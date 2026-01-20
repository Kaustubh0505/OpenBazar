"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit2, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    isDefault: false,
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
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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

      setUser((prev) => ({ ...prev, addresses: res.data.addresses }));
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
      setUser((prev) => ({ ...prev, addresses: res.data.addresses }));
    } catch {
      alert("Error deleting address");
    }
  };

  const handleEdit = (addr) => {
    setFormData({ ...addr });
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
      isDefault: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5f2] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#f7f5f2] py-10 px-4"
    >
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={() => router.push("/homePage")}
            className="text-[#6f6451] hover:underline cursor-pointer"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl font-light text-gray-900">
            My Profile
          </h1>
        </motion.div>

        {/* ACCOUNT DETAILS */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-[#e6e1d8] p-6 mb-8"
        >
          <h2 className="text-xl font-medium text-gray-900 mb-4">
            Account Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#8c8275]">Full Name</label>
              <p className="font-medium text-gray-900">{user?.name}</p>
            </div>
            <div>
              <label className="text-sm text-[#8c8275]">Email</label>
              <p className="font-medium text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm text-[#8c8275]">Phone</label>
              <p className="font-medium text-gray-900">{user?.phone}</p>
            </div>
          </div>
        </motion.div>

        {/* ADDRESSES */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-[#e6e1d8] p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-900">
              Saved Addresses
            </h2>

            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-[#6f6451] text-white px-4 py-2 flex items-center gap-2 text-sm hover:bg-[#8c8275] transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add New Address
            </button>
          </div>

          {user?.addresses?.length === 0 ? (
            <p className="text-[#6f6451] text-center py-8">
              No addresses saved yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.addresses.map((addr) => (
                <motion.div
                  key={addr._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-[#e6e1d8] p-4"
                >
                  <h4 className="font-medium text-gray-900">
                    {addr.fullName}
                  </h4>
                  <p className="text-sm text-[#6f6451]">{addr.street}</p>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleEdit(addr)}
                      className="text-[#6f6451] hover:underline text-sm cursor-pointer flex items-center gap-1"
                    >
                      <Edit2 className="h-4 w-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(addr._id)}
                      className="text-red-600 hover:underline text-sm cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
