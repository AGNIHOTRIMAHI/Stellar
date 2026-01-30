import express from "express";
import { createOrder, verifyPayment } from "../controllers/payment.controller.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// All payment routes require authentication
router.use(protect);

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);

export default router;