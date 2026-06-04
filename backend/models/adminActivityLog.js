const mongoose = require("mongoose");

const adminActivityLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    action: { type: String, required: true, trim: true },
    method: { type: String, required: true, trim: true },
    path: { type: String, required: true, trim: true },
    statusCode: { type: Number, required: true },
    ip: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

const AdminActivityLog = mongoose.model("AdminActivityLog", adminActivityLogSchema);

module.exports = { AdminActivityLog };

