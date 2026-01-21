"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Edit2, Save, X } from "lucide-react";
import { SellerNavbar } from "../../components/SellerNavbar";
import { toast } from "sonner";

export default function SellerDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Inline Stock Edit State
  const [editingStockId, setEditingStockId] = useState(null);
  const [editStockValue, setEditStockValue] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, searchQuery, filterStatus]);

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

  const applyFilters = () => {
    let result = products;

    if (searchQuery) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus === "in_stock") {
      result = result.filter((p) => p.stock > 0);
    } else if (filterStatus === "out_of_stock") {
      result = result.filter((p) => p.stock === 0);
    }

    setFilteredProducts(result);
  };

  const handleStartEditStock = (product) => {
    setEditingStockId(product._id);
    setEditStockValue(product.stock);
  };

  const handleCancelEdit = () => {
    setEditingStockId(null);
    setEditStockValue("");
  };

  const handleUpdateStock = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKENDURL}/api/products/${id}`,
        { stock: parseInt(editStockValue) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      const updatedProducts = products.map((p) =>
        p._id === id ? { ...p, stock: parseInt(editStockValue) } : p
      );
      setProducts(updatedProducts);
      setEditingStockId(null);
      toast.success("Stock updated successfully");
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Failed to update stock");
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
    <div className="min-h-screen bg-[#f7f5f2]">
      <SellerNavbar
        onSearch={setSearchQuery}
        onFilterChange={setFilterStatus}
      />

      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-black">
            Dashboard
          </h1>

          <button
            onClick={() => router.push("/seller/add-product")}
            className="flex items-center gap-2 bg-[#6e5f47] text-white px-6 py-2 hover:bg-[#938772] transition cursor-pointer rounded-md"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>


        {/* Product Table */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-lg font-medium text-black">
              Your Inventory
            </h2>
            <span className="text-sm text-gray-500">
              {filteredProducts.length} Product{filteredProducts.length !== 1 && 's'} Found
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Updates</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No products found.
                      {products.length === 0 && (
                        <button
                          onClick={() => router.push("/seller/add-product")}
                          className="ml-2 underline text-black cursor-pointer"
                        >
                          Add your first product
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr
                      key={p._id}
                      className="hover:bg-gray-50 transition"
                    >
                      {/* IMAGE CELL */}
                      <td className="px-6 py-4">
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      {/* NAME */}
                      <td className="px-6 py-4 font-semibold text-black">
                        {p.name}
                        {p.stock === 0 && (
                          <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] rounded-full uppercase tracking-wider font-bold">
                            Out of Stock
                          </span>
                        )}
                      </td>

                      {/* PRICE */}
                      <td className="px-6 py-4 font-semibold text-gray-700">
                        ₹{p.price}
                      </td>

                      {/* STOCK (Editable) */}
                      <td className="px-6 py-4 font-semibold text-gray-700">
                        {editingStockId === p._id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              className="w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-black"
                              value={editStockValue}
                              onChange={(e) => setEditStockValue(e.target.value)}
                            />
                          </div>
                        ) : (
                          <span className={p.stock === 0 ? "text-red-500 font-medium" : ""}>
                            {p.stock}
                          </span>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4">
                        {editingStockId === p._id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateStock(p._id)}
                              className="p-1 rounded bg-black text-white hover:bg-gray-800 transition cursor-pointer"
                              title="Save"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300 transition cursor-pointer"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartEditStock(p)}
                            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-black transition cursor-pointer border border-gray-200 px-3 py-1.5 rounded hover:border-gray-400"
                          >
                            <Edit2 className="h-3 w-3" />
                            Edit Stock
                          </button>
                        )}
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
