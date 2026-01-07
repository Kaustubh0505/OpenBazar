"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginForm() {
  const router = useRouter();

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
        "http://localhost:5001/api/auth/login",
        {
          identifier: formData.identifier,
          password: formData.password,
        }
      );
      localStorage.setItem("token", res.data.token);
      router.push("/homePage");
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
        "http://localhost:5001/api/auth/login/send-otp",
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
        "http://localhost:5001/api/auth/login/verify-otp",
        { email: formData.email, otp }
      );
      localStorage.setItem("token", res.data.token);
      router.push("/homePage");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={mode === "password" ? handlePasswordLogin : handleSendOtp}
        className="bg-white text-gray-600 w-full max-w-[350px] p-6 rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Login Now
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        {/* MODE TOGGLE */}
        <div className="flex mb-5 rounded-full overflow-hidden border border-gray-300">
          <button
            type="button"
            onClick={() => {
              setMode("password");
              setStep("login");
            }}
            className={`w-1/2 py-2 text-sm cursor-pointer transition ${
              mode === "password"
                ? "bg-gray-800 text-white"
                : "bg-gray-100"
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
            className={`w-1/2 py-2 text-sm cursor-pointer transition ${
              mode === "otp"
                ? "bg-gray-800 text-white"
                : "bg-gray-100"
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
              className="w-full border my-3 border-gray-400/40 outline-none rounded-full py-2.5 px-4"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border mt-1 border-gray-400/40 outline-none rounded-full py-2.5 px-4"
            />

            <div className="text-right py-4">
              <button
                type="button"
                className="text-gray-600 text-sm underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer mb-3 bg-gray-800 hover:bg-gray-600 active:scale-95 transition py-2.5 rounded-full text-white disabled:opacity-50"
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
              className="w-full border my-4 border-gray-400/40 outline-none rounded-full py-2.5 px-4"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer mb-3 bg-gray-800 hover:bg-gray-600 active:scale-95 transition py-2.5 rounded-full text-white disabled:opacity-50"
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
              className="w-full border my-4 border-gray-400/40 outline-none rounded-full py-2.5 px-4"
            />

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full mb-3 cursor-pointer bg-green-500 hover:bg-green-600 active:scale-95 transition py-2.5 rounded-full text-white disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        <p className="text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/signup")}
            className="text-gray-500 cursor-pointer underline"
          >
            Signup Now
          </button>
        </p>
      </form>
    </div>
  );
}
