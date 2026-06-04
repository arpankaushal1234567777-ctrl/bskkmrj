const express = require("express");
const cors = require("cors");

const { notFound, errorHandler } = require("./middleware/error.middleware");
const { connectDb } = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const newsRoutes = require("./routes/news.routes");
const eventRoutes = require("./routes/event.routes");
const galleryRoutes = require("./routes/gallery.routes");
const contactRoutes = require("./routes/contact.routes");
const teamRoutes = require("./routes/team.routes");
const aboutRoutes = require("./routes/about.routes");
const joinRoutes = require("./routes/join.routes");
const settingsRoutes = require("./routes/settings.routes");
const documentRoutes = require("./routes/document.routes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.disable("x-powered-by");

app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use((req, _res, next) => {
  connectDb().then(() => next()).catch(next);
});

app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/join", joinRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/documents", documentRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
