import express from "express";
import {
  getTheatresByCity,
  getTheatreById,
  createTheatre,
} from "../controllers/theatre.controller.js";

const router = express.Router();

router.get("/", getTheatresByCity);
router.get("/:id", getTheatreById);
router.post("/", createTheatre); // Add admin middleware if needed

export default router;