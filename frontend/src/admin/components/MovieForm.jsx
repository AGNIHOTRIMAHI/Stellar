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
    posterUrl: "",
    videoUrl: "",
    isPublished: false,
  });

  useEffect(() => {
    if (initialValues) {
      setForm((prev) => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  function updateField(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return alert("Title is required");
    if (!form.videoUrl.trim()) return alert("Video URL is required");
    onSubmit({
      ...form,
      title: form.title.trim(),
      genre: form.genre.trim(),
      posterUrl: form.posterUrl.trim(),
      videoUrl: form.videoUrl.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs text-gray-400">Title *</label>
        <input
          className={inputClass}
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="e.g. Interstellar"
        />
      </div>

      <div>
        <label className="text-xs text-gray-400">Description</label>
        <textarea
          className={`${inputClass} min-h-[90px]`}
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Short overview..."
        />
      </div>

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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs text-gray-400">Poster URL</label>
          <input
            className={inputClass}
            value={form.posterUrl}
            onChange={(e) => updateField("posterUrl", e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="text-xs text-gray-400">Video URL *</label>
          <input
            className={inputClass}
            value={form.videoUrl}
            onChange={(e) => updateField("videoUrl", e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-300">
        <input
          type="checkbox"
          checked={form.isPublished}
          onChange={(e) => updateField("isPublished", e.target.checked)}
        />
        Publish now
      </label>

      <button className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200">
        {submitLabel}
      </button>
    </form>
  );
}
