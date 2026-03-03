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
    const ev = await Event.create({
      title: req.body.title,
      date: req.body.date,
      location: req.body.location,
    });
    res.status(201).json(ev);
  } catch (err) {
    next(err);
  }
}

async function updateEvent(req, res, next) {
  try {
    const { id } = req.params;
    const ev = await Event.findByIdAndUpdate(
      id,
      { title: req.body.title, date: req.body.date, location: req.body.location },
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
