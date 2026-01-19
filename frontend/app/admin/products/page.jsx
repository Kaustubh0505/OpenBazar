"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ProductApproval() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKENDURL}/api/admin/products/pending`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setProducts(res.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `${process.env.NEXT_PUBLIC_BACKENDURL}/api/admin/products/${id}/${action}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Refresh list
            fetchProducts();
        } catch (error) {
            alert(error.response?.data?.message || `Error ${action}ing product`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => router.back()} className="text-gray-500 hover:text-black cursor-pointer">&larr; Back</button>
                    <h1 className="text-3xl font-bold text-gray-800">Product Approvals</h1>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-gray-600">
                            <thead className="bg-gray-50 text-xs uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">Product Name</th>
                                    <th className="px-6 py-4">Seller</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Description</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                                            No pending products.
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 font-medium text-gray-800">
                                                <div className="flex items-center gap-3">
                                                    <img src={product.image_url} alt="" className="w-10 h-10 rounded object-cover bg-gray-200" />
                                                    {product.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">{product.seller_id?.name || "Unknown"}</td>
                                            <td className="px-6 py-4">₹{product.price}</td>
                                            <td className="px-6 py-4 text-sm max-w-xs truncate" title={product.description}>
                                                {product.description}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleAction(product._id, "approve")}
                                                        className="bg-green-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-600 transition cursor-pointer"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(product._id, "reject")}
                                                        className="bg-red-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-600 transition cursor-pointer"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
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
