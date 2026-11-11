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

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (origin && !allowedOrigins.has(origin)) return respond({ error: "Origin not allowed." }, origin, 403);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(origin) });
  if (req.method !== "POST") return respond({ error: "Method not allowed." }, origin, 405);

  try {
    const authorization = req.headers.get("Authorization") || "";
    const token = authorization.replace(/^Bearer\s+/i, "");
    if (!token) return respond({ error: "You must be signed in as an administrator." }, origin, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const secretKeysRaw = Deno.env.get("SUPABASE_SECRET_KEYS");
    const serviceKey = secretKeysRaw ? JSON.parse(secretKeysRaw).default : Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) return respond({ error: "Subscription service is not configured." }, origin, 503);

    const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: authData, error: authError } = await admin.auth.getUser(token);
    if (authError || !authData.user) return respond({ error: "Your admin session is invalid or expired. Please sign in again." }, origin, 401);

    const { data: profile, error: profileError } = await admin
      .from("profiles").select("role").eq("id", authData.user.id).maybeSingle();
    if (profileError || !profile || !["admin", "editor"].includes(profile.role)) {
      return respond({ error: "You do not have permission to manage newsletter subscribers." }, origin, 403);
    }

    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const status = String(body?.status ?? "");
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return respond({ error: "A valid subscriber email is required." }, origin, 400);
    }
    if (!["subscribed", "unsubscribed"].includes(status)) {
      return respond({ error: "Choose subscribed or unsubscribed." }, origin, 400);
    }

    const brevoKey = Deno.env.get("BREVO_API_KEY");
    const listId = Number(Deno.env.get("BREVO_LIST_ID"));
    if (!brevoKey || !Number.isInteger(listId) || listId <= 0) {
      return respond({ error: "Brevo is not configured. The subscription was not changed." }, origin, 503);
    }

    let brevoResponse: Response;
    if (status === "subscribed") {
      brevoResponse = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: { "api-key": brevoKey, "accept": "application/json", "content-type": "application/json" },
        body: JSON.stringify({ email, listIds: [listId], updateEnabled: true }),
      });
    } else {
      brevoResponse = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
        method: "PUT",
        headers: { "api-key": brevoKey, "accept": "application/json", "content-type": "application/json" },
        body: JSON.stringify({ unlinkListIds: [listId] }),
      });
    }

    // A contact that is already absent from the selected list is already unsubscribed.
    if (!brevoResponse.ok && !(status === "unsubscribed" && brevoResponse.status === 404)) {
      const details = await brevoResponse.text();
      console.error("Brevo subscription update failed:", brevoResponse.status, details.slice(0, 400));
      return respond({ error: "Brevo could not confirm this change. The saved subscription status was left unchanged." }, origin, 502);
    }

    const { error: updateError } = await admin.from("newsletter_subscribers")
      .update({ status, updated_at: new Date().toISOString() }).eq("email", email);
    if (updateError) {
      console.error("Brevo updated but database status update failed:", updateError.message);
      return respond({ error: "Brevo was updated, but the dashboard record could not be updated. Refresh and retry." }, origin, 500);
    }

    return respond({ ok: true, synced: true, status }, origin);
  } catch (error) {
    console.error("Newsletter admin update error:", error);
    return respond({ error: "Unable to update this subscription right now." }, origin, 500);
  }
});
