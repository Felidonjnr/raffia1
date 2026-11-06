import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const consent = body?.consent === true;
    const source = String(body?.source ?? "website").slice(0, 80);
    const honeypot = String(body?.website ?? "");

    // Quietly accept bot submissions without forwarding them.
    if (honeypot) return json({ ok: true });
    if (!consent) return json({ error: "Consent is required." }, 400);
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "Enter a valid email address." }, 400);
    }

    const brevoKey = Deno.env.get("BREVO_API_KEY");
    const listId = Number(Deno.env.get("BREVO_LIST_ID"));
    if (!brevoKey || !Number.isInteger(listId) || listId <= 0) {
      console.error("Newsletter integration is missing BREVO_API_KEY or BREVO_LIST_ID.");
      return json({ error: "Subscription service is not configured." }, 503);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const secretKeysRaw = Deno.env.get("SUPABASE_SECRET_KEYS");
    const secretKey = secretKeysRaw
      ? JSON.parse(secretKeysRaw).default
      : Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !secretKey) {
      console.error("Supabase server credentials are unavailable.");
      return json({ error: "Subscription service is not configured." }, 503);
    }

    const admin = createClient(supabaseUrl, secretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error: saveError } = await admin.from("newsletter_subscribers").upsert({
      email,
      status: "pending_sync",
      source,
      consent_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "email" });

    if (saveError) {
      console.error("Could not save newsletter consent:", saveError.message);
      return json({ error: "We could not save your subscription. Please try again." }, 500);
    }

    const brevoResponse = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": brevoKey,
        "accept": "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        listIds: [listId],
        updateEnabled: true,
        attributes: { SIGNUP_SOURCE: source },
      }),
    });

    if (!brevoResponse.ok) {
      const details = await brevoResponse.text();
      console.error("Brevo contact sync failed:", brevoResponse.status, details.slice(0, 500));
      return json({ error: "Your request was saved, but email-list confirmation is delayed. Please try again shortly." }, 502);
    }

    const { error: updateError } = await admin.from("newsletter_subscribers")
      .update({ status: "subscribed", updated_at: new Date().toISOString() })
      .eq("email", email);

    if (updateError) {
      console.error("Brevo sync succeeded but subscriber status update failed:", updateError.message);
      return json({ ok: true, synced: true });
    }

    return json({ ok: true, synced: true });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return json({ error: "Unable to process your subscription right now." }, 500);
  }
});
