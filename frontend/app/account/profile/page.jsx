"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit2, MapPin } from "lucide-react";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        isDefault: false
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return router.push("/auth/login");

            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKENDURL}/api/user/profile`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(res.data);
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            let res;

            if (editingId) {
                res = await axios.put(
                    `${process.env.NEXT_PUBLIC_BACKENDURL}/api/user/address/${editingId}`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                res = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKENDURL}/api/user/address`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            // Update local user addresses
            setUser(prev => ({ ...prev, addresses: res.data.addresses }));
            resetForm();
        } catch (error) {
            alert(error.response?.data?.message || "Error saving address");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this address?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await axios.delete(
                `${process.env.NEXT_PUBLIC_BACKENDURL}/api/user/address/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(prev => ({ ...prev, addresses: res.data.addresses }));
        } catch (error) {
            alert("Error deleting address");
        }
    };

    const handleEdit = (addr) => {
        setFormData({
            fullName: addr.fullName,
            phone: addr.phone,
            street: addr.street,
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
            country: addr.country,
            isDefault: addr.isDefault
        });
        setEditingId(addr._id);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            fullName: "",
            phone: "",
            street: "",
            city: "",
            state: "",
            pincode: "",
            country: "India",
            isDefault: false
        });
        setEditingId(null);
        setShowForm(false);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

                {/* Profile Info */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Account Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-500">Full Name</label>
                            <p className="font-medium text-gray-800">{user?.name}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Email</label>
                            <p className="font-medium text-gray-800">{user?.email}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Phone</label>
                            <p className="font-medium text-gray-800">{user?.phone}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Role</label>
                            <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs font-bold uppercase text-gray-600">
                                {user?.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Addresses */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-700">Saved Addresses</h2>
                        <button
                            onClick={() => { resetForm(); setShowForm(true); }}
                            className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-gray-700 transition"
                        >
                            <Plus className="w-4 h-4" /> Add New Address
                        </button>
                    </div>

                    {showForm && (
                        <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
                            <h3 className="font-semibold mb-4">{editingId ? "Edit Address" : "New Address"}</h3>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} className="p-2 border rounded" required />
                                <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} className="p-2 border rounded" required />
                                <input name="street" placeholder="Street Address" value={formData.street} onChange={handleInputChange} className="p-2 border rounded md:col-span-2" required />
                                <input name="city" placeholder="City" value={formData.city} onChange={handleInputChange} className="p-2 border rounded" required />
                                <input name="state" placeholder="State" value={formData.state} onChange={handleInputChange} className="p-2 border rounded" required />
                                <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleInputChange} className="p-2 border rounded" required />
                                <input name="country" placeholder="Country" value={formData.country} onChange={handleInputChange} className="p-2 border rounded" required />

                                <div className="md:col-span-2 flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isDefault"
                                        name="isDefault"
                                        checked={formData.isDefault}
                                        onChange={handleInputChange}
                                        className="h-4 w-4"
                                    />
                                    <label htmlFor="isDefault" className="text-sm text-gray-700">Set as default address</label>
                                </div>

                                <div className="md:col-span-2 flex gap-3 mt-2">
                                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Save Address</button>
                                    <button type="button" onClick={resetForm} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user?.addresses?.length === 0 ? (
                            <p className="text-gray-500 text-center col-span-2 py-8">No addresses saved yet.</p>
                        ) : (
                            user?.addresses?.map((addr) => (
                                <div key={addr._id} className="border border-gray-200 rounded-lg p-4 relative hover:shadow-md transition">
                                    {addr.isDefault && (
                                        <span className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Default</span>
                                    )}
                                    <h4 className="font-bold text-gray-800">{addr.fullName}</h4>
                                    <p className="text-gray-600 text-sm mt-1">{addr.street}</p>
                                    <p className="text-gray-600 text-sm">{addr.city}, {addr.state} - {addr.pincode}</p>
                                    <p className="text-gray-600 text-sm">{addr.country}</p>
                                    <p className="text-gray-600 text-sm mt-2 flex items-center gap-1">
                                        <span className="font-medium">Phone:</span> {addr.phone}
                                    </p>

                                    <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100">
                                        <button onClick={() => handleEdit(addr)} className="text-blue-600 text-sm flex items-center gap-1 hover:underline">
                                            <Edit2 className="w-3 h-3" /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(addr._id)} className="text-red-500 text-sm flex items-center gap-1 hover:underline">
                                            <Trash2 className="w-3 h-3" /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
