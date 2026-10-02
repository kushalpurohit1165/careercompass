import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Sparkles, RefreshCw, Target, Rocket, CheckCircle2 } from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const priorityStyle = {
  High: "bg-red-500/15 text-red-500",
  Medium: "bg-amber-500/15 text-amber-500",
  Low: "bg-emerald-500/15 text-emerald-500",
};

export default function Roadmap() {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    api
      .get("/ai/roadmap")
      .then(({ data }) => setRoadmap(data))
      .catch(() => setError("Could not load your roadmap"))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  const generate = async () => {
    setGenerating(true);
    setError("");
    try {
      const { data } = await api.post("/ai/roadmap");
      setRoadmap(data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setGenerating(false);
    }
  };

  const card =
    "p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md";

  return (
    <div className="max-w-4xl mx-auto px-6 pt-28 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your career roadmap</h1>
          {roadmap && (
            <p className="mt-1 text-sm text-slate-500">
              {roadmap.targetRole} · {roadmap.targetCompany}
            </p>
          )}
        </div>
        <button
          onClick={generate}
          disabled={generating}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-linear-to-r from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/30 hover:opacity-90 transition disabled:opacity-60"
        >
          {roadmap ? <RefreshCw size={16} /> : <Sparkles size={16} />}
          {generating
            ? "Generating..."
            : roadmap
            ? "Regenerate"
            : "Generate roadmap"}
        </button>
      </div>

      {generating && (
        <p className="mt-4 text-sm text-slate-500">
          Your AI mentor is thinking. This can take up to 30 seconds.
        </p>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-500 bg-red-500/10 px-3 py-2 rounded-lg">
          {error}{" "}
          {error.includes("profile") && (
            <Link to="/profile" className="underline font-medium">
              Go to profile
            </Link>
          )}
        </p>
      )}

      {!loading && !roadmap && !generating && !error && (
        <div className={`${card} mt-8 text-center`}>
          <p className="text-slate-600 dark:text-slate-300">
            You have no roadmap yet. Make sure your profile is saved, then click
            Generate roadmap.
          </p>
        </div>
      )}

      {roadmap && (
        <div className="mt-8 space-y-8">
          <div className={card}>
            <p className="text-slate-700 dark:text-slate-200">{roadmap.summary}</p>
            {roadmap.strengths?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {roadmap.strengths.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-violet-500/15 text-violet-500"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Target size={20} className="text-violet-500" /> Skill gaps
            </h2>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              {roadmap.skillGaps.map((g) => (
                <div key={g.skill} className={card}>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold">{g.skill}</h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        priorityStyle[g.priority] || priorityStyle.Medium
                      }`}
                    >
                      {g.priority}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {g.reason}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <CheckCircle2 size={20} className="text-cyan-500" /> Learning steps
            </h2>
            <div className="mt-4 space-y-3">
              {roadmap.steps.map((s, i) => (
                <div key={s._id || i} className={`${card} flex gap-4`}>
                  <div className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-white bg-linear-to-br from-violet-500 to-cyan-400">
                    {i + 1}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{s.title}</h3>
                      <span className="text-xs text-slate-500">{s.duration}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {s.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Rocket size={20} className="text-violet-500" /> Projects to build
            </h2>
            <div className="mt-4 grid sm:grid-cols-3 gap-4">
              {roadmap.projects.map((p) => (
                <div key={p.title} className={card}>
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {p.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.skills?.map((sk) => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 rounded-md text-xs bg-slate-200 dark:bg-white/10"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}