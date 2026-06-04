const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const { activityLogger } = require("../middleware/activity.middleware");
const {
  listEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/event.controller");

const router = express.Router();

router.get("/", listEvents);
router.post("/", requireAuth, activityLogger("event:create"), createEvent);
router.put("/:id", requireAuth, activityLogger("event:update"), updateEvent);
router.delete("/:id", requireAuth, activityLogger("event:delete"), deleteEvent);

module.exports = router;
