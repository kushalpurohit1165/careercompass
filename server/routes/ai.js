const express = require("express");
const User = require("../models/User");
const Roadmap = require("../models/Roadmap");
const auth = require("../middleware/auth");
const { askGemini } = require("../services/gemini");

const router = express.Router();

const parseJson = (text) => JSON.parse(text.replace(/```json|```/g, "").trim());

// Get my saved roadmap
router.get("/roadmap", auth, async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ user: req.userId });
    res.json(roadmap);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Generate (or regenerate) my roadmap
router.post("/roadmap", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const p = user?.profile;
    if (!p || !p.targetRole || !p.skills || p.skills.length === 0) {
      return res
        .status(400)
        .json({ message: "Please complete your profile first" });
    }

    const prompt = `You are a career mentor for engineering students in India.

Student profile:
- Branch: ${p.branch}
- Year: ${p.year}
- Current skills: ${p.skills.join(", ")}
- Interests: ${p.interests || "not specified"}
- Target role: ${p.targetRole}
- Target company: ${p.targetCompany}

Compare the student's current skills with what the target role needs.
Return ONLY JSON in exactly this shape:
{
  "summary": "2-3 sentence overview of where the student stands",
  "strengths": ["skill"],
  "skillGaps": [{ "skill": "name", "priority": "High or Medium or Low", "reason": "why it matters" }],
  "steps": [{ "title": "short title", "description": "what to learn or do", "duration": "for example 2 weeks" }],
  "projects": [{ "title": "project name", "description": "what to build", "skills": ["skill"] }]
}
Give 4 to 6 skillGaps, 6 to 8 steps in learning order, and 3 projects.
Write the summary in second person, speaking directly to the student (use "you").
Keep every description under 25 words.`;

    const text = await askGemini(prompt, { json: true });
    const data = parseJson(text);

    const roadmap = await Roadmap.findOneAndUpdate(
      { user: req.userId },
      {
        user: req.userId,
        targetRole: p.targetRole,
        targetCompany: p.targetCompany,
        summary: data.summary,
        strengths: data.strengths || [],
        skillGaps: data.skillGaps || [],
        steps: (data.steps || []).map((s) => ({ ...s, done: false })),
        projects: data.projects || [],
      },
      { new: true, upsert: true }
    );

    res.json(roadmap);
  } catch (err) {
    console.log("Roadmap error:", err.message);
    res
      .status(500)
      .json({ message: "Could not generate roadmap. Please try again." });
  }
});
// Tick or untick a step
router.patch("/roadmap/steps/:stepId", auth, async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ user: req.userId });
    if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });

    const step = roadmap.steps.id(req.params.stepId);
    if (!step) return res.status(404).json({ message: "Step not found" });

    step.done = !step.done;
    await roadmap.save();
    res.json(roadmap);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;