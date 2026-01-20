"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../../app/context/CartContext";
import {
  ArrowRight,
  MapPin,
  Package,
  ShoppingBag,
  Loader2,
} from "lucide-react";

export default function CheckoutReview() {
  const router = useRouter();
  const { cart, getTotalPrice } = useCart();
  const [shippingAddress, setShippingAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Guards
    if (cart.length === 0) {
      router.push("/homePage");
      return;
    }

    const role = localStorage.getItem("role");
    if (role && role !== "buyer") {
      router.push("/homePage");
      return;
    }

    const storedAddr = sessionStorage.getItem("shippingAddress");
    if (!storedAddr) {
      router.push("/checkout/address");
      return;
    }

    setShippingAddress(JSON.parse(storedAddr));
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f5f2]">
        <Loader2 className="h-10 w-10 animate-spin text-black" />
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#f7f5f2] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <CheckoutSteps />

        <div className="mb-6">
          <button
            onClick={() => router.push("/checkout/address")}
            className="text-gray-500 hover:text-black flex items-center gap-2 cursor-pointer"
          >
            &larr; Back to Address
          </button>
        </div>

        <h1 className="text-2xl font-light text-black mb-8">
          Review Your Order
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address */}
            <div className="bg-white border border-gray-200 p-6">
              <div className="flex justify-between mb-4">
                <h2 className="flex items-center gap-2 font-medium text-black">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </h2>
                <button
                  onClick={() => router.push("/checkout/address")}
                  className="text-sm underline text-gray-600 cursor-pointer"
                >
                  Change
                </button>
              </div>

              <p className="font-medium text-black">
                {shippingAddress.fullName}
              </p>
              <p className="text-sm text-gray-600">
                {shippingAddress.street}
              </p>
              <p className="text-sm text-gray-600">
                {shippingAddress.city}, {shippingAddress.state} –{" "}
                {shippingAddress.pincode}
              </p>
              <p className="text-sm text-gray-600">
                {shippingAddress.country}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Phone: {shippingAddress.phone}
              </p>
            </div>

            {/* Items */}
            <div className="bg-white border border-gray-200 p-6">
              <h2 className="flex items-center gap-2 font-medium text-black mb-4">
                <Package className="h-5 w-5" />
                Items ({cart.length})
              </h2>

              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 border-b last:border-0 pb-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover bg-gray-100"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-black">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        ₹{item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="font-medium text-black">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 p-6 sticky top-24">
              <h2 className="flex items-center gap-2 font-medium text-black mb-4">
                <ShoppingBag className="h-5 w-5" />
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <div className="border-t pt-3 flex justify-between text-lg font-medium">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/checkout/payment")}
                className="w-full bg-[#867964] text-white py-3 mt-6 flex items-center justify-center gap-2 cursor-pointer"
              >
                Continue to Payment <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Steps ---------------- */

function CheckoutSteps() {
  return (
    <div className="flex items-center justify-between mb-10 text-sm">
      <Step done label="Address" />
      <Line done />
      <Step active label="Review" />
      <Line />
      <Step label="Payment" />
    </div>
  );
}

function Step({ label, active, done }) {
  return (
    <div className={`flex items-center ${active || done ? "text-black" : "text-gray-400"}`}>
      <span
        className={`w-8 h-8 flex items-center justify-center rounded-full mr-2
        ${done || active ? "bg-[#867964] text-white" : "bg-gray-200"}`}
      >
        {done ? "✓" : label[0]}
      </span>
      {label}
    </div>
  );
}

function Line({ done }) {
  return (
    <div className={`flex-1 h-px mx-4 ${done ? "bg-[#867964]" : "bg-gray-300"}`} />
  );
}
