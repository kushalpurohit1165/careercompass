const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    targetRole: String,
    targetCompany: String,
    summary: String,
    strengths: [String],
    skillGaps: [{ skill: String, priority: String, reason: String }],
    steps: [
      {
        title: String,
        description: String,
        duration: String,
        done: { type: Boolean, default: false },
      },
    ],
    projects: [{ title: String, description: String, skills: [String] }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Roadmap", roadmapSchema);