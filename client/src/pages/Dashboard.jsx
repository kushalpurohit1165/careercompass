import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="pt-32 text-center">
      <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
      <p className="mt-2 text-slate-500">Your dashboard is coming soon.</p>
      <button
        onClick={logout}
        className="mt-6 px-5 py-2 rounded-lg border border-slate-300 dark:border-white/20 hover:bg-slate-100 dark:hover:bg-white/10 transition"
      >
        Logout
      </button>
    </div>
  );
}