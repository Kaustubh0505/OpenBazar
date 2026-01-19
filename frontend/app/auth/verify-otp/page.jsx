"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

function VerifyOtpContent() {
  const router = useRouter();
  const phone = useSearchParams().get("phone");
  const [otp, setOtp] = useState("");

  const handleVerify = async () => {
    if (!otp) return alert("Enter OTP");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDURL}/api/auth/verify-otp`,
        { phone, otp }
      );

      // ✅ Save JWT
      localStorage.setItem("token", res.data.token);

      // ✅ Redirect to Home
      router.push("/");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow w-80">
        <h2 className="text-xl font-semibold mb-4">Verify OTP</h2>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />

        <button
          onClick={handleVerify}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full cursor-pointer"
        >
          Verify
        </button>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
