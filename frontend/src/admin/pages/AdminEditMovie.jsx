import React from "react";
import { useNavigate, useParams, Navigate } from "react-router";
import MovieForm from "../components/MovieForm";
import { adminMoviesStore } from "../store/adminMoviesStore";

export default function AdminEditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();

  const movie = adminMoviesStore.getById(id);

  if (!movie) {
    return <Navigate to="/admin/movies" replace />;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold">Edit Movie</h1>
      <p className="mt-1 text-sm text-gray-400">
        Update details, poster link, video link, and publish status.
      </p>

      <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-5">
        <MovieForm
          initialValues={movie}
          submitLabel="Save Changes"
          onSubmit={(data) => {
            adminMoviesStore.update(id, data);
            navigate("/admin/movies");
          }}
        />
      </div>
    </div>
  );
}
