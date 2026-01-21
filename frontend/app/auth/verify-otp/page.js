"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";

function VerifyOtpContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleVerify = async (e) => {
        e.preventDefault();
        setError("");

        if (!otp) return setError("OTP is required");

        try {
            setLoading(true);
            // Validate OTP without consuming it
            await axios.post(
                `${process.env.NEXT_PUBLIC_BACKENDURL}/api/auth/verify-reset-otp`,
                { email, otp }
            );

            // Navigate to Reset Password page with OTP and Email
            router.push(`/auth/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div className="min-h-screen flex items-center justify-center bg-[#f7f5f2] px-4">
            <motion.div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-3xl font-semibold text-[#2f2a24] mb-2 text-center">
                    Verify OTP
                </h2>
                <p className="text-sm text-[#5b5244] mb-8 text-center">
                    Enter the code sent to <b>{email}</b>
                </p>

                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                <form onSubmit={handleVerify} className="space-y-4">
                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full border border-[#cfc6b8] rounded-full px-5 py-3 text-sm
                        text-[#4a443a] placeholder:text-[#8a8173] focus:outline-none focus:border-[#8b7a5e] text-center tracking-widest text-lg"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#8b7a5e] text-white rounded-full py-3 hover:bg-[#7a6a50]"
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <button
                        onClick={() => router.push("/auth/forgot-password")}
                        className="text-sm text-[#8b7a5e] underline"
                    >
                        Change Email
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f7f5f2]">Loading...</div>}>
            <VerifyOtpContent />
        </Suspense>
    );
}
