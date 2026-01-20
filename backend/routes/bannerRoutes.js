import express from "express";
import { getBanners, addBanner, deleteBanner } from "../controllers/bannerControllers.js";
import { protect, verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public route to get all banners
router.get("/", getBanners);

// Admin protected routes to add/delete banners
router.post("/", protect, verifyAdmin, addBanner);
router.delete("/:id", protect, verifyAdmin, deleteBanner);

export default router;
