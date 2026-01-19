import express from "express";
import {
    getAllProducts,
    getProductsByCategory,
    getAllCategories,
    getProductById,
    createProduct,
    getProductsBySeller,
    updateProduct,
    deleteProduct
} from "../controllers/productControllers.js";
import { protect, verifySeller } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Product routes
// Product routes (Public)
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.get("/products/category/:categoryId", getProductsByCategory);

// Product routes (Seller/Admin Protected)
router.post("/products", protect, verifySeller, createProduct);
router.get("/seller/products", protect, verifySeller, getProductsBySeller);
router.put("/products/:id", protect, verifySeller, updateProduct);
router.delete("/products/:id", protect, verifySeller, deleteProduct);

// Category routes
router.get("/categories", getAllCategories);

export default router;
