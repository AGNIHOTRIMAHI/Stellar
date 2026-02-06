import express from "express";
import {
  createComment,
  getCommentsByMovie,
} from "../controllers/comment.controller.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createComment);
router.get("/:movieId", getCommentsByMovie);

export default router;