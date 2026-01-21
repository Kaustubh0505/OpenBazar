import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import { sendEmail } from "../utils/sendEmail.js";

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
export const createRazorpayOrder = async (req, res) => {
    try {
        const { items, shippingAddress, totalAmount } = req.body;

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

        // Create Razorpay order
        const options = {
            amount: Math.round(totalAmount * 100), // amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // Store order details temporarily (we'll create the actual order after payment verification)
        // For now, we'll just return the razorpay order details
        res.status(200).json({
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error("Razorpay order creation error:", error);
        res.status(500).json({ message: "Error creating Razorpay order", error: error.message });
    }
};

// Verify Razorpay Payment Signature
export const verifyRazorpayPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            items,
            shippingAddress,
            totalAmount,
        } = req.body;

        // Verify signature
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid payment signature" });
        }

        // Verify stock again (in case stock changed during payment)
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }
        }

        // Create order in database
        const order = await Order.create({
            user: req.user._id,
            items,
            shippingAddress,
            totalAmount,
            paymentMethod: "Razorpay",
            paymentStatus: "Paid",
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
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
            const emailText = `Thank you for your order!\n\nOrder ID: ${order._id}\nTotal Amount: ₹${totalAmount}\nPayment ID: ${razorpay_payment_id}\n\nWe will notify you when your order is shipped.`;

            sendEmail({ to: req.user.email, subject: emailSubject, text: emailText }).catch(err =>
                console.error("Failed to send order email:", err)
            );
        }

        res.status(201).json({
            success: true,
            orderId: order._id,
            message: "Payment verified and order created successfully",
        });
    } catch (error) {
        console.error("Payment verification error:", error);
        res.status(500).json({ message: "Error verifying payment", error: error.message });
    }
};
