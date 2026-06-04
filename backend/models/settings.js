const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    siteTitle: { type: String, trim: true, default: "BSKKMRJ" },
    seoDescription: { type: String, trim: true, default: "" },
    seoKeywords: { type: String, trim: true, default: "" },
    socialLinks: {
      facebook: { type: String, trim: true, default: "" },
      instagram: { type: String, trim: true, default: "" },
      twitter: { type: String, trim: true, default: "" },
      youtube: { type: String, trim: true, default: "" },
      whatsapp: { type: String, trim: true, default: "" },
    },
    contact: {
      phone: { type: String, trim: true, default: "" },
      email: { type: String, trim: true, default: "" },
      address: { type: String, trim: true, default: "" },
    },
    footerText: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);

module.exports = { Settings };

