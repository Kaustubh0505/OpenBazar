import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category.js";
import Product from "./models/Product.js";
import connectDB from "./config/db.js";

dotenv.config();

const categories = [
    {
        name: "Electronics",
        description: "Electronic devices and gadgets",
    },
    {
        name: "Clothing",
        description: "Fashion and apparel",
    },
    {
        name: "Home & Kitchen",
        description: "Home essentials and kitchen items",
    },
    {
        name: "Books",
        description: "Physical and digital books",
    },
    {
        name: "Sports",
        description: "Sports equipment and accessories",
    },
];

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Category.deleteMany({});
        await Product.deleteMany({});

        console.log("Cleared existing data");

        // Insert categories
        const insertedCategories = await Category.insertMany(categories);
        console.log(`Inserted ${insertedCategories.length} categories`);

        // Create products for each category
        const products = [];

        // Electronics
        const electronicsId = insertedCategories[0]._id;
        products.push(
            {
                name: "Wireless Bluetooth Headphones",
                description: "Premium noise-cancelling headphones with 30-hour battery life",
                price: 89.99,
                image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
                category_id: electronicsId,
                stock: 45,
                rating: 4.5,
            },
            {
                name: "Smart Watch Series 5",
                description: "Fitness tracker with heart rate monitor and GPS",
                price: 299.99,
                image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
                category_id: electronicsId,
                stock: 28,
                rating: 4.7,
            },
            {
                name: "4K Ultra HD Monitor",
                description: "27-inch display with HDR support",
                price: 349.99,
                image_url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500",
                category_id: electronicsId,
                stock: 15,
                rating: 4.6,
            },
            {
                name: "Mechanical Gaming Keyboard",
                description: "RGB backlit keyboard with Cherry MX switches",
                price: 129.99,
                image_url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
                category_id: electronicsId,
                stock: 32,
                rating: 4.4,
            }
        );

        // Clothing
        const clothingId = insertedCategories[1]._id;
        products.push(
            {
                name: "Premium Cotton T-Shirt",
                description: "Soft, breathable cotton t-shirt in various colors",
                price: 24.99,
                image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
                category_id: clothingId,
                stock: 120,
                rating: 4.3,
            },
            {
                name: "Classic Denim Jeans",
                description: "Comfortable fit denim jeans for everyday wear",
                price: 59.99,
                image_url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
                category_id: clothingId,
                stock: 85,
                rating: 4.5,
            },
            {
                name: "Winter Jacket",
                description: "Warm and stylish jacket for cold weather",
                price: 129.99,
                image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
                category_id: clothingId,
                stock: 42,
                rating: 4.8,
            },
            {
                name: "Running Sneakers",
                description: "Lightweight sneakers with excellent cushioning",
                price: 79.99,
                image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
                category_id: clothingId,
                stock: 67,
                rating: 4.6,
            }
        );

        // Home & Kitchen
        const homeKitchenId = insertedCategories[2]._id;
        products.push(
            {
                name: "Stainless Steel Cookware Set",
                description: "10-piece professional cookware set",
                price: 199.99,
                image_url: "https://images.unsplash.com/photo-1584990347449-39fac1a74a49?w=500",
                category_id: homeKitchenId,
                stock: 25,
                rating: 4.7,
            },
            {
                name: "Coffee Maker Machine",
                description: "Programmable coffee maker with thermal carafe",
                price: 89.99,
                image_url: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500",
                category_id: homeKitchenId,
                stock: 38,
                rating: 4.4,
            },
            {
                name: "Memory Foam Pillow",
                description: "Ergonomic pillow for better sleep quality",
                price: 39.99,
                image_url: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500",
                category_id: homeKitchenId,
                stock: 95,
                rating: 4.5,
            },
            {
                name: "LED Desk Lamp",
                description: "Adjustable LED lamp with touch control",
                price: 34.99,
                image_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
                category_id: homeKitchenId,
                stock: 54,
                rating: 4.3,
            }
        );

        // Books
        const booksId = insertedCategories[3]._id;
        products.push(
            {
                name: "The Art of Programming",
                description: "Comprehensive guide to software development",
                price: 49.99,
                image_url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500",
                category_id: booksId,
                stock: 73,
                rating: 4.8,
            },
            {
                name: "Mystery Novel Collection",
                description: "Bestselling mystery novels bundle",
                price: 29.99,
                image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
                category_id: booksId,
                stock: 102,
                rating: 4.6,
            },
            {
                name: "Cookbook: World Cuisine",
                description: "Recipes from around the world",
                price: 34.99,
                image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500",
                category_id: booksId,
                stock: 48,
                rating: 4.5,
            }
        );

        // Sports
        const sportsId = insertedCategories[4]._id;
        products.push(
            {
                name: "Yoga Mat Premium",
                description: "Non-slip yoga mat with carrying strap",
                price: 29.99,
                image_url: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500",
                category_id: sportsId,
                stock: 88,
                rating: 4.4,
            },
            {
                name: "Adjustable Dumbbells Set",
                description: "Space-saving dumbbells 5-52.5 lbs",
                price: 299.99,
                image_url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500",
                category_id: sportsId,
                stock: 22,
                rating: 4.7,
            },
            {
                name: "Basketball Official Size",
                description: "Indoor/outdoor basketball",
                price: 24.99,
                image_url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500",
                category_id: sportsId,
                stock: 56,
                rating: 4.3,
            },
            {
                name: "Resistance Bands Set",
                description: "5-piece resistance band set for home workouts",
                price: 19.99,
                image_url: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500",
                category_id: sportsId,
                stock: 134,
                rating: 4.5,
            }
        );

        // Insert products
        const insertedProducts = await Product.insertMany(products);
        console.log(`Inserted ${insertedProducts.length} products`);

        console.log("\n✅ Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
