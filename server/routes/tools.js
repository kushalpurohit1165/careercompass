const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { askGemini } = require("../services/gemini");

const router = express.Router();

const parseJson = (text) => JSON.parse(text.replace(/```json|```/g, "").trim());

// Resume analysis (the resume text is not stored)
router.post("/resume", auth, async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText || resumeText.trim().length < 50) {
      return res
        .status(400)
        .json({
          message: "Please paste your resume text first (at least a few lines)",
        });
    }

    const user = await User.findById(req.userId);
    const p = user?.profile || {};

    const prompt = `You are an expert resume reviewer for engineering students in India.

Target role: ${p.targetRole || "Software Engineer"}
Target company: ${p.targetCompany || "any company"}

Resume text:
"""
${resumeText.slice(0, 6000)}
"""

Review this resume for the target role.
Return ONLY JSON in exactly this shape:
{
  "score": 0 to 100 as a number,
  "summary": "2 sentence overall verdict, speaking to the student as you",
  "strengths": ["short point"],
  "improvements": [{ "issue": "what is weak", "fix": "specific fix" }],
  "missingKeywords": ["keyword"]
}
Give 3 to 5 strengths, 4 to 6 improvements, and 5 to 8 missingKeywords.
Keep every point under 25 words.`;

    const text = await askGemini(prompt, { json: true });
    res.json(parseJson(text));
  } catch (err) {
    console.log("Resume error:", err.message);
    res
      .status(500)
      .json({ message: "Could not analyze resume. Please try again." });
  }
});

// Interview questions
router.post("/interview", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const p = user?.profile;
    if (!p || !p.targetRole) {
      return res
        .status(400)
        .json({ message: "Please complete your profile first" });
    }

    const prompt = `You are an interview coach for engineering students in India.

Student profile:
- Year: ${p.year}
- Skills: ${(p.skills || []).join(", ")}
- Target role: ${p.targetRole}
- Target company: ${p.targetCompany}

Create interview practice questions.
Return ONLY JSON in exactly this shape:
{
  "technical": [{ "question": "text", "hint": "what a good answer covers" }],
  "behavioral": [{ "question": "text", "hint": "what a good answer covers" }],
  "company": [{ "question": "text", "hint": "what a good answer covers" }]
}
Give 5 technical, 3 behavioral, and 3 company-specific questions for ${p.targetCompany}.
Keep every hint under 25 words.`;

    const text = await askGemini(prompt, { json: true });
    res.json(parseJson(text));
  } catch (err) {
    console.log("Interview error:", err.message);
    res
      .status(500)
      .json({ message: "Could not generate questions. Please try again." });
  }
});

module.exports = router;
