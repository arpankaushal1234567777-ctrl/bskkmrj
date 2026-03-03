async function sendEmail(_payload) {
  return { ok: false, message: "Email service not configured." };
}

module.exports = { sendEmail };

