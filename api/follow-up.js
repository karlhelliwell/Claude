/**
 * Follow-up request endpoint — relays form submissions via Mailgun.
 *
 * Required Vercel environment variables:
 *   MAILGUN_API_KEY  — Mailgun private API key
 *   MAILGUN_DOMAIN   — verified sending domain, e.g. mg.oakleafpartnership.com
 *   MAILGUN_REGION   — "eu" or "us" (defaults to "eu")
 *   FORM_RECIPIENT   — destination inbox (defaults to karlhelliwell@oakleaf.group)
 */

const SECTORS = [
  "Professional Services",
  "Financial Services",
  "Payroll",
  "Executive Search",
  "Tech, Media & Telco",
  "Consumer",
  "Industry & Science",
  "Reward & Analytics",
  "Not for Profit & Charities",
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, sector, _honey } = req.body || {};

  // honeypot — pretend success so bots learn nothing
  if (_honey) return res.status(200).json({ ok: true });

  const clean = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const data = {
    name: clean(name, 120),
    email: clean(email, 200),
    phone: clean(phone, 40),
    sector: clean(sector, 60),
  };

  if (data.name.length < 2) return res.status(400).json({ error: "Please provide your full name." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return res.status(400).json({ error: "Please provide a valid email address." });
  if (data.phone.length < 5) return res.status(400).json({ error: "Please provide a phone number." });
  if (!SECTORS.includes(data.sector)) return res.status(400).json({ error: "Please select an industry sector." });

  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  if (!apiKey || !domain) {
    return res.status(503).json({ error: "Mail service is not configured." });
  }
  const apiHost = (process.env.MAILGUN_REGION || "eu") === "eu" ? "api.eu.mailgun.net" : "api.mailgun.net";
  const recipient = process.env.FORM_RECIPIENT || "karlhelliwell@oakleaf.group";

  const text = [
    "New follow-up request from the Oakleaf Capabilities site",
    "",
    `Full name:        ${data.name}`,
    `Email:            ${data.email}`,
    `Phone:            ${data.phone}`,
    `Industry sector:  ${data.sector}`,
    "",
    `Submitted: ${new Date().toISOString()}`,
  ].join("\n");

  const params = new URLSearchParams({
    from: `Oakleaf Capabilities <follow-up@${domain}>`,
    to: recipient,
    subject: `Follow-up request — ${data.name} (${data.sector})`,
    text,
    "h:Reply-To": data.email,
  });

  try {
    const mg = await fetch(`https://${apiHost}/v3/${domain}/messages`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`api:${apiKey}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    if (!mg.ok) {
      const detail = await mg.text();
      console.error("Mailgun error", mg.status, detail.slice(0, 300));
      return res.status(502).json({ error: "Mail service rejected the request." });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Mailgun request failed", err);
    return res.status(502).json({ error: "Mail service unavailable." });
  }
}
