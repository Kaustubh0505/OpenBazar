"use client";

import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Sidebar } from "../components/Sidebar";
import { ProductCard } from "../components/ProductCard";
import { Pagination } from "../components/Pagination";
import { Loader2 } from "lucide-react";

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
    <div className="min-h-screen flex flex-col bg-[#f7f5f2]">
      <Navbar
        categories={categories}
        onCategorySelect={setSelectedCategory}
        onSearch={setSearchQuery}
        onCartClick={() => {}}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="lg:w-64">
            <Sidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </aside>

          {/* Products */}
          <section className="flex-1">
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
                  {currentProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                    />
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
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
