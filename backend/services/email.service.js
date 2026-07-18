const nodemailer = require("nodemailer");
const dns = require("dns");

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

async function sendEmail(payload) {
  const { to, subject, text, html } = payload || {};
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
    });

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    return { ok: true, messageId: info.messageId };
  } catch (err) {
    console.error("Failed to send email via SMTP:", err);
    return { ok: false, error: err.message };
  }
}

module.exports = { sendEmail };
