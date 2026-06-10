const express = require("express");
const { requireAuth, optionalAuth, requireRole } = require("../middleware/auth.middleware");
const { activityLogger } = require("../middleware/activity.middleware");
const { validateObjectIdParam } = require("../middleware/validate.middleware");
const {
  listNews,
  createNews,
  updateNews,
  deleteNews,
} = require("../controllers/news.controller");

const router = express.Router();

router.get("/", optionalAuth, listNews);
router.post("/", requireAuth, requireRole("admin", "editor"), activityLogger("news:create"), createNews);
router.put("/:id", requireAuth, requireRole("admin", "editor"), validateObjectIdParam("id", "News"), activityLogger("news:update"), updateNews);
router.delete("/:id", requireAuth, requireRole("admin", "editor"), validateObjectIdParam("id", "News"), activityLogger("news:delete"), deleteNews);

module.exports = router;
