const { About } = require("../models/about");
const { sanitizeRichText, sanitizeText } = require("../utils/validate");

const DEFAULT_ABOUT = {
  title: "भारतीय श्रमिक कामगार कर्मचारी महासंघ राजस्थान :",
  mission: "",
  vision: "",
  description:
    "भारतीय श्रमिक कामगार कर्मचारी महासंघ भारत का सबसे बड़ा केंद्रीय, कामगारो कर्मचारियों व श्रमिक संगठन है। इसकी स्थापना 23 जुलाई 2010 को हुई। भारत के अन्य श्रम संगठनों की तरह यह किसी संगठन के विभाजन के कारण नहीं बना वरन एक विचारधारा के लोगों का सम्मिलित प्रयास का परिणाम था।",
  history: "",
};

async function ensureAboutDoc() {
  let doc = await About.findOne();
  if (!doc) {
    doc = await About.create(DEFAULT_ABOUT);
  }
  return doc;
}

function toPublicShape(doc) {
  const d = doc.toObject ? doc.toObject() : doc;
  return {
    title: d.title || "",
    text: d.description || "",
    mission: d.mission || "",
    vision: d.vision || "",
    description: d.description || "",
    history: d.history || "",
  };
}

async function getAbout(_req, res, next) {
  try {
    const doc = await ensureAboutDoc();
    res.json(toPublicShape(doc));
  } catch (err) {
    next(err);
  }
}

async function updateAbout(req, res, next) {
  try {
    const doc = await ensureAboutDoc();
    const title = sanitizeText(req.body.title ?? doc.title ?? "", 200);
    const mission = sanitizeRichText(req.body.mission ?? doc.mission ?? "", 5000);
    const vision = sanitizeRichText(req.body.vision ?? doc.vision ?? "", 5000);
    const description = sanitizeRichText(req.body.description ?? doc.description ?? "", 15000);
    const history = sanitizeRichText(req.body.history ?? doc.history ?? "", 15000);

    if (!title && !description) {
      return res.status(400).json({ error: "Title or description is required" });
    }

    doc.title = title;
    doc.mission = mission;
    doc.vision = vision;
    doc.description = description;
    doc.history = history;
    await doc.save();
    res.json(toPublicShape(doc));
  } catch (err) {
    next(err);
  }
}

module.exports = { getAbout, updateAbout };
