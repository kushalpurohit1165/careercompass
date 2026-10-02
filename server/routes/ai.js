const express = require("express");
const User = require("../models/User");
const Roadmap = require("../models/Roadmap");
const Conversation = require("../models/Conversation");
const auth = require("../middleware/auth");
const { askGemini, chatGemini } = require("../services/gemini");

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
      { new: true, upsert: true },
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

// List my chats (newest first)
router.get("/conversations", auth, async (req, res) => {
  try {
    const list = await Conversation.find({ user: req.userId })
      .select("title updatedAt")
      .sort({ updatedAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Open one chat
router.get("/conversations/:id", auth, async (req, res) => {
  try {
    const convo = await Conversation.findOne({
      _id: req.params.id,
      user: req.userId,
    });
    if (!convo) return res.status(404).json({ message: "Chat not found" });
    res.json(convo);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete one chat
router.delete("/conversations/:id", auth, async (req, res) => {
  try {
    await Conversation.deleteOne({ _id: req.params.id, user: req.userId });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Chat with the career mentor (saves every message)
router.post("/chat", auth, async (req, res) => {
  try {
    const { conversationId, message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: "No message" });
    }

    let convo = null;
    if (conversationId) {
      convo = await Conversation.findOne({
        _id: conversationId,
        user: req.userId,
      });
    }
    if (!convo) {
      convo = new Conversation({
        user: req.userId,
        title: message.trim().slice(0, 40),
        messages: [],
      });
    }
    convo.messages.push({ role: "user", text: message.trim() });

    const user = await User.findById(req.userId);
    const roadmap = await Roadmap.findOne({ user: req.userId });
    const p = user?.profile || {};

    const done = roadmap
      ? roadmap.steps.filter((s) => s.done).map((s) => s.title)
      : [];
    const pending = roadmap
      ? roadmap.steps.filter((s) => !s.done).map((s) => s.title)
      : [];

    const system = `You are CareerCompass, a friendly AI career mentor for engineering students in India.

About the student:
- Name: ${user.name}
- Branch: ${p.branch || "not set"}
- Year: ${p.year || "not set"}
- Current skills: ${(p.skills || []).join(", ") || "not set"}
- Interests: ${p.interests || "not set"}
- Target role: ${p.targetRole || "not set"}
- Target company: ${p.targetCompany || "not set"}
- Roadmap steps completed: ${done.join(", ") || "none yet"}
- Roadmap steps still pending: ${pending.join(", ") || "no roadmap generated yet"}

Rules:
- Give practical advice based on this student's profile and progress.
- Keep answers under 150 words and use simple language.
- Use plain text only. Do not use markdown symbols like ** or #. For lists, use short lines starting with a hyphen.
- Completed steps only mean the student ticked them off. Never say they have mastered a topic; say they have worked through it.
- If the question is not about careers, studies, or skills, say in one friendly sentence that you cannot help with that here (you also have no live news or scores), then offer one useful career question. Do not repeat the student's roadmap details in that reply.`;

    const history = convo.messages
      .slice(-12)
      .map((m) => ({ role: m.role, text: m.text }));

    const reply = await chatGemini(system, history);
    convo.messages.push({ role: "model", text: reply });
    await convo.save();

    res.json({ conversationId: convo._id, title: convo.title, reply });
  } catch (err) {
    console.log("Chat error:", err.message);
    res.status(500).json({ message: "Chat failed. Please try again." });
  }
});

module.exports = router;
