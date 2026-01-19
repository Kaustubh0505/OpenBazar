import Product from "../models/Product.js";
import Category from "../models/Category.js";
import User from "../models/User.js";

// Get all approved products (Public)
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ status: "approved" }).populate("category_id", "name").populate("seller_id", "name").sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const products = await Product.find({ category_id: categoryId, status: "approved" }).populate("category_id", "name").populate("seller_id", "name");
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
        const product = await Product.findById(id).populate("category_id", "name").populate("seller_id", "name");

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error: error.message });
    }
};

// Create Product (Seller/Admin)
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image_url, category_id, stock } = req.body;

        const product = new Product({
            name,
            description,
            price,
            image_url,
            category_id,
            stock,
            seller_id: req.user._id,
            status: "approved"
        });

        await product.save();
        res.status(201).json({ message: "Product created successfully", product });

    } catch (error) {
        res.status(500).json({ message: "Error creating product", error: error.message });
    }
};

// Get Seller's Products
export const getProductsBySeller = async (req, res) => {
    try {
        const products = await Product.find({ seller_id: req.user._id }).populate("category_id", "name").sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching seller products", error: error.message });
    }
}

// Update Product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) return res.status(404).json({ message: "Product not found" });

        // Check ownership or admin
        if (product.seller_id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized to update this product" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedProduct);

    } catch (error) {
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
}

// Delete Product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) return res.status(404).json({ message: "Product not found" });

        // Check ownership or admin
        if (product.seller_id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized to delete this product" });
        }

        await product.deleteOne();
        res.status(200).json({ message: "Product deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
}
