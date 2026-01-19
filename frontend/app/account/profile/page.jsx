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
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push("/homePage")}
            className="text-gray-500 hover:text-black cursor-pointer"
          >
            &larr; Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            My Profile
          </h1>
        </div>

        {/* PROFILE INFO */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Account Details
          </h2>

          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          ) : (
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
            </div>
          )}
        </div>

        {/* ADDRESSES */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700">
              Saved Addresses
            </h2>

            <button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-gray-700 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add New Address
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <div key={i} className="border rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-full mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user?.addresses?.length === 0 ? (
                <p className="text-gray-500 col-span-2 text-center py-8">
                  No addresses saved yet.
                </p>
              ) : (
                user.addresses.map(addr => (
                  <div key={addr._id} className="border rounded-lg p-4">
                    <h4 className="font-bold text-gray-800">{addr.fullName}</h4>
                    <p className="text-sm text-gray-600">{addr.street}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

}
