const STORAGE_KEY = "admin_movies_v1";

function loadMovies() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMovies(movies) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
}

function uid() {
  return crypto?.randomUUID?.() ?? String(Date.now());
}

export const adminMoviesStore = {
  getAll() {
    return loadMovies();
  },

  create(movie) {
    const movies = loadMovies();
    const now = new Date().toISOString();

    const newMovie = {
      _id: uid(),
      title: movie.title,
      description: movie.description ?? "",
      genre: movie.genre ?? "",
      year: Number(movie.year) || "",
      posterUrl: movie.posterUrl ?? "",
      videoUrl: movie.videoUrl ?? "",
      isPublished: Boolean(movie.isPublished),
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newMovie, ...movies];
    saveMovies(updated);
    return newMovie;
  },

  update(id, patch) {
    const movies = loadMovies();
    const updated = movies.map((m) =>
      m._id === id
        ? { ...m, ...patch, updatedAt: new Date().toISOString() }
        : m
    );
    saveMovies(updated);
    return updated.find((m) => m._id === id);
  },

  remove(id) {
    const movies = loadMovies();
    const updated = movies.filter((m) => m._id !== id);
    saveMovies(updated);
  },

  getById(id) {
    const movies = loadMovies();
    return movies.find((m) => m._id === id);
  },
};
