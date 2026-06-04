const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");
const { activityLogger } = require("../middleware/activity.middleware");
const {
  listDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} = require("../controllers/document.controller");

const router = express.Router();

router.get("/", listDocuments);
router.post("/", requireAuth, requireRole("admin", "editor"), activityLogger("document:create"), createDocument);
router.put("/:id", requireAuth, requireRole("admin", "editor"), activityLogger("document:update"), updateDocument);
router.delete("/:id", requireAuth, requireRole("admin", "editor"), activityLogger("document:delete"), deleteDocument);

module.exports = router;

