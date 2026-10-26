// Vercel serverless function: WhatsApp + email lead capture.
// Keeps the AiSensy and Resend API keys server-side (never shipped to the
// browser).
//
// Required env vars (set in the Vercel dashboard):
//   AISENSY_API_KEY     - your AiSensy API key
//   AISENSY_CAMPAIGN    - the approved campaign name to send through
//   AISENSY_TARGET      - the sales WhatsApp number that receives leads (e.g. 919648249999)
//
// Optional email channel (skipped entirely when unset):
//   RESEND_API_KEY      - Resend API key
//   MAIL_FROM           - verified Resend sender (default: Ghar Banwao <leads@gharbanwao.com>)
//   MAIL_TO             - sales inbox that receives leads (default: sales@gharbanwao.com)
//
// The AiSensy Campaign API sends a pre-approved template, so templateParams
// must line up with that template's placeholders. If a channel is not
// configured or fails, we still return success with a wa.me deep link so the
// enquiry can be forwarded manually — a lead is never dropped.

const SALES_NUMBER = process.env.AISENSY_TARGET || "919648249999";
const MAIL_FROM = process.env.MAIL_FROM || "Ghar Banwao <leads@gharbanwao.com>";
const MAIL_TO = process.env.MAIL_TO || "sales@gharbanwao.com";

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

/**
 * Best-effort email mirror of the same enquiry. Configures nothing by default
 * (RESEND_API_KEY empty), so the function returns "not_configured" and the
 * caller treats the email as simply skipped rather than a failure.
 */
async function sendViaEmail({ subject, body, pdfBase64 }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "not_configured" };

  const payload = {
    from: MAIL_FROM,
    to: MAIL_TO,
    subject,
    html: body,
  };
  if (pdfBase64) {
    payload.attachments = [
      {
        filename: "GharBanwao-Estimate.pdf",
        content: pdfBase64, // Resend takes a base64 string with no data: prefix
      },
    ];
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { sent: false, reason: `http_${res.status}` };
    return { sent: true };
  } catch (err) {
    return { sent: false, reason: String(err && err.message ? err.message : err) };
  }
}

const htmlEscape = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const buildEmail = (d, message) => {
  const est = d.estimate || {};
  const rows = [
    ["Name", d.name],
    ["Phone", d.phone],
    ["City", d.city],
    ["Locality", d.locality],
    ["Plot size", d.plot_size],
    ["Timeline", d.timeline],
    ["Package interest", d.package_interest],
  ];
  if (est.total != null) rows.push(["Estimate", `Rs ${Number(est.total).toLocaleString("en-IN")}`]);
  if (est.sqft) rows.push(["Area", `${est.sqft} sq ft`]);
  const table = `<table style="font-family:monospace;width:100%;border-collapse:collapse">
    ${rows
      .filter(([, v]) => v)
      .map(([k, v]) => `<tr><td style="padding:4px 8px;color:#888;width:120px">${htmlEscape(k)}</td><td style="padding:4px 8px;font-weight:600">${htmlEscape(v)}</td></tr>`)
      .join("")}
  </table>`;
  return `<div style="font-family:Arial,Helvetica,sans-serif">
    <h2 style="margin:0 0 8px">${htmlEscape(subject)}</h2>
    ${table}
    <p style="color:#666;font-size:12px;margin-top:16px">Raw WhatsApp payload:<br/>${htmlEscape(message)}</p>
  </div>`;
};

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
  const subject = `Ghar Banwao · New enquiry · ${d.name || "Unknown"} · ${d.phone}`;
  const [whatsapp, email] = await Promise.all([
    sendViaAiSensy(message),
    sendViaEmail({
      subject,
      body: buildEmail(d, message),
      pdfBase64: d.pdf_base64 || null,
    }),
  ]);

  return res.status(200).json({
    ok: true,
    whatsapp_sent: whatsapp.sent,
    whatsapp_reason: whatsapp.sent ? undefined : whatsapp.reason,
    whatsapp_fallback: whatsapp.sent ? undefined : waLink(message),
    email_sent: email.sent,
    email_reason: email.sent ? undefined : email.reason,
  });
}
