"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const { cart, syncCartWithDB, fetchCartFromDB } = useCart();

  const [mode, setMode] = useState("password"); // password | otp
  const [step, setStep] = useState("login"); // login | otp
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    email: "",
  });

  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= PASSWORD LOGIN ================= */
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.identifier || !formData.password) {
      return setError("All fields are required");
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDURL}/api/auth/login`,
        {
          identifier: formData.identifier,
          password: formData.password,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      if (cart.length > 0) {
        await syncCartWithDB(cart);
      } else {
        await fetchCartFromDB();
      }

      if (res.data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (res.data.user.role === "seller") {
        router.push("/seller/dashboard");
      } else {
        router.push("/homePage");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEND OTP ================= */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email) return setError("Email is required");

    try {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDURL}/api/auth/login/send-otp`,
        { email: formData.email }
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
        `${process.env.NEXT_PUBLIC_BACKENDURL}/api/auth/login/verify-otp`,
        { email: formData.email, otp }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      if (cart.length > 0) {
        await syncCartWithDB(cart);
      } else {
        await fetchCartFromDB();
      }

      if (res.data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (res.data.user.role === "seller") {
        router.push("/seller/dashboard");
      } else {
        router.push("/homePage");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen flex items-center justify-center bg-[#f7f5f2] px-4"
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        className="w-full max-w-5xl bg-white rounded-2xl shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >

        {/* ================= LEFT : FORM ================= */}
        <div className="px-8 py-10 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold text-[#2f2a24] mb-2">
            Welcome Back
          </h2>

          <p className="text-sm text-[#7a6f5b] mb-8">
            Login to continue shopping on <b>OpenBazar</b>
          </p>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          {/* MODE TOGGLE */}
          <div className="flex mb-6 border border-[#e4ded4] rounded-full overflow-hidden">
            <button
              type="button"
              onClick={() => {
                setMode("password");
                setStep("login");
              }}
              className={`w-1/2 py-2 text-sm transition ${
                mode === "password"
                  ? "bg-[#8b7a5e] text-white"
                  : "bg-white text-[#6f6451]"
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("otp");
                setStep("login");
              }}
              className={`w-1/2 py-2 text-sm transition ${
                mode === "otp"
                  ? "bg-[#8b7a5e] text-white"
                  : "bg-white text-[#6f6451]"
              }`}
            >
              Email OTP
            </button>
          </div>

          {/* PASSWORD LOGIN */}
          {mode === "password" && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <input
                type="text"
                name="identifier"
                placeholder="Email or Phone"
                value={formData.identifier}
                onChange={handleChange}
                className="w-full border border-[#e4ded4] rounded-full px-5 py-3 text-[#8b7a5e] text-sm focus:outline-none focus:border-[#8b7a5e]"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-[#e4ded4] rounded-full px-5 py-3 text-[#8b7a5e] text-sm focus:outline-none focus:border-[#8b7a5e]"
              />

              <div className="text-right">
                <button
                  type="button"
                  className="text-xs text-[#6f6451] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-[#8b7a5e] hover:bg-[#7a6a50] text-white rounded-full py-3 text-sm font-medium transition disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>
          )}

          {/* OTP LOGIN */}
          {mode === "otp" && step === "login" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-[#e4ded4] rounded-full px-5 py-3 text-sm text-[#8b7a5e] focus:outline-none focus:border-[#8b7a5e]"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8b7a5e] hover:bg-[#7a6a50] text-white rounded-full py-3 text-sm font-medium transition disabled:opacity-50"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {/* OTP VERIFY */}
          {mode === "otp" && step === "otp" && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border border-[#e4ded4] rounded-full px-5 py-3 text-sm text-[#8b7a5e] focus:outline-none focus:border-[#8b7a5e]"
              />

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-[#8b7a5e] hover:bg-[#7a6a50] text-white rounded-full py-3 text-sm font-medium transition disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          )}

          <p className="text-sm text-center text-[#6f6451] mt-8">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/auth/signup")}
              className="text-[#8b7a5e] underline"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* ================= RIGHT : BRAND PANEL ================= */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="hidden md:flex bg-[#f3efe8] items-center justify-center px-10"
        >
          <div className="text-center max-w-sm">
            <h2 className="text-3xl font-bold text-[#2f2a24] mb-6">
              Welcome to OpenBazar
            </h2>

            <p className="text-sm text-[#6f6451]">
              Sign in to buy amazing products or sell what you no longer need —
              all in one trusted marketplace.
            </p>
          </div>
        </motion.div>

      </motion.div>
    </motion.div>
  );
}
