"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";

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

  /* ================= GOOGLE OAUTH ================= */
  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDURL}/api/auth/google`,
        { token: credentialResponse.credential }
      );

      localStorage.setItem("token", res.data.token);

      if (cart.length > 0) {
        await syncCartWithDB(cart);
      } else {
        await fetchCartFromDB();
      }

      router.push("/homePage");
    } catch {
      setError("Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center bg-[#f7f5f2] px-4"
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="w-full max-w-5xl bg-white rounded-2xl shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        {/* ================= LEFT ================= */}
        <div className="px-8 py-10 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold text-[#2f2a24] mb-2">
            {step === "signup" ? "Create your account" : "Verify OTP"}
          </h2>

          <p className="text-sm text-[#5b5244] mb-8">
            Buy & sell effortlessly on <b>OpenBazar</b>
          </p>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          {/* ================= SIGNUP ================= */}
          {step === "signup" && (
            <>
              <form onSubmit={handleSignup} className="space-y-4">
                {["name", "email", "password", "phone"].map((field) => (
                  <input
                    key={field}
                    type={field === "password" ? "password" : field === "phone" ? "tel" : "text"}
                    name={field}
                    placeholder={
                      field === "name"
                        ? "Full Name"
                        : field === "email"
                        ? "Email address"
                        : field === "password"
                        ? "Password"
                        : "Phone Number"
                    }
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full border border-[#cfc6b8] rounded-full px-5 py-3 text-sm
                               text-[#4a443a] placeholder:text-[#8a8173]
                               focus:outline-none focus:border-[#8b7a5e]"
                  />
                ))}

                <label className="flex items-center gap-3 text-sm text-[#4a443a] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.role === "seller"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.checked ? "seller" : "buyer",
                      })
                    }
                    className="h-4 w-4 accent-[#8b7a5e]"
                  />
                  I want to sell products on OpenBazar
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#7a6a50] hover:bg-[#8b7a5e] text-white rounded-full py-3 text-sm font-medium transition disabled:opacity-50"
                >
                  {loading ? "Sending OTP..." : "Create Account"}
                </button>
              </form>

              {/* ===== OR ===== */}
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-[#cfc6b8]" />
                <span className="px-3 text-sm text-[#6b6254]">OR</span>
                <div className="flex-1 border-t border-[#cfc6b8]" />
              </div>

              {/* ===== GOOGLE ===== */}
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google signup failed")}
                  text="signup_with"
                />
              </div>
            </>
          )}

          {/* ================= OTP ================= */}
          {step === "otp" && (
            <div className="space-y-5">
              <p className="text-sm text-[#5b5244]">
                OTP sent to <b>{formData.email}</b>
              </p>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border border-[#cfc6b8] rounded-full px-5 py-3 text-sm
                           text-[#4a443a] placeholder:text-[#8a8173]
                           focus:outline-none focus:border-[#8b7a5e]"
              />

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-[#8b7a5e] hover:bg-[#7a6a50] text-white rounded-full py-3 text-sm font-medium transition disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          )}

          <p className="text-sm text-center text-[#5b5244] mt-8">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/auth/login")}
              className="text-[#8b7a5e] underline"
            >
              Login
            </button>
          </p>
        </div>

        {/* ================= RIGHT ================= */}
        <motion.div className="hidden md:flex bg-[#f3efe8] items-center justify-center px-10">
          <div className="text-center max-w-sm">
            <h2 className="text-3xl font-bold text-[#2f2a24] mb-6">
              Welcome to OpenBazar
            </h2>

            <h3 className="text-xl font-semibold text-[#2f2a24] mb-4">
              Buy & Sell with Confidence
            </h3>

            <p className="text-sm text-[#5b5244]">
              OpenBazar combines the best of online marketplaces and local
              listings. Discover amazing deals or sell items you no longer
              need — all in one trusted platform.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
