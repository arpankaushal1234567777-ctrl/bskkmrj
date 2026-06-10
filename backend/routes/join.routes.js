const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");
const { activityLogger } = require("../middleware/activity.middleware");
const { validateObjectIdParam } = require("../middleware/validate.middleware");
const {
  createJoinRequest,
  listJoinRequests,
  updateJoinRequestStatus,
} = require("../controllers/join.controller");

const router = express.Router();

router.post("/", createJoinRequest);
router.get("/", requireAuth, requireRole("admin", "editor"), listJoinRequests);
router.patch("/:id", requireAuth, requireRole("admin", "editor"), validateObjectIdParam("id", "Join request"), activityLogger("join-request:update"), updateJoinRequestStatus);

module.exports = router;
