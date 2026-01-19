import express from "express";
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus } from "../controllers/orderControllers.js";
import { protect, verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getUserOrders);

// Admin Routes
router.get("/admin/all", protect, verifyAdmin, getAllOrders);
router.put("/admin/:id/status", protect, verifyAdmin, updateOrderStatus);

export default router;
