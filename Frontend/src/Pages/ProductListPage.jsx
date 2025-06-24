// src/pages/ProductListPage.jsx

import React, { useState, useEffect, useMemo } from "react";
import ProductCard from "../Components/ProductCard";
import Filters from "../Components/Filters";
import Pagination from "../Components/Pagination";
import { products as allProducts } from "../data/products";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS_PER_PAGE = 9;

const Spinner = () => (
  <div className="flex justify-center items-center h-96">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

// --- Component now accepts wishlist props from App.jsx ---
const ProductListPage = ({
  searchQuery,
  onQuickView,
  wishlist,
  onToggleWishlist,
}) => {
  const [productsToShow, setProductsToShow] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});
  const [sortOption, setSortOption] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const { minPrice, maxPrice } = useMemo(() => {
    if (allProducts.length === 0) return { minPrice: 0, maxPrice: 0 };
    const prices = allProducts.map((p) => p.price);
    return {
      minPrice: Math.floor(Math.min(...prices)),
      maxPrice: Math.ceil(Math.max(...prices)),
    };
  }, []);

  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);

  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const handleFilterChange = (filterType, value) => {
    setCurrentPage(1);
    setActiveFilters((prev) => {
      const newFilters = { ...prev };
      if (!newFilters[filterType]) newFilters[filterType] = new Set();
      if (newFilters[filterType].has(value)) {
        newFilters[filterType].delete(value);
        if (newFilters[filterType].size === 0) delete newFilters[filterType];
      } else {
        newFilters[filterType].add(value);
      }
      return newFilters;
    });
  };

  const resetFilters = () => {
    setCurrentPage(1);
    setActiveFilters({});
    setPriceRange([minPrice, maxPrice]);
    const checkboxes = document.querySelectorAll(
      'aside input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => (checkbox.checked = false));
  };

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let tempProducts = [...allProducts];

      // Filtering and Sorting Logic... (no changes here)
      if (searchQuery) {
        /* ... */
      }
      if (priceRange[0] > minPrice || priceRange[1] < maxPrice) {
        /* ... */
      }
      const filterKeys = Object.keys(activeFilters);
      if (filterKeys.length > 0) {
        /* ... */
      }
      if (sortOption === "price-asc") {
        /* ... */
      }
      // ... (all the logic is the same)
      if (searchQuery) {
        const l = searchQuery.toLowerCase();
        tempProducts = tempProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(l) ||
            p.brand.toLowerCase().includes(l) ||
            p.tags.some((t) => t.toLowerCase().includes(l))
        );
      }
      if (priceRange[0] > minPrice || priceRange[1] < maxPrice) {
        tempProducts = tempProducts.filter(
          (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
        );
      }
      if (filterKeys.length > 0) {
        tempProducts = tempProducts.filter((product) =>
          filterKeys.every((key) => {
            const f = activeFilters[key];
            if (f.size === 0) return true;
            const p = key.slice(0, -1).toLowerCase();
            return f.has(product[p]);
          })
        );
      }
      if (sortOption === "price-asc")
        tempProducts.sort((a, b) => a.price - b.price);
      else if (sortOption === "price-desc")
        tempProducts.sort((a, b) => b.price - a.price);
      else if (sortOption === "newest")
        tempProducts.sort(
          (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
        );

      setTotalPages(Math.ceil(tempProducts.length / ITEMS_PER_PAGE));
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const paginatedProducts = tempProducts.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
      );
      setProductsToShow(paginatedProducts);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [
    activeFilters,
    sortOption,
    searchQuery,
    priceRange,
    minPrice,
    maxPrice,
    currentPage,
  ]);

  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-12">
          {/* ... H1 and Sorting Dropdown ... */}
        </div>
        <section className="pb-24 pt-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            <Filters
              onFilterChange={handleFilterChange}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              minPrice={minPrice}
              maxPrice={maxPrice}
              resetFilters={resetFilters}
              activeFilters={activeFilters}
            />
            <div className="lg:col-span-3">
              {isLoading ? (
                <Spinner />
              ) : (
                <motion.div layout>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                    <AnimatePresence>
                      {productsToShow.length > 0 ? (
                        productsToShow.map((product) => (
                          <motion.div
                            key={product.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {/* --- THE FIX IS HERE --- */}
                            <ProductCard
                              product={product}
                              onQuickView={onQuickView}
                              wishlist={wishlist}
                              onToggleWishlist={onToggleWishlist}
                            />
                          </motion.div>
                        ))
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="lg:col-span-3 text-center py-20"
                        >
                          {/* ... No products found message ... */}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </motion.div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductListPage;
