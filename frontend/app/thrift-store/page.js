"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingBag, PackageX } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Navbar } from "../components/Navbar";

export default function ThriftStorePage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchThriftItems();
  }, []);

  const fetchThriftItems = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKENDURL}/api/thrift`
      );
      const data = await res.json();
      if (data.success) setItems(data.data);
      else setError("Failed to load items");
    } catch {
      setError("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5f2] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f5f2]">
      <Navbar
        categories={[]}
        onCategorySelect={() => {}}
        onSearch={() => {}}
        onCartClick={() => {}}
      />

      {/* 🔙 Back to Home */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => router.push("/homePage")}
          className="text-[#6f6451] hover:underline cursor-pointer"
        >
          ← Back to Home
        </button>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-black mb-3">
            Thrift Store
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Discover pre-loved treasures at great prices
          </p>
          <button
            onClick={() => router.push("/sell-item")}
            className="bg-[#665b49] text-white px-6 py-3 text-sm hover:bg-[#736958] transition cursor-pointer"
          >
            Sell Your Item
          </button>
        </div>

        {error && (
          <div className="text-sm text-red-600 mb-6 text-center">
            {error}
          </div>
        )}

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="text-center py-20">
            <PackageX className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">
              No items available
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Be the first to list an item
            </p>
            <button
              onClick={() => router.push("/sell-item")}
              className="bg-black text-white px-6 py-3 text-sm hover:bg-gray-800 transition cursor-pointer"
            >
              List Your First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-200 rounded-2xl hover:shadow-lg transition"
              >
                {/* Image */}
                <div className="aspect-square bg-[#f7f5f2]">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-xs uppercase text-gray-500 mb-1">
                    {item.category}
                  </p>

                  <h3 className="text-sm font-medium text-black mb-2 line-clamp-1">
                    {item.name}
                  </h3>

                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  {item.seller_id && (
                    <p className="text-xs text-gray-500 mb-3">
                      Seller: {item.seller_id.name || "Unknown"}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-base font-medium text-black">
                      ₹{item.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart({ ...item, image: item.image_url });
                    }}
                    className="w-full bg-[#f7f5f2] text-black border border-gray-200 py-2 text-sm hover:bg-[#e5e0d8] transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Add to Cart
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
