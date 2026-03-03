const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = { Event };
