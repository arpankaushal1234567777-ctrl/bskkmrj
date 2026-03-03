const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "editor"], default: "admin" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };

