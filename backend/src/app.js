const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { connectDatabase } = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const matchRoutes = require("./routes/matchRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const { notFoundHandler, errorHandler } = require("./middlewares/errorHandler");

const app = express();

connectDatabase();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(helmet());
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false
}));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/newsletter", newsletterRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
