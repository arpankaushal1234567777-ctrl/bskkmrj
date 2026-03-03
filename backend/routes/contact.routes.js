const express = require("express");
const { getContact } = require("../controllers/contact.controller");

const router = express.Router();

router.get("/", getContact);

module.exports = router;
