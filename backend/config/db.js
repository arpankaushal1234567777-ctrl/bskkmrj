const mongoose = require("mongoose");

let connectionPromise;

async function connectDb(uri) {
  if (connectionPromise) return connectionPromise;
  const mongoUri = uri || process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not set in environment.");
  }
  mongoose.set("strictQuery", true);
  connectionPromise = mongoose.connect(mongoUri).then(() => {
    // connected
    return mongoose.connection;
  });
  return connectionPromise;
}

module.exports = { connectDb };
