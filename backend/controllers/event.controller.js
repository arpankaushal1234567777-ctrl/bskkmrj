const { Event } = require("../models/event");

async function listEvents(_req, res, next) {
  try {
    const events = await Event.find().sort({ date: -1 }).lean();
    res.json({ events });
  } catch (err) {
    next(err);
  }
}

async function createEvent(req, res, next) {
  try {
    const title = String(req.body.title || "").trim();
    const date = String(req.body.date || "").trim();
    const location = String(req.body.location || "").trim();
    if (!title || !date) {
      return res.status(400).json({ error: "Title and date are required" });
    }
    const ev = await Event.create({
      title,
      date,
      location,
    });
    res.status(201).json(ev);
  } catch (err) {
    next(err);
  }
}

async function updateEvent(req, res, next) {
  try {
    const { id } = req.params;
    const title = String(req.body.title || "").trim();
    const date = String(req.body.date || "").trim();
    const location = String(req.body.location || "").trim();
    if (!title || !date) {
      return res.status(400).json({ error: "Title and date are required" });
    }
    const ev = await Event.findByIdAndUpdate(
      id,
      { title, date, location },
      { new: true }
    );
    if (!ev) return res.status(404).json({ error: "Event not found" });
    res.json(ev);
  } catch (err) {
    next(err);
  }
}

async function deleteEvent(req, res, next) {
  try {
    const { id } = req.params;
    const ev = await Event.findByIdAndDelete(id);
    if (!ev) return res.status(404).json({ error: "Event not found" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { listEvents, createEvent, updateEvent, deleteEvent };
