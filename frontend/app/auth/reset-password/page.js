"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const otp = searchParams.get("otp");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleReset = async (e) => {
        e.preventDefault();
        setError("");

        if (!password || !confirmPassword) return setError("All fields are required");
        if (password !== confirmPassword) return setError("Passwords do not match");
        if (password.length < 6) return setError("Password must be at least 6 characters");

        try {
            setLoading(true);
            await axios.post(
                `${process.env.NEXT_PUBLIC_BACKENDURL}/api/auth/reset-password`,
                {
                    email,
                    otp,
                    newPassword: password,
                }
            );

            alert("Password reset successfully! Please login.");
            router.push("/auth/login");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div className="min-h-screen flex items-center justify-center bg-[#f7f5f2] px-4">
            <motion.div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-3xl font-semibold text-[#2f2a24] mb-2 text-center">
                    Set New Password
                </h2>
                <p className="text-sm text-[#5b5244] mb-8 text-center">
                    Choose a strong password (minimum 6 characters)
                </p>

                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                <form onSubmit={handleReset} className="space-y-4">
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-[#cfc6b8] rounded-full px-5 py-3 text-sm
                        text-[#4a443a] placeholder:text-[#8a8173] focus:outline-none focus:border-[#8b7a5e]"
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border border-[#cfc6b8] rounded-full px-5 py-3 text-sm
                        text-[#4a443a] placeholder:text-[#8a8173] focus:outline-none focus:border-[#8b7a5e]"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#8b7a5e] text-white rounded-full py-3 hover:bg-[#7a6a50]"
                    >
                        {loading ? "Resetting..." : "Reset My Password"}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f7f5f2]">Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
