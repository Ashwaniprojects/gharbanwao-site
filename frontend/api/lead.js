// Vercel serverless function: WhatsApp lead capture.
// Keeps the AiSensy API key server-side (never shipped to the browser).
//
// Required env vars (set in the Vercel dashboard):
//   AISENSY_API_KEY     - your AiSensy API key
//   AISENSY_CAMPAIGN    - the approved campaign name to send through
//   AISENSY_TARGET      - the sales WhatsApp number that receives leads (e.g. 919648249999)
//
// The AiSensy Campaign API sends a pre-approved template, so templateParams
// must line up with that template's placeholders. If the send is not configured
// or fails, we still return success with a wa.me deep link so the enquiry can be
// forwarded manually — a lead is never dropped.

const SALES_NUMBER = process.env.AISENSY_TARGET || "919648249999";

const buildMessage = (d) => {
  const est = d.estimate || {};
  const lines = [
    "New consultation enquiry (Ghar Banwao website)",
    `Name: ${d.name || "-"}`,
    `Phone: ${d.phone || "-"}`,
    `City: ${d.city || "-"}`,
    `Locality: ${d.locality || "-"}`,
    `Plot size: ${d.plot_size || "-"}`,
    `Timeline: ${d.timeline || "-"}`,
    `Package interest: ${d.package_interest || "-"}`,
  ];
  if (est.total != null) lines.push(`Estimate: Rs ${Number(est.total).toLocaleString("en-IN")}`);
  if (est.sqft) lines.push(`Area: ${est.sqft} sqft`);
  return lines.join("\n");
};

const waLink = (text) => `https://wa.me/${SALES_NUMBER}?text=${encodeURIComponent(text)}`;

async function sendViaAiSensy(message) {
  const apiKey = process.env.AISENSY_API_KEY;
  const campaign = process.env.AISENSY_CAMPAIGN;
  if (!apiKey || !campaign) return { sent: false, reason: "not_configured" };

  try {
    const res = await fetch("https://backend.aisensy.com/campaign/t1/api/v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey,
        campaignName: campaign,
        destination: SALES_NUMBER,
        templateParams: [message],
        responseType: "json",
      }),
    });
    if (!res.ok) return { sent: false, reason: `http_${res.status}` };
    return { sent: true };
  } catch (err) {
    return { sent: false, reason: String(err && err.message ? err.message : err) };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const d = req.body || {};
  if (!d.name || !d.phone) {
    return res.status(400).json({ ok: false, error: "Name and phone are required." });
  }

  const message = buildMessage(d);
  const result = await sendViaAiSensy(message);

  return res.status(200).json({
    ok: true,
    whatsapp_sent: result.sent,
    whatsapp_reason: result.sent ? undefined : result.reason,
    whatsapp_fallback: result.sent ? undefined : waLink(message),
  });
}
