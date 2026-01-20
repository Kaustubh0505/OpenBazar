"use client";

import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Sidebar } from "../components/Sidebar";
import { ProductCard } from "../components/ProductCard";
import { Pagination } from "../components/Pagination";
import { HeroSlider } from "../components/HeroSlider";
import { OurPolicy } from "../components/OurPolicy";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const PRODUCTS_PER_PAGE = 12;

function App() {
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, searchQuery, allProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKENDURL}/api/categories`
      );
      const data = await res.json();
      setCategories(data || []);
    } catch {
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKENDURL}/api/products`
      );
      const data = await res.json();
      setAllProducts(data || []);
    } catch {
      setAllProducts([]);
    }
    setIsLoading(false);
  };

  const filterProducts = () => {
    let filtered = [...allProducts];

    if (selectedCategory) {
      filtered = filtered.filter((p) => {
        const categoryId =
          typeof p.category_id === "object"
            ? p.category_id._id
            : p.category_id;
        return categoryId === selectedCategory;
      });
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  };

  const totalPages = Math.ceil(
    filteredProducts.length / PRODUCTS_PER_PAGE
  );

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;

  const currentProducts = filteredProducts.slice(
    startIndex,
    endIndex
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen flex flex-col bg-[#f7f5f2]"
    >
      <Navbar
        categories={categories}
        onCategorySelect={setSelectedCategory}
        onSearch={setSearchQuery}
        onCartClick={() => {}}
      />

      {/* Hero Section */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="w-full"
      >
        <HeroSlider />
      </motion.div>

      {/* Main Content */}
      <motion.main
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10"
      >
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <motion.aside
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:w-64"
          >
            <Sidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </motion.aside>

          {/* Products */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex-1"
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-10 w-10 animate-spin text-black" />
              </div>
            ) : currentProducts.length === 0 ? (
              <div className="bg-white border border-gray-200 p-12 text-center">
                <p className="text-lg font-medium text-black">
                  No products found
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Try adjusting your filters or search
                </p>
              </div>
            ) : (
              <>
                {/* Result count */}
                <div className="mb-6 text-sm text-gray-600">
                  Showing{" "}
                  <span className="text-black font-medium">
                    {startIndex + 1}–
                    {Math.min(endIndex, filteredProducts.length)}
                  </span>{" "}
                  of{" "}
                  <span className="text-black font-medium">
                    {filteredProducts.length}
                  </span>{" "}
                  products
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentProducts.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.05 * index,
                      }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </motion.section>
        </div>
      </motion.main>

      <OurPolicy />
      <Footer />
    </motion.div>
  );
}

export default App;
