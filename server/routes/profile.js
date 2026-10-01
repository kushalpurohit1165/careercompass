const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Get my profile
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Save my profile
router.put("/", auth, async (req, res) => {
  try {
    const { branch, year, skills, interests, targetRole, targetCompany } =
      req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { profile: { branch, year, skills, interests, targetRole, targetCompany } },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;