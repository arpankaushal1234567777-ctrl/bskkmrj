const mongoose = require("mongoose");

const otpVerificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tempToken: { type: String, required: true, unique: true, index: true },
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: false }
);

otpVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OtpVerification = mongoose.model("OtpVerification", otpVerificationSchema);

module.exports = { OtpVerification };
