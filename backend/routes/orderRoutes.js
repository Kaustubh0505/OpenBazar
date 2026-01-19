import express from "express";
import { createOrder, getUserOrders } from "../controllers/orderControllers.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getUserOrders);

export default router;
