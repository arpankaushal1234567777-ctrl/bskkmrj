const { News } = require("../models/news");

async function listNews(_req, res, next) {
  try {
    const news = await News.find().sort({ createdAt: -1 }).lean();
    res.json({ news });
  } catch (err) {
    next(err);
  }
}

async function createNews(req, res, next) {
  try {
    const title = String(req.body.title || "").trim();
    const url = String(req.body.url || "").trim();
    const excerpt = String(req.body.excerpt || "").trim();
    if (!title) return res.status(400).json({ error: "Title is required" });

    const news = await News.create({
      title,
      url,
      excerpt,
    });
    res.status(201).json(news);
  } catch (err) {
    next(err);
  }
}

async function updateNews(req, res, next) {
  try {
    const { id } = req.params;
    const title = String(req.body.title || "").trim();
    const url = String(req.body.url || "").trim();
    const excerpt = String(req.body.excerpt || "").trim();
    if (!title) return res.status(400).json({ error: "Title is required" });
    const news = await News.findByIdAndUpdate(
      id,
      { title, url, excerpt },
      { new: true }
    );
    if (!news) return res.status(404).json({ error: "News not found" });
    res.json(news);
  } catch (err) {
    next(err);
  }
}

async function deleteNews(req, res, next) {
  try {
    const { id } = req.params;
    const doc = await News.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ error: "News not found" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { listNews, createNews, updateNews, deleteNews };
