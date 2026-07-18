const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const { connectDb } = require("../config/db");
const { AdminSession } = require("../models/adminSession");
const crypto = require("crypto");
const {
  parseBoolean,
  sanitizeEmail,
  sanitizeText,
} = require("../utils/validate");

async function ensureAdminSeeded() {
  await connectDb();
  const adminEmail = sanitizeEmail(process.env.ADMIN_EMAIL || "admin@local");
  const adminUsername = sanitizeText(process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL || "admin", 100).toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD must be set in environment");
  }

  const existing = await User.findOne({ $or: [{ email: adminEmail }, { username: adminUsername }] });
  if (existing) return;
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await User.create({ email: adminEmail, username: adminUsername, passwordHash, role: "admin" });
}

async function login(req, res, next) {
  try {
    await ensureAdminSeeded();

    const { email, username, password, rememberMe } = req.body || {};
    const identifier = sanitizeText(username || email, 320).toLowerCase();
    const pass = String(password || "").trim();
    if (!identifier || !pass) {
      return res.status(400).json({ error: "Username/email and password are required." });
    }
    if (pass.length < 8 || pass.length > 128) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET must be set in environment");
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select("+passwordHash");
    if (!user) return res.status(401).json({ error: "Invalid credentials." });

    const ok = await bcrypt.compare(pass, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials." });

    const expiresIn = parseBoolean(rememberMe) ? "30d" : "12h";
    const jti = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString("hex");
    const payload = { id: user._id, email: user.email, username: user.username, role: user.role, jti };
    const token = jwt.sign(payload, jwtSecret, { expiresIn, algorithm: "HS256" });

    const decoded = jwt.decode(token);
    const expMs = decoded?.exp ? decoded.exp * 1000 : Date.now() + 12 * 60 * 60 * 1000;
    await AdminSession.create({
      userId: user._id,
      jti,
      expiresAt: new Date(expMs),
      ip: String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || ""),
      userAgent: String(req.headers["user-agent"] || ""),
    });

    res.json({ token, user: payload, expiresIn });
  } catch (err) {
    next(err);
  }
}

async function me(req, res) {
  const { id, email, username, role } = req.user || {};
  res.json({ id, email, username, role });
}

async function logout(req, res, next) {
  try {
    const jti = req.user?.jti;
    if (jti) {
      await AdminSession.updateOne({ jti }, { $set: { revokedAt: new Date() } });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { login, me, logout };
