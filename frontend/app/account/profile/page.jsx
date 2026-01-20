"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit2 } from "lucide-react";
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
      console.error(err);
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
    } catch (err) {
      alert(err.response?.data?.message || "Error saving address");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this address?")) return;
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
    setFormData({
      fullName: addr.fullName,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      country: addr.country,
      isDefault: addr.isDefault,
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
      isDefault: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5f2] flex items-center justify-center text-black">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2] py-10 px-4 text-black">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push("/homePage")}
            className="text-black hover:underline cursor-pointer"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl font-light text-black">
            My Profile
          </h1>
        </div>

        {/* ACCOUNT DETAILS */}
        <div className="bg-white border border-[#e6e1d8] p-6 mb-8">
          <h2 className="text-xl font-medium text-black mb-4">
            Account Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-black">Full Name</label>
              <p className="font-medium text-black">{user.name}</p>
            </div>
            <div>
              <label className="text-sm text-black">Email</label>
              <p className="font-medium text-black">{user.email}</p>
            </div>
            <div>
              <label className="text-sm text-black">Phone</label>
              <p className="font-medium text-black">{user.phone}</p>
            </div>
          </div>
        </div>

        {/* ADDRESSES */}
        <div className="bg-white border border-[#e6e1d8] p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-black">
              Saved Addresses
            </h2>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-[#6f6451] text-white px-4 py-2 flex items-center gap-2 text-sm hover:bg-[#8c8275] cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Address
            </button>
          </div>

          {showForm && (
            <motion.form
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="mb-6 border border-[#e6e1d8] p-5 bg-[#faf9f6]"
            >
              <h3 className="text-lg font-medium mb-4 text-black">
                {editingId ? "Edit Address" : "Add New Address"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["fullName", "phone", "city", "state", "pincode"].map((field) => (
                  <input
                    key={field}
                    name={field}
                    placeholder={field.replace(/([A-Z])/g, " $1")}
                    value={formData[field]}
                    onChange={handleInputChange}
                    required
                    className="border px-3 py-2 bg-white text-black focus:outline-none"
                  />
                ))}

                <input
                  name="street"
                  placeholder="Street Address"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                  className="border px-3 py-2 bg-white text-black focus:outline-none md:col-span-2"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="border px-4 py-2 text-sm cursor-pointer text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#6f6451] text-white px-5 py-2 text-sm cursor-pointer hover:bg-[#8c8275]"
                >
                  {editingId ? "Update Address" : "Save Address"}
                </button>
              </div>
            </motion.form>
          )}

          {user.addresses.length === 0 ? (
            <p className="text-center text-black py-8">
              No addresses saved yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.addresses.map((addr) => (
                <div
                  key={addr._id}
                  className="border border-[#e6e1d8] p-4"
                >
                  <h4 className="font-medium text-black">
                    {addr.fullName}
                  </h4>
                  <p className="text-sm text-black">
                    {addr.street}
                  </p>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleEdit(addr)}
                      className="text-black text-sm flex items-center gap-1 cursor-pointer hover:underline"
                    >
                      <Edit2 className="h-4 w-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(addr._id)}
                      className="text-red-600 text-sm flex items-center gap-1 cursor-pointer hover:underline"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
