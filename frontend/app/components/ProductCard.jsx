"use client";

import { Star, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useState,useRef } from "react";
import { useRouter } from "next/navigation";

export function ProductCard({ product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);


  const addingRef = useRef(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();     // ✅ stop default behavior
    e.stopPropagation();    // ✅ stop bubbling
  
    if (addingRef.current) return; // 🔒 HARD BLOCK
    addingRef.current = true;
  
    try {
      setIsAdding(true);
      await addToCart(product); // ✅ ONE CALL ONLY
    } finally {
      setIsAdding(false);
      setTimeout(() => {
        addingRef.current = false;
      }, 300);
    }
  };

  const handleCardClick = () => {
    router.push(`/product/${product._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 h-14">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < Math.floor(product.rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
                }`}
            />
          ))}
          <span className="text-sm text-gray-600 ml-1">
            ({product.rating})
          </span>
        </div>

        {/* Price & Stock */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-gray-700">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">
            {product.stock > 0
              ? `${product.stock} in stock`
              : "Out of stock"}
          </span>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAdding}
          className={`w-full flex items-center cursor-pointer justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors ${product.stock === 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : isAdding
              ? "bg-blue-900 text-white"
              : "bg-gray-800 text-white hover:bg-gray-600"
            }`}
        >
          <ShoppingCart className="h-4 w-4" />
          {isAdding
            ? "Added!"
            : product.stock === 0
              ? "Out of Stock"
              : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
