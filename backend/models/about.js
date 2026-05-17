const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "" },
    mission: { type: String, trim: true, default: "" },
    vision: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    history: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

const About = mongoose.model("About", aboutSchema);

module.exports = { About };
