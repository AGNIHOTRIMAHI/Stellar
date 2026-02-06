import React from "react";
import { useNavigate } from "react-router";
import MovieForm from "../components/MovieForm";

export default function AdminUpload() {
  const navigate = useNavigate();

  async function handleSubmit(formData) {
    try {
      const res = await fetch("http://localhost:5000/api/movies", {
        method: "POST",
        credentials: "include",
        body: formData, 
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Failed to upload movie");
        return;
      }

      alert("Movie uploaded successfully!");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold">Upload Movie</h1>
      <p className="mt-1 text-sm text-gray-400">
        Add movie details and publish when ready.
      </p>

      <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-5">
        <MovieForm submitLabel="Create Movie" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
