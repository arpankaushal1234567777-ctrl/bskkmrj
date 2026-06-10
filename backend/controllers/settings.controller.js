const { Settings } = require("../models/settings");
const {
  isEmail,
  isPhone,
  sanitizeEmail,
  sanitizePhone,
  sanitizeRichText,
  sanitizeText,
  sanitizeUrl,
} = require("../utils/validate");

async function ensureSettingsDoc() {
  let doc = await Settings.findOne();
  if (!doc) doc = await Settings.create({});
  return doc;
}

function toPublicShape(doc) {
  const d = doc.toObject ? doc.toObject() : doc;
  return {
    siteTitle: d.siteTitle || "BSKKMRJ",
    seoDescription: d.seoDescription || "",
    seoKeywords: d.seoKeywords || "",
    socialLinks: d.socialLinks || {},
    contact: d.contact || {},
    footerText: d.footerText || "",
  };
}

async function getSettings(_req, res, next) {
  try {
    const doc = await ensureSettingsDoc();
    res.json(toPublicShape(doc));
  } catch (err) {
    next(err);
  }
}

async function updateSettings(req, res, next) {
  try {
    const doc = await ensureSettingsDoc();
    const body = req.body || {};

    doc.siteTitle = sanitizeText(body.siteTitle ?? doc.siteTitle ?? "", 120) || "BSKKMRJ";
    doc.seoDescription = sanitizeRichText(body.seoDescription ?? doc.seoDescription ?? "", 320);
    doc.seoKeywords = sanitizeText(body.seoKeywords ?? doc.seoKeywords ?? "", 320);

    const social = body.socialLinks || {};
    doc.socialLinks = {
      facebook: sanitizeUrl(social.facebook ?? doc.socialLinks?.facebook ?? ""),
      instagram: sanitizeUrl(social.instagram ?? doc.socialLinks?.instagram ?? ""),
      twitter: sanitizeUrl(social.twitter ?? doc.socialLinks?.twitter ?? ""),
      youtube: sanitizeUrl(social.youtube ?? doc.socialLinks?.youtube ?? ""),
      whatsapp: sanitizeUrl(social.whatsapp ?? doc.socialLinks?.whatsapp ?? ""),
    };

    const contact = body.contact || {};
    const phone = sanitizePhone(contact.phone ?? doc.contact?.phone ?? "");
    const email = sanitizeEmail(contact.email ?? doc.contact?.email ?? "");
    doc.contact = {
      phone,
      email,
      address: sanitizeText(contact.address ?? doc.contact?.address ?? "", 300),
    };
    if (phone && !isPhone(phone)) return res.status(400).json({ error: "Valid contact phone is required" });
    if (email && !isEmail(email)) return res.status(400).json({ error: "Valid contact email is required" });

    doc.footerText = sanitizeRichText(body.footerText ?? doc.footerText ?? "", 1000);

    await doc.save();
    res.json(toPublicShape(doc));
  } catch (err) {
    next(err);
  }
}

module.exports = { getSettings, updateSettings };
