import express from "express";
import { getUserProfile } from "../controllers/user.controller.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// Get current user profile
router.get("/profile", protect, getUserProfile);

export default router;