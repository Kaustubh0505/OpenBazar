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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/categories`);
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/products`);
      const data = await response.json();
      setAllProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setAllProducts([]);
    }

    setIsLoading(false);
  };

  const filterProducts = () => {
    let filtered = [...allProducts];

    if (selectedCategory) {
      filtered = filtered.filter((p) => {
        // Handle both populated (object) and non-populated (string) category_id
        const categoryId = typeof p.category_id === 'object' ? p.category_id._id : p.category_id;
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

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar
        categories={categories}
        onCategorySelect={handleCategorySelect}
        onSearch={handleSearch}
        onCartClick={() => { }}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:block">
            <Sidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
          </div>

          {/* Products */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              </div>
            ) : currentProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-xl text-gray-600">
                  No products found
                </p>
                <p className="text-gray-500 mt-2">
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-gray-600">
                  Showing {startIndex + 1}–
                  {Math.min(
                    endIndex,
                    filteredProducts.length
                  )}{" "}
                  of {filteredProducts.length} products
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                    />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
