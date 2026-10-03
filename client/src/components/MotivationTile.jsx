import { useState } from "react";
import { Quote } from "lucide-react";

const lines = [
  "Consistency beats intensity. One focused hour today beats a perfect plan for tomorrow.",
  "Your future self is already grateful you opened this dashboard. Now give them something to thank you for.",
  "Motivation gets you started. A calendar gets you finished.",
  "Every expert was once a beginner who refused to close the tab.",
  "Tutorial hell has great snacks but no job offers. Build something today.",
  "Even one LeetCode problem moves you forward. Small steps still count.",
  "Reading about DSA doesn't build skill any more than reading about the gym builds muscle. Solve one problem.",
  "Your roadmap won't tick itself, tempting as that would be.",
  "Progress, not perfection. Ship the imperfect project.",
  "The best time to start was earlier. The second best time is right now.",
  "Don't compare your chapter 3 to someone else's chapter 20.",
  "Debugging is just detective work with worse lighting. Keep going.",
  "Interviews reward preparation, not luck. Prepare a little every day.",
  "A project on GitHub speaks louder than a skill listed on a resume.",
  "Rest is part of the plan. Take a break, then come back sharper.",
  "You do not need to feel ready. You need to start.",
  "Ten minutes of practice beats an hour of procrastination.",
  "Every green tick on your roadmap is proof that you showed up.",
  "Skills compound like interest. Keep making small deposits.",
  "Stuck means you are learning something new. Stay with it.",
  "Great engineers are not born, they are built one commit at a time.",
  "Your competition is not other students. It is yesterday's version of you.",
  "Hard problems feel impossible right up until they feel obvious. Keep solving.",
  "Do the boring revision today. Future you will call it a smart move.",
];

export default function MotivationTile({ percent = 0 }) {
  const [line] = useState(
    () => lines[Math.floor(Math.random() * lines.length)],
  );

  return (
    <div className="mt-8 p-6 rounded-2xl border border-violet-500/30 bg-linear-to-br from-violet-500/10 to-cyan-400/10">
      <Quote size={22} className="text-violet-500" />
      <p className="mt-3 text-lg font-medium">{line}</p>
      <p className="mt-2 text-sm text-slate-500">
        {percent >= 100
          ? "Roadmap complete. Time to set a bigger goal."
          : percent > 0
            ? `You are ${percent}% through your roadmap. Keep the momentum.`
            : "Your roadmap is waiting. Tick off your first step today."}
      </p>
    </div>
  );
}
