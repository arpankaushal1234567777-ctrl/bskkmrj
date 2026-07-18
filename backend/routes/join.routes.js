const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");
const { activityLogger } = require("../middleware/activity.middleware");
const { validateObjectIdParam } = require("../middleware/validate.middleware");
const { createPublicSubmissionLimiter } = require("../config/security");
const {
  createJoinRequest,
  listJoinRequests,
  updateJoinRequestStatus,
  deleteJoinRequests,
  getJoinRequestPhoto,
} = require("../controllers/join.controller");

const router = express.Router();

router.post("/", createPublicSubmissionLimiter(), createJoinRequest);
router.get("/", requireAuth, requireRole("admin", "editor"), listJoinRequests);
router.get("/:id/photo", requireAuth, requireRole("admin", "editor"), validateObjectIdParam("id", "Join request"), getJoinRequestPhoto);
router.patch("/:id", requireAuth, requireRole("admin", "editor"), validateObjectIdParam("id", "Join request"), activityLogger("join-request:update"), updateJoinRequestStatus);
router.post("/bulk-delete", requireAuth, requireRole("admin", "editor"), activityLogger("join-request:bulk-delete"), deleteJoinRequests);

module.exports = router;
