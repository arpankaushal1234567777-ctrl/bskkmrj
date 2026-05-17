const mongoose = require("mongoose");

const baseFields = {
  name: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  photo: { type: String, trim: true, default: "" },
  phone: { type: String, trim: true, default: "" },
};

const nationalSchema = new mongoose.Schema(baseFields, { timestamps: true });
const stateSchema = new mongoose.Schema(baseFields, { timestamps: true });

const NationalTeamMember = mongoose.model("NationalTeamMember", nationalSchema);
const StateTeamMember = mongoose.model("StateTeamMember", stateSchema);

module.exports = { NationalTeamMember, StateTeamMember };

