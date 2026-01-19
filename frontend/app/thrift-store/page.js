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

  const handleBuyItem = async (itemId, sellerId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    setBuyingItemId(itemId);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKENDURL}/api/thrift/${itemId}/buy`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      fetchThriftItems();
    } catch (err) {
      setError(err.message || "Failed to purchase item");
    } finally {
      setBuyingItemId(null);
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
    <div className="min-h-screen bg-[#f7f5f2] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-black mb-3">
            Thrift Store
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Discover pre-loved treasures at great prices
          </p>
          <button
            onClick={() => router.push("/sell-item")}
            className="bg-black text-white px-6 py-3 text-sm hover:bg-gray-800 transition"
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
              className="bg-black text-white px-6 py-3 text-sm hover:bg-gray-800 transition"
            >
              List Your First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-200 hover:shadow-lg transition"
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

                  <p className="text-base font-medium text-black mb-4">
                    ₹{item.price.toFixed(2)}
                  </p>

                  <button
                    onClick={() =>
                      handleBuyItem(item._id, item.seller_id?._id)
                    }
                    disabled={buyingItemId === item._id}
                    className="w-full bg-black text-white py-2 text-sm hover:bg-gray-800 transition disabled:opacity-50"
                  >
                    {buyingItemId === item._id ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        Buy Now
                      </span>
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
