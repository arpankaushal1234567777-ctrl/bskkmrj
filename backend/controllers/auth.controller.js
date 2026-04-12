const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const { connectDb } = require("../config/db");

async function ensureAdminSeeded() {
  await connectDb();
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment");
  }

  const existing = await User.findOne({ email: adminEmail });
  if (existing) return;
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await User.create({ email: adminEmail, passwordHash, role: "admin" });
}

async function login(req, res, next) {
  try {
    await ensureAdminSeeded();

    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET must be set in environment");
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials." });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials." });

    const payload = { id: user._id, email: user.email, role: user.role };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "12h" });

    res.json({ token, user: payload });
  } catch (err) {
    next(err);
  }
}

module.exports = { login };
