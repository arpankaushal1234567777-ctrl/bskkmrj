const { JoinRequest } = require("../models/joinRequest");
const {
  assertObjectId,
  isEmail,
  isPhone,
  sanitizeEmail,
  sanitizePhone,
  sanitizeRichText,
  sanitizeText,
} = require("../utils/validate");

async function createJoinRequest(req, res, next) {
  try {
    const name = sanitizeText(req.body.name, 120);
    const email = sanitizeEmail(req.body.email);
    const phone = sanitizePhone(req.body.phone);
    const address = sanitizeText(req.body.address, 300);
    const occupation = sanitizeText(req.body.occupation, 150);
    const message = sanitizeRichText(req.body.message, 5000);

    if (!name) return res.status(400).json({ error: "Name is required" });
    if (!email || !isEmail(email)) return res.status(400).json({ error: "Valid email is required" });
    if (!phone || !isPhone(phone)) return res.status(400).json({ error: "Valid phone is required" });

    const doc = await JoinRequest.create({
      name,
      email,
      phone,
      address,
      occupation,
      message,
      status: "pending",
    });
    res.status(201).json({ ok: true, id: doc._id });
  } catch (err) {
    next(err);
  }
}

async function listJoinRequests(_req, res, next) {
  try {
    const requests = await JoinRequest.find().sort({ createdAt: -1 }).lean();
    res.json({ requests });
  } catch (err) {
    next(err);
  }
}

async function updateJoinRequestStatus(req, res, next) {
  try {
    assertObjectId(req.params.id, "Join request");
    const status = sanitizeText(req.body.status, 20);
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Status must be pending, approved, or rejected" });
    }
    const doc = await JoinRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: "Join request not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

module.exports = { createJoinRequest, listJoinRequests, updateJoinRequestStatus };
