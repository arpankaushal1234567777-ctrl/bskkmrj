const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const {
  getNationalTeam,
  getStateTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = require("../controllers/team.controller");

const router = express.Router();

router.get("/national", getNationalTeam);
router.get("/state", getStateTeam);

router.post("/national", requireAuth, (req, res, next) =>
  createTeamMember("national", req, res, next)
);
router.put("/national/:id", requireAuth, (req, res, next) =>
  updateTeamMember("national", req, res, next)
);
router.delete("/national/:id", requireAuth, (req, res, next) =>
  deleteTeamMember("national", req, res, next)
);

router.post("/state", requireAuth, (req, res, next) =>
  createTeamMember("state", req, res, next)
);
router.put("/state/:id", requireAuth, (req, res, next) =>
  updateTeamMember("state", req, res, next)
);
router.delete("/state/:id", requireAuth, (req, res, next) =>
  deleteTeamMember("state", req, res, next)
);

module.exports = router;

