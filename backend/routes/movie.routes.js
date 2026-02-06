import express from "express";
import protect from "../middleware/auth.js";
import adminOnly from "../middleware/adminOnly.js";
import uploadPoster from "../middleware/uploadPoster.js";

import {
  createMovie,
  getAdminMovies,
  getPublishedMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} from "../controllers/movie.controller.js";

const router = express.Router();

/* ================= PUBLIC ================= */

// 🔥 MUST be first
router.get("/published", getPublishedMovies);

// view single movie (watch page)
router.get("/:id", getMovieById);

/* ================= ADMIN ================= */

// create movie
router.post(
  "/",
  protect,
  adminOnly,
  uploadPoster.single("poster"),
  createMovie
);

// admin list
router.get("/admin", protect, adminOnly, getAdminMovies);

// admin edit
router.put(
  "/:id",
  protect,
  adminOnly,
  uploadPoster.single("poster"),
  updateMovie
);

// admin delete
router.delete("/:id", protect, adminOnly, deleteMovie);

export default router;
