"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingBag, PackageX } from "lucide-react";

export default function ThriftStorePage() {
    const router = useRouter();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [buyingItemId, setBuyingItemId] = useState(null);

    useEffect(() => {
        fetchThriftItems();
    }, []);

    const fetchThriftItems = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/thrift`);
            const data = await response.json();

            if (data.success) {
                setItems(data.data);
            } else {
                setError("Failed to load items");
            }
        } catch (error) {
            console.error("Error fetching thrift items:", error);
            setError("Failed to load items");
        } finally {
            setLoading(false);
        }
    };

    const handleBuyItem = async (itemId, sellerId) => {
        // Check if user is logged in
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login to buy items");
            router.push("/auth/login");
            return;
        }

        // Get current user ID from token (you might need to decode the JWT)
        const currentUserId = localStorage.getItem("userId");

        if (currentUserId === sellerId) {
            alert("You cannot buy your own item");
            return;
        }

        setBuyingItemId(itemId);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/thrift/${itemId}/buy`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.success) {
                alert("Item purchased successfully!");
                // Refresh the items list
                fetchThriftItems();
            } else {
                alert(data.message || "Failed to purchase item");
            }
        } catch (error) {
            console.error("Error buying item:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setBuyingItemId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading thrifted items...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Thrift Store
                    </h1>
                    <p className="text-lg text-gray-600">
                        Discover pre-loved treasures at great prices
                    </p>
                    <button
                        onClick={() => router.push("/sell-item")}
                        className="mt-4 inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Sell Your Item
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Items Grid */}
                {items.length === 0 ? (
                    <div className="text-center py-20">
                        <PackageX className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            No items available yet
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Be the first to list an item in our thrift store!
                        </p>
                        <button
                            onClick={() => router.push("/sell-item")}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            List Your First Item
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.map((item) => (
                            <div
                                key={item._id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
                                {/* Image */}
                                <div className="relative h-64 bg-gray-200">
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {item.category}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                                        {item.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {item.description}
                                    </p>

                                    {/* Seller Info */}
                                    {item.seller_id && (
                                        <p className="text-xs text-gray-500 mb-3">
                                            Seller: {item.seller_id.name || "Unknown"}
                                        </p>
                                    )}

                                    {/* Price */}
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-2xl font-bold text-gray-900">
                                            ₹{item.price.toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Buy Button */}
                                    <button
                                        onClick={() => handleBuyItem(item._id, item.seller_id?._id)}
                                        disabled={buyingItemId === item._id}
                                        className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {buyingItemId === item._id ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingBag className="w-4 h-4" />
                                                Buy Now
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
