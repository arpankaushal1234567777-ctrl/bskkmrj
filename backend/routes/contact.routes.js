const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");
const { activityLogger } = require("../middleware/activity.middleware");
const { validateObjectIdParam } = require("../middleware/validate.middleware");
const { createPublicSubmissionLimiter } = require("../config/security");
const {
  getContactInfo,
  createContactMessage,
  listContactMessages,
  markContactMessageRead,
  deleteContactMessage,
} = require("../controllers/contactMessage.controller");

const router = express.Router();

router.get("/info", getContactInfo);
router.post("/", createPublicSubmissionLimiter(), createContactMessage);
router.get("/", requireAuth, requireRole("admin", "editor"), listContactMessages);
router.patch("/:id/read", requireAuth, requireRole("admin", "editor"), validateObjectIdParam("id", "Message"), activityLogger("contact-message:read"), markContactMessageRead);
router.delete("/:id", requireAuth, requireRole("admin", "editor"), validateObjectIdParam("id", "Message"), activityLogger("contact-message:delete"), deleteContactMessage);

module.exports = router;
