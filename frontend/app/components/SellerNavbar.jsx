"use client";

import { useState } from "react";
import { Search, User, LogOut, LayoutDashboard, Store } from "lucide-react";
import { useRouter } from "next/navigation";

export function SellerNavbar({ onSearch, onFilterChange }) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        onSearch(value);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo & Brand */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/seller/dashboard")}>
                        <Store className="h-6 w-6 text-black" />
                        <span className="text-xl font-semibold text-black">Seller Center</span>
                    </div>

                    {/* Search & Filter */}
                    <div className="flex-1 max-w-xl mx-8 hidden md:flex items-center gap-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search your products..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black transition-colors"
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>

                        <select
                            onChange={(e) => onFilterChange(e.target.value)}
                            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-black focus:border-black block p-2.5 cursor-pointer"
                        >
                            <option value="all">All Items</option>
                            <option value="in_stock">In Stock</option>
                            <option value="out_of_stock">Out of Stock</option>
                        </select>
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                    <User className="h-5 w-5 text-gray-600" />
                                </div>
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                                    <button
                                        onClick={() => router.push("/seller/dashboard")}
                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <LayoutDashboard className="h-4 w-4" />
                                        Dashboard
                                    </button>

                                    <button
                                        onClick={() => {
                                            localStorage.removeItem("token");
                                            localStorage.removeItem("role");
                                            router.push("/auth/login");
                                        }}
                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 border-t border-gray-100"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
