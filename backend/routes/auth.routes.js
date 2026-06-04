const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const { login, me, logout } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/login", login);
router.get("/me", requireAuth, me);
router.post("/logout", requireAuth, logout);

module.exports = router;
