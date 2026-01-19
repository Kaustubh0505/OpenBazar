"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Plus, CheckCircle, ArrowRight, Loader2 } from "lucide-react";

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

      // Optional safety: checkout only for buyers
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
      console.error("Error fetching addresses:", err);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f5f2]">
        <Loader2 className="h-10 w-10 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress */}
        <CheckoutSteps />

        <div className="mb-6">
          <button
            onClick={() => router.push("/cart")}
            className="text-gray-500 hover:text-black flex items-center gap-2 cursor-pointer"
          >
            &larr; Back to Cart
          </button>
        </div>

        <h1 className="text-2xl font-light text-black mb-6">
          Select Delivery Address
        </h1>

        {error && (
          <p className="text-sm text-red-600 mb-4">{error}</p>
        )}

        {/* Address List */}
        <div className="grid gap-4 mb-8">
          {user.addresses.length === 0 ? (
            <div className="bg-white border border-gray-200 p-8 text-center">
              <p className="text-gray-600 mb-4">
                No saved addresses found
              </p>
              <button
                onClick={() => router.push("/account/profile")}
                className="bg-black text-white px-6 py-2 cursor-pointer"
              >
                <Plus className="inline w-4 h-4 mr-2" />
                Add Address
              </button>
            </div>
          ) : (
            user.addresses.map((addr) => (
              <div
                key={addr._id}
                onClick={() => setSelectedAddress(addr._id)}
                className={`
                  border p-5 cursor-pointer transition relative bg-white
                  ${selectedAddress === addr._id
                    ? "border-black"
                    : "border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                {selectedAddress === addr._id && (
                  <CheckCircle className="absolute top-4 right-4 text-black h-5 w-5" />
                )}

                <p className="font-medium text-black">
                  {addr.fullName}
                </p>
                <p className="text-sm text-gray-600">
                  {addr.street}, {addr.city}
                </p>
                <p className="text-sm text-gray-600">
                  {addr.state} - {addr.pincode}
                </p>
                <p className="text-sm text-gray-600">
                  {addr.country}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Phone: {addr.phone}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer CTA */}
        {user.addresses.length > 0 && (
          <div className="flex justify-between items-center bg-white border border-gray-200 p-4">
            <button
              onClick={() => router.push("/account/profile")}
              className="text-sm text-gray-600 underline cursor-pointer"
            >
              Manage Addresses
            </button>

            <button
              onClick={handleContinue}
              disabled={!selectedAddress}
              className="bg-black text-white px-8 py-3 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Checkout Steps ---------------- */

function CheckoutSteps() {
  return (
    <div className="flex items-center justify-between mb-10 text-sm">
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
    <div className={`flex items-center ${active ? "text-black" : "text-gray-400"}`}>
      <span
        className={`w-8 h-8 flex items-center justify-center rounded-full mr-2
        ${active ? "bg-black text-white" : "bg-gray-200"}`}
      >
        {label[0]}
      </span>
      {label}
    </div>
  );
}

function Line() {
  return <div className="flex-1 h-px bg-gray-300 mx-4" />;
}
