import React, { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const modalRef = useRef(null);

  // Load recent searches
  useEffect(() => {
    const savedSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(savedSearches);
  }, []);

  // Save recent searches
  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  const handleSearchClick = () => setIsExpanded(true);

  const handleCancelClick = () => {
    setIsExpanded(false);
    setSearchValue("");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim() && !recentSearches.includes(searchValue)) {
      setRecentSearches((prev) => [searchValue, ...prev]);
    }
    setSearchValue("");
  };

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isExpanded ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isExpanded]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsExpanded(false);
        setSearchValue("");
      }
    };
    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  const constantItems = [
    "Nike",
    "air max",
    "killshot",
    "jordan",
    "converse",
    "vans",
  ];

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <div className={`relative ${isExpanded ? "w-full" : ""}`}>
      {/* Compact Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex items-center gap-2 bg-white border hover:bg-gray-300 rounded-full px-1.5 md:px-4 py-1.5 transition-all duration-300"
        onClick={handleSearchClick}
      >
        <FiSearch size={24} className="text-gray-500" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search..."
          className="hidden md:flex bg-transparent outline-none w-32 text-gray-700"
        />
      </form>

      {/* AnimatePresence for backdrop and modal */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-30"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={handleCancelClick}
            />

            {/* Modal */}
            <motion.div
              ref={modalRef}
              className="fixed top-0 left-0 right-0 px-8 pb-20 py-3 bg-white w-full z-40"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="md:flex justify-between items-center border-gray-200 px-4">
                <div className="flex items-center justify-between gap-x-1 mb-3 md:mb-0">
                  <p className="text-xl md:text-2xl font-bold">ChiqFirg</p>
                  <button
                    onClick={handleCancelClick}
                    className="md:hidden py-2 text-gray-800 font-semibold hover:text-gray-500 text-lg transition"
                  >
                    Cancel
                  </button>
                </div>
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center gap-2 hover:bg-gray-300 bg-gray-200 border rounded-full px-4 py-2 transition-all duration-300"
                >
                  <FiSearch
                    size={24}
                    className="text-gray-500 hidden md:block"
                  />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search..."
                    className="flex bg-transparent w-[800px]  outline-none text-gray-800"
                  />
                </form>
                <button
                  onClick={handleCancelClick}
                  className="hidden md:block py-2 text-gray-800 font-semibold hover:text-gray-500 text-lg transition"
                >
                  Cancel
                </button>
              </div>

              {/* Popular Searches */}
              <div className="md:w-[850px] mx-auto mt-6">
                <h4 className="text-gray-500 text-md font-semibold p-4">
                  Popular Search Terms
                </h4>
                <ul className="flex items-center flex-wrap gap-4 mb-4 px-4">
                  {constantItems.map((item, index) => (
                    <li
                      key={index}
                      className="text-black text-base py-1.5 hover:bg-gray-300 px-5 rounded-full bg-gray-200 cursor-pointer"
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <>
                    <h4 className="text-gray-500 text-md font-semibold p-4">
                      Recent Searches
                    </h4>
                    <ul className="flex items-center flex-wrap gap-4 mb-4 px-4">
                      {recentSearches.map((item, index) => (
                        <li
                          key={index}
                          className="text-black text-base py-1.5 hover:bg-gray-300 px-5 rounded-full bg-gray-100 cursor-pointer"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
