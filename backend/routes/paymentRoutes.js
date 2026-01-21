import express from "express";
import { createRazorpayOrder, verifyRazorpayPayment } from "../controllers/paymentControllers.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-order", protect, createRazorpayOrder);
router.post("/verify", protect, verifyRazorpayPayment);

export default router;
