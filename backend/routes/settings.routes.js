const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");
const { activityLogger } = require("../middleware/activity.middleware");
const { getSettings, updateSettings } = require("../controllers/settings.controller");

const router = express.Router();

router.get("/", getSettings);
router.put("/", requireAuth, requireRole("admin", "editor"), activityLogger("settings:update"), updateSettings);

module.exports = router;

