const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

const GalleryItem = mongoose.model("GalleryItem", gallerySchema);

module.exports = { GalleryItem };
