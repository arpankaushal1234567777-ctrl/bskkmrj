const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const {
  getContactInfo,
  createContactMessage,
  listContactMessages,
  markContactMessageRead,
  deleteContactMessage,
} = require("../controllers/contactMessage.controller");

const router = express.Router();

router.get("/info", getContactInfo);
router.post("/", createContactMessage);
router.get("/", requireAuth, listContactMessages);
router.patch("/:id/read", requireAuth, markContactMessageRead);
router.delete("/:id", requireAuth, deleteContactMessage);

module.exports = router;
