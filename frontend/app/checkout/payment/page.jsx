"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCart } from "../../../app/context/CartContext";
import { Loader2, Banknote, CreditCard } from "lucide-react";

export default function CheckoutPayment() {
  const router = useRouter();
  const { cart, getTotalPrice, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("COD");
  const [error, setError] = useState("");

  useEffect(() => {
    // Guards
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
      console.error("Order failed", err);
      setError(
        err.response?.data?.message || "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <CheckoutSteps />

        <div className="mb-6">
          <button
            onClick={() => router.push("/checkout/review")}
            className="text-gray-500 hover:text-black flex items-center gap-2 cursor-pointer"
          >
            &larr; Back to Review
          </button>
        </div>

        <h1 className="text-2xl font-light text-black mb-6">
          Payment Method
        </h1>

        {error && (
          <p className="text-sm text-red-600 mb-4">{error}</p>
        )}

        {/* Payment Options */}
        <div className="bg-white border border-gray-200 p-6 mb-8">
          <div className="space-y-4">
            <PaymentOption
              active={selectedMethod === "COD"}
              onClick={() => setSelectedMethod("COD")}
              icon={<Banknote className="h-6 w-6" />}
              title="Cash on Delivery"
              subtitle="Pay when you receive your order"
            />

            <div className="opacity-40 border p-4 flex items-center gap-4 cursor-not-allowed">
              <CreditCard className="h-6 w-6 text-gray-500" />
              <div>
                <p className="font-medium text-black">
                  Credit / Debit Card
                </p>
                <p className="text-sm text-gray-500">
                  Coming soon
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full bg-black text-white py-4 text-lg font-medium disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Placing order...
            </span>
          ) : (
            `Place Order (₹${getTotalPrice().toFixed(2)})`
          )}
        </button>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function CheckoutSteps() {
  return (
    <div className="flex items-center justify-between mb-10 text-sm">
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
    <div className={`flex items-center ${active || done ? "text-black" : "text-gray-400"}`}>
      <span
        className={`w-8 h-8 flex items-center justify-center rounded-full mr-2
        ${done || active ? "bg-black text-white" : "bg-gray-200"}`}
      >
        {done ? "✓" : label[0]}
      </span>
      {label}
    </div>
  );
}

function Line({ done }) {
  return (
    <div className={`flex-1 h-px mx-4 ${done ? "bg-black" : "bg-gray-300"}`} />
  );
}

function PaymentOption({ active, onClick, icon, title, subtitle }) {
  return (
    <div
      onClick={onClick}
      className={`border p-4 flex items-center gap-4 cursor-pointer
      ${active ? "border-black bg-gray-50" : "hover:border-gray-300"}`}
    >
      {icon}
      <div>
        <p className="font-medium text-black">{title}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}
