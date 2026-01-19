"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function UserManagement() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKENDURL}/api/admin/users`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers(res.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleBlock = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `${process.env.NEXT_PUBLIC_BACKENDURL}/api/admin/users/${id}/block`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Refresh list
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.message || "Error updating user");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => router.back()} className="text-gray-500 hover:text-black cursor-pointer">&larr; Back</button>
                    <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-gray-600">
                            <thead className="bg-gray-50 text-xs uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-800">{user.name}</td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs uppercase font-bold">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.isBlocked ? (
                                                <span className="text-red-500 font-medium text-xs">Blocked</span>
                                            ) : (
                                                <span className="text-green-500 font-medium text-xs">Active</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.role !== "admin" && (
                                                <button
                                                    onClick={() => toggleBlock(user._id)}
                                                    className={`text-xs px-3 py-1 rounded-full font-medium transition ${user.isBlocked
                                                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                        : "bg-red-100 text-red-700 hover:bg-red-200"
                                                        } cursor-pointer`}
                                                >
                                                    {user.isBlocked ? "Unblock" : "Block"}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
