"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCart } from "../../../app/context/CartContext";
import { Loader2, Banknote, CreditCard, ArrowRight } from "lucide-react";

export default function CheckoutPayment() {
    const router = useRouter();
    const { cart, getTotalPrice, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState("COD");

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const shippingAddress = JSON.parse(sessionStorage.getItem("shippingAddress"));

            // Construct backend payload
            const items = cart.map(item => ({
                product: item._id, // Ensure cart item has _id of product
                quantity: item.quantity,
                price: item.price
            }));

            const totalAmount = getTotalPrice();

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKENDURL}/api/orders`,
                { items, shippingAddress, totalAmount, paymentMethod: selectedMethod },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Clear local cart
            clearCart();
            sessionStorage.removeItem("shippingAddress"); // Clean up

            router.push("/checkout/success?orderId=" + res.data._id);
        } catch (error) {
            console.error("Order failed", error);
            alert(error.response?.data?.message || "Order placement failed");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Progress Steps */}
                <div className="flex justify-between items-center mb-10 text-sm font-medium">
                    <div className="flex items-center text-blue-600">
                        <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full mr-2">✓</span>
                        Address
                    </div>
                    <div className="flex-1 h-1 bg-blue-600 mx-4"></div>
                    <div className="flex items-center text-blue-600">
                        <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full mr-2">✓</span>
                        Review
                    </div>
                    <div className="flex-1 h-1 bg-blue-600 mx-4"></div>
                    <div className="flex items-center text-blue-600">
                        <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full mr-2">3</span>
                        Payment
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-8">Payment Method</h1>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
                    <div className="space-y-4">
                        <div
                            onClick={() => setSelectedMethod("COD")}
                            className={`p-4 border rounded-lg cursor-pointer flex items-center gap-4 transition-all ${selectedMethod === "COD" ? "border-blue-600 bg-blue-50" : "hover:bg-gray-50"}`}
                        >
                            <input type="radio" checked={selectedMethod === "COD"} readOnly className="h-5 w-5 text-blue-600" />
                            <div className="bg-green-100 p-2 rounded text-green-700">
                                <Banknote className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Cash on Delivery</h3>
                                <p className="text-sm text-gray-500">Pay when you receive your order</p>
                            </div>
                        </div>

                        <div className="opacity-50 p-4 border rounded-lg cursor-not-allowed flex items-center gap-4">
                            <input type="radio" disabled className="h-5 w-5" />
                            <div className="bg-gray-100 p-2 rounded text-gray-500">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Credit / Debit Card</h3>
                                <p className="text-sm text-gray-500">Coming soon</p>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full bg-gray-900 text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" /> Processing Address...
                        </>
                    ) : (
                        <>
                            Place Order (${getTotalPrice().toFixed(2)})
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
