import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const promoteUser = async () => {
    // CHANGE THIS EMAIL to the one you are logging in with
    const targetEmail = "kaustubhhiwanj44@gmail.com";

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const user = await User.findOne({ email: targetEmail });
        if (!user) {
            console.log(`User with email ${targetEmail} not found.`);
            return;
        }

        console.log(`Current role for ${user.name}: ${user.role}`);

        user.role = "admin";
        await user.save();

        console.log(`Successfully promoted ${user.name} to ADMIN.`);

    } catch (error) {
        console.error("Error promoting user:", error);
    } finally {
        await mongoose.disconnect();
    }
};

promoteUser();
