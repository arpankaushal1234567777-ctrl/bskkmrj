const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const {
  listGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require("../controllers/gallery.controller");

const router = express.Router();

router.get("/", listGallery);
router.post("/", requireAuth, createGalleryItem);
router.put("/:id", requireAuth, updateGalleryItem);
router.delete("/:id", requireAuth, deleteGalleryItem);

module.exports = router;
