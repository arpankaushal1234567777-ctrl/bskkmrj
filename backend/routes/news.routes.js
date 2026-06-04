const express = require("express");
const { requireAuth, optionalAuth } = require("../middleware/auth.middleware");
const { activityLogger } = require("../middleware/activity.middleware");
const {
  listNews,
  createNews,
  updateNews,
  deleteNews,
} = require("../controllers/news.controller");

const router = express.Router();

router.get("/", optionalAuth, listNews);
router.post("/", requireAuth, activityLogger("news:create"), createNews);
router.put("/:id", requireAuth, activityLogger("news:update"), updateNews);
router.delete("/:id", requireAuth, activityLogger("news:delete"), deleteNews);

module.exports = router;
