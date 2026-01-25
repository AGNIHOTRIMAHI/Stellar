import React from "react";
import { NavLink, Outlet } from "react-router";

const linkBase =
  "block rounded-xl px-3 py-2 text-sm font-medium transition";

const navClass = ({ isActive }) =>
  `${linkBase} ${
    isActive
      ? "bg-purple-800 text-white ring-1 ring-purple-500/30"
      : "text-gray-300 hover:bg-purple-600/10 hover:text-purple-200"
  }`;

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-800 bg-gray-950 p-4">
          <div className="mb-6">
            <div className="text-lg font-semibold text-white">Admin Panel</div>
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

            <button
              className="mt-6 w-full rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-sm font-medium text-gray-200
                         hover:border-purple-500/40 hover:bg-purple-600/10 hover:text-purple-200 transition"
              onClick={() => alert("Later: Logout")}
            >
              Logout
            </button>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 bg-gradient-to-b from-gray-950 via-gray-950 to-purple-950/10 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
