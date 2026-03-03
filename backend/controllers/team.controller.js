const { NationalTeamMember, StateTeamMember } = require("../models/team");

async function getNationalTeam(_req, res, next) {
  try {
    const national = await NationalTeamMember.find().sort({ createdAt: -1 }).lean();
    res.json({ national });
  } catch (err) {
    next(err);
  }
}

async function getStateTeam(_req, res, next) {
  try {
    const state = await StateTeamMember.find().sort({ createdAt: -1 }).lean();
    res.json({ state });
  } catch (err) {
    next(err);
  }
}

async function createTeamMember(scope, req, res, next) {
  try {
    const Model = scope === "state" ? StateTeamMember : NationalTeamMember;
    const doc = await Model.create({ name: req.body.name, role: req.body.role });
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
}

async function updateTeamMember(scope, req, res, next) {
  try {
    const Model = scope === "state" ? StateTeamMember : NationalTeamMember;
    const { id } = req.params;
    const doc = await Model.findByIdAndUpdate(
      id,
      { name: req.body.name, role: req.body.role },
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: "Member not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

async function deleteTeamMember(scope, req, res, next) {
  try {
    const Model = scope === "state" ? StateTeamMember : NationalTeamMember;
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ error: "Member not found" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getNationalTeam,
  getStateTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
};
