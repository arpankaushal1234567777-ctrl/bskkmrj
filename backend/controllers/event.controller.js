const { Event } = require("../models/event");
const {
  assertObjectId,
  pickImageUrl,
  sanitizeRichText,
  sanitizeText,
} = require("../utils/validate");

async function listEvents(_req, res, next) {
  try {
    const events = await Event.find().sort({ date: -1 }).lean();
    res.json({ events });
  } catch (err) {
    next(err);
  }
}

function buildEventPayload(body, existing) {
  const title = sanitizeText(body.title ?? existing?.title ?? "", 200);
  const date = sanitizeText(body.date ?? existing?.date ?? "", 100);
  const location = sanitizeText(body.location ?? existing?.location ?? "", 200);
  const description = sanitizeRichText(body.description ?? existing?.description ?? "", 5000);
  const imageUrl = pickImageUrl(body) || (existing && existing.imageUrl) || "";
  return { title, date, location, description, imageUrl };
}

async function createEvent(req, res, next) {
  try {
    const payload = buildEventPayload(req.body);
    if (!payload.title || !payload.date) {
      return res.status(400).json({ error: "Title and date are required" });
    }
    const ev = await Event.create(payload);
    res.status(201).json(ev);
  } catch (err) {
    next(err);
  }
}

async function updateEvent(req, res, next) {
  try {
    const { id } = req.params;
    assertObjectId(id, "Event");
    const existing = await Event.findById(id);
    if (!existing) return res.status(404).json({ error: "Event not found" });
    const payload = buildEventPayload(req.body, existing);
    if (!payload.title || !payload.date) {
      return res.status(400).json({ error: "Title and date are required" });
    }
    const ev = await Event.findByIdAndUpdate(id, payload, { new: true });
    res.json(ev);
  } catch (err) {
    next(err);
  }
}

async function deleteEvent(req, res, next) {
  try {
    const { id } = req.params;
    assertObjectId(id, "Event");
    const ev = await Event.findByIdAndDelete(id);
    if (!ev) return res.status(404).json({ error: "Event not found" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { listEvents, createEvent, updateEvent, deleteEvent };
