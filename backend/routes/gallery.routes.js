const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const { activityLogger } = require("../middleware/activity.middleware");
const {
  listGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require("../controllers/gallery.controller");

const router = express.Router();

router.get("/", listGallery);
router.post("/", requireAuth, activityLogger("gallery:create"), createGalleryItem);
router.put("/:id", requireAuth, activityLogger("gallery:update"), updateGalleryItem);
router.delete("/:id", requireAuth, activityLogger("gallery:delete"), deleteGalleryItem);

module.exports = router;
