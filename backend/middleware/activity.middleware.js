const { AdminActivityLog } = require("../models/adminActivityLog");

function activityLogger(action) {
  return (req, res, next) => {
    const start = Date.now();
    res.on("finish", async () => {
      try {
        if (!req.user?.id) return;
        await AdminActivityLog.create({
          userId: req.user.id,
          action: String(action || req.method),
          method: req.method,
          path: req.originalUrl,
          statusCode: res.statusCode,
          ip: String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || ""),
          userAgent: String(req.headers["user-agent"] || ""),
          meta: { ms: Date.now() - start },
        });
      } catch (_e) {
        // best-effort logging
      }
    });
    next();
  };
}

module.exports = { activityLogger };

