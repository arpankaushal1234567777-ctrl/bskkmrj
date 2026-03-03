const express = require("express");
const { getAbout } = require("../controllers/about.controller");

const router = express.Router();

router.get("/", getAbout);

module.exports = router;

