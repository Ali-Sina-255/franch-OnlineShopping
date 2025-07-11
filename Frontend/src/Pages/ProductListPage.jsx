// src/pages/ProductListPage.jsx

import React, { useState, useEffect, useMemo, useRef } from "react";
import ProductCard from "../Components/ProductCard";
import ProductCardSkeleton from "../Components/ProductCardSkeleton";
import Filters from "../Components/Filters";
import Pagination from "../Components/Pagination";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchProducts, extractUniqueAttributes } from "../services/api";
import { mapProductFromApi } from "../utils/product-mapper"; // <-- IMPORT THE MAPPER

const ITEMS_PER_PAGE = 9;

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
  const [totalProducts, setTotalProducts] = useState(0);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    colors: [],
    sizes: [],
    conditions: ["New", "Use", "Other"],
  });

  useEffect(() => {
    const getFilterData = async () => {
      try {
        const productsRes = await fetchProducts({ page_size: 100 });
        const allProducts = productsRes.data.results;

        const brands = extractUniqueAttributes(allProducts, "brand");
        const colors = extractUniqueAttributes(allProducts, "color");
        const sizes = extractUniqueAttributes(allProducts, "size");

        setFilterOptions((prev) => ({ ...prev, brands, colors, sizes }));
      } catch (error) {
        console.error("Failed to fetch data for filters:", error);
      }
    };
    getFilterData();
  }, []);

  const { minPrice, maxPrice } = useMemo(
    () => ({ minPrice: 0, maxPrice: 2000 }),
    []
  );
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  useEffect(() => setPriceRange([minPrice, maxPrice]), [minPrice, maxPrice]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilterChange = (filterType, value) => {
    setCurrentPage(1);
    setActiveFilters((prev) => {
      const newFilters = { ...prev };
      const filterKey = filterType.toLowerCase();
      if (!newFilters[filterKey]) newFilters[filterKey] = new Set();
      if (newFilters[filterKey].has(value)) {
        newFilters[filterKey].delete(value);
        if (newFilters[filterKey].size === 0) delete newFilters[filterKey];
      } else {
        newFilters[filterKey].add(value);
      }
      return newFilters;
    });
  };

  const resetFilters = () => {
    setCurrentPage(1);
    setActiveFilters({});
    setPriceRange([minPrice, maxPrice]);
    document
      .querySelectorAll('aside input[type="checkbox"]')
      .forEach((c) => (c.checked = false));
  };

  useEffect(() => {
    setIsLoading(true);
    const params = {
      page: currentPage,
      page_size: ITEMS_PER_PAGE,
      price_min: priceRange[0] > minPrice ? priceRange[0] : undefined,
      price_max: priceRange[1] < maxPrice ? priceRange[1] : undefined,
      tags: searchQuery || undefined,
      condition:
        activeFilters.conditions?.size > 0
          ? Array.from(activeFilters.conditions)[0]
          : undefined,
    };

    const attributeQueries = [];
    Object.keys(activeFilters).forEach((key) => {
      if (["brands", "colors", "sizes"].includes(key)) {
        const filterKey = key.slice(0, -1);
        Array.from(activeFilters[key]).forEach((value) =>
          attributeQueries.push(`${filterKey}:${value}`)
        );
      }
    });
    if (attributeQueries.length > 0)
      params.attributes = attributeQueries.join(",");

    fetchProducts(params)
      .then((res) => {
        // --- USE THE MAPPER HERE ---
        const mappedProducts = res.data.results.map(mapProductFromApi);

        if (sortOption === "price-asc")
          mappedProducts.sort((a, b) => a.price - b.price);
        else if (sortOption === "price-desc")
          mappedProducts.sort((a, b) => b.price - a.price);
        // Newest is default from backend, no need to sort unless you have a date field

        setProductsToShow(mappedProducts);
        setTotalProducts(res.data.count);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error);
        setIsLoading(false);
      });
  }, [
    activeFilters,
    sortOption,
    searchQuery,
    priceRange,
    minPrice,
    maxPrice,
    currentPage,
  ]);

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
  const getSortText = (option) =>
    ({
      newest: "Newest",
      "price-asc": "Price: Low to High",
      "price-desc": "Price: High to Low",
    }[option]);

  return (
    <div className="bg-gradient-to-b from-indigo-50/20 to-white">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-indigo-100 pb-6 pt-12">
          <h1 className="text-4xl font-bold tracking-tight text-indigo-900">
            Premium Secondhand Fashion
          </h1>
          <div className="flex items-center" ref={sortRef}>
            <div className="relative inline-block text-left">
              <button
                type="button"
                className="group inline-flex justify-center text-sm font-medium text-indigo-700 hover:text-indigo-900"
                onClick={() => setIsSortOpen(!isSortOpen)}
              >
                {getSortText(sortOption)}
                <ChevronDown
                  className={`-mr-1 ml-1 h-5 w-5 ... ${
                    isSortOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 z-10 mt-2 ..."
                  >
                    <div className="py-1">
                      {["newest", "price-asc", "price-desc"].map((option) => (
                        <button
                          key={option}
                          className={`block px-4 py-2.5 text-sm w-full ... ${
                            sortOption === option
                              ? "bg-indigo-50 ..."
                              : "text-gray-700 ..."
                          }`}
                          onClick={() => {
                            setSortOption(option);
                            setIsSortOpen(false);
                          }}
                        >
                          {getSortText(option)}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
              filterOptions={filterOptions}
            />
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                  {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
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
                          <div className="bg-gradient-to-br from-indigo-50 ...">
                            <h3 className="text-xl ...">No Products Found</h3>
                            <p className="text-indigo-600 ...">
                              Try adjusting your search or filter criteria.
                            </p>
                            <button
                              onClick={resetFilters}
                              className="mt-4 px-4 py-2 ..."
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
