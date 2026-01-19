"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";

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
      const role = localStorage.getItem("role");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      if (role !== "seller") {
        router.push("/homePage");
        return;
      }

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKENDURL}/api/seller/products`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProducts(res.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f5f2]">
        <Loader2 className="h-10 w-10 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">

            <h1 className="text-3xl font-light text-black">
              Seller Dashboard
            </h1>
          </div>

          <button
            onClick={() => router.push("/seller/add-product")}
            className="flex items-center gap-2 bg-black text-white px-6 py-2 hover:bg-gray-800 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>


        {/* Product Table */}
        <div className="bg-white border border-gray-200">
          <div className="p-6 border-b">
            <h2 className="text-lg font-medium text-black">
              Your Products
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No products yet.
                      <button
                        onClick={() => router.push("/seller/add-product")}
                        className="ml-2 underline text-black cursor-pointer"
                      >
                        Add your first product
                      </button>
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr
                      key={p._id}
                      className="hover:bg-gray-50 transition"
                    >
                      {/* IMAGE CELL */}
                      <td className="px-6 py-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      {/* NAME */}
                      <td className="px-6 py-4 font-medium text-black">
                        {p.name}
                      </td>

                      {/* PRICE */}
                      <td className="px-6 py-4 text-gray-700">
                        ₹{p.price}
                      </td>

                      {/* STOCK */}
                      <td className="px-6 py-4 text-gray-700">
                        {p.stock}
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

/* ----------------- Helper Components ----------------- */

function StatCard({ label, value, color }) {
  const colors = {
    green: "text-green-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
  };

  return (
    <div className="bg-white border border-gray-200 p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-3xl font-semibold ${colors[color] || "text-black"} mt-2`}>
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
