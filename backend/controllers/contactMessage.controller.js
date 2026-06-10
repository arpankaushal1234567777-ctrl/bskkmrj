const { ContactMessage } = require("../models/contactMessage");
const {
  assertObjectId,
  isEmail,
  isPhone,
  sanitizeEmail,
  sanitizePhone,
  sanitizeRichText,
  sanitizeText,
} = require("../utils/validate");

function getContactInfo(_req, res) {
  res.json({
    organization: "भारतीय श्रमिक कामगार कर्मचारी महासंघ राजस्थान",
    phone: "+919451238931",
    footerPhone: "01147095426",
    address:
      "84, North Ave, North Avenue Road Area, Raisina Hills, New Delhi, Delhi 110001",
    mapUrl: "https://maps.app.goo.gl/yRtRmDRg8NuPodGg7",
  });
}

async function createContactMessage(req, res, next) {
  try {
    const name = sanitizeText(req.body.name, 120);
    const email = sanitizeEmail(req.body.email);
    const phone = sanitizePhone(req.body.phone);
    const subject = sanitizeText(req.body.subject, 200);
    const message = sanitizeRichText(req.body.message, 5000);

    if (!name) return res.status(400).json({ error: "Name is required" });
    if (!email || !isEmail(email)) return res.status(400).json({ error: "Valid email is required" });
    if (phone && !isPhone(phone)) return res.status(400).json({ error: "Valid phone is required" });
    if (!message) return res.status(400).json({ error: "Message is required" });

    const doc = await ContactMessage.create({ name, email, phone, subject, message });
    res.status(201).json({ ok: true, id: doc._id });
  } catch (err) {
    next(err);
  }
}

async function listContactMessages(_req, res, next) {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
    res.json({ messages });
  } catch (err) {
    next(err);
  }
}

async function markContactMessageRead(req, res, next) {
  try {
    assertObjectId(req.params.id, "Message");
    const doc = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: "Message not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

async function deleteContactMessage(req, res, next) {
  try {
    assertObjectId(req.params.id, "Message");
    const doc = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "Message not found" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getContactInfo,
  createContactMessage,
  listContactMessages,
  markContactMessageRead,
  deleteContactMessage,
};
