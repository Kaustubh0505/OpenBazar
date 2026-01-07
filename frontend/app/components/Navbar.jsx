"use client";

import { ShoppingCart, User, Search, Menu, Store } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Navbar({ categories, onCategorySelect, onSearch, onCartClick }) {
  const router = useRouter();
  const { getTotalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <nav className="bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onCategorySelect(null)}
          >
            <Store className="h-8 w-8 text-white" />
            <span className="text-xl font-bold text-white hidden sm:block">
              OpenBazar
            </span>
          </div>

          {/* Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full flex">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-white pl-4 pr-10 py-2 border border-gray-500 rounded-l-lg"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <select
                onChange={(e) =>
                  onCategorySelect(e.target.value || null)
                }
                className="border border-l-0 border-gray-500 text-gray-400 cursor-pointer px-3 py-2 focus:outline-none bg-gray-800"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="bg-gray-800  text-gray-400 px-6 py-2 rounded-r-lg hover:bg-gray-900 cursor-pointer border border-gray-500 transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="hidden md:flex cursor-pointer hover:underline items-center gap-2 px-4 py-2 text-white transition-colors">
              <User className="h-5 w-5" />
              <span className="text-sm font-medium">Account</span>
            </button>

            <button
              onClick={() => router.push('/cart')}
              className="relative p-2 text-white hover:underline transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {getTotalItems()}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>

            <button className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <User className="h-5 w-5" />
              <span>My Account</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
