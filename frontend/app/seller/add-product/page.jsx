"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Upload, ImagePlus, Loader2 } from "lucide-react";

export default function AddProduct() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    stock: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKENDURL}/api/categories`
      );
      setCategories(res.data || []);
    } catch {
      setError("Failed to load categories");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const uploadToCloudinary = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", "thrift_upload");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_CLOUDINARYAPI}`,
      { method: "POST", body: fd }
    );

    const data = await res.json();
    if (!res.ok) throw new Error("Image upload failed");
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!imageFile) return setError("Please upload an image");
    if (+formData.price <= 0) return setError("Price must be greater than 0");
    if (+formData.stock < 0) return setError("Stock cannot be negative");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login again");
      router.push("/auth/login");
      return;
    }

    setLoading(true);

    try {
      const imageUrl = await uploadToCloudinary(imageFile);

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDURL}/api/products`,
        { ...formData, image_url: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      router.push("/seller/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-2xl p-8 rounded-xl shadow-sm">
        <h1 className="text-2xl font-light text-black mb-6">
          Add New Product
        </h1>

        {error && (
          <p className="text-sm text-red-600 mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image */}
          <label className="block border-2 border-dashed border-gray-300 rounded-lg h-48 cursor-pointer bg-gray-50 hover:bg-gray-100">
            {imagePreview ? (
              <img src={imagePreview} className="w-full h-full object-contain" />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <ImagePlus className="h-10 w-10 mb-2" />
                Click to upload image
              </div>
            )}
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </label>

          <input
            name="name"
            placeholder="Product name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          />

          <textarea
            name="description"
            placeholder="Description"
            required
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="price"
              placeholder="Price"
              required
              value={formData.price}
              onChange={handleChange}
              className="border px-4 py-2 rounded-lg"
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              required
              value={formData.stock}
              onChange={handleChange}
              className="border px-4 py-2 rounded-lg"
            />
          </div>

          <select
            name="category_id"
            required
            value={formData.category_id}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 text-gray-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-6 py-2 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
