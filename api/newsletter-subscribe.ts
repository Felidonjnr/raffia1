type VercelRequest = {
  method?: string;
  body?: unknown;
};
type VercelResponse = {
  setHeader(name: string, value: string): void;
  status(code: number): VercelResponse;
  json(body: unknown): void;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const body = (req.body && typeof req.body === "object" ? req.body : {}) as Record<string, unknown>;
    const email = String(body.email ?? "").trim().toLowerCase();
    const consent = body.consent === true;
    const website = String(body.website ?? "");

    // Quietly accept bot submissions without forwarding them.
    if (website) return res.status(200).json({ ok: true });
    if (!consent) return res.status(400).json({ error: "Consent is required." });
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Enter a valid email address." });
    }

    const apiKey = process.env.BREVO_API_KEY;
    const listId = Number(process.env.BREVO_LIST_ID);
    if (!apiKey || !Number.isInteger(listId) || listId <= 0) {
      console.error("Newsletter integration is missing BREVO_API_KEY or BREVO_LIST_ID.");
      return res.status(503).json({ error: "Subscription service is not configured." });
    }

    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({ email, listIds: [listId], updateEnabled: true }),
    });

    if (!response.ok) {
      const details = await response.text();
      console.error("Brevo contact sync failed:", response.status, details.slice(0, 500));
      return res.status(502).json({ error: "We could not complete your subscription right now. Please try again shortly." });
    }

    return res.status(200).json({ ok: true, synced: true });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return res.status(500).json({ error: "Unable to process your subscription right now." });
  }
}
