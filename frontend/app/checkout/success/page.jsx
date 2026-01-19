"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Suspense } from "react";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen bg-[#f7f5f2] flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full p-8 border border-gray-200 text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-light text-black mb-2">
          Order Confirmed
        </h1>

        <p className="text-sm text-gray-600 mb-6">
          Your order has been placed successfully. We’ll start processing it right away.
        </p>

        {/* Order ID */}
        {orderId && (
          <div className="bg-gray-50 border border-gray-200 p-4 mb-6">
            <p className="text-xs text-gray-500 mb-1">Order ID</p>
            <p className="font-mono text-sm text-black">{orderId}</p>
          </div>
        )}

        {/* Next Steps */}
        <div className="text-sm text-gray-600 mb-8 space-y-1">
          <p>• You’ll receive an order confirmation email</p>
          <p>• Delivery typically takes 3–5 business days</p>
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push("/homePage")}
          className="w-full bg-black text-white py-3 font-medium flex items-center justify-center gap-2 cursor-pointer"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function OrderSuccess() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f7f5f2]">
          Loading...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
