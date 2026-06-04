const mongoose = require("mongoose");

const adminSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    jti: { type: String, required: true, unique: true, index: true },
    createdAt: { type: Date, default: Date.now, index: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null, index: true },
    ip: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: false }
);

adminSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const AdminSession = mongoose.model("AdminSession", adminSessionSchema);

module.exports = { AdminSession };
