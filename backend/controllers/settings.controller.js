const { Settings } = require("../models/settings");

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

    doc.siteTitle = String(body.siteTitle ?? doc.siteTitle ?? "").trim() || "BSKKMRJ";
    doc.seoDescription = String(body.seoDescription ?? doc.seoDescription ?? "").trim();
    doc.seoKeywords = String(body.seoKeywords ?? doc.seoKeywords ?? "").trim();

    const social = body.socialLinks || {};
    doc.socialLinks = {
      facebook: String(social.facebook ?? doc.socialLinks?.facebook ?? "").trim(),
      instagram: String(social.instagram ?? doc.socialLinks?.instagram ?? "").trim(),
      twitter: String(social.twitter ?? doc.socialLinks?.twitter ?? "").trim(),
      youtube: String(social.youtube ?? doc.socialLinks?.youtube ?? "").trim(),
      whatsapp: String(social.whatsapp ?? doc.socialLinks?.whatsapp ?? "").trim(),
    };

    const contact = body.contact || {};
    doc.contact = {
      phone: String(contact.phone ?? doc.contact?.phone ?? "").trim(),
      email: String(contact.email ?? doc.contact?.email ?? "").trim(),
      address: String(contact.address ?? doc.contact?.address ?? "").trim(),
    };

    doc.footerText = String(body.footerText ?? doc.footerText ?? "").trim();

    await doc.save();
    res.json(toPublicShape(doc));
  } catch (err) {
    next(err);
  }
}

module.exports = { getSettings, updateSettings };

