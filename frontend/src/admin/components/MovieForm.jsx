import React, { useEffect, useState } from "react";

const inputClass =
  "w-full rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-gray-600";

export default function MovieForm({
  initialValues,
  onSubmit,
  submitLabel = "Save",
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    genre: "",
    year: "",
    poster: null,        // 🔴 file, not URL
    videoUrl: "",
    isPublished: false,
  });

  useEffect(() => {
    if (initialValues) {
      setForm((prev) => ({
        ...prev,
        ...initialValues,
        poster: null, // never preload file input
      }));
    }
  }, [initialValues]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim()) return alert("Title is required");
    if (!form.videoUrl.trim()) return alert("Video URL is required");

    const formData = new FormData();

    formData.append("title", form.title.trim());
    formData.append("description", form.description);
    formData.append("genre", form.genre.trim());
    formData.append("year", form.year);
    formData.append("videoUrl", form.videoUrl.trim());
    formData.append("isPublished", form.isPublished);

    if (form.poster) {
      formData.append("poster", form.poster); // 🔥 Cloudinary upload
    }

    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* TITLE */}
      <div>
        <label className="text-xs text-gray-400">Title *</label>
        <input
          className={inputClass}
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="e.g. Interstellar"
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="text-xs text-gray-400">Description</label>
        <textarea
          className={`${inputClass} min-h-[90px]`}
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Short overview..."
        />
      </div>

      {/* GENRE + YEAR */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs text-gray-400">Genre</label>
          <input
            className={inputClass}
            value={form.genre}
            onChange={(e) => updateField("genre", e.target.value)}
            placeholder="Sci-Fi"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400">Release Year</label>
          <input
            className={inputClass}
            value={form.year}
            onChange={(e) => updateField("year", e.target.value)}
            placeholder="2014"
            inputMode="numeric"
          />
        </div>
      </div>

      {/* POSTER IMAGE UPLOAD */}
      <div>
        <label className="text-xs text-gray-400">
          Poster Image *
        </label>
        <input
          type="file"
          accept="image/*"
          className={inputClass}
          onChange={(e) =>
            updateField("poster", e.target.files[0])
          }
        />
      </div>

      {/* VIDEO URL (TEMPORARY – later Cloudinary video) */}
      <div>
        <label className="text-xs text-gray-400">
          Video URL *
        </label>
        <input
          className={inputClass}
          value={form.videoUrl}
          onChange={(e) => updateField("videoUrl", e.target.value)}
          placeholder="https://..."
        />
      </div>

      {/* PUBLISH */}
      <label className="flex items-center gap-2 text-sm text-gray-300">
        <input
          type="checkbox"
          checked={form.isPublished}
          onChange={(e) =>
            updateField("isPublished", e.target.checked)
          }
        />
        Publish now
      </label>

      {/* SUBMIT */}
      <button className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200">
        {submitLabel}
      </button>
    </form>
  );
}
