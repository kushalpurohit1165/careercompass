import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { FileText, Briefcase, Sparkles } from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function Tools() {
  const { user } = useAuth();
  const [tab, setTab] = useState("resume");
  const [resumeText, setResumeText] = useState("");
  const [resumeResult, setResumeResult] = useState(null);
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) return <Navigate to="/login" />;

  const run = async (fn) => {
    setLoading(true);
    setError("");
    try {
      await fn();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const analyzeResume = () =>
    run(async () => {
      const { data } = await api.post("/tools/resume", { resumeText });
      setResumeResult(data);
    });

  const getQuestions = () =>
    run(async () => {
      const { data } = await api.post("/tools/interview");
      setInterview(data);
    });

  const card =
    "p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md";
  const gradBtn =
    "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-linear-to-r from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/30 hover:opacity-90 transition disabled:opacity-60";
  const tabClass = (name) =>
    `inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
      tab === name
        ? "bg-violet-500/15 text-violet-600 dark:text-violet-300"
        : "hover:bg-slate-100 dark:hover:bg-white/10"
    }`;

  const score = Number(resumeResult?.score) || 0;

  const sections = [
    ["Technical", "technical"],
    ["Behavioral", "behavioral"],
    ["Company-specific", "company"],
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 pt-28 pb-16">
      <h1 className="text-3xl font-bold">Career tools</h1>
      <p className="mt-1 text-sm text-slate-500">
        Resume feedback and interview practice, tailored to your target role.
      </p>

      <div className="mt-6 flex gap-2">
        <button onClick={() => setTab("resume")} className={tabClass("resume")}>
          <FileText size={16} /> Resume analysis
        </button>
        <button
          onClick={() => setTab("interview")}
          className={tabClass("interview")}
        >
          <Briefcase size={16} /> Interview prep
        </button>
      </div>

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

      {tab === "resume" && (
        <div className="mt-6">
          <div className={card}>
            <label className="block mb-2 text-sm font-medium">
              Paste your resume text
            </label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={10}
              placeholder="Paste the text of your resume here..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900 outline-none focus:border-violet-500 transition text-sm"
            />
            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={analyzeResume}
                disabled={loading}
                className={gradBtn}
              >
                <Sparkles size={16} />
                {loading ? "Analyzing..." : "Analyze resume"}
              </button>
              <span className="text-xs text-slate-500">
                Your resume text is not saved.
              </span>
            </div>
          </div>

          {resumeResult && (
            <div className="mt-6 space-y-4">
              <div className={card}>
                <div className="flex items-end justify-between">
                  <p className="text-sm text-slate-500">Resume score</p>
                  <p className="text-4xl font-bold">{score}/100</p>
                </div>
                <div className="mt-3 h-3 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-violet-500 to-cyan-400 transition-all duration-700"
                    style={{ width: `${Math.min(score, 100)}%` }}
                  />
                </div>
                <p className="mt-4 text-slate-700 dark:text-slate-200">
                  {resumeResult.summary}
                </p>
              </div>

              <div className={card}>
                <h2 className="font-semibold">Strengths</h2>
                <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {resumeResult.strengths?.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>

              <div className={card}>
                <h2 className="font-semibold">What to improve</h2>
                <div className="mt-3 space-y-4">
                  {resumeResult.improvements?.map((m, i) => (
                    <div key={i}>
                      <p className="text-sm font-medium text-amber-500">
                        {m.issue}
                      </p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {m.fix}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className={card}>
                <h2 className="font-semibold">Keywords to add</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {resumeResult.missingKeywords?.map((k) => (
                    <span
                      key={k}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-violet-500/15 text-violet-500"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "interview" && (
        <div className="mt-6">
          <div
            className={`${card} flex flex-wrap items-center justify-between gap-4`}
          >
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Get practice questions for your target role and company.
            </p>
            <button
              onClick={getQuestions}
              disabled={loading}
              className={gradBtn}
            >
              <Sparkles size={16} />
              {loading
                ? "Generating..."
                : interview
                  ? "Regenerate questions"
                  : "Generate questions"}
            </button>
          </div>

          {interview && (
            <div className="mt-6 space-y-6">
              {sections.map(([title, key]) => (
                <section key={key}>
                  <h2 className="text-xl font-semibold">{title}</h2>
                  <div className="mt-3 space-y-3">
                    {interview[key]?.map((q, i) => (
                      <div key={i} className={card}>
                        <p className="font-medium">
                          {i + 1}. {q.question}
                        </p>
                        <details className="mt-2">
                          <summary className="cursor-pointer text-sm text-violet-500">
                            Show hint
                          </summary>
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            {q.hint}
                          </p>
                        </details>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
