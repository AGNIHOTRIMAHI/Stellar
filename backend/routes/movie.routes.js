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
} from "../controllers/movie.controller.js";

const router = express.Router();

router.get("/published", getPublishedMovies);

router.get("/admin", protect, adminOnly, getAdminMovies);

// CREATE movie (poster + video)
router.post(
  "/",
  protect,
  adminOnly,
  uploadMovieAssets.fields([
    { name: "poster", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createMovie
);

// UPDATE movie (no file upload for now)
router.put(
  "/:id",
  protect,
  adminOnly,
  updateMovie
);

router.delete("/:id", protect, adminOnly, deleteMovie);

router.get("/:id", getMovieById);

export default router;
