"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SellerDashboard() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return router.push("/auth/login");

            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKENDURL}/api/seller/products`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setProducts(res.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const pendingCount = products.filter((p) => p.status === "pending").length;
    const approvedCount = products.filter((p) => p.status === "approved").length;
    const rejectedCount = products.filter((p) => p.status === "rejected").length;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
                    <button
                        onClick={() => router.push("/seller/add-product")}
                        className="bg-gray-800 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition"
                    >
                        + Add New Product
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{products.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-yellow-500 text-sm font-medium">Pending</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{pendingCount}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-green-500 text-sm font-medium">Approved</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{approvedCount}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-red-500 text-sm font-medium">Rejected</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{rejectedCount}</p>
                    </div>
                </div>

                {/* Product List */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800">Your Products</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-gray-600">
                            <thead className="bg-gray-50 text-xs uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">Product Name</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Stock</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                                            No products found. Start selling today!
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 font-medium text-gray-800">
                                                {product.name}
                                            </td>
                                            <td className="px-6 py-4">₹{product.price}</td>
                                            <td className="px-6 py-4">{product.stock}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${product.status === "approved"
                                                            ? "bg-green-100 text-green-700"
                                                            : product.status === "rejected"
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                >
                                                    {product.status.charAt(0).toUpperCase() +
                                                        product.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {/* Edit/Delete Actions could go here */}
                                                <button className="text-blue-500 hover:underline text-sm mr-3">Edit</button>
                                                <button className="text-red-500 hover:underline text-sm">Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
