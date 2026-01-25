import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { adminMoviesStore } from "../store/adminMoviesStore";

export default function AdminMovies() {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(0);
  const [query, setQuery] = useState("");

  const movies = useMemo(() => adminMoviesStore.getAll(), [refresh]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return movies;
    return movies.filter(
      (m) =>
        m.title?.toLowerCase().includes(q) ||
        m.genre?.toLowerCase().includes(q) ||
        String(m.year || "").includes(q)
    );
  }, [movies, query]);

  function forceRefresh() {
    setRefresh((x) => x + 1);
  }

  function togglePublish(id, value) {
    adminMoviesStore.update(id, { isPublished: value });
    forceRefresh();
  }

  function handleDelete(id, title) {
    const ok = confirm(`Delete "${title}"? This cannot be undone.`);
    if (!ok) return;
    adminMoviesStore.remove(id);
    forceRefresh();
  }

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Movies</h1>
          <p className="text-sm text-gray-400">
            Create, edit, publish and delete movies.
          </p>
        </div>

        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-64 rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-gray-600"
          />
          <button
            className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
            onClick={() => navigate("/admin/upload")}
          >
            + Add Movie
          </button>
        </div>
      </header>

      <section className="rounded-2xl border border-gray-800 bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-400">
              <tr className="border-b border-gray-800">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Genre</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((m) => (
                <tr
                  key={m._id}
                  className="border-b border-gray-800 last:border-none"
                >
                  <td className="px-4 py-3 font-medium">{m.title}</td>
                  <td className="px-4 py-3">{m.genre || "-"}</td>
                  <td className="px-4 py-3">{m.year || "-"}</td>
                  <td className="px-4 py-3">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={!!m.isPublished}
                        onChange={(e) => togglePublish(m._id, e.target.checked)}
                      />
                      <span className="text-gray-300">
                        {m.isPublished ? "Yes" : "No"}
                      </span>
                    </label>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        className="rounded-lg border border-gray-700 px-3 py-1 hover:bg-gray-800"
                        onClick={() => navigate(`/admin/movies/${m._id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-lg border border-gray-700 px-3 py-1 hover:bg-gray-800"
                        onClick={() => handleDelete(m._id, m.title)}
                      >
                        Delete
                      </button>
                    </div>
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
