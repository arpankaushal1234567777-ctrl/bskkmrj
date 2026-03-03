const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, trim: true },
    excerpt: { type: String, trim: true },
  },
  { timestamps: true }
);

const News = mongoose.model("News", newsSchema);

module.exports = { News };
