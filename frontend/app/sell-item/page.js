"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, ImagePlus, Loader2, X } from "lucide-react";

export default function SellItemPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "thrift_upload");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_CLOUDINARYAPI}`,
      { method: "POST", body: data }
    );

    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message);
    return json.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      return setError("Please fill in all fields");
    }

    if (!imageFile) return setError("Please upload a product image");
    if (parseFloat(formData.price) <= 0) return setError("Price must be greater than 0");

    setLoading(true);

    try {
      const imageUrl = await uploadToCloudinary(imageFile);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to sell items");
        setTimeout(() => router.push("/auth/login"), 2000);
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKENDURL}/api/thrift`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            price: parseFloat(formData.price),
            image_url: imageUrl,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      setSuccess("Item listed successfully!");
      setFormData({ name: "", description: "", price: "", category: "" });
      setImageFile(null);
      setImagePreview(null);

      setTimeout(() => router.push("/thrift-store"), 2000);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-start mb-4">
            <button
              onClick={() => router.push("/thrift-store")}
              className="text-gray-500 hover:text-black cursor-pointer"
            >
              &larr; Back to Thrift Store
            </button>
          </div>
          <h1 className="text-3xl font-light text-black mb-2">
            Sell Your Item
          </h1>
          <p className="text-sm text-gray-600">
            List your pre-loved items and give them a new home
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-200 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Product Image
              </label>

              <label className="flex items-center justify-center h-64 border border-dashed border-gray-300 cursor-pointer bg-[#fafafa] hover:border-black transition">
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 bg-black text-white p-1 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <ImagePlus className="h-10 w-10 mx-auto mb-3" />
                    <p className="text-sm">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs mt-1">
                      JPG, PNG (max 10MB)
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {/* Inputs */}
            {["name", "price"].map((field) => (
              <input
                key={field}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                placeholder={field === "name" ? "Product Name" : "Price"}
                type={field === "price" ? "number" : "text"}
                className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-black"
              />
            ))}

            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the item condition and details"
              className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-black"
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-black"
            >
              <option value="">Select Category</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Home & Garden</option>
              <option>Sports</option>
              <option>Books</option>
              <option>Toys</option>
              <option>Other</option>
            </select>

            {/* Messages */}
            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}
            {success && (
              <div className="text-sm text-green-600">{success}</div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-black text-white py-3 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Upload className="h-4 w-4" />
                    List Item
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push("/homePage")}
                className="border border-gray-300 px-6 py-3 text-sm hover:border-black transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
