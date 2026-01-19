import User from "../models/User.js";

// Get User Profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password -otp");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
};

// Add Address
export const addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const { fullName, phone, street, city, state, pincode, country, isDefault } = req.body;

        if (isDefault) {
            // Unset other default addresses
            user.addresses.forEach((addr) => (addr.isDefault = false));
        }

        user.addresses.push({
            fullName,
            phone,
            street,
            city,
            state,
            pincode,
            country,
            isDefault: isDefault || user.addresses.length === 0, // Make first address default
        });

        await user.save();
        res.status(200).json({ message: "Address added successfully", addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ message: "Error adding address", error: error.message });
    }
};

// Update Address
export const updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);
        const { fullName, phone, street, city, state, pincode, country, isDefault } = req.body;

        const addressIndex = user.addresses.findIndex((addr) => addr._id.toString() === id);

        if (addressIndex === -1) {
            return res.status(404).json({ message: "Address not found" });
        }

        if (isDefault) {
            user.addresses.forEach((addr) => (addr.isDefault = false));
        }

        user.addresses[addressIndex] = {
            ...user.addresses[addressIndex]._doc, // Preserve _id
            fullName, phone, street, city, state, pincode, country, isDefault
        };

        await user.save();
        res.status(200).json({ message: "Address updated successfully", addresses: user.addresses });

    } catch (error) {
        res.status(500).json({ message: "Error updating address", error: error.message });
    }
};


// Delete Address
export const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);

        user.addresses = user.addresses.filter((addr) => addr._id.toString() !== id);

        // If default was deleted, make the first one default
        if (user.addresses.length > 0 && !user.addresses.some(a => a.isDefault)) {
            user.addresses[0].isDefault = true;
        }

        await user.save();
        res.status(200).json({ message: "Address deleted successfully", addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ message: "Error deleting address", error: error.message });
    }
};
