import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import Category from "./models/Category.js";
import User from "./models/User.js";
import connectDB from "./config/db.js";

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();
        console.log("Connected to MongoDB...");

        // 1. Clear existing data
        await Product.deleteMany({});
        await Category.deleteMany({});
        console.log("Cleared existing products and categories.");

        // 2. Get a seller ID
        let seller = await User.findOne({ role: "seller" });
        if (!seller) {
            seller = await User.findOne({ role: "admin" });
        }
        if (!seller) {
            console.log("No seller/admin found. Please ensure a user exists with role 'seller' or 'admin'.");
            process.exit(1);
        }
        const sellerId = seller._id;

        // 3. Create Categories
        const categoriesData = [
            { name: "T-Shirts", description: "Premium cotton t-shirts for everyday comfort." },
            { name: "Shirts", description: "Formal and casual shirts for a sharp look." },
            { name: "Watches", description: "Luxury timepieces to elevate your style." },
            { name: "Sneakers", description: "High-performance and street-style footwear." },
            { name: "Jackets", description: "Premium outerwear for all seasons." },
            { name: "Backpacks", description: "Durable and stylish bags for your journey." },
            { name: "Sunglasses", description: "Designer eyewear to frame your face." },
        ];

        const createdCategories = await Category.insertMany(categoriesData);
        console.log("Categories created.");

        const catMap = {};
        createdCategories.forEach(c => {
            catMap[c.name] = c._id;
        });

        // 4. Create Products
        const products = [
            // --- T-SHIRTS ---
            {
                name: "Classic White Essential Tee",
                description: "A timeless classic. Made from 100% Supima cotton for an ultra-soft feel. Minimalist design suitable for any occasion.",
                price: 299,
                image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                category_id: catMap["T-Shirts"],
                stock: 50,
                seller_id: sellerId,
                status: "approved",
                rating: 4.8
            },
            {
                name: "Midnight Black Crew Neck",
                description: "Deep black hue that stays true wash after wash. Tailored fit to accentuate your physique.",
                price: 499,
                image_url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                category_id: catMap["T-Shirts"],
                stock: 45,
                seller_id: sellerId,
                status: "approved",
                rating: 4.7
            },
            {
                name: "Urban Grey Streetwear Tee",
                description: "Heavyweight cotton with a boxy fit. Perfect for the modern streetwear aesthetic.",
                price: 799,
                image_url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                category_id: catMap["T-Shirts"],
                stock: 30,
                seller_id: sellerId,
                status: "approved",
                rating: 4.5
            },
            {
                name: "Navy Blue V-Neck",
                description: "Elegant V-neck cut. Breathable fabric ideal for summer days.",
                price: 699,
                image_url: "https://images.unsplash.com/photo-1554568218-0f1715e72254?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                category_id: catMap["T-Shirts"],
                stock: 60,
                seller_id: sellerId,
                status: "approved",
                rating: 4.6
            },

            // --- SHIRTS ---
            {
                name: "Oxford Cotton White Shirt",
                description: "The quintessential white shirt. Crisp, clean, and professional. Features a button-down collar.",
                price: 899,
                image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                category_id: catMap["Shirts"],
                stock: 25,
                seller_id: sellerId,
                status: "approved",
                rating: 4.9
            },
            {
                name: "Charcoal Formal Shirt",
                description: "A dark grey shirt for evening wear or serious business meetings. Wrinkle-resistant fabric.",
                price: 999,
                image_url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                category_id: catMap["Shirts"],
                stock: 20,
                seller_id: sellerId,
                status: "approved",
                rating: 4.8
            },
            {
                name: "Casual Denim Shirt",
                description: "Rugged yet refined. Soft-washed denim that pairs perfectly with chinos or jeans.",
                price: 1999,
                image_url: "https://images.unsplash.com/photo-1582538885592-e70a5d7ab3d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                category_id: catMap["Shirts"],
                stock: 35,
                seller_id: sellerId,
                status: "approved",
                rating: 4.7
            },
            {
                name: "Striped Business Premium",
                description: "Subtle vertical stripes to elongate the torso. Finest Egyptian cotton.",
                price: 289,
                image_url: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                category_id: catMap["Shirts"],
                stock: 15,
                seller_id: sellerId,
                status: "approved",
                rating: 4.9
            },

            // --- WATCHES ---
            {
                name: "Royal Chronograph Gold",
                description: "A statement piece. Gold-plated stainless steel with a precision chronograph movement.",
                price: 2999,
                image_url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                category_id: catMap["Watches"],
                stock: 10,
                seller_id: sellerId,
                status: "approved",
                rating: 5.0
            },
            {
                name: "Minimalist Leather Strap",
                description: "Understated elegance. Genuine leather strap with a clean white dial.",
                price: 1999,
                image_url: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                category_id: catMap["Watches"],
                stock: 12,
                seller_id: sellerId,
                status: "approved",
                rating: 4.6
            },
            {
                name: "Diver Master Pro",
                description: "Water-resistant up to 200m. Robust build for the adventurous soul.",
                price: 999,
                image_url: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                category_id: catMap["Watches"],
                stock: 8,
                seller_id: sellerId,
                status: "approved",
                rating: 4.8
            },
            {
                name: "Vintage Silver Automatic",
                description: "Classic mechanical movement. A tribute to horological history.",
                price: 3999,
                image_url: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                category_id: catMap["Watches"],
                stock: 5,
                seller_id: sellerId,
                status: "approved",
                rating: 4.9
            },

            // --- SNEAKERS ---
            {
                name: "Urban Runner 500",
                description: "Lightweight mesh upper with responsive cushioning for city running.",
                price: 1899,
                image_url: "https://images.unsplash.com/photo-1622760807301-4d2351a5a942?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                category_id: catMap["Sneakers"],
                stock: 20,
                seller_id: sellerId,
                status: "approved",
                rating: 4.7
            },
            {
                name: "Street Hi-Tops",
                description: "Classic basketball-inspired silhouette remixed for the streets.",
                price: 1199,
                image_url: "https://images.unsplash.com/photo-1622760808027-095ea611f657?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                category_id: catMap["Sneakers"],
                stock: 15,
                seller_id: sellerId,
                status: "approved",
                rating: 4.8
            },
            {
                name: "Limited Edition Trainers",
                description: "Exclusive colorway with premium suede accents.",
                price: 1199,
                image_url: "https://images.unsplash.com/photo-1622760806530-3cb6301c087d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                category_id: catMap["Sneakers"],
                stock: 8,
                seller_id: sellerId,
                status: "approved",
                rating: 4.9
            },

            // --- JACKETS ---
            {
                name: "Black Leather Moto Jacket",
                description: "Genuine leather with asymmetrical zipper. A rebellious classic.",
                price: 1399,
                image_url: "https://images.unsplash.com/photo-1727518154538-59e7dc479f8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                category_id: catMap["Jackets"],
                stock: 10,
                seller_id: sellerId,
                status: "approved",
                rating: 4.9
            },
            {
                name: "Vintage Bomber Jacket",
                description: "Insulated nylon bomber to keep you warm and stylish.",
                price: 1289,
                image_url: "https://images.unsplash.com/photo-1675877879221-871aa9f7c314?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                category_id: catMap["Jackets"],
                stock: 18,
                seller_id: sellerId,
                status: "approved",
                rating: 4.6
            },

            // --- BACKPACKS ---
            {
                name: "Explorer Canvas Backpack",
                description: "Rugged canvas with leather straps. Perfect for weekend getaways.",
                price: 1099,
                image_url: "https://images.unsplash.com/photo-1583300418584-8332e32b710e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                category_id: catMap["Backpacks"],
                stock: 25,
                seller_id: sellerId,
                status: "approved",
                rating: 4.7
            },
            {
                name: "Tech Commuter Pack",
                description: "Water-resistant with padded laptop compartment. Minimalist urban design.",
                price: 2899,
                image_url: "https://images.unsplash.com/photo-1579718080147-0fef34dc9529?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                category_id: catMap["Backpacks"],
                stock: 30,
                seller_id: sellerId,
                status: "approved",
                rating: 4.5
            },

            // --- SUNGLASSES ---
            {
                name: "Aviator Gold Classics",
                description: "The pilot style that never goes out of fashion. UV400 protection.",
                price: 99,
                image_url: "https://images.unsplash.com/photo-1711223499758-8aef018b720e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                category_id: catMap["Sunglasses"],
                stock: 40,
                seller_id: sellerId,
                status: "approved",
                rating: 4.6
            },
            {
                name: "Modern Wayfarer Matte",
                description: "Matte black finish with polarized lenses for glare reduction.",
                price: 199,
                image_url: "https://images.unsplash.com/photo-1654274285614-37cad6007665?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                category_id: catMap["Sunglasses"],
                stock: 35,
                seller_id: sellerId,
                status: "approved",
                rating: 4.7
            }
        ];

        await Product.insertMany(products);
        console.log(`Successfully added ${products.length} products.`);

        process.exit();
    } catch (error) {
        console.error("Error with data seeding:", error);
        process.exit(1);
    }
};

seedData();
