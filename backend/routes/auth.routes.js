import express from "express";
import { 
  login, 
  logout, 
  signUp,
  checkUsernameAvailability,
  checkEmailAvailability,
  getBloomFilterStats
} from "../controllers/auth.controller.js";

const router = express.Router();

// Authentication routes
router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);

// Availability check routes (with bloom filter optimization)
router.get("/check-username/:username", checkUsernameAvailability);
router.get("/check-email/:email", checkEmailAvailability);

// Bloom filter stats (for monitoring)
router.get("/bloom-stats", getBloomFilterStats);

export default router;