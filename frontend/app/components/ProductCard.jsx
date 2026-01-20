"use client";

import { Star, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export function ProductCard({ product }) {
  const router = useRouter();
  const { addToCart } = useCart();

  const [isAdding, setIsAdding] = useState(false);
  const addingRef = useRef(false); // 🔒 prevents double add

  /* ================= ADD TO CART ================= */
  const handleAddToCart = async (e) => {
    e.preventDefault();     // ✅ prevents form/default behavior
    e.stopPropagation();    // ✅ prevents card click navigation

    if (addingRef.current) return; // 🔒 hard block
    addingRef.current = true;

    try {
      setIsAdding(true);
      await addToCart(product); // ✅ cart context call

      setTimeout(() => {
        setIsAdding(false);
        addingRef.current = false;
      }, 1500);
    } catch {
      setIsAdding(false);
      addingRef.current = false;
    }
  };

  /* ================= CARD NAVIGATION ================= */
  const handleCardClick = () => {
    router.push(`/product/${product._id}`);
  };

  return (
    <div
      onClick={handleCardClick}   // ✅ navigate to product page
      className="
        group bg-white rounded-sm overflow-hidden cursor-pointer
        border border-gray-200
        hover:shadow-lg transition-all duration-300
      "
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#f7f5f2]">
        <img
          src={product.image_url}
          alt={product.name}
          className="
            w-full h-full object-cover
            transition-transform duration-500
            group-hover:scale-105
          "
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Product Name */}
        <h3 className="text-sm font-bold text-black leading-snug line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${i < Math.floor(product.rating)
                  ? "fill-black text-black"
                  : "text-gray-300"
                }`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">
            {product.rating}
          </span>
        </div>

        {/* Price & Stock */}
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-black">
          ₹{product.price.toFixed(2)}
          </span>
          <span
            className={`text-xs ${product.stock > 0
                ? "text-gray-500"
                : "text-red-500"
              }`}
          >
            {product.stock > 0
              ? `${product.stock} in stock`
              : "Out of stock"}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}   // ✅ does NOT trigger card click
          disabled={product.stock === 0 || isAdding}
          className={`
            w-full flex items-center justify-center gap-2
            py-2 text-sm font-medium tracking-wide
            cursor-pointer
            border-gray-400
            transition-all duration-300
            ${product.stock === 0
              ? ""
              : isAdding
                ? "bg-[#f7f5f2] text-black"
                : "bg-[#f7f5f2] text-black hover:bg-[#d2cac0]"
            }
          `}
        >
          <ShoppingCart className="h-4 w-4" />
          {isAdding
            ? "Added"
            : product.stock === 0
              ? "Out of Stock"
              : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
