"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { Suspense } from "react";

function SuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-lg text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                <p className="text-gray-500 mb-8">
                    Thank you for your purchase. Your order has been placed successfully.
                </p>

                {orderId && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-8 border border-gray-100">
                        <p className="text-sm text-gray-600 mb-1">Order ID</p>
                        <p className="font-mono font-medium text-gray-900">{orderId}</p>
                    </div>
                )}

                <div className="space-y-3">
                    <button
                        onClick={() => router.push("/homePage")} // Ideally /account/orders if implemented
                        className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                    >
                        Continue Shopping
                    </button>

                    <button
                        onClick={() => router.push("/homePage")}
                        className="w-full bg-white text-gray-700 border border-gray-200 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function OrderSuccess() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
