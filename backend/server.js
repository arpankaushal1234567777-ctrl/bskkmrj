const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const app = require("./app");
const { connectDb } = require("./config/db");

const port = Number(process.env.PORT || 5000);

async function start() {
  try {
    await connectDb();
    app.listen(port, () => {
      console.log(`Backend listening on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

start();
