const mongoose = require("mongoose");
const sanitizeHtml = require("sanitize-html");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-()\s]{7,20}$/;
const HTTP_URL_RE = /^https?:\/\//i;
const DATA_IMAGE_RE = /^data:image\/(png|jpe?g|webp|gif|svg\+xml);base64,[a-z0-9+/=\s]+$/i;
const DATA_PDF_RE = /^data:application\/pdf;base64,[a-z0-9+/=\s]+$/i;
const MAX_DATA_URL_LENGTH = 12_000_000;

function isEmail(value) {
  return EMAIL_RE.test(String(value || "").trim());
}

function isPhone(value) {
  return PHONE_RE.test(String(value || "").trim());
}

function isObjectId(value) {
  return mongoose.Types.ObjectId.isValid(String(value || ""));
}

function sanitizeText(value, maxLength = 5000) {
  const text = String(value ?? "").replace(/\0/g, "").trim();
  const clean = sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} });
  return clean.slice(0, maxLength);
}

function sanitizeRichText(value, maxLength = 20000) {
  const text = String(value ?? "").replace(/\0/g, "").trim();
  const clean = sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {},
  });
  return clean.slice(0, maxLength);
}

function sanitizeEmail(value) {
  return sanitizeText(value, 320).toLowerCase();
}

function sanitizePhone(value) {
  return sanitizeText(value, 20);
}

function sanitizeUrl(value, { allowDataImage = false, allowPdfData = false } = {}) {
  const url = String(value ?? "").trim();
  if (!url) return "";
  if (HTTP_URL_RE.test(url)) return url.slice(0, 2048);
  if (allowDataImage && DATA_IMAGE_RE.test(url) && url.length <= MAX_DATA_URL_LENGTH) return url;
  if (allowPdfData && DATA_PDF_RE.test(url) && url.length <= MAX_DATA_URL_LENGTH) return url;
  return "";
}

function pickImageUrl(body) {
  const imageUrl = sanitizeUrl(body?.imageUrl, { allowDataImage: false });
  const imageBase64 = sanitizeUrl(body?.imageBase64, { allowDataImage: true });
  return imageUrl || imageBase64 || "";
}

function pickDocumentUrl(body) {
  const fileUrl = sanitizeUrl(body?.fileUrl, { allowPdfData: false });
  const fileBase64 = sanitizeUrl(body?.fileBase64 || body?.fileUrl, { allowPdfData: true });
  return fileUrl || fileBase64 || "";
}

function parseBoolean(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const lowered = value.trim().toLowerCase();
    if (["true", "1", "yes", "on"].includes(lowered)) return true;
    if (["false", "0", "no", "off"].includes(lowered)) return false;
  }
  return fallback;
}

function assertObjectId(value, label = "Resource") {
  if (!isObjectId(value)) {
    const error = new Error(`${label} id is invalid`);
    error.status = 400;
    throw error;
  }
}

module.exports = {
  assertObjectId,
  isEmail,
  isObjectId,
  isPhone,
  parseBoolean,
  pickDocumentUrl,
  pickImageUrl,
  sanitizeEmail,
  sanitizePhone,
  sanitizeRichText,
  sanitizeText,
  sanitizeUrl,
};
