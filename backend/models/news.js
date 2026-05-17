const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    date: { type: String, trim: true, default: "" },
    url: { type: String, trim: true },
    excerpt: { type: String, trim: true },
    content: { type: String, trim: true, default: "" },
    imageUrl: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

const News = mongoose.model("News", newsSchema);

module.exports = { News };
