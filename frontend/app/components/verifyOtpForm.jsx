"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function VerifyOtpForm() {
  const router = useRouter();
  const phone = useSearchParams().get("phone");
  const [otp, setOtp] = useState("");

  const handleVerify = async () => {
    if (!otp) return alert("Enter OTP");

    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/verify-otp",
        { phone, otp }
      );

      localStorage.setItem("token", res.data.token);
      router.push("/");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
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
        className="bg-gray-800 text-white px-4 py-2 rounded w-full"
      >
        Verify
      </button>
    </div>
  );
}
