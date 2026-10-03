import MotivationTile from "../components/MotivationTile";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Map,
  MessageSquare,
  UserCircle,
  Target,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([api.get("/profile"), api.get("/ai/roadmap")])
      .then(([p, r]) => {
        setProfile(p.data.profile || null);
        setRoadmap(r.data || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  const steps = roadmap?.steps || [];
  const doneCount = steps.filter((s) => s.done).length;
  const percent = steps.length
    ? Math.round((doneCount / steps.length) * 100)
    : 0;
  const nextStep = steps.find((s) => !s.done);
  const highGaps = (roadmap?.skillGaps || []).filter(
    (g) => g.priority === "High",
  ).length;
  const profileDone = profile?.targetRole && profile?.skills?.length > 0;
  const firstName = user.name.split(" ")[0];

  const card =
    "p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md";

  const stats = [
    { icon: TrendingUp, label: "Roadmap progress", value: `${percent}%` },
    {
      icon: CheckCircle2,
      label: "Steps completed",
      value: `${doneCount}/${steps.length}`,
    },
    { icon: Target, label: "High-priority gaps", value: highGaps },
  ];

  const actions = [
    {
      to: "/profile",
      icon: UserCircle,
      title: "Your profile",
      text: "Update your skills and goals",
    },
    {
      to: "/roadmap",
      icon: Map,
      title: "Your roadmap",
      text: "See gaps, steps, and projects",
    },
    {
      to: "/chat",
      icon: MessageSquare,
      title: "AI mentor",
      text: "Ask anything about your career",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 pt-28 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold">
          Welcome back,{" "}
          <span className="bg-linear-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent">
            {firstName}
          </span>
        </h1>
        {profileDone && (
          <p className="mt-2 text-slate-500">
            Working towards {profile.targetRole} at {profile.targetCompany}
          </p>
        )}
      </motion.div>
        <MotivationTile percent={percent} />
      {!loading && !profileDone && (
        <div
          className={`${card} mt-8 flex flex-wrap items-center justify-between gap-4`}
        >
          <p className="text-slate-700 dark:text-slate-200">
            Complete your profile to unlock your personalized roadmap.
          </p>
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-linear-to-r from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/30 hover:opacity-90 transition"
          >
            Complete profile <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {!loading && profileDone && !roadmap && (
        <div
          className={`${card} mt-8 flex flex-wrap items-center justify-between gap-4`}
        >
          <p className="text-slate-700 dark:text-slate-200">
            Your profile is ready. Generate your first roadmap.
          </p>
          <Link
            to="/roadmap"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-linear-to-r from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/30 hover:opacity-90 transition"
          >
            Generate roadmap <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {roadmap && (
        <>
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={card}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-linear-to-br from-violet-500 to-cyan-400">
                  <s.icon size={20} />
                </div>
                <p className="mt-4 text-3xl font-bold">{s.value}</p>
                <p className="text-sm text-slate-500">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <div className={`${card} mt-4`}>
            <div className="flex justify-between text-sm text-slate-500 mb-2">
              <span>Overall progress</span>
              <span>{percent}%</span>
            </div>
            <div className="h-3 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-linear-to-r from-violet-500 to-cyan-400 transition-all duration-700"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <div className={`${card} mt-4`}>
            {nextStep ? (
              <>
                <p className="text-sm text-slate-500">Up next</p>
                <h2 className="mt-1 text-xl font-semibold">{nextStep.title}</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {nextStep.description} ({nextStep.duration})
                </p>
                <Link
                  to="/roadmap"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-violet-500"
                >
                  Open roadmap <ArrowRight size={14} />
                </Link>
              </>
            ) : (
              <p className="font-semibold">
                You finished every step on your roadmap. Amazing work!
              </p>
            )}
          </div>
        </>
      )}

      {profile?.skills?.length > 0 && (
        <div className={`${card} mt-4`}>
          <p className="text-sm text-slate-500">Your current skills</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.skills.map((s) => (
              <span
                key={s}
                className="px-3 py-1 rounded-full text-xs font-medium bg-violet-500/15 text-violet-500"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        {actions.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className={`${card} hover:-translate-y-1 hover:border-violet-500/50 transition`}
          >
            <a.icon size={22} className="text-violet-500" />
            <h3 className="mt-3 font-semibold">{a.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{a.text}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
