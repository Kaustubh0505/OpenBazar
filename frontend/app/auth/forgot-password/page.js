"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email) return setError("Email is required");

        try {
            setLoading(true);
            await axios.post(
                `${process.env.NEXT_PUBLIC_BACKENDURL}/api/auth/forgot-password`,
                { email }
            );
            // Redirect to verification page
            router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div className="min-h-screen flex items-center justify-center bg-[#f7f5f2] px-4">
            <motion.div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-3xl font-semibold text-[#2f2a24] mb-2 text-center">
                    Forgot Password
                </h2>
                <p className="text-sm text-[#5b5244] mb-8 text-center">
                    Enter your email to receive a password reset OTP.
                </p>

                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-[#cfc6b8] rounded-full px-5 py-3 text-sm
                        text-[#4a443a] placeholder:text-[#8a8173] focus:outline-none focus:border-[#8b7a5e]"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#8b7a5e] text-white rounded-full py-3 hover:bg-[#7a6a50]"
                    >
                        {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => router.push("/auth/login")}
                        className="text-sm text-[#8b7a5e] underline"
                    >
                        &larr; Back to Login
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
