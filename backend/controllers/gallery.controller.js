const { GalleryItem } = require("../models/gallery");
const { pickImageUrl } = require("../utils/validate");

async function listGallery(_req, res, next) {
  try {
    const items = await GalleryItem.find().sort({ createdAt: -1 }).lean();
    res.json({ items });
  } catch (err) {
    next(err);
  }
}

async function createGalleryItem(req, res, next) {
  try {
    const title = String(req.body.title || "").trim();
    const date = String(req.body.date || "").trim();
    const description = String(req.body.description || "").trim();
    const imageUrl = pickImageUrl(req.body);
    if (!title || !date) {
      return res.status(400).json({ error: "Title and date are required" });
    }
    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL or upload is required" });
    }
    const item = await GalleryItem.create({ title, date, description, imageUrl });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

async function updateGalleryItem(req, res, next) {
  try {
    const { id } = req.params;
    const title = String(req.body.title || "").trim();
    const date = String(req.body.date || "").trim();
    const description = String(req.body.description || "").trim();
    const imageUrl = pickImageUrl(req.body);
    if (!title || !date) {
      return res.status(400).json({ error: "Title and date are required" });
    }
    const existing = await GalleryItem.findById(id);
    if (!existing) return res.status(404).json({ error: "Gallery item not found" });
    const item = await GalleryItem.findByIdAndUpdate(
      id,
      {
        title,
        date,
        description,
        imageUrl: imageUrl || existing.imageUrl,
      },
      { new: true }
    );
    res.json(item);
  } catch (err) {
    next(err);
  }
}

async function deleteGalleryItem(req, res, next) {
  try {
    const { id } = req.params;
    const item = await GalleryItem.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ error: "Gallery item not found" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { listGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem };
