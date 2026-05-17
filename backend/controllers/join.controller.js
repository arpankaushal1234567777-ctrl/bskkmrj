const { JoinRequest } = require("../models/joinRequest");
const { isEmail } = require("../utils/validate");

async function createJoinRequest(req, res, next) {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const phone = String(req.body.phone || "").trim();
    const address = String(req.body.address || "").trim();
    const occupation = String(req.body.occupation || "").trim();
    const message = String(req.body.message || "").trim();

    if (!name) return res.status(400).json({ error: "Name is required" });
    if (!email || !isEmail(email)) return res.status(400).json({ error: "Valid email is required" });
    if (!phone) return res.status(400).json({ error: "Phone is required" });

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
    const status = String(req.body.status || "").trim();
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
