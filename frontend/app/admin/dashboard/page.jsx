"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState({ users: 0, orders: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return router.push("/auth/login");

            const [usersRes, productsRes, ordersRes] = await Promise.all([
                axios.get(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/admin/products/pending`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/orders/admin/all`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            setStats({
                users: usersRes.data.length,
                pendingProducts: productsRes.data.length,
                orders: ordersRes.data.length
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
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.push("/homePage")}
                        className="text-gray-500 hover:text-black cursor-pointer"
                    >
                        &larr; Back to Home
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div
                        onClick={() => router.push("/admin/users")}
                        className="bg-white p-8 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
                    >
                        <h3 className="text-gray-500 font-medium">Total Users</h3>
                        <p className="text-4xl font-bold text-gray-800 mt-4">{stats.users}</p>
                        <p className="text-blue-500 mt-2 text-sm font-medium">Manage Users &rarr;</p>
                    </div>


                    <div
                        onClick={() => router.push("/admin/orders")}
                        className="bg-white p-8 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
                    >
                        <h3 className="text-green-500 font-medium">Total Orders</h3>
                        <p className="text-4xl font-bold text-gray-800 mt-4">{stats.orders}</p>
                        <p className="text-blue-500 mt-2 text-sm font-medium">Manage Orders &rarr;</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
