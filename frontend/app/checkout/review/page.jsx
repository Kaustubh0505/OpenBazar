"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../../app/context/CartContext";
import { ArrowLeft, ArrowRight, MapPin, Package, ShoppingBag } from "lucide-react";

export default function CheckoutReview() {
    const router = useRouter();
    const { cart, getTotalPrice } = useCart();
    const [shippingAddress, setShippingAddress] = useState(null);

    useEffect(() => {
        // Load address from session
        const storedAddr = sessionStorage.getItem("shippingAddress");
        if (!storedAddr) router.push("/checkout/address");
        else setShippingAddress(JSON.parse(storedAddr));
    }, []);

    if (!shippingAddress) return null;

    const subtotal = getTotalPrice();
    const shipping = 0; // Free for now
    const total = subtotal + shipping;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Progress Steps */}
                <div className="flex justify-between items-center mb-10 text-sm font-medium">
                    <div className="flex items-center text-blue-600">
                        <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full mr-2">✓</span>
                        Address
                    </div>
                    <div className="flex-1 h-1 bg-blue-600 mx-4"></div>
                    <div className="flex items-center text-blue-600">
                        <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full mr-2">2</span>
                        Review
                    </div>
                    <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
                    <div className="flex items-center text-gray-500">
                        <span className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full mr-2">3</span>
                        Payment
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-8">Review Order</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Items & Address */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Address */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                                    <MapPin className="w-5 h-5 text-gray-500" /> Shipping Address
                                </h2>
                                <button
                                    onClick={() => router.push("/checkout/address")}
                                    className="text-blue-600 text-sm hover:underline"
                                >
                                    Change
                                </button>
                            </div>
                            <div className="text-gray-700">
                                <p className="font-semibold">{shippingAddress.fullName}</p>
                                <p>{shippingAddress.street}</p>
                                <p>{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}</p>
                                <p>{shippingAddress.country}</p>
                                <p className="mt-1 text-sm text-gray-500">Phone: {shippingAddress.phone}</p>
                            </div>
                        </div>

                        {/* Cart Items */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800 mb-4">
                                <Package className="w-5 h-5 text-gray-500" /> Cart Items ({cart.length})
                            </h2>
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div key={item._id} className="flex gap-4 py-4 border-b last:border-0 border-gray-100">
                                        <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                            <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                                            <p className="font-medium text-gray-800 mt-1">${item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="text-right font-bold text-gray-900">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5" /> Order Summary
                            </h2>
                            <div className="space-y-3 text-gray-700">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-green-600">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between font-bold text-xl text-gray-900">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push("/checkout/payment")}
                                className="w-full bg-gray-900 text-white py-3 rounded-lg mt-6 font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                            >
                                Continue to Payment <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
