"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignupForm() {
  const router = useRouter();

  const [step, setStep] = useState("signup"); // signup | otp
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
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
        "http://localhost:5001/api/auth/send-otp",
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
        "http://localhost:5001/api/auth/verify-otp",
        {
          email: formData.email,
          otp,
        }
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
        onSubmit={handleSignup}
        className={`bg-white text-gray-600 w-full max-w-[350px] p-6 rounded-xl
        shadow-[0px_0px_10px_0px] shadow-black/10 transition-all duration-300`}
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
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
              className="w-full border my-3 border-gray-400/40 outline-none rounded-full py-2.5 px-4"
            />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border my-3 border-gray-400/40 outline-none rounded-full py-2.5 px-4"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border my-3 border-gray-400/40 outline-none rounded-full py-2.5 px-4"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border my-3 border-gray-400/40 outline-none rounded-full py-2.5 px-4"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-gray-800 hover:bg-gray-600
              active:scale-95 transition py-2.5 rounded-full text-white
              disabled:opacity-50 cursor-pointer"
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
              className="w-full border my-4 border-gray-800 outline-none
              rounded-full py-2.5 px-4"
            />

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600
              active:scale-95 cursor-pointer transition py-2.5 rounded-full text-white
              disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="text-gray-500 cursor-pointer underline"
          >
            Login Now
          </button>
        </p>
      </form>
    </div>
  );
}
