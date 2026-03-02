import Movie from "../models/Movie.js";

export const searchMovies = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(200).json([]);
    
    const movies = await Movie.find({
      title: { $regex: query, $options: "i" },
      isPublished: true,
    }).limit(6);
    
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMovie = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    const { title, description, genre, year, isPublished } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ message: "Title is required" });
    const posterFile = req.files?.poster?.[0];
    const videoFile = req.files?.video?.[0];
    if (!posterFile || !videoFile) return res.status(400).json({ message: "Both poster and video are required" });
    const movie = await Movie.create({
      title: title.trim(),
      description,
      genre,
      year,
      posterUrl: posterFile.path,
      videoUrl: videoFile.path,
      isPublished: isPublished === "true" || isPublished === true,
      uploadedBy: req.user._id,
    });
    return res.status(201).json(movie);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };
    if (req.files) {
      if (req.files.poster?.[0]) updateData.posterUrl = req.files.poster[0].path;
      if (req.files.video?.[0]) updateData.videoUrl = req.files.video[0].path;
    }
    if (updateData.isPublished !== undefined) {
      updateData.isPublished = updateData.isPublished === "true" || updateData.isPublished === true;
    }
    const movie = await Movie.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin movies" });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublishedMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ isPublished: true }).sort({ createdAt: -1 }).limit(12);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};