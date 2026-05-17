function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function pickImageUrl(body) {
  const imageUrl = String(body.imageUrl || "").trim();
  const imageBase64 = String(body.imageBase64 || "").trim();
  if (imageUrl) return imageUrl;
  if (imageBase64 && imageBase64.length < 12_000_000) return imageBase64;
  return "";
}

module.exports = { isEmail, pickImageUrl };
