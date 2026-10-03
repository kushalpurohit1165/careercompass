require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());
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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
