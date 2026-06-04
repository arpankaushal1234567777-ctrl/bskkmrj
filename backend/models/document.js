const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    fileUrl: { type: String, required: true, trim: true }, // URL or base64 data URL
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);

module.exports = { Document };

