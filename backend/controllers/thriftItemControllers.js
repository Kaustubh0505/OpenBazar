import ThriftItem from "../models/ThriftItem.js";

// Create a new thrift item
export const createThriftItem = async (req, res) => {
    try {
        const { name, description, price, category, image_url } = req.body;

        // Validate required fields
        if (!name || !description || !price || !category || !image_url) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Validate price
        if (price < 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be a positive number",
            });
        }

        // Get seller ID from authenticated user
        const seller_id = req.user._id;

        // Create thrift item
        const thriftItem = await ThriftItem.create({
            seller_id,
            name,
            description,
            price,
            category,
            image_url,
        });

        res.status(201).json({
            success: true,
            message: "Thrift item created successfully",
            data: thriftItem,
        });
    } catch (error) {
        console.error("Error creating thrift item:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// Get all available thrift items
export const getAllThriftItems = async (req, res) => {
    try {
        const thriftItems = await ThriftItem.find({ status: "available" })
            .populate("seller_id", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: thriftItems.length,
            data: thriftItems,
        });
    } catch (error) {
        console.error("Error fetching thrift items:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// Buy a thrift item
export const buyThriftItem = async (req, res) => {
    try {
        const { id } = req.params;
        const buyer_id = req.user._id;

        // Find the thrift item
        const thriftItem = await ThriftItem.findById(id);

        if (!thriftItem) {
            return res.status(404).json({
                success: false,
                message: "Thrift item not found",
            });
        }

        // Check if item is still available
        if (thriftItem.status === "sold") {
            return res.status(400).json({
                success: false,
                message: "This item has already been sold",
            });
        }

        // Check if buyer is not the seller
        if (thriftItem.seller_id.toString() === buyer_id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot buy your own item",
            });
        }

        // Update item status to sold
        thriftItem.status = "sold";
        thriftItem.buyer_id = buyer_id;
        await thriftItem.save();

        res.status(200).json({
            success: true,
            message: "Item purchased successfully",
            data: thriftItem,
        });
    } catch (error) {
        console.error("Error buying thrift item:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};
