const path = require("path");

function safeJoin(baseDir, fileName) {
  const safeName = path.basename(String(fileName || ""));
  return path.join(baseDir, safeName);
}

module.exports = { safeJoin };

