import Product from "../models/Product.js";
import Category from "../models/Category.js";

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("category_id", "name").sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const products = await Product.find({ category_id: categoryId }).populate("category_id", "name");
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
};

// Get all categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error: error.message });
    }
};

// Get single product
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate("category_id", "name");

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error: error.message });
    }
};
