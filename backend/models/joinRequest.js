const mongoose = require("mongoose");

const joinRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, trim: true, default: "" },
    occupation: { type: String, trim: true, default: "" },
    message: { type: String, trim: true, default: "" },
    aadhaar_number: { type: String, required: true, trim: true },
    aadhaar_photo: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const JoinRequest = mongoose.model("JoinRequest", joinRequestSchema);

module.exports = { JoinRequest };
