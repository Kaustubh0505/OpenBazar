import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const checkRoles = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const users = await User.find({}, "name email role");
        console.log("\n--- User Roles ---");
        users.forEach(u => {
            console.log(`${u.email} (${u.name}): ${u.role}`);
        });
        console.log("------------------\n");

    } catch (error) {
        console.error("Error checking roles:", error);
    } finally {
        await mongoose.disconnect();
    }
};

checkRoles();
