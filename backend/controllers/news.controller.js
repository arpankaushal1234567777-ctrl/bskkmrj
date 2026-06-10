const { News } = require("../models/news");
const {
  assertObjectId,
  parseBoolean,
  pickImageUrl,
  sanitizeRichText,
  sanitizeText,
  sanitizeUrl,
} = require("../utils/validate");

async function listNews(_req, res, next) {
  try {
    const isAdmin = Boolean(_req.user?.id);
    const query = isAdmin ? {} : { published: true };
    const news = await News.find(query).sort({ createdAt: -1 }).lean();
    res.json({ news });
  } catch (err) {
    next(err);
  }
}

function buildNewsPayload(body, existing) {
  const title = sanitizeText(body.title ?? existing?.title ?? "", 200);
  const date = sanitizeText(body.date ?? existing?.date ?? "", 100);
  const url = sanitizeUrl(body.url ?? existing?.url ?? "");
  const excerpt = sanitizeRichText(
    body.excerpt ?? body.content ?? existing?.excerpt ?? existing?.content ?? "",
    5000
  );
  const content = sanitizeRichText(
    body.content ?? body.excerpt ?? existing?.content ?? existing?.excerpt ?? "",
    15000
  );
  const imageUrl = pickImageUrl(body) || (existing && existing.imageUrl) || "";
  const published =
    body.published === undefined ? (existing ? existing.published : true) : parseBoolean(body.published, true);
  return { title, date, url, excerpt, content, imageUrl, published };
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
    assertObjectId(id, "News");
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
    assertObjectId(id, "News");
    const doc = await News.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ error: "News not found" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { listNews, createNews, updateNews, deleteNews };
