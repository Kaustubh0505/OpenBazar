import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

import { sendEmail } from "../utils/sendEmail.js";

// Create a new order
export const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, totalAmount, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items in order" });
        }

        // Verify stock for each item
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }
        }

        // specific check for duplicate order creation prevention could go here (idempotency)

        const order = await Order.create({
            user: req.user._id,
            items,
            shippingAddress,
            totalAmount,
            paymentMethod: paymentMethod || "COD",
        });

        // Reduce stock
        for (const item of items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity },
            });
        }

        // Clear user's cart
        await Cart.findOneAndDelete({ user: req.user._id });

        // Send Email to User
        if (req.user.email) {
            const emailSubject = `Order Confirmation - #${order._id}`;
            const emailText = `Thank you for your order!\n\nOrder ID: ${order._id}\nTotal Amount: ₹${totalAmount}\n\nWe will notify you when your order is shipped.`;

            // Send email asynchronously to not block response
            sendEmail({ to: req.user.email, subject: emailSubject, text: emailText }).catch(err => console.error("Failed to send order email:", err));
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error creating order", error: error.message });
    }
};

// Get logged-in user's orders
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate("items.product", "name image_url"); // populate essential product details

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

// Get ALL orders (Admin)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .sort({ createdAt: -1 })
            .populate("user", "name email")
            .populate("items.product", "name image_url");

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching all orders", error: error.message });
    }
};

// Update order status (Admin)
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id).populate("user", "email name");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        await order.save();

        // Send Email if Delivered
        if (status === "delivered" && order.user && order.user.email) {
            const emailSubject = `Order Delivered - #${order._id}`;
            const emailText = `Hello ${order.user.name},\n\nYour order #${order._id} has been delivered successfully.\n\nThank you for shopping with us!`;

            sendEmail({ to: order.user.email, subject: emailSubject, text: emailText }).catch(err => console.error("Failed to send delivery email:", err));
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error updating order status", error: error.message });
    }
};
