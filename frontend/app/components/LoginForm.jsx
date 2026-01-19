"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useCart } from "../context/CartContext";

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
    <div className="min-h-screen flex items-center justify-center bg-[#f7f5f2] px-4">
      <form
        onSubmit={mode === "password" ? handlePasswordLogin : handleSendOtp}
        className="w-full max-w-[360px] bg-white border border-gray-200 px-6 py-8 rounded-sm shadow-sm"
      >
        <h2 className="text-2xl font-semibold text-black text-center mb-6">
          Welcome Back
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        {/* MODE TOGGLE */}
        <div className="flex mb-6 border border-gray-300 rounded-full overflow-hidden">
          <button
            type="button"
            onClick={() => {
              setMode("password");
              setStep("login");
            }}
            className={`w-1/2 py-2 text-sm transition ${
              mode === "password"
                ? "bg-black text-white"
                : "bg-white text-gray-600"
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
                ? "bg-black text-white"
                : "bg-white text-gray-600"
            }`}
          >
            Email OTP
          </button>
        </div>

        {/* PASSWORD LOGIN */}
        {mode === "password" && (
          <>
            <input
              type="text"
              name="identifier"
              placeholder="Email or Phone"
              value={formData.identifier}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-black"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2.5 text-sm mb-3 focus:outline-none focus:border-black"
            />

            <div className="text-right mb-5">
              <button
                type="button"
                className="text-xs text-gray-500 hover:text-black"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2.5 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </>
        )}

        {/* OTP LOGIN */}
        {mode === "otp" && step === "login" && (
          <>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2.5 text-sm mb-5 focus:outline-none focus:border-black"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2.5 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {/* OTP VERIFY */}
        {mode === "otp" && step === "otp" && (
          <>
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
              className="w-full bg-black text-white py-2.5 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/signup")}
            className="text-black underline"
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
}
