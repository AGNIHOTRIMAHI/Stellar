import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";
import { Home, LogOut } from "lucide-react";

const linkBase =
  "block rounded-xl px-3 py-2 text-sm font-medium transition";

const navClass = ({ isActive }) =>
  `${linkBase} ${
    isActive
      ? "bg-purple-800 text-white ring-1 ring-purple-500/30"
      : "text-gray-300 hover:bg-purple-600/10 hover:text-purple-200"
  }`;

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      const { message } = await logout();
      toast.success(message);
      navigate("/"); // ✅ redirect to home
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="flex">
        {/* SIDEBAR */}
        <aside className="w-64 border-r border-gray-800 bg-gray-950 p-4">
          <div className="mb-6">
            <div className="text-lg font-semibold text-white">
              Admin Panel
            </div>
            <div className="text-xs text-gray-400">
              Manage your movies
            </div>
          </div>

          <nav className="space-y-2">
            <NavLink to="/admin/dashboard" className={navClass}>
              Dashboard
            </NavLink>

            <NavLink to="/admin/movies" className={navClass}>
              Movies
            </NavLink>

            <NavLink to="/admin/upload" className={navClass}>
              Upload Movie
            </NavLink>

            {/* 🔥 HOME BUTTON (ABOVE LOGOUT) */}
            <button
              onClick={() => navigate("/")}
              className="mt-6 w-full flex items-center gap-2 rounded-xl
              bg-purple-700 px-3 py-2 text-sm font-medium text-white
              hover:bg-purple-600 transition"
            >
              <Home size={16} />
              Home
            </button>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 rounded-xl
              border border-gray-800 bg-gray-900 px-3 py-2 text-sm font-medium text-gray-200
              hover:border-red-500/40 hover:bg-red-600/10 hover:text-red-300 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 bg-gradient-to-b from-gray-950 via-gray-950 to-purple-950/10 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
