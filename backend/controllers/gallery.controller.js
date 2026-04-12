const { GalleryItem } = require("../models/gallery");

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
    const imageUrl = String(req.body.imageUrl || "").trim();
    if (!title || !date || !imageUrl) {
      return res.status(400).json({ error: "Title, date and imageUrl are required" });
    }
    const item = await GalleryItem.create({
      title,
      date,
      imageUrl,
    });
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
    const imageUrl = String(req.body.imageUrl || "").trim();
    if (!title || !date || !imageUrl) {
      return res.status(400).json({ error: "Title, date and imageUrl are required" });
    }
    const item = await GalleryItem.findByIdAndUpdate(
      id,
      { title, date, imageUrl },
      { new: true }
    );
    if (!item) return res.status(404).json({ error: "Gallery item not found" });
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
