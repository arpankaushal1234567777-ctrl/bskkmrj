const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const { activityLogger } = require("../middleware/activity.middleware");
const { getAbout, updateAbout } = require("../controllers/about.controller");

const router = express.Router();

router.get("/", getAbout);
router.put("/", requireAuth, activityLogger("about:update"), updateAbout);

module.exports = router;
