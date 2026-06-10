const { Document } = require("../models/document");
const {
  assertObjectId,
  parseBoolean,
  pickDocumentUrl,
  sanitizeRichText,
  sanitizeText,
} = require("../utils/validate");

async function listDocuments(req, res, next) {
  try {
    const isAdmin = Boolean(req.user?.id);
    const query = isAdmin ? {} : { published: true };
    const docs = await Document.find(query).sort({ createdAt: -1 }).lean();
    res.json({ documents: docs });
  } catch (err) {
    next(err);
  }
}

function buildPayload(body, existing) {
  const title = sanitizeText(body.title ?? existing?.title ?? "", 200);
  const description = sanitizeRichText(body.description ?? existing?.description ?? "", 5000);
  const fileUrl = pickDocumentUrl(body) || existing?.fileUrl || "";
  const published = body.published === undefined ? existing?.published ?? true : parseBoolean(body.published, true);
  return { title, description, fileUrl, published };
}

async function createDocument(req, res, next) {
  try {
    const payload = buildPayload(req.body);
    if (!payload.title) return res.status(400).json({ error: "Title is required" });
    if (!payload.fileUrl) return res.status(400).json({ error: "fileUrl is required" });
    const doc = await Document.create(payload);
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
}

async function updateDocument(req, res, next) {
  try {
    const { id } = req.params;
    assertObjectId(id, "Document");
    const existing = await Document.findById(id);
    if (!existing) return res.status(404).json({ error: "Document not found" });
    const payload = buildPayload(req.body, existing);
    if (!payload.title) return res.status(400).json({ error: "Title is required" });
    if (!payload.fileUrl) return res.status(400).json({ error: "fileUrl is required" });
    const updated = await Document.findByIdAndUpdate(id, payload, { new: true });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function deleteDocument(req, res, next) {
  try {
    const { id } = req.params;
    assertObjectId(id, "Document");
    const doc = await Document.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ error: "Document not found" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { listDocuments, createDocument, updateDocument, deleteDocument };
