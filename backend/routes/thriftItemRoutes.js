import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
    createThriftItem,
    getAllThriftItems,
    buyThriftItem,
} from "../controllers/thriftItemControllers.js";

const router = express.Router();

// Create a new thrift item (protected route)
router.post("/", protect, createThriftItem);

// Get all available thrift items (public route)
router.get("/", getAllThriftItems);

// Buy a thrift item (protected route)
router.put("/:id/buy", protect, buyThriftItem);

export default router;
