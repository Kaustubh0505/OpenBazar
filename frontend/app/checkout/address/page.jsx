"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Plus, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutAddress() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      if (role && role !== "buyer") {
        router.push("/homePage");
        return;
      }

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKENDURL}/api/user/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const addresses = res.data.addresses || [];
      setUser({ ...res.data, addresses });

      const defaultAddr =
        addresses.find((a) => a.isDefault) || addresses[0];

      if (defaultAddr) setSelectedAddress(defaultAddr._id);
    } catch (err) {
      setError("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!selectedAddress) {
      setError("Please select a delivery address");
      return;
    }

    const address = user.addresses.find(
      (a) => a._id === selectedAddress
    );

    sessionStorage.setItem(
      "shippingAddress",
      JSON.stringify(address)
    );

    router.push("/checkout/review");
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f5f2]">
        <Loader2 className="h-10 w-10 animate-spin text-[#6f6451]" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-[#f7f5f2] py-12 px-4"
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-3xl mx-auto"
      >
        {/* Progress */}
        <CheckoutSteps />

        {/* Back */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <button
            onClick={() => router.push("/cart")}
            className="text-[#6f6451] hover:underline flex items-center gap-2 cursor-pointer"
          >
            ← Back to Cart
          </button>
        </motion.div>

        <h1 className="text-2xl font-light text-gray-900 mb-6">
          Select Delivery Address
        </h1>

        {error && (
          <p className="text-sm text-red-600 mb-4">{error}</p>
        )}

        {/* Address List */}
        <div className="grid gap-4 mb-8">
          {user.addresses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-gray-200 p-8 text-center"
            >
              <p className="text-[#6f6451] mb-4">
                No saved addresses found
              </p>
              <button
                onClick={() => router.push("/account/profile")}
                className="bg-[#6f6451] text-white px-6 py-2 rounded cursor-pointer hover:bg-[#8c8275]"
              >
                <Plus className="inline w-4 h-4 mr-2" />
                Add Address
              </button>
            </motion.div>
          ) : (
            user.addresses.map((addr, index) => (
              <motion.div
                key={addr._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedAddress(addr._id)}
                className={`
                  border p-5 cursor-pointer transition relative bg-white
                  ${
                    selectedAddress === addr._id
                      ? "border-[#6f6451]"
                      : "border-gray-200 hover:border-[#8c8275]"
                  }
                `}
              >
                {selectedAddress === addr._id && (
                  <CheckCircle className="absolute top-4 right-4 text-[#6f6451] h-5 w-5" />
                )}

                <p className="text-lg font-bold text-gray-900">
                  {addr.fullName}
                </p>
                <p className="text-sm text-[#6f6451]">
                  {addr.street}, {addr.city}
                </p>
                <p className="text-sm text-[#6f6451]">
                  {addr.state} - {addr.pincode}
                </p>
                <p className="text-sm text-[#6f6451]">
                  {addr.country}
                </p>
                <p className="text-sm text-[#8c8275] mt-2">
                  Phone: {addr.phone}
                </p>
              </motion.div>
            ))
          )}
        </div>

        {/* Footer CTA */}
        {user.addresses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-between items-center bg-white border border-gray-200 p-4"
          >
            <button
              onClick={() => router.push("/account/profile")}
              className="text-sm text-[#6f6451] underline cursor-pointer"
            >
              Manage Addresses
            </button>

            <button
              onClick={handleContinue}
              disabled={!selectedAddress}
              className="bg-[#605441] text-white px-8 py-3 flex items-center gap-2 hover:bg-[#736958] cursor-pointer disabled:opacity-50"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ---------------- Checkout Steps ---------------- */

function CheckoutSteps() {
  return (
    <div className="flex items-center justify-between mb-10 text-sm font-semibold">
      <Step active label="Address" />
      <Line />
      <Step label="Review" />
      <Line />
      <Step label="Payment" />
    </div>
  );
}

function Step({ label, active }) {
  return (
    <div
      className={`flex items-center ${
        active ? "text-gray-900" : "text-[#8c8275]"
      }`}
    >
      <span
        className={`w-8 h-8 flex items-center justify-center rounded-full mr-2
        ${
          active
            ? "bg-[#6f6451] text-white"
            : "bg-[#e6e1d8] text-[#6f6451]"
        }`}
      >
        {label[0]}
      </span>
      {label}
    </div>
  );
}

function Line() {
  return <div className="flex-1 h-px bg-[#d8d2c6] mx-4" />;
}
