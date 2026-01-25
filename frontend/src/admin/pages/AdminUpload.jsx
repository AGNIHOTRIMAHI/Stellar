import React from "react";
import { useNavigate } from "react-router";
import MovieForm from "../components/MovieForm";
import { adminMoviesStore } from "../store/adminMoviesStore";

export default function AdminUpload() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold">Upload Movie</h1>
      <p className="mt-1 text-sm text-gray-400">
        Add movie details and publish when ready.
      </p>

      <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-5">
        <MovieForm
          submitLabel="Create Movie"
          onSubmit={(data) => {
            adminMoviesStore.create(data);
            navigate("/admin/movies");
          }}
        />
      </div>
    </div>
  );
}
