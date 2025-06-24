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

      // Filtering and Sorting Logic remains unchanged
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
      if (Object.keys(activeFilters).length > 0) {
        tempProducts = tempProducts.filter((product) =>
          Object.keys(activeFilters).every((key) => {
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
    <div className="bg-gradient-to-b from-indigo-50/20 to-white">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-indigo-100 pb-6 pt-12">
          <h1 className="text-4xl font-bold tracking-tight text-indigo-900">
            Premium Secondhand Fashion
          </h1>
          <div className="flex items-center">
            <div className="relative inline-block text-left">
              <div>
                <button
                  type="button"
                  className="group inline-flex justify-center text-sm font-medium text-indigo-700 hover:text-indigo-900"
                  id="menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  Sort
                  <ChevronDown
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-indigo-500 group-hover:text-indigo-700"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <div
                className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-indigo-200 ring-opacity-80 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex="-1"
              >
                <div className="py-1" role="none">
                  {["Newest", "Price: Low to High", "Price: High to Low"].map(
                    (option) => (
                      <button
                        key={option}
                        className={`block px-4 py-2 text-sm w-full text-left ${
                          sortOption === option.toLowerCase().replace(/: /g, "-")
                            ? "bg-indigo-50 text-indigo-700 font-medium"
                            : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                        }`}
                        role="menuitem"
                        tabIndex="-1"
                        onClick={() =>
                          setSortOption(
                            option.toLowerCase().replace(/: /g, "-")
                          )
                        }
                      >
                        {option}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
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
                          <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-xl border-2 border-dashed border-indigo-200 inline-block">
                            <h3 className="text-xl font-semibold text-indigo-800 mb-2">
                              No Products Found
                            </h3>
                            <p className="text-indigo-600 max-w-md">
                              Try adjusting your search or filter criteria to
                              find what you're looking for.
                            </p>
                            <button
                              onClick={resetFilters}
                              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg hover:from-indigo-600 hover:to-blue-600 transition-all duration-200"
                            >
                              Reset All Filters
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {productsToShow.length > 0 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  )}
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