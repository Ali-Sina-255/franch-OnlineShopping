import React, { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { X } from "lucide-react"; // Import the X icon for the clear button
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState(searchQuery);
  const [recentSearches, setRecentSearches] = useState([]);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  // No changes needed for the core "debouncing" search logic
  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue !== searchQuery) {
        setSearchQuery(inputValue);
        if (inputValue.trim() !== "") {
          navigate("/");
        }
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [inputValue, searchQuery, setSearchQuery, navigate]);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // No changes to recent search logic
  useEffect(() => {
    const savedSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(savedSearches);
  }, []);
  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  // Helper functions
  const handleSearchClick = () => setIsExpanded(true);
  const handleCancelClick = () => {
    setIsExpanded(false);
    setInputValue(searchQuery);
  };
  const handleClearInput = () => setInputValue("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !recentSearches.includes(trimmedValue)) {
      setRecentSearches((prev) => [trimmedValue, ...prev.slice(0, 4)]);
    }
    setSearchQuery(trimmedValue);
    setIsExpanded(false);
  };

  const handleSuggestionClick = (term) => {
    setInputValue(term);
    setSearchQuery(term);
    setIsExpanded(false);
    navigate("/");
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
  };

  // Body scroll lock (no changes)
  useEffect(() => {
    /* ... */
  }, [isExpanded]);
  useEffect(() => {
    /* ... */
  }, [isExpanded]);

  const popularSearches = [
    "Vintage Tee",
    "Denim Jacket",
    "Leather Bag",
    "Floral Dress",
    "Boots",
  ];
  const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: { y: -50, opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <div className={`relative ${isExpanded ? "w-full" : ""}`}>
      <div
        className="flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 rounded-full px-1.5 md:px-4 py-1.5 transition-all duration-300 cursor-pointer"
        onClick={handleSearchClick}
      >
        <FiSearch size={20} className="text-gray-500" />
        <span className="hidden md:block bg-transparent outline-none w-32 text-gray-500 text-sm truncate">
          {searchQuery || "Search..."}
        </span>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={handleCancelClick}
            />
            <motion.div
              ref={modalRef}
              className="fixed top-0 left-0 right-0 bg-white shadow-2xl z-50"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Search Input Form */}
                <form onSubmit={handleSearchSubmit} className="relative w-full">
                  <FiSearch
                    size={22}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Search for products, tags, or colors..."
                    className="w-full bg-gray-100 border-2 border-transparent rounded-full py-3 pl-12 pr-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    autoFocus
                  />
                  {/* The new "Clear" button */}
                  {inputValue && (
                    <button
                      type="button"
                      onClick={handleClearInput}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                    >
                      <X size={20} />
                    </button>
                  )}
                </form>

                {/* Suggestions Section */}
                <div className="mt-6 space-y-6">
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-semibold text-gray-600">
                          Recent Searches
                        </h4>
                        <button
                          onClick={handleClearRecent}
                          className="text-xs font-medium text-indigo-600 hover:underline"
                        >
                          Clear
                        </button>
                      </div>
                      <ul className="flex flex-wrap gap-2">
                        {recentSearches.map((item, index) => (
                          <li
                            key={index}
                            onClick={() => handleSuggestionClick(item)}
                            className="text-sm py-1.5 px-4 rounded-full bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 cursor-pointer transition-colors"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">
                      Popular Searches
                    </h4>
                    <ul className="flex flex-wrap gap-2">
                      {popularSearches.map((item, index) => (
                        <li
                          key={index}
                          onClick={() => handleSuggestionClick(item)}
                          className="text-sm py-1.5 px-4 rounded-full bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 cursor-pointer transition-colors"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
