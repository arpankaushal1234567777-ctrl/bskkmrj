const rateLimit = require("express-rate-limit");

function buildAllowedOrigins() {
  const configured = [
    process.env.FRONTEND_ORIGIN,
    process.env.ADMIN_ORIGIN,
    process.env.SITE_ORIGIN,
    ...(process.env.CORS_ORIGINS || "").split(","),
    "https://bskkmrj.in",
    "https://www.bskkmrj.in",
    "https://admin.bskkmrj.in",
  ]
    .map((value) => String(value || "").trim())
    .filter(Boolean);

  if (process.env.NODE_ENV !== "production") {
    configured.push(
      "http://localhost:3000",
      "http://localhost:4173",
      "http://localhost:5000",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:4173",
      "http://127.0.0.1:5000"
    );
  }

  return [...new Set(configured)];
}

function createCorsOptions() {
  const allowedOrigins = buildAllowedOrigins();

  return {
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      const error = new Error("Origin not allowed by CORS");
      error.status = 403;
      error.expose = true;
      return callback(error);
    },
    credentials: false,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  };
}

function createAuthLimiter() {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Number(process.env.AUTH_RATE_LIMIT_MAX || 10),
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many login attempts. Please try again later." },
    skipSuccessfulRequests: true,
  });
}

module.exports = {
  buildAllowedOrigins,
  createAuthLimiter,
  createCorsOptions,
};
