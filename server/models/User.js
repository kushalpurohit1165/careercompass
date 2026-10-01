const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    profile: {
      branch: String,
      year: String,
      skills: [String],
      interests: String,
      targetRole: String,
      targetCompany: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);