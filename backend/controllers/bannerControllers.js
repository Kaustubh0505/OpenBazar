import Banner from "../models/Banner.js";

// Get all banners (Public)
export const getBanners = async (req, res) => {
    try {
        const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
        res.status(200).json(banners);
    } catch (error) {
        res.status(500).json({ message: "Error fetching banners", error: error.message });
    }
};

// Add a new banner (Admin only)
export const addBanner = async (req, res) => {
    try {
        const { image_url, title, order } = req.body;

        if (!image_url) {
            return res.status(400).json({ message: "Image URL is required" });
        }

        const newBanner = new Banner({
            image_url,
            title,
            order,
        });

        await newBanner.save();
        res.status(201).json({ message: "Banner added successfully", banner: newBanner });
    } catch (error) {
        res.status(500).json({ message: "Error adding banner", error: error.message });
    }
};

// Delete a banner (Admin only)
export const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await Banner.findById(id);

        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }

        await banner.deleteOne();
        res.status(200).json({ message: "Banner deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting banner", error: error.message });
    }
};
