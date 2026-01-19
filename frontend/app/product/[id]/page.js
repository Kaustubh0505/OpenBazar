"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Star, ShoppingCart, ArrowLeft, Loader2 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params?.id) fetchProduct();
  }, [params?.id]);

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKENDURL}/api/products/${params.id}`
      );
      const data = await res.json();
      setProduct(data);
    } catch {
      setProduct(null);
    }
    setIsLoading(false);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setIsAdding(true);
      await addToCart(product, quantity);
      setTimeout(() => setIsAdding(false), 1500);
    } catch {
      setIsAdding(false);
    }
  };

  /* ================= LOADING ================= */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7f5f2] flex flex-col">
        <Navbar categories={[]} onCategorySelect={() => { }} onSearch={() => { }} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-black" />
        </div>
      </div>
    );
  }

  /* ================= NOT FOUND ================= */
  if (!product) {
    return (
      <div className="min-h-screen bg-[#f7f5f2] flex flex-col">
        <Navbar categories={[]} onCategorySelect={() => { }} onSearch={() => { }} />
        <div className="flex-1 flex items-center justify-center text-center">
          <div>
            <h2 className="text-2xl font-light text-black mb-3">
              Product Not Found
            </h2>
            <button
              onClick={() => router.push("/homePage")}
              className="text-sm text-gray-600 underline cursor-pointer"
            >
              Back to products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2] flex flex-col">
      <Navbar
        categories={[]}
        onCategorySelect={() => router.push("/homePage")}
        onSearch={() => { }}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Back */}
        <button
          onClick={() => router.push("/homePage")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-8 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </button>

        <div className="bg-white border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6 md:p-10">

            {/* Image */}
            <div className="aspect-square bg-[#f7f5f2]">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div>
              {/* Category */}
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                {typeof product.category_id === "object"
                  ? product.category_id.name
                  : "Uncategorized"}
              </p>

              {/* Name */}
              <h1 className="text-3xl font-light text-black mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating)
                        ? "fill-black text-black"
                        : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating}
                </span>
              </div>

              {/* Price */}
              <p className="text-2xl font-medium text-black mb-6">
                ${product.price.toFixed(2)}
              </p>

              {/* Stock */}
              <p
                className={`text-sm mb-6 ${product.stock > 0
                  ? "text-gray-600"
                  : "text-red-500"
                  }`}
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </p>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-black mb-2">
                  Description
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <label className="block text-sm text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setQuantity(Math.max(1, quantity - 1))
                    }
                    disabled={quantity <= 1}
                    className="h-9 w-9 border border-gray-300 hover:border-black disabled:opacity-40 cursor-pointer"
                  >
                    −
                  </button>

                  <span className="w-10 text-center text-sm font-medium">
                    {quantity}
                  </span>

                  <button
                    onClick={() =>
                      setQuantity(
                        Math.min(product.stock, quantity + 1)
                      )
                    }
                    disabled={quantity >= product.stock}
                    className="h-9 w-9 border border-gray-300 hover:border-black disabled:opacity-40 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAdding}
                className={`w-full flex items-center justify-center gap-3 py-3 text-sm font-medium transition cursor-pointer ${product.stock === 0
                  ? "bg-gray-200 text-gray-500"
                  : isAdding
                    ? "bg-black text-white"
                    : "bg-black text-white hover:bg-gray-800"
                  }`}
              >
                <ShoppingCart className="h-4 w-4" />
                {isAdding
                  ? "Added to Cart"
                  : product.stock === 0
                    ? "Out of Stock"
                    : "Add to Cart"}
              </button>

              {/* Details */}
              <div className="mt-10 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-medium text-black mb-4">
                  Product Details
                </h3>

                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Product ID</dt>
                    <dd className="text-black font-medium">
                      {product._id.slice(-8).toUpperCase()}
                    </dd>
                  </div>

                  <div className="flex justify-between">
                    <dt className="text-gray-600">Category</dt>
                    <dd className="text-black font-medium">
                      {typeof product.category_id === "object"
                        ? product.category_id.name
                        : "Uncategorized"}
                    </dd>
                  </div>

                  <div className="flex justify-between">
                    <dt className="text-gray-600">Stock</dt>
                    <dd className="text-black font-medium">
                      {product.stock}
                    </dd>
                  </div>

                  <div className="flex justify-between">
                    <dt className="text-gray-600">Rating</dt>
                    <dd className="text-black font-medium">
                      {product.rating} / 5
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
