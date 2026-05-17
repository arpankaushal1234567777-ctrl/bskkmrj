const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const { getAbout, updateAbout } = require("../controllers/about.controller");

const router = express.Router();

router.get("/", getAbout);
router.put("/", requireAuth, updateAbout);

module.exports = router;
