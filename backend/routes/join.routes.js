const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const {
  createJoinRequest,
  listJoinRequests,
  updateJoinRequestStatus,
} = require("../controllers/join.controller");

const router = express.Router();

router.post("/", createJoinRequest);
router.get("/", requireAuth, listJoinRequests);
router.patch("/:id", requireAuth, updateJoinRequestStatus);

module.exports = router;
