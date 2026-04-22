const friendRoutes = require("./routes/friendRoutes");
const messageRoutes = require("./routes/messageRoutes");

const authMiddleware=require("./middleware/authMiddleware");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/user", userRoutes);
app.get("/", (req, res) => {
  res.send("🚀 GalaxyVerse backend running");
});
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are logged in",
    user: req.user
  });
});
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`✅ Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB error:", err));