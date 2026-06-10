const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");
const { activityLogger } = require("../middleware/activity.middleware");
const { validateObjectIdParam } = require("../middleware/validate.middleware");
const {
  listGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require("../controllers/gallery.controller");

const router = express.Router();

router.get("/", listGallery);
router.post("/", requireAuth, requireRole("admin", "editor"), activityLogger("gallery:create"), createGalleryItem);
router.put("/:id", requireAuth, requireRole("admin", "editor"), validateObjectIdParam("id", "Gallery item"), activityLogger("gallery:update"), updateGalleryItem);
router.delete("/:id", requireAuth, requireRole("admin", "editor"), validateObjectIdParam("id", "Gallery item"), activityLogger("gallery:delete"), deleteGalleryItem);

module.exports = router;
