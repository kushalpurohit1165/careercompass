import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 outline-none focus:border-violet-500 transition";

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md shadow-xl"
      >
        <h1 className="text-3xl font-bold">Create your account</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Start your personalized career journey.
        </p>

        {error && (
          <p className="mt-4 text-sm text-red-500 bg-red-500/10 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <div className="mt-6 space-y-4">
          <div className="relative">
            <User size={18} className="absolute left-3 top-3.5 text-slate-400" />
            <input
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-3.5 text-slate-400" />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3.5 text-slate-400" />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="mt-6 w-full py-3 rounded-xl font-semibold text-white bg-linear-to-r from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/30 hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-violet-500 font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}