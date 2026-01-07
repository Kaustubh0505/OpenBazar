import express from "express";
import {
    getAllProducts,
    getProductsByCategory,
    getAllCategories,
    getProductById,
} from "../controllers/productControllers.js";

const router = express.Router();

// Product routes
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.get("/products/category/:categoryId", getProductsByCategory);

// Category routes
router.get("/categories", getAllCategories);

export default router;
