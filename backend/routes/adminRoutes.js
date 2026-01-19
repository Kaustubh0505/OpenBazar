import express from "express";
import {
    getAllUsers,
    toggleBlockUser,
    getPendingProducts,
    approveProduct,
    rejectProduct
} from "../controllers/adminControllers.js";
import { protect, verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// User Management
router.get("/users", protect, verifyAdmin, getAllUsers);
router.put("/users/:id/block", protect, verifyAdmin, toggleBlockUser);

// Product Approval
router.get("/products/pending", protect, verifyAdmin, getPendingProducts);
router.put("/products/:id/approve", protect, verifyAdmin, approveProduct);
router.put("/products/:id/reject", protect, verifyAdmin, rejectProduct);

export default router;
