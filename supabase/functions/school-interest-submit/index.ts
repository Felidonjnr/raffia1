import { createClient } from "npm:@supabase/supabase-js@2";

const allowedOrigins = new Set([
  "https://www.raffialegacy.com.ng",
  "https://raffialegacy.com.ng",
  "https://raffia1.vercel.app",
  "http://localhost:3000",
]);

const headers = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && allowedOrigins.has(origin) ? origin : "https://www.raffialegacy.com.ng",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
});

const respond = (body: Record<string, unknown>, origin: string | null, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...headers(origin), "Content-Type": "application/json" } });

const clean = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (origin && !allowedOrigins.has(origin)) return respond({ error: "Origin not allowed." }, origin, 403);
  if (req.method === "OPTIONS") return new Response("ok", { headers: headers(origin) });
  if (req.method !== "POST") return respond({ error: "Method not allowed." }, origin, 405);

  try {
    const body = await req.json();
    // Silently discard automated submissions caught by the honeypot.
    if (clean(body?.website, 300)) return respond({ ok: true }, origin);

    const school_name = clean(body?.school_name, 180);
    const institution_type = clean(body?.institution_type, 20);
    const contact_name = clean(body?.contact_name, 160);
    const position = clean(body?.position, 120);
    const email = clean(body?.email, 254).toLowerCase();
    const phone = clean(body?.phone, 40);
    const school_address = clean(body?.school_address, 500);
    const confirms_institution = body?.confirms_institution === true;

    if (!school_name || !["primary", "secondary", "tertiary"].includes(institution_type) ||
        !contact_name || !position || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        !phone || !school_address || !confirms_institution) {
      return respond({ error: "Please complete all required fields and confirm that you represent the institution." }, origin, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const secretKeysRaw = Deno.env.get("SUPABASE_SECRET_KEYS");
    const serviceKey = secretKeysRaw ? JSON.parse(secretKeysRaw).default : Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) {
      console.error("School interest submission is missing Supabase server credentials.");
      return respond({ error: "The form is temporarily unavailable. Please try again later." }, origin, 503);
    }

    const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { error } = await admin.from("school_interest_submissions").insert({
      school_name, institution_type, contact_name, position, email, phone, school_address, confirms_institution,
    });

    if (error) {
      console.error("Could not save school interest:", error.message);
      return respond({ error: "We could not save your interest. Please try again." }, origin, 500);
    }

    return respond({ ok: true }, origin);
  } catch (error) {
    console.error("School interest submission error:", error);
    return respond({ error: "Unable to process your request right now." }, origin, 500);
  }
});
