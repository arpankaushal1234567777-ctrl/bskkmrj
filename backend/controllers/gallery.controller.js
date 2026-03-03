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
    const item = await GalleryItem.create({
      title: req.body.title,
      date: req.body.date,
      imageUrl: req.body.imageUrl,
    });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

async function updateGalleryItem(req, res, next) {
  try {
    const { id } = req.params;
    const item = await GalleryItem.findByIdAndUpdate(
      id,
      { title: req.body.title, date: req.body.date, imageUrl: req.body.imageUrl },
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
