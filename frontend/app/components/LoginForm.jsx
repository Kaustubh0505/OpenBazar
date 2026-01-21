"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";

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

  /* ================= GOOGLE LOGIN ================= */
  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDURL}/api/auth/google-login`,
        { credential: credentialResponse.credential }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      if (cart.length > 0) {
        await syncCartWithDB(cart);
      } else {
        await fetchCartFromDB();
      }

      router.push(redirectPath || "/homePage");
    } catch {
      setError("Google Login Failed");
    } finally {
      setLoading(false);
    }
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
            Welcome Back
          </h2>

          <p className="text-sm text-[#5b5244] mb-8">
            Login to continue shopping on <b>OpenBazar</b>
          </p>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          {/* PASSWORD LOGIN */}
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <input
              type="text"
              name="identifier"
              placeholder="Email or Phone"
              value={formData.identifier}
              onChange={handleChange}
              className="w-full border border-[#cfc6b8] rounded-full px-5 py-3 text-sm
                         text-[#4a443a] placeholder:text-[#8a8173]
                         focus:outline-none focus:border-[#8b7a5e]"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-[#cfc6b8] rounded-full px-5 py-3 text-sm
                         text-[#4a443a] placeholder:text-[#8a8173]
                         focus:outline-none focus:border-[#8b7a5e]"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.push("/auth/forgot-password")}
                className="text-xs text-[#5b5244] hover:text-[#8b7a5e]"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8b7a5e] hover:bg-[#7a6a50] text-white rounded-full py-3 text-sm font-medium transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* ===== OR ===== */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-[#cfc6b8]" />
            <span className="px-3 text-sm text-[#6b6254]">OR</span>
            <div className="flex-1 border-t border-[#cfc6b8]" />
          </div>

          {/* GOOGLE LOGIN */}
          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google Login Failed")}
            />
          </div>

          <p className="text-sm text-center text-[#5b5244]">
            Don’t have an account?{" "}
            <button
              onClick={() => router.push("/auth/signup")}
              className="text-[#8b7a5e] underline"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* ================= RIGHT ================= */}
        <motion.div className="hidden md:flex bg-[#f3efe8] items-center justify-center px-10">
          <div className="text-center max-w-sm">
            <h2 className="text-3xl font-bold text-[#2f2a24] mb-6">
              Welcome Back 👋
            </h2>

            <h3 className="text-xl font-semibold text-[#2f2a24] mb-4">
              Continue Your OpenBazar Journey
            </h3>

            <p className="text-sm text-[#5b5244]">
              Log in to explore amazing deals, manage your listings, and connect
              with buyers and sellers you trust. Your marketplace, all in one
              place.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
