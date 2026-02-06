import Movie from "../models/Movie.js";

/* ================= ADMIN: CREATE MOVIE ================= */
export const createMovie = async (req, res) => {
  try {
    // 🔍 DEBUG LOGS (keep for now)
    console.log("REQ.USER =>", req.user);
    console.log("REQ.BODY =>", req.body);
    console.log("REQ.FILE =>", req.file);

    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const {
      title,
      description = "",
      genre = "",
      year = "",
      videoUrl,
      isPublished = false,
    } = req.body;

    if (!title || !videoUrl) {
      return res
        .status(400)
        .json({ message: "Title and video URL are required" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Poster image is required" });
    }

    const movie = await Movie.create({
      title,
      description,
      genre,
      year,
      videoUrl,
      posterUrl: req.file.path, // ✅ Cloudinary URL
      isPublished: isPublished === "true" || isPublished === true,
      uploadedBy: req.user._id,
    });

    return res.status(201).json(movie);
  } catch (error) {
    console.error("CREATE MOVIE ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

/* ================= ADMIN: GET ALL MOVIES ================= */
// Admin: get all movies
export const getAdminMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.status(200).json(movies);
  } catch (error) {
    console.error("ADMIN MOVIES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch admin movies" });
  }
};


/* ================= ADMIN: GET MOVIE BY ID ================= */
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= ADMIN: UPDATE MOVIE ================= */
export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= ADMIN: DELETE MOVIE ================= */
export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= PUBLIC: PUBLISHED MOVIES ================= */
export const getPublishedMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .limit(12);

    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
