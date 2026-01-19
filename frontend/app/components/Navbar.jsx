"use client";

import { ShoppingCart, User, Search, Menu, Store } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Navbar({ categories = [], onCategorySelect, onSearch, onCartClick }) {
  const router = useRouter();
  const { getTotalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#f7f5f2] border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => {
              onCategorySelect(null);
              router.push("/homePage");
            }}
          >
            <Store className="h-7 w-7 text-black" />
            <span className="text-xl font-semibold text-black hidden sm:block">
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
                  className="w-full bg-transparent text-black placeholder-gray-400 pl-2 pr-10 py-2 border-b border-gray-400 focus:outline-none focus:border-black"
                />
                <Search className="absolute right-1 top-2.5 h-4 w-4 text-gray-600" />
              </div>

              <select
                onChange={(e) => onCategorySelect(e.target.value || null)}
                className="ml-6 bg-transparent border-b border-gray-400 text-sm text-black cursor-pointer focus:outline-none"
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
                className="ml-6 text-sm font-medium text-black hover:text-gray-700 transition-colors cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">

            {/* Account Dropdown */}
            <div className="hidden md:flex relative group">
              <button className="flex items-center gap-2 text-black hover:text-gray-700 transition-colors cursor-pointer">
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">Account</span>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-3 w-52 bg-white border border-gray-200 shadow-lg rounded-sm hidden group-hover:block">
                {!mounted || !localStorage.getItem("token") ? (
                  <>
                    <button
                      onClick={() => router.push("/auth/login")}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left cursor-pointer"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => router.push("/auth/signup")}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left cursor-pointer"
                    >
                      Sign Up
                    </button>
                    <button
                      onClick={() => router.push("/auth/signup")}
                      className="block px-4 py-2 text-sm font-semibold text-black hover:bg-gray-100 w-full text-left border-t cursor-pointer"
                    >
                      Sell on OpenBazar
                    </button>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-2 text-xs text-gray-500 border-b">
                      Hello, User
                    </div>

                    <button
                      onClick={() => router.push("/account/profile")}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left cursor-pointer"
                    >
                      My Profile
                    </button>

                    {localStorage.getItem("role") === "seller" && (
                      <button
                        onClick={() => router.push("/seller/dashboard")}
                        className="block px-4 py-2 text-sm text-black hover:bg-gray-100 w-full text-left cursor-pointer"
                      >
                        Seller Dashboard
                      </button>
                    )}

                    {localStorage.getItem("role") === "admin" && (
                      <button
                        onClick={() => router.push("/admin/dashboard")}
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left cursor-pointer"
                      >
                        Admin Panel
                      </button>
                    )}

                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("role");
                        router.push("/auth/login");
                      }}
                      className="block px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 w-full text-left border-t cursor-pointer"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Cart */}
            <button
              onClick={() => {
                onCartClick?.();
                router.push("/cart");
              }}
              className="relative cursor-pointer"
            >
              <ShoppingCart className="h-6 w-6 text-black" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Mobile Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden cursor-pointer"
            >
              <Menu className="h-6 w-6 text-black" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            <form onSubmit={handleSearch} className="mb-3 mt-3">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </form>

            <button
              onClick={() => router.push("/account/profile")}
              className="flex items-center gap-2 w-full px-4 py-2 text-black hover:bg-gray-100 rounded-md cursor-pointer"
            >
              <User className="h-5 w-5" />
              <span>My Account</span>
            </button>

            {mounted && localStorage.getItem("token") && (
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("role");
                  router.push("/auth/login");
                }}
                className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 rounded-md cursor-pointer"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
