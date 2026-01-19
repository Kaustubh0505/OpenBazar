"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export default function CartPage() {
    const router = useRouter();
    const {
        cart,
        updateQuantity,
        removeFromCart,
        getTotalPrice,
        clearCart,
        fetchCartFromDB,
        loading,
    } = useCart();

    // Fetch cart from database when component mounts
    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
            fetchCartFromDB();

        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar
                categories={[]}
                onCategorySelect={() => router.push("/homePage")}
                onSearch={() => { }}
                onCartClick={() => { }}
            />

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Back Button */}
                <button
                    onClick={() => router.push("/homePage")}
                    className="flex items-center gap-2 text-gray-600 hover:underline cursor-pointer mb-6"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Continue Shopping</span>
                </button>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Shopping Cart
                    </h1>
                    {!loading && (
                        <p className="text-gray-600">
                            {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
                        </p>
                    )}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <Loader2 className="h-12 w-12 animate-spin text-gray-800 mx-auto mb-4" />
                            <p className="text-gray-600">Loading your cart...</p>
                        </div>
                    </div>
                ) : cart.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Looks like you haven't added any items yet.
                        </p>
                        <button
                            onClick={() => router.push("/homePage")}
                            className="bg-gray-800 text-white px-6 py-3 cursor-pointer  rounded-lg font-semibold hover:bg-gray-600"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item._id} // ✅ UNIQUE cart item ID
                                    className="bg-white rounded-lg shadow-md p-4 sm:p-6"
                                >
                                    <div className="flex gap-4">
                                        {/* Image */}
                                        <div
                                            className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                                            onClick={() =>
                                                router.push(`/product/${item._id}`)
                                            }
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1">
                                            <h3
                                                className="text-lg text-gray-900 font-semibold cursor-pointer"
                                                onClick={() =>
                                                    router.push(`/product/${item._id}`)
                                                }
                                            >
                                                {item.name}
                                            </h3>

                                            <div className="flex text-gray-900 justify-between items-center mt-4">
                                                {/* Price */}
                                                <div>
                                                    <p className="text-xl font-bold">
                                                        ${item.price.toFixed(2)}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        ${(item.price * item.quantity).toFixed(2)} total
                                                    </p>
                                                </div>

                                                {/* Quantity */}
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item._id,
                                                                item.quantity - 1
                                                            )
                                                        }
                                                        className="w-8 h-8 bg-gray-700 text-white rounded cursor-pointer"
                                                    >
                                                        <Minus className="h-4 w-4 mx-auto" />
                                                    </button>

                                                    <span className="w-10 text-center">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item._id,
                                                                item.quantity + 1
                                                            )
                                                        }
                                                        className="w-8 h-8 bg-gray-700 text-white rounded cursor-pointer"
                                                    >
                                                        <Plus className="h-4 w-4 mx-auto" />
                                                    </button>

                                                    {/* Remove */}
                                                    <button
                                                        onClick={() =>
                                                            removeFromCart(item._id)
                                                        }
                                                        className="p-2 text-red-600 cursor-pointer"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white text-gray-900 rounded-lg shadow-md p-6 sticky top-24">
                                <h2 className="text-xl font-bold mb-4">
                                    Order Summary
                                </h2>

                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>${getTotalPrice().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between font-bold">
                                        <span>Total</span>
                                        <span>${getTotalPrice().toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        const token = localStorage.getItem("token");
                                        if (token) {
                                            router.push("/checkout/address");
                                        } else {
                                            router.push("/auth/login?redirect=/checkout/address");
                                        }
                                    }}
                                    className="w-full cursor-pointer bg-gray-800 text-white py-3 rounded-lg mt-6 hover:bg-gray-700 transition"
                                >
                                    Proceed to Checkout
                                </button>

                                <button
                                    onClick={clearCart}
                                    className="w-full cursor-pointer border mt-3 py-2 rounded-lg"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
