require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");

const app = express();
app.set("trust proxy", 1);
app.use(cors());
app.use(express.json({ limit: "100kb" }));

const base = { standardHeaders: true, legacyHeaders: false };

app.use(
  "/api",
  rateLimit({
    ...base,
    windowMs: 15 * 60 * 1000,
    limit: 300,
    message: { message: "Too many requests. Please try again later." },
  }),
);

app.use(
  "/api/auth",
  rateLimit({
    ...base,
    windowMs: 15 * 60 * 1000,
    limit: 30,
    message: { message: "Too many attempts. Please try again later." },
  }),
);

const aiLimiter = rateLimit({
  ...base,
  windowMs: 60 * 60 * 1000,
  limit: 60,
  message: {
    message: "AI usage limit reached for now. Please try again later.",
  },
});
const onlyPost = (limiter) => (req, res, next) =>
  req.method === "POST" ? limiter(req, res, next) : next();

app.use("/api/ai", onlyPost(aiLimiter));
app.use("/api/tools", aiLimiter);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const profileRoutes = require("./routes/profile");
app.use("/api/profile", profileRoutes);

const aiRoutes = require("./routes/ai");
app.use("/api/ai", aiRoutes);

const toolsRoutes = require("./routes/tools");
app.use("/api/tools", toolsRoutes);

app.get("/", (req, res) => {
  res.send("CareerCompass API is running");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err.message));

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
