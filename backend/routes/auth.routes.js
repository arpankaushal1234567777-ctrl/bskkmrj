const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const { createAuthLimiter } = require("../config/security");
const { activityLogger } = require("../middleware/activity.middleware");
const { login, verifyOtp, me, logout } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/login", createAuthLimiter(), login);
router.post("/verify-otp", createAuthLimiter(), verifyOtp);
router.get("/me", requireAuth, me);
router.post("/logout", requireAuth, activityLogger("auth:logout"), logout);

module.exports = router;
