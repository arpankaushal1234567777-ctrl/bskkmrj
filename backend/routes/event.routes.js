const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const {
  listEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/event.controller");

const router = express.Router();

router.get("/", listEvents);
router.post("/", requireAuth, createEvent);
router.put("/:id", requireAuth, updateEvent);
router.delete("/:id", requireAuth, deleteEvent);

module.exports = router;
