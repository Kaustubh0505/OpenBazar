"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function VerifyOtpForm() {
  const router = useRouter();
  const phone = useSearchParams().get("phone");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!otp) return setError("Enter OTP");

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDURL}/api/auth/verify-otp`,
        { phone, otp }
      );

      localStorage.setItem("token", res.data.token);
      router.push("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f5f2] px-4">
      <div className="w-full max-w-[360px] bg-white border border-gray-200 px-6 py-8">
        <h2 className="text-2xl font-semibold text-black text-center mb-4">
          Verify OTP
        </h2>

        <p className="text-sm text-center text-gray-600 mb-6">
          Enter the OTP sent to your phone
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="
            w-full border border-gray-300
            px-4 py-2.5 text-sm
            mb-5
            text-[#6f6451]
            focus:outline-none focus:border-black
          "
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="
            w-full bg-[#6f6451] text-white
            py-2.5 text-sm font-medium
            hover:bg-[#736958] transition
            disabled:opacity-50
            cursor-pointer
          "
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
}
