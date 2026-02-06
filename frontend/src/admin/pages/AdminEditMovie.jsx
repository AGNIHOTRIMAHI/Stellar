import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router";
import MovieForm from "../components/MovieForm";

export default function AdminEditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch movie by ID (correct route)
  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/movies/${id}`,
          { credentials: "include" }
        );

        if (!res.ok) {
          throw new Error("Movie not found");
        }

        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error(err);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [id]);

  // ✅ Update movie
  async function handleSubmit(formData) {
    try {
      const res = await fetch(
        `http://localhost:5000/api/movies/${id}`,
        {
          method: "PUT",
          credentials: "include",
          body: formData, // FormData → no headers
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Update failed");
        return;
      }

      alert("Movie updated successfully");
      navigate("/admin/movies");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  }

  if (loading) {
    return <div className="text-gray-400">Loading movie...</div>;
  }

  if (!movie) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold">Edit Movie</h1>
      <p className="mt-1 text-sm text-gray-400">
        Update details, poster, video link, and publish status.
      </p>

      <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-5">
        <MovieForm
          initialValues={movie}
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
