const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");
const { activityLogger } = require("../middleware/activity.middleware");
const { validateObjectIdParam } = require("../middleware/validate.middleware");
const {
  getNationalTeam,
  getStateTeam,
  createTeamMember,
  createTeamMemberUnified,
  updateTeamMember,
  updateTeamMemberUnified,
  deleteTeamMember,
  deleteTeamMemberUnified,
} = require("../controllers/team.controller");

const router = express.Router();

router.get("/national", getNationalTeam);
router.get("/state", getStateTeam);

router.post("/", requireAuth, requireRole("admin", "editor"), activityLogger("team:create"), createTeamMemberUnified);
router.put("/:id", requireAuth, requireRole("admin", "editor"), validateObjectIdParam("id", "Member"), activityLogger("team:update"), updateTeamMemberUnified);
router.delete("/:id", requireAuth, requireRole("admin", "editor"), validateObjectIdParam("id", "Member"), activityLogger("team:delete"), deleteTeamMemberUnified);

router.post("/national", requireAuth, requireRole("admin", "editor"), activityLogger("team:create-national"), (req, res, next) =>
  createTeamMember("national", req, res, next)
);
router.put("/national/:id", requireAuth, requireRole("admin", "editor"), validateObjectIdParam("id", "Member"), activityLogger("team:update-national"), (req, res, next) =>
  updateTeamMember("national", req, res, next)
);
router.delete("/national/:id", requireAuth, requireRole("admin", "editor"), validateObjectIdParam("id", "Member"), activityLogger("team:delete-national"), (req, res, next) =>
  deleteTeamMember("national", req, res, next)
);

router.post("/state", requireAuth, requireRole("admin", "editor"), activityLogger("team:create-state"), (req, res, next) =>
  createTeamMember("state", req, res, next)
);
router.put("/state/:id", requireAuth, requireRole("admin", "editor"), validateObjectIdParam("id", "Member"), activityLogger("team:update-state"), (req, res, next) =>
  updateTeamMember("state", req, res, next)
);
router.delete("/state/:id", requireAuth, requireRole("admin", "editor"), validateObjectIdParam("id", "Member"), activityLogger("team:delete-state"), (req, res, next) =>
  deleteTeamMember("state", req, res, next)
);

module.exports = router;
