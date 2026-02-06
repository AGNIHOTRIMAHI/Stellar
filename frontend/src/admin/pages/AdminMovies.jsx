import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

export default function AdminMovies() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all movies (admin)
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

  useEffect(() => {
    fetchMovies();
  }, []);

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

  // Toggle publish/unpublish
 async function togglePublish(id, value) {
  try {
    const res = await fetch(`http://localhost:5000/api/movies/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: value }),
    });

    if (!res.ok) {
      throw new Error("Failed to update publish status");
    }

    // refresh list
    fetchMovies();
  } catch (err) {
    alert("Could not update movie");
  }
}


  // Delete movie
  async function handleDelete(id, title) {
  const ok = confirm(`Delete "${title}"?`);
  if (!ok) return;

  const res = await fetch(
    `http://localhost:5000/api/movies/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Delete failed");
    return;
  }

  alert("Movie deleted");
  forceRefresh();
}

  if (loading) {
    return <div className="text-gray-400">Loading movies...</div>;
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
                        onChange={(e) =>
                          togglePublish(m._id, e.target.checked)
                        }
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
                        onClick={() =>
                          navigate(`/admin/movies/${m._id}/edit`)
                        }
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
