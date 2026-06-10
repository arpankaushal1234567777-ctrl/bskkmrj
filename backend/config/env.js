function getEnv() {
  return {
    nodeEnv: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT || 5000),
    jwtSecret: process.env.JWT_SECRET || "",
    mongodbUri: process.env.MONGODB_URI || "",
  };
}

function validateEnv() {
  const env = getEnv();
  const missing = [];

  if (!env.jwtSecret) missing.push("JWT_SECRET");
  if (!env.mongodbUri) missing.push("MONGODB_URI");
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  return env;
}

module.exports = { getEnv, validateEnv };
