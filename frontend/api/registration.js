// Vercel serverless function: WhatsApp registration capture.
// Handles vendor, channel partner and hiring registrations.
// Keeps the AiSensy API key server-side (never shipped to the browser).
//
// Required env vars (set in the Vercel dashboard):
//   AISENSY_API_KEY     - your AiSensy API key
//   AISENSY_CAMPAIGN    - the approved campaign name to send through
//   AISENSY_TARGET      - the sales WhatsApp number that receives leads (e.g. 919648249999)
//
// Falls back to a wa.me deep link if the AiSensy send is not configured or fails,
// so a registration is never dropped.

const SALES_NUMBER = process.env.AISENSY_TARGET || "919648249999";

/**
 * Keep only the 10 national digits of an Indian phone. Strips spaces, dashes,
 * and an optional +91 / 91 country prefix. Returns "" when the result is not a
 * clean 10-digit national number, which is the "invalid" signal the callers use.
 */
const normalizePhone = (value) => {
  if (!value) return "";
  const digits = String(value).replace(/[\s\-().]/g, "");
  const stripped = digits.replace(/^(?:\+?91)(?=\d{10}$)/, "");
  return /^\d{10}$/.test(stripped) ? stripped : "";
};

const TYPE_LABELS = {
  vendor: "Vendor Registration",
  channel_partner: "Channel Partner",
  hiring: "Careers / Hiring",
};

const buildMessage = (d) => {
  const label = TYPE_LABELS[d.type] || d.type || "Registration";
  const lines = [
    `New ${label} (Ghar Banwao website)`,
    `Name: ${d.name || "-"}`,
    `Phone: ${d.phone || "-"}`,
    `Email: ${d.email || "-"}`,
    `City: ${d.city || "-"}`,
  ];
  if (d.company_name) lines.push(`Company: ${d.company_name}`);
  if (d.category) lines.push(`Category: ${d.category}`);
  if (d.experience_years) lines.push(`Experience: ${d.experience_years}`);
  if (d.role) lines.push(`Role: ${d.role}`);
  if (d.message) lines.push(`Message: ${d.message}`);
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
  const phone = normalizePhone(d.phone);
  if (!phone) {
    return res.status(400).json({
      ok: false,
      error: "Please enter a valid 10-digit Indian mobile number.",
    });
  }
  d.phone = phone;

  const message = buildMessage(d);
  const result = await sendViaAiSensy(message);

  return res.status(200).json({
    ok: true,
    whatsapp_sent: result.sent,
    whatsapp_reason: result.sent ? undefined : result.reason,
    whatsapp_fallback: result.sent ? undefined : waLink(message),
  });
}
