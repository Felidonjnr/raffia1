import { createClient } from "npm:@supabase/supabase-js@2";

const allowedOrigins = new Set([
  "https://www.raffialegacy.com.ng",
  "https://raffialegacy.com.ng",
  "https://raffia1.vercel.app",
  "http://localhost:3000",
]);
const corsHeaders = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && allowedOrigins.has(origin) ? origin : "https://www.raffialegacy.com.ng",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
});
const respond = (body: Record<string, unknown>, origin: string | null, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders(origin), "Content-Type": "application/json" } });
const clean = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (origin && !allowedOrigins.has(origin)) return respond({ error: "Origin not allowed." }, origin, 403);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(origin) });
  if (req.method !== "POST") return respond({ error: "Method not allowed." }, origin, 405);

  try {
    const body = await req.json();
    if (clean(body?.website, 300)) return respond({ ok: true }, origin);
    if (body?.consent !== true) return respond({ error: "Please consent to being contacted." }, origin, 400);

    const type = clean(body?.type, 20);
    const email = clean(body?.email, 254).toLowerCase();
    const phone = clean(body?.phone, 40);
    if (!emailPattern.test(email) || !phone) return respond({ error: "Enter a valid email and phone number." }, origin, 400);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const secretKeysRaw = Deno.env.get("SUPABASE_SECRET_KEYS");
    const serviceKey = secretKeysRaw ? JSON.parse(secretKeysRaw).default : Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) return respond({ error: "The form is temporarily unavailable. Please try again later." }, origin, 503);

    const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const consent_at = new Date().toISOString();

    if (type === "volunteer") {
      const full_name = clean(body?.full_name, 160);
      const skills = (Array.isArray(body?.skills) ? body.skills : clean(body?.skills, 1000).split(","))
        .map((skill: unknown) => clean(skill, 80)).filter(Boolean).slice(0, 20);
      const availability = clean(body?.availability, 160);
      const motivation = clean(body?.motivation, 2000);
      if (!full_name || skills.length === 0 || !availability || !motivation) {
        return respond({ error: "Please complete all required volunteer fields." }, origin, 400);
      }
      const { error } = await admin.from("volunteer_applications").insert({
        full_name, email, phone, skills, availability, motivation, consent_at,
      });
      if (error) {
        console.error("Could not save volunteer application:", error.message);
        return respond({ error: "We could not save your application. Please try again." }, origin, 500);
      }
      return respond({ ok: true }, origin);
    }

    if (type === "partnership") {
      const organization_name = clean(body?.organization_name, 180);
      const contact_name = clean(body?.contact_name, 160);
      const partnership_type = clean(body?.partnership_type, 80);
      const message = clean(body?.message, 3000);
      const allowedTypes = ["Festival Sponsor", "Programme Sponsor", "Legacy Partner", "Knowledge Partner", "Media & Creative Partner", "Tourism & Destination Partner", "In-kind Support", "Other"];
      const rawValue = body?.estimated_value;
      const estimated_value = rawValue === "" || rawValue == null ? null : Number(rawValue);
      if (!organization_name || !contact_name || !allowedTypes.includes(partnership_type) || !message || (estimated_value !== null && (!Number.isFinite(estimated_value) || estimated_value < 0))) {
        return respond({ error: "Please complete all required partnership fields." }, origin, 400);
      }
      const { error } = await admin.from("partnership_inquiries").insert({
        organization_name, contact_name, email, phone, partnership_type, message, estimated_value, consent_at,
      });
      if (error) {
        console.error("Could not save partnership enquiry:", error.message);
        return respond({ error: "We could not save your enquiry. Please try again." }, origin, 500);
      }
      return respond({ ok: true }, origin);
    }

    return respond({ error: "Unknown form type." }, origin, 400);
  } catch (error) {
    console.error("Get-involved submission error:", error);
    return respond({ error: "Unable to process your request right now." }, origin, 500);
  }
});
