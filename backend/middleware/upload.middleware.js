function uploadNotConfigured(_req, res) {
  res.status(501).json({ error: "Uploads not configured in this project." });
}

module.exports = { uploadNotConfigured };

