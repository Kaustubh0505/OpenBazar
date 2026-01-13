import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Get user's cart
export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;

        let cart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
            await cart.save();
        }

        return res.status(200).json({
            success: true,
            cart,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // 1️⃣ Try to increment quantity if product already exists
        let cart = await Cart.findOneAndUpdate(
            {
                user: userId,
                "items.product": productId,
            },
            {
                $inc: { "items.$.quantity": quantity },
            },
            { new: true }
        );

        // 2️⃣ If product was NOT in cart, push it
        if (!cart) {
            cart = await Cart.findOneAndUpdate(
                { user: userId },
                {
                    $push: {
                        items: {
                            product: productId,
                            quantity,
                            price: product.price,
                            name: product.name,
                            image: product.image,
                        },
                    },
                },
                { new: true, upsert: true }
            );
        }

        res.status(200).json({
            success: true,
            message: "Item added to cart",
            cart,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// Update cart item quantity
export const updateCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        if (!productId || quantity === undefined) {
            return res.status(400).json({
                success: false,
                message: "Product ID and quantity are required",
            });
        }

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart",
            });
        }

        if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();
        await cart.populate("items.product");

        return res.status(200).json({
            success: true,
            message: "Cart updated",
            cart,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;

        const cart = await Cart.findOneAndUpdate(
            { user: userId },
            {
                $pull: {
                    items: { product: productId }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Item removed from cart",
            cart,
        });
    } catch (error) {
        console.error("REMOVE CART ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Clear cart
export const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        cart.items = [];
        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart cleared",
            cart,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Sync local cart with database (for when user logs in)
export const syncCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { items } = req.body;

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({
                success: false,
                message: "Items array is required",
            });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        // Merge local cart with database cart
        for (const localItem of items) {
            const existingItemIndex = cart.items.findIndex(
                (item) => item.product.toString() === localItem._id
            );

            if (existingItemIndex > -1) {
                // Add quantities if item exists
                cart.items[existingItemIndex].quantity += localItem.quantity;
            } else {
                // Add new item
                const product = await Product.findById(localItem._id);
                if (product) {
                    cart.items.push({
                        product: localItem._id,
                        quantity: localItem.quantity,
                        price: product.price,
                        name: product.name,
                        image: product.image,
                    });
                }
            }
        }

        await cart.save();
        await cart.populate("items.product");

        return res.status(200).json({
            success: true,
            message: "Cart synced successfully",
            cart,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
