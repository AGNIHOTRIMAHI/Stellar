import express from "express";
import { getCityFromCoordinates } from "../controllers/location.controller.js";

const router = express.Router();

router.get("/city", getCityFromCoordinates);

export default router;