import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Target,
  Map,
  MessageSquare,
  FileText,
  TrendingUp,
  Briefcase,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Skill-Gap Analysis",
    text: "See exactly which skills you are missing for your dream role.",
  },
  {
    icon: Map,
    title: "Personalized Roadmap",
    text: "A step-by-step learning plan with projects built around your goals.",
  },
  {
    icon: MessageSquare,
    title: "AI Career Chatbot",
    text: "Ask anything. The mentor already knows your profile and goals.",
  },
  {
    icon: FileText,
    title: "Resume Feedback",
    text: "Paste your resume and get clear, actionable improvements.",
  },
  {
    icon: Briefcase,
    title: "Interview Prep",
    text: "Practice questions tailored to your target role and company.",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    text: "Tick off milestones and watch your growth on the dashboard.",
  },
];

export default function Landing() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-150 h-150 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-20 w-100 h-100 rounded-full bg-cyan-400/20 blur-3xl" />

      <section className="relative max-w-4xl mx-auto px-6 pt-40 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-300">
            <Sparkles size={16} /> AI-powered career guidance
          </span>

          <h1 className="mt-6 text-5xl md:text-7xl font-extrabold tracking-tight">
            Navigate your career with{" "}
            <span className="bg-linear-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent">
              CareerCompass
            </span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Find your skill gaps, get a personalized roadmap, and prepare for
            internships and placements with a mentor that actually knows you.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-violet-500 to-cyan-500 shadow-xl shadow-violet-500/30 hover:scale-105 transition"
            >
              Get Started <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="px-7 py-3 rounded-xl font-semibold border border-slate-300 dark:border-white/20 hover:bg-slate-100 dark:hover:bg-white/10 transition"
            >
              I already have an account
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Everything you need to get placement-ready
        </h2>
        <p className="mt-3 text-center text-slate-600 dark:text-slate-400">
          Not just answers. A system that tracks you and guides you.
        </p>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md hover:-translate-y-1 hover:border-violet-500/50 transition"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-linear-to-br from-violet-500 to-cyan-400 text-white">
                <f.icon size={22} />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {f.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="relative border-t border-slate-200 dark:border-white/10 py-8 text-center text-sm text-slate-500">
        © 2026 CareerCompass. Built as an ITR project.
      </footer>
    </div>
  );
}