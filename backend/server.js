const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const app = require("./app");
const { connectDb } = require("./config/db");
const { validateEnv } = require("./config/env");

async function start() {
  try {
    const env = validateEnv();
    await connectDb();
    app.listen(env.port, () => {
      console.log(`Backend listening on http://localhost:${env.port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

start();
