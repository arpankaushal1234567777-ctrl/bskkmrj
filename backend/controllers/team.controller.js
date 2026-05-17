const { NationalTeamMember, StateTeamMember } = require("../models/team");
const { pickImageUrl } = require("../utils/validate");

function getModel(scope) {
  return scope === "state" ? StateTeamMember : NationalTeamMember;
}

function normalizeScope(scope) {
  return scope === "state" ? "state" : "national";
}

function buildMemberPayload(body) {
  const name = String(body.name || "").trim();
  const role = String(body.role || body.position || "").trim();
  const photo = String(body.photo || "").trim() || pickImageUrl(body);
  const phone = String(body.phone || "").trim();
  return { name, role, photo, phone };
}

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
    const payload = buildMemberPayload(req.body);
    if (!payload.name || !payload.role) {
      return res.status(400).json({ error: "Name and position are required" });
    }
    const Model = getModel(scope);
    const doc = await Model.create(payload);
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
}

async function createTeamMemberUnified(req, res, next) {
  const scope = normalizeScope(String(req.body.scope || "").trim());
  return createTeamMember(scope, req, res, next);
}

async function updateTeamMember(scope, req, res, next) {
  try {
    const payload = buildMemberPayload(req.body);
    if (!payload.name || !payload.role) {
      return res.status(400).json({ error: "Name and position are required" });
    }
    const Model = getModel(scope);
    const { id } = req.params;
    const existing = await Model.findById(id);
    if (!existing) return res.status(404).json({ error: "Member not found" });
    if (!payload.photo) payload.photo = existing.photo;
    const doc = await Model.findByIdAndUpdate(id, payload, { new: true });
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

async function updateTeamMemberUnified(req, res, next) {
  const scope = normalizeScope(String(req.body.scope || "").trim());
  return updateTeamMember(scope, req, res, next);
}

async function deleteTeamMember(scope, req, res, next) {
  try {
    const Model = getModel(scope);
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ error: "Member not found" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

async function deleteTeamMemberUnified(req, res, next) {
  const scope = normalizeScope(String(req.body.scope || req.query.scope || "").trim());
  return deleteTeamMember(scope, req, res, next);
}

module.exports = {
  getNationalTeam,
  getStateTeam,
  createTeamMember,
  createTeamMemberUnified,
  updateTeamMember,
  updateTeamMemberUnified,
  deleteTeamMember,
  deleteTeamMemberUnified,
};
