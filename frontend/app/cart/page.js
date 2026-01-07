"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
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
    } = useCart();

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
                    className="flex items-center gap-2 text-gray-600 hover:underline cursor-pointer mb-6 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Continue Shopping</span>
                </button>

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
                    <p className="text-gray-600">
                        {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>

                {cart.length === 0 ? (
                    // Empty Cart State
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Looks like you haven't added any items to your cart yet.
                        </p>
                        <button
                            onClick={() => router.push("/homePage")}
                            className="bg-gray-800 cursor-pointer text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    // Cart with Items
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item._id}
                                    className="bg-white rounded-lg shadow-md p-4 sm:p-6"
                                >
                                    <div className="flex gap-4">
                                        {/* Product Image */}
                                        <div
                                            className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                                            onClick={() => router.push(`/product/${item._id}`)}
                                        >
                                            <img
                                                src={item.image_url}
                                                alt={item.name}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3
                                                className="text-lg font-semibold text-gray-900 mb-1 cursor-pointer hover:text-blue-600 transition-colors truncate"
                                                onClick={() => router.push(`/product/${item._id}`)}
                                            >
                                                {item.name}
                                            </h3>

                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                {item.description}
                                            </p>

                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                {/* Price */}
                                                <div>
                                                    <p className="text-2xl font-bold text-gray-700">
                                                        ${item.price.toFixed(2)}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        ${(item.price * item.quantity).toFixed(2)} total
                                                    </p>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(item._id, item.quantity - 1)
                                                            }
                                                            className="w-8 h-8 flex items-center justify-center bg-gray-700 cursor-pointer rounded hover:bg-gray-500 transition-colors"
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </button>

                                                        <span className="font-medium text-gray-800 w-12 text-center">
                                                            {item.quantity}
                                                        </span>

                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(item._id, item.quantity + 1)
                                                            }
                                                            className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded hover:bg-gray-500 cursor-pointer transition-colors"
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </button>
                                                    </div>

                                                    {/* Remove Button */}
                                                    <button
                                                        onClick={() => removeFromCart(item._id)}
                                                        className="p-2 text-red-600 cursor-pointer hover:bg-red-50 rounded transition-colors"
                                                        title="Remove item"
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

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">
                                    Order Summary
                                </h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>${getTotalPrice().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax (estimated)</span>
                                        <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
                                    </div>
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between text-lg font-bold text-gray-900">
                                            <span>Total</span>
                                            <span className="text-gray-800">
                                                ${(getTotalPrice() * 1.1).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full bg-gray-800 cursor-pointer text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors mb-3">
                                    Proceed to Checkout
                                </button>

                                <button
                                    onClick={clearCart}
                                    className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                                >
                                    Clear Cart
                                </button>

                                {/* Savings Badge */}
                                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-sm text-green-800">
                                        <span className="font-semibold">🎉 Free Shipping!</span>
                                        <br />
                                        You're saving on shipping costs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
