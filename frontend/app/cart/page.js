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
                onSearch={() => {}}
                onCartClick={() => {}}
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
                    <p className="text-gray-600">
                        {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
                    </p>
                </div>

                {cart.length === 0 ? (
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
                            className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600"
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
                                                router.push(`/product/${item.product}`)
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
                                                className="text-lg font-semibold cursor-pointer"
                                                onClick={() =>
                                                    router.push(`/product/${item.product}`)
                                                }
                                            >
                                                {item.name}
                                            </h3>

                                            <div className="flex justify-between items-center mt-4">
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
                                                                item.product,
                                                                item.quantity - 1
                                                            )
                                                        }
                                                        className="w-8 h-8 bg-gray-700 text-white rounded"
                                                    >
                                                        <Minus className="h-4 w-4 mx-auto" />
                                                    </button>

                                                    <span className="w-10 text-center">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.product,
                                                                item.quantity + 1
                                                            )
                                                        }
                                                        className="w-8 h-8 bg-gray-700 text-white rounded"
                                                    >
                                                        <Plus className="h-4 w-4 mx-auto" />
                                                    </button>

                                                    {/* Remove */}
                                                    <button
                                                        onClick={() =>
                                                            removeFromCart(item.product)
                                                        }
                                                        className="p-2 text-red-600"
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
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
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

                                <button className="w-full bg-gray-800 text-white py-3 rounded-lg mt-6">
                                    Proceed to Checkout
                                </button>

                                <button
                                    onClick={clearCart}
                                    className="w-full border mt-3 py-2 rounded-lg"
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
