import express from "express";
import protect from "../middleware/auth.js";
import adminOnly from "../middleware/adminOnly.js";
import uploadMovieAssets from "../middleware/uploadMovieAssets.js";
import {
  createMovie,
  getAdminMovies,
  getPublishedMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
  searchMovies,
} from "../controllers/movie.controller.js";

const router = express.Router();

const uploadMiddleware = uploadMovieAssets.fields([
  { name: "poster", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

router.get("/published", getPublishedMovies);
router.get("/admin", protect, adminOnly, getAdminMovies);
router.get("/search", searchMovies);
router.get("/:id", getMovieById);
router.delete("/:id", protect, adminOnly, deleteMovie);

router.post("/", protect, adminOnly, uploadMiddleware, createMovie);
router.put("/:id", protect, adminOnly, uploadMiddleware, updateMovie);

export default router;