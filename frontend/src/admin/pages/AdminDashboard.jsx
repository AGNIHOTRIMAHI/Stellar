import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4 shadow">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch movies from backend (ADMIN)
  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch("http://localhost:5000/api/movies/admin", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch movies");
        }

        const data = await res.json();
        setMovies(data);
      } catch (err) {
        console.error("Error loading movies:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return movies;
    return movies.filter(
      (m) =>
        m.title?.toLowerCase().includes(q) ||
        (m.genre || "").toLowerCase().includes(q) ||
        String(m.year || "").includes(q) ||
        String(m.isPublished ? "published" : "draft").includes(q)
    );
  }, [movies, query]);

  const total = movies.length;
  const published = movies.filter((m) => m.isPublished).length;
  const drafts = total - published;

  if (loading) {
    return <div className="text-gray-400">Loading movies...</div>;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-400">
            Overview of your movie library
          </p>
        </div>

        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies..."
            className="w-64 rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-gray-600"
          />
          <button
            className="rounded-xl bg-purple-800 px-4 py-2 text-sm font-medium text-white hover:bg-white hover:text-purple-700 transition-colors"
            onClick={() => navigate("/admin/upload")}
          >
            + Add Movie
          </button>
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Total Movies" value={total} />
        <StatCard label="Published" value={published} />
        <StatCard label="Drafts" value={drafts} />
      </section>

      {/* Table */}
      <section className="rounded-2xl border border-gray-800 bg-gray-900">
        <div className="border-b border-gray-800 px-4 py-3">
          <div className="text-sm font-medium">Recent Movies</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-400">
              <tr className="border-b border-gray-800">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Genre</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
              </tr>
            </thead>

            <tbody>
              {filtered.slice(0, 10).map((m) => (
                <tr
                  key={m._id}
                  className="border-b border-gray-800 last:border-none"
                >
                  <td className="px-4 py-3 font-medium">{m.title}</td>
                  <td className="px-4 py-3">{m.genre || "-"}</td>
                  <td className="px-4 py-3">{m.year || "-"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        m.isPublished
                          ? "bg-green-900/40 text-green-300"
                          : "bg-yellow-900/40 text-yellow-300"
                      }`}
                    >
                      {m.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {(m.updatedAt || m.createdAt || "").slice(0, 10)}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-gray-400" colSpan={5}>
                    No movies yet. Click “Add Movie”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
