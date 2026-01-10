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
        if (params?.id) {
            fetchProduct();
        }
    }, [params?.id]);

    const fetchProduct = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `http://localhost:5001/api/products/${params.id}`
            );
            const data = await response.json();
            setProduct(data);
        } catch (error) {
            console.error("Error fetching product:", error);
        }
        setIsLoading(false);
    };

    const handleAddToCart = async () => {
        if (!product) return;
    
        setIsAdding(true);
    
        await addToCart(product, quantity);
    
        setIsAdding(false);
    };
    

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar categories={[]} onCategorySelect={() => { }} onSearch={() => { }} onCartClick={() => { }} />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar categories={[]} onCategorySelect={() => { }} onSearch={() => { }} onCartClick={() => { }} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Product Not Found
                        </h2>
                        <button
                            onClick={() => router.push("/homePage")}
                            className="text-gray-600 hover:underline"
                        >
                            Go back to shop
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar
                categories={[]}
                onCategorySelect={() => router.push("/homePage")}
                onSearch={() => { }}
            />

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Back Button */}
                <button
                    onClick={() => router.push("/homePage")}
                    className="flex items-center gap-2 text-gray-600 hover:underline cursor-pointer mb-6 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Back to Products</span>
                </button>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
                        {/* Product Image */}
                        <div className="aspect-square overflow-hidden bg-gray-100 rounded-lg">
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Product Info */}
                        <div>
                            {/* Category Badge */}
                            <div className="mb-3">
                                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                                    {typeof product.category_id === 'object'
                                        ? product.category_id.name
                                        : 'Uncategorized'}
                                </span>
                            </div>

                            {/* Product Name */}
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < Math.floor(product.rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-gray-600">({product.rating})</span>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <span className="text-3xl font-bold text-gray-700">
                                    ${product.price.toFixed(2)}
                                </span>
                            </div>

                            {/* Stock Status */}
                            <div className="mb-6">
                                {product.stock > 0 ? (
                                    <p className="text-green-600 font-medium">
                                        ✓ In Stock ({product.stock} available)
                                    </p>
                                ) : (
                                    <p className="text-red-600 font-medium">✗ Out of Stock</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Description
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Quantity Selector */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantity
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 border border-gray-800 text-gray-800 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors"
                                        disabled={quantity <= 1}
                                    >
                                        −
                                    </button>
                                    <span className="text-lg text-gray-800 font-medium w-12 text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="w-10 h-10 border text-gray-800 border-gray-800 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors"
                                        disabled={quantity >= product.stock}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0 || isAdding}
                                className={`w-full flex cursor-pointer items-center justify-center gap-3 py-4 rounded-lg font-semibold text-lg transition-all ${product.stock === 0
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : isAdding
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-800 text-white hover:bg-gray-700 active:scale-95"
                                    }`}
                            >
                                <ShoppingCart className="h-6 w-6" />
                                {isAdding
                                    ? "Added to Cart!"
                                    : product.stock === 0
                                        ? "Out of Stock"
                                        : "Add to Cart"}
                            </button>

                            {/* Product Details */}
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Product Details
                                </h3>
                                <dl className="space-y-3">
                                    <div className="flex justify-between">
                                        <dt className="text-gray-600">Product ID</dt>
                                        <dd className="text-gray-900 font-medium">
                                            {product._id.slice(-8).toUpperCase()}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-gray-600">Category</dt>
                                        <dd className="text-gray-900 font-medium">
                                            {typeof product.category_id === 'object'
                                                ? product.category_id.name
                                                : 'Uncategorized'}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-gray-600">Stock</dt>
                                        <dd className="text-gray-900 font-medium">
                                            {product.stock} units
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-gray-600">Rating</dt>
                                        <dd className="text-gray-900 font-medium">
                                            {product.rating} / 5.0
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
