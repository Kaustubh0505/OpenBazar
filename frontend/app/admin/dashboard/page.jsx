"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState({ users: 0, pendingProducts: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return router.push("/auth/login");

            const [usersRes, productsRes] = await Promise.all([
                axios.get(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/admin/products/pending`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            setStats({
                users: usersRes.data.length,
                pendingProducts: productsRes.data.length,
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div
                        onClick={() => router.push("/admin/users")}
                        className="bg-white p-8 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
                    >
                        <h3 className="text-gray-500 font-medium">Total Users</h3>
                        <p className="text-4xl font-bold text-gray-800 mt-4">{stats.users}</p>
                        <p className="text-blue-500 mt-2 text-sm font-medium">Manage Users &rarr;</p>
                    </div>

                    <div
                        onClick={() => router.push("/admin/products")}
                        className="bg-white p-8 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
                    >
                        <h3 className="text-yellow-500 font-medium">Pending Approvals</h3>
                        <p className="text-4xl font-bold text-gray-800 mt-4">{stats.pendingProducts}</p>
                        <p className="text-blue-500 mt-2 text-sm font-medium">Review Products &rarr;</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
