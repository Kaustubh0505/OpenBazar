"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCart } from "../../../app/context/CartContext";
import { Loader2, Banknote, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutPayment() {
  const router = useRouter();
  const { cart, getTotalPrice, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("COD");
  const [error, setError] = useState("");

  useEffect(() => {
    if (cart.length === 0) {
      router.push("/homePage");
      return;
    }

    const address = sessionStorage.getItem("shippingAddress");
    if (!address) {
      router.push("/checkout/address");
      return;
    }

    const role = localStorage.getItem("role");
    if (role && role !== "buyer") {
      router.push("/homePage");
    }
  }, []);

  const handleComingSoon = (method) => {
    alert(`${method} payment is coming soon 🚀`);
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const shippingAddress = JSON.parse(
        sessionStorage.getItem("shippingAddress")
      );

      if (!shippingAddress) {
        setError("Shipping address missing");
        return;
      }

      const items = cart.map((item) => ({
        product: item._id,
        quantity: item.quantity,
        price: item.price,
      }));

      const totalAmount = getTotalPrice();

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDURL}/api/orders`,
        {
          items,
          shippingAddress,
          totalAmount,
          paymentMethod: selectedMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      clearCart();
      sessionStorage.removeItem("shippingAddress");

      router.push(`/checkout/success?orderId=${res.data._id}`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#f7f5f2] py-12 px-4"
    >
      <div className="max-w-2xl mx-auto">
        <CheckoutSteps />

        <button
          onClick={() => router.push("/checkout/review")}
          className="text-[#6f6451] hover:underline mb-6 cursor-pointer"
        >
          ← Back to Review
        </button>

        <h1 className="text-2xl font-light text-gray-900 mb-6">
          Payment Method
        </h1>

        {error && (
          <p className="text-sm text-red-600 mb-4">{error}</p>
        )}

        {/* Payment Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white border border-gray-200 p-6 mb-8"
        >
          <div className="space-y-4">
            {/* COD */}
            <PaymentOption
              active={selectedMethod === "COD"}
              onClick={() => setSelectedMethod("COD")}
              icon={<Banknote className="h-6 w-6 text-[#6f6451]" />}
              title="Cash on Delivery"
              subtitle="Pay when you receive your order"
            />

            {/* UPI (Clickable) */}
            <div
              onClick={() => handleComingSoon("UPI")}
              className="border p-4 flex items-center gap-4 cursor-pointer opacity-60 hover:bg-[#f7f5f2] transition"
            >
              <CreditCard className="h-6 w-6 text-[#8c8275]" />
              <div>
                <p className="font-medium text-gray-900">UPI</p>
                <p className="text-sm text-[#8c8275]">
                  Pay through QR code (Coming soon)
                </p>
              </div>
            </div>

            {/* Card (Clickable) */}
            <div
              onClick={() => handleComingSoon("Card")}
              className="border p-4 flex items-center gap-4 cursor-pointer opacity-60 hover:bg-[#f7f5f2] transition"
            >
              <CreditCard className="h-6 w-6 text-[#8c8275]" />
              <div>
                <p className="font-medium text-gray-900">
                  Credit / Debit Card
                </p>
                <p className="text-sm text-[#8c8275]">
                  Coming soon
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full text-white bg-[#605441] py-4 text-lg font-medium hover:bg-[#736958] cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Placing order...
            </span>
          ) : (
            `Place Order ₹${getTotalPrice().toFixed(2)}`
          )}
        </button>
      </div>
    </motion.div>
  );
}

/* ---------------- Steps ---------------- */

function CheckoutSteps() {
  return (
    <div className="flex items-center justify-between mb-10 text-sm font-semibold">
      <Step done label="Address" />
      <Line done />
      <Step done label="Review" />
      <Line done />
      <Step active label="Payment" />
    </div>
  );
}

function Step({ label, active, done }) {
  return (
    <div className={`flex items-center ${active || done ? "text-gray-900" : "text-[#8c8275]"}`}>
      <span
        className={`w-8 h-8 flex items-center justify-center rounded-full mr-2
        ${done || active ? "bg-[#6f6451] text-white" : "bg-[#e6e1d8] text-[#6f6451]"}`}
      >
        {done ? "✓" : label[0]}
      </span>
      {label}
    </div>
  );
}

function Line({ done }) {
  return (
    <div className={`flex-1 h-px mx-4 ${done ? "bg-[#6f6451]" : "bg-[#d8d2c6]"}`} />
  );
}

function PaymentOption({ active, onClick, icon, title, subtitle }) {
  return (
    <div
      onClick={onClick}
      className={`border p-4 flex items-center gap-4 cursor-pointer transition
      ${active ? "border-[#6f6451] bg-[#f7f5f2]" : "hover:border-[#8c8275]"}`}
    >
      {icon}
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-[#6f6451]">{subtitle}</p>
      </div>
    </div>
  );
}
