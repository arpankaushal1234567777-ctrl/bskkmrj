const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");
const { activityLogger } = require("../middleware/activity.middleware");
const { validateObjectIdParam } = require("../middleware/validate.middleware");
const {
  listEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/event.controller");

const router = express.Router();

router.get("/", listEvents);
router.post("/", requireAuth, requireRole("admin", "editor"), activityLogger("event:create"), createEvent);
router.put("/:id", requireAuth, requireRole("admin", "editor"), validateObjectIdParam("id", "Event"), activityLogger("event:update"), updateEvent);
router.delete("/:id", requireAuth, requireRole("admin", "editor"), validateObjectIdParam("id", "Event"), activityLogger("event:delete"), deleteEvent);

module.exports = router;
