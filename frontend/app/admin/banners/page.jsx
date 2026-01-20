"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Trash, Upload, Image as ImageIcon, Loader2 } from "lucide-react";

export default function BannerManagement() {
    const router = useRouter();
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/banners`);
            setBanners(res.data || []);
        } catch (error) {
            console.error("Error fetching banners:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleUpload = async () => {
        if (!imageFile) return;
        setUploading(true);

        try {
            // 1. Upload to Cloudinary
            const fd = new FormData();
            fd.append("file", imageFile);
            fd.append("upload_preset", "thrift_upload"); // Reuse existing preset

            const uploadRes = await fetch(
                `${process.env.NEXT_PUBLIC_CLOUDINARYAPI}`,
                { method: "POST", body: fd }
            );
            const data = await uploadRes.json();

            if (!uploadRes.ok) throw new Error("Upload failed");
            const imageUrl = data.secure_url;

            // 2. Save to Backend
            const token = localStorage.getItem("token");
            await axios.post(
                `${process.env.NEXT_PUBLIC_BACKENDURL}/api/banners`,
                { image_url: imageUrl, order: banners.length + 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Reset and refresh
            setImageFile(null);
            setPreview(null);
            fetchBanners();

        } catch (error) {
            console.error("Error uploading banner:", error);
            alert("Failed to upload banner");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this banner?")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `${process.env.NEXT_PUBLIC_BACKENDURL}/api/banners/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchBanners();
        } catch (error) {
            console.error("Error deleting banner:", error);
            alert("Failed to delete banner");
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
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.push("/admin/dashboard")}
                        className="text-gray-500 hover:text-black cursor-pointer"
                    >
                        &larr; Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">Manage Banners</h1>
                </div>

                {/* Upload Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                    <h2 className="text-lg font-medium mb-4">Add New Banner</h2>
                    <div className="flex items-start gap-6">
                        <div className="w-64 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden relative">
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                                    <span className="text-sm">Click to select</span>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-gray-500">
                                Recommended size: 1920x600px. <br />
                                Supported formats: JPG, PNG, WEBP.
                            </p>
                            <button
                                onClick={handleUpload}
                                disabled={!imageFile || uploading}
                                className="bg-black text-white px-6 py-2 rounded-lg flex items-center gap-2 w-fit mt-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition"
                            >
                                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                {uploading ? "Uploading..." : "Upload Banner"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Banner List */}
                <div className="grid grid-cols-1 gap-6">
                    {banners.length === 0 ? (
                        <p className="text-center text-gray-500 py-10">No banners uploaded yet.</p>
                    ) : (
                        banners.map((banner, index) => (
                            <div key={banner._id} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-6 group">
                                <span className="text-gray-400 font-mono">#{index + 1}</span>
                                <div className="w-48 h-24 bg-gray-100 rounded-lg overflow-hidden">
                                    <img src={banner.image_url} alt="Banner" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">Uploaded on {new Date(banner.createdAt).toLocaleDateString()}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(banner._id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                                >
                                    <Trash className="h-5 w-5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
