import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const branches = [
  "Information Technology",
  "Computer Science",
  "Electronics",
  "Electrical",
  "Mechanical",
  "Civil",
  "Other",
];
const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduated"];
const roles = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Software Engineer (SDE)",
  "Data Analyst",
  "Data Scientist",
  "ML Engineer",
  "DevOps Engineer",
];
const companies = [
  "Any company",
  "TCS",
  "Infosys",
  "Wipro",
  "Accenture",
  "Capgemini",
  "Cognizant",
  "Amazon",
  "Microsoft",
  "Google",
  "Startups",
];

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    branch: "",
    year: "",
    skills: "",
    interests: "",
    targetRole: "",
    targetCompany: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    api.get("/profile").then(({ data }) => {
      const p = data.profile || {};
      setForm({
        branch: p.branch || "",
        year: p.year || "",
        skills: (p.skills || []).join(", "),
        interests: p.interests || "",
        targetRole: p.targetRole || "",
        targetCompany: p.targetCompany || "",
      });
    });
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await api.put("/profile", {
        ...form,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      setMessage("Profile saved!");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      setMessage("Could not save profile");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    "w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900 outline-none focus:border-violet-500 transition";
  const labelClass = "block mb-1.5 text-sm font-medium";

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-28 pb-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md shadow-xl"
      >
        <h1 className="text-3xl font-bold">Your profile</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Tell us about yourself so we can build a personalized roadmap.
        </p>

        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Branch</label>
            <select
              name="branch"
              value={form.branch}
              onChange={handleChange}
              className={fieldClass}
              required
            >
              <option value="">Select branch</option>
              {branches.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Year</label>
            <select
              name="year"
              value={form.year}
              onChange={handleChange}
              className={fieldClass}
              required
            >
              <option value="">Select year</option>
              {years.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Target role</label>
            <select
              name="targetRole"
              value={form.targetRole}
              onChange={handleChange}
              className={fieldClass}
              required
            >
              <option value="">Select role</option>
              {roles.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Target company</label>
            <select
              name="targetCompany"
              value={form.targetCompany}
              onChange={handleChange}
              className={fieldClass}
              required
            >
              <option value="">Select company</option>
              {companies.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className={labelClass}>Current skills (comma separated)</label>
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="HTML, CSS, JavaScript, Java"
            className={fieldClass}
            required
          />
        </div>

        <div className="mt-4">
          <label className={labelClass}>Interests</label>
          <input
            name="interests"
            value={form.interests}
            onChange={handleChange}
            placeholder="Web development, AI, problem solving"
            className={fieldClass}
          />
        </div>

        {message && (
          <p className="mt-4 text-sm text-emerald-500 bg-emerald-500/10 px-3 py-2 rounded-lg">
            {message}
          </p>
        )}

        <button
          disabled={loading}
          className="mt-6 w-full py-3 rounded-xl font-semibold text-white bg-linear-to-r from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/30 hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save profile"}
        </button>
      </form>
    </div>
  );
}