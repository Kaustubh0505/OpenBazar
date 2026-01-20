"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Suspense } from "react";
import { motion } from "framer-motion";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-[#f7f5f2] flex items-center justify-center px-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white max-w-md w-full p-8 border border-gray-200 text-center rounded-lg shadow-sm"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.3 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-green-600" />
        </motion.div>

        {/* Heading */}
        <h1 className="text-2xl font-light text-gray-900 mb-2">
          Order Confirmed
        </h1>

        <p className="text-sm text-[#6f6451] mb-6">
          Your order has been placed successfully. We’ll start processing it right away.
        </p>

        {/* Order ID */}
        {orderId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-[#f7f5f2] border border-[#e6e1d8] p-4 mb-6 rounded"
          >
            <p className="text-xs text-[#8c8275] mb-1">Order ID</p>
            <p className="font-mono text-sm text-gray-900 break-all">
              {orderId}
            </p>
          </motion.div>
        )}

        {/* Next Steps */}
        <div className="text-sm text-[#6f6451] mb-8 space-y-1">
          <p>• You’ll receive an order confirmation email</p>
          <p>• Delivery typically takes 3–5 business days</p>
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/homePage")}
          className="w-full bg-[#6f6451] text-white py-3 font-medium flex items-center justify-center hover:bg-[#736958] gap-2 cursor-pointer rounded transition"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default function OrderSuccess() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f7f5f2] text-[#6f6451]">
          Loading...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
