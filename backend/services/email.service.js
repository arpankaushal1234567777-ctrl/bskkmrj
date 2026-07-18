const nodemailer = require("nodemailer");
const dns = require("dns");

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

async function sendEmail(payload) {
  const { to, subject, text, html } = payload || {};

  // 1. Check if Resend HTTP API Key is configured (Best for Render/Cloud where SMTP is blocked)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const fromEmail = process.env.SMTP_FROM || "onboarding@resend.dev";
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `BSKKMRJ Admin <${fromEmail}>`,
          to: [to],
          subject,
          text,
          html,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(`[Resend HTTP] Email sent successfully to ${to}. ID: ${data.id}`);
        return { ok: true, messageId: data.id };
      } else {
        console.error("Resend API Error:", data);
        return { ok: false, error: data.message };
      }
    } catch (err) {
      console.error("Failed to send email via Resend HTTP API:", err);
      return { ok: false, error: err.message };
    }
  }

  // 2. Fallback to SMTP configuration (used locally or if SMTP ports are open)
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@local";

  if (!host || !user || !pass) {
    console.log(`[SMTP Dev Mode] Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    if (text) console.log(`Text Body:\n${text}`);
    if (html) console.log(`HTML Body:\n${html}`);
    console.log(`--------------------------------------`);
    return { ok: true, devMode: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      family: 4, // Force IPv4 only
      connectionTimeout: 10000, // 10 seconds timeout
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    console.log(`[SMTP] Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return { ok: true, messageId: info.messageId };
  } catch (err) {
    console.error("Failed to send email via SMTP:", err);
    return { ok: false, error: err.message };
  }
}

module.exports = { sendEmail };
