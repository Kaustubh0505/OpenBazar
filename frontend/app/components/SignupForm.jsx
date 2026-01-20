"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useCart } from "../context/CartContext";

export default function SignupForm() {
  const router = useRouter();
  const { cart, syncCartWithDB, fetchCartFromDB } = useCart();

  const [step, setStep] = useState("signup"); // signup | otp
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "buyer",
  });

  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= SEND OTP ================= */
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      return setError("Name, email and password are required");
    }

    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDURL}/api/auth/send-otp`,
        formData
      );
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleVerifyOtp = async () => {
    setError("");
    if (!otp) return setError("Enter OTP");

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDURL}/api/auth/verify-otp`,
        {
          email: formData.email,
          otp,
        }
      );

      localStorage.setItem("token", res.data.token);

      if (cart.length > 0) {
        await syncCartWithDB(cart);
      } else {
        await fetchCartFromDB();
      }

      router.push("/homePage");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f5f2] px-4">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-[360px] bg-white border border-gray-200 px-6 py-8"
      >
        <h2 className="text-2xl font-semibold text-black text-center mb-6">
          {step === "signup" ? "Create Account" : "Verify OTP"}
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        {/* ================= SIGNUP STEP ================= */}
        {step === "signup" && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2.5 text-sm text-[#6f6451] mb-4 focus:outline-none focus:border-black"
            />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2.5 text-sm mb-4 focus:outline-none text-[#6f6451] focus:border-black"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2.5 text-sm mb-4 text-[#6f6451] focus:outline-none focus:border-black"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2.5 text-sm mb-3 text-[#6f6451] focus:outline-none focus:border-black"
            />

            {/* Seller Toggle */}
            <label className="flex items-center gap-3 text-sm text-gray-700 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.role === "seller"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.checked ? "seller" : "buyer",
                  })
                }
                className="h-4 w-4 accent-black"
              />
              I want to become a Seller
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2.5 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Sending OTP..." : "Sign Up"}
            </button>
          </>
        )}

        {/* ================= OTP STEP ================= */}
        {step === "otp" && (
          <>
            <p className="text-sm text-center text-gray-600 mb-4">
              OTP sent to <b>{formData.email}</b>
            </p>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2.5 text-sm mb-5 focus:outline-none focus:border-black"
            />

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-black text-white py-2.5 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="text-black underline cursor-pointer"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}
