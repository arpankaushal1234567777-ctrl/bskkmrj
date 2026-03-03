const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const {
  listNews,
  createNews,
  updateNews,
  deleteNews,
} = require("../controllers/news.controller");

const router = express.Router();

router.get("/", listNews);
router.post("/", requireAuth, createNews);
router.put("/:id", requireAuth, updateNews);
router.delete("/:id", requireAuth, deleteNews);

module.exports = router;
