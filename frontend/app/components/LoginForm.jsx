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
        `${process.env.NEXT_PUBLIC_BACKENDURL}/api/auth/google`,
        { token: credentialResponse.credential }
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

      router.push("/homePage");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="min-h-screen flex items-center justify-center bg-[#f7f5f2] px-4">
      <motion.div className="w-full max-w-5xl bg-white rounded-2xl shadow-md grid grid-cols-1 md:grid-cols-2">
        {/* LEFT */}
        <div className="px-8 py-10">
          <h2 className="text-3xl font-semibold text-[#2f2a24] mb-2">
            Welcome Back
          </h2>

          <p className="text-sm text-[#5b5244] mb-8">
            Login to continue shopping on <b>OpenBazar</b>
          </p>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* MODE TOGGLE */}
          <div className="flex mb-6 border border-[#cfc6b8] rounded-full overflow-hidden">
            {["password", "otp"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setStep("login");
                }}
                className={`w-1/2 py-2 text-sm transition ${
                  mode === m
                    ? "bg-[#8b7a5e] text-white"
                    : "bg-white text-[#5b5244]"
                }`}
              >
                {m === "password" ? "Password" : "Email OTP"}
              </button>
            ))}
          </div>

          {/* PASSWORD */}
          {mode === "password" && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              {["identifier", "password"].map((f) => (
                <input
                  key={f}
                  type={f === "password" ? "password" : "text"}
                  name={f}
                  placeholder={f === "password" ? "Password" : "Email or Phone"}
                  value={formData[f]}
                  onChange={handleChange}
                  className="w-full border border-[#cfc6b8] rounded-full px-5 py-3 text-sm
                             text-[#4a443a] placeholder:text-[#8a8173]
                             focus:outline-none focus:border-[#8b7a5e]"
                />
              ))}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8b7a5e] hover:bg-[#7a6a50] text-white rounded-full py-3"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>
          )}

          {/* OTP */}
          {mode === "otp" && step === "login" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-[#cfc6b8] rounded-full px-5 py-3 text-sm
                           text-[#4a443a] placeholder:text-[#8a8173]"
              />
              <button className="w-full bg-[#8b7a5e] text-white rounded-full py-3">
                Send OTP
              </button>
            </form>
          )}

          {mode === "otp" && step === "otp" && (
            <div className="space-y-4">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border border-[#cfc6b8] rounded-full px-5 py-3 text-sm
                           text-[#4a443a] placeholder:text-[#8a8173]"
              />
              <button
                onClick={handleVerifyOtp}
                className="w-full bg-[#8b7a5e] text-white rounded-full py-3"
              >
                Verify OTP
              </button>
            </div>
          )}

          {/* OR + GOOGLE */}
          <div className="mt-8">
            <div className="flex items-center mb-6">
              <div className="flex-1 border-t border-[#cfc6b8]" />
              <span className="px-3 text-sm text-[#6b6254]">OR</span>
              <div className="flex-1 border-t border-[#cfc6b8]" />
            </div>

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
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex bg-[#f3efe8] items-center justify-center px-10">
          <p className="text-sm text-[#5b5244] text-center">
            Sign in to buy or sell confidently on OpenBazar.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
