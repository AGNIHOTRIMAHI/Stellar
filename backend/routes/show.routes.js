import express from "express";
import {
  getShows,
  getShowById,
  getShowSeats,
  createShow,
} from "../controllers/show.controller.js";

const router = express.Router();

router.get("/", getShows);
router.get("/:showId/seats", getShowSeats);
router.get("/:id", getShowById);
router.post("/", createShow); // Add admin middleware if needed

export default router;