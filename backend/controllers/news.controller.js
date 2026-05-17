const { News } = require("../models/news");
const { pickImageUrl } = require("../utils/validate");

async function listNews(_req, res, next) {
  try {
    const news = await News.find().sort({ createdAt: -1 }).lean();
    res.json({ news });
  } catch (err) {
    next(err);
  }
}

function buildNewsPayload(body, existing) {
  const title = String(body.title || "").trim();
  const date = String(body.date || "").trim();
  const url = String(body.url || "").trim();
  const excerpt = String(body.excerpt || body.content || "").trim();
  const content = String(body.content || body.excerpt || "").trim();
  const imageUrl = pickImageUrl(body) || (existing && existing.imageUrl) || "";
  return { title, date, url, excerpt, content, imageUrl };
}

async function createNews(req, res, next) {
  try {
    const payload = buildNewsPayload(req.body);
    if (!payload.title) return res.status(400).json({ error: "Title is required" });
    const news = await News.create(payload);
    res.status(201).json(news);
  } catch (err) {
    next(err);
  }
}

async function updateNews(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await News.findById(id);
    if (!existing) return res.status(404).json({ error: "News not found" });
    const payload = buildNewsPayload(req.body, existing);
    if (!payload.title) return res.status(400).json({ error: "Title is required" });
    const news = await News.findByIdAndUpdate(id, payload, { new: true });
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
