const jwt = require("jsonwebtoken");
const { AdminSession } = require("../models/adminSession");

function getTokenFromReq(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return token;
}

async function requireAuth(req, res, next) {
  const token = getTokenFromReq(req);
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: "Server misconfiguration: JWT secret missing" });
    }

    const payload = jwt.verify(token, secret);
    if (!payload?.jti) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const session = await AdminSession.findOne({ jti: payload.jti }).lean();
    if (!session || session.revokedAt) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    req.user = payload;
    req.session = session;
    next();
  } catch (_e) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

async function optionalAuth(req, _res, next) {
  const token = getTokenFromReq(req);
  if (!token) return next();
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return next();
    const payload = jwt.verify(token, secret);
    if (!payload?.jti) return next();
    const session = await AdminSession.findOne({ jti: payload.jti }).lean();
    if (!session || session.revokedAt) return next();
    req.user = payload;
    req.session = session;
  } catch (_e) {
    // ignore
  }
  next();
}

function requireRole(...roles) {
  const allowed = new Set(roles.flat().filter(Boolean));
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role || (allowed.size > 0 && !allowed.has(role))) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

module.exports = { requireAuth, optionalAuth, requireRole, getTokenFromReq };
