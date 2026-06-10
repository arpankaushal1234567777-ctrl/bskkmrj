function notFound(req, res) {
  res.status(404).json({
    error: "Not Found",
    path: req.originalUrl,
  });
}

function errorHandler(err, _req, res, _next) {
  const status = Number(err.status || 500);
  const isProduction = process.env.NODE_ENV === "production";
  const message =
    status >= 500 && isProduction
      ? "Internal server error"
      : err.expose
        ? err.message
        : err.message || "Server Error";

  console.error("Request failed", {
    method: _req.method,
    path: _req.originalUrl,
    status,
    message: err.message,
    stack: isProduction ? undefined : err.stack,
  });

  res.status(status).json({
    error: message,
  });
}

module.exports = { notFound, errorHandler };
