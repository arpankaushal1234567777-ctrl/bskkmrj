function notFound(req, res) {
  res.status(404).json({
    error: "Not Found",
    path: req.originalUrl,
  });
}

function errorHandler(err, _req, res, _next) {
  const status = Number(err.status || 500);
  res.status(status).json({
    error: err.message || "Server Error",
  });
}

module.exports = { notFound, errorHandler };
