import { Link, NavLink, useNavigate } from "react-router-dom";
import { Compass, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive
        ? "bg-violet-500/15 text-violet-600 dark:text-violet-300"
        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10"
    }`;

  return (
    <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-950/60 border-b border-slate-200 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-white"
        >
          <span className="p-1.5 rounded-lg bg-linear-to-br from-violet-500 to-cyan-400 text-white">
            <Compass size={20} />
          </span>
          CareerCompass
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/profile" className={linkClass}>
                Profile
              </NavLink>
              <NavLink to="/roadmap" className={linkClass}>
                Roadmap
              </NavLink>
              <NavLink to="/chat" className={linkClass}>
                Mentor
              </NavLink>
              <NavLink to="/tools" className={linkClass}>
                Tools
              </NavLink>
              <button
                onClick={handleLogout}
                className="ml-1 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-linear-to-r from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/30 hover:opacity-90 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-linear-to-r from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/30 hover:opacity-90 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
