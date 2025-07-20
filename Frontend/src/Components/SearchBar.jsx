import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { SiNike } from "react-icons/si";

const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(savedSearches);
  }, []);

  // Save recent searches to localStorage whenever the list changes
  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  const handleSearchClick = () => {
    setIsExpanded(true);
  };

  const handleCancelClick = () => {
    setIsExpanded(false);
    setSearchValue("");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // Add the search term to the list if it doesn't already exist
      if (!recentSearches.includes(searchValue)) {
        setRecentSearches((prev) => [searchValue, ...prev]);
      }
      setSearchValue("");
    }
  };

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isExpanded]);

  // Constant items
  const constantItems = [
    "Nike",
    "air max",
    "killshot",
    "jordan",
    "converse",
    "vans",
  ];

  return (
    <div className={`relative ${isExpanded ? "w-full" : ""}`}>
      {/* Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex items-center gap-2 bg-white border hover:bg-gray-300 rounded-full px-1.5 md:px-4 py-1.5 transition-all duration-300"
        onClick={handleSearchClick}
      >
        <FiSearch size={24} className="text-gray-500" />

        {/* Input will be hidden on mobile and visible on md+ screens */}
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search..."
          className="hidden md:flex bg-transparent outline-none w-32 text-gray-700"
        />
      </form>

      {/* Search List & Cancel Button */}
      {isExpanded && (
        <div className="fixed top-0  left-0 right-0 px-8 pb-20 py-3 bg-white w-full z-40">
          {/* Header Section */}
          <div className="md:flex justify-between items-center border-gray-200 px-4">
            <div className="flex items-center justify-between gap-x-1 mb-3 md:mb-0">
              <p className="text-xl  md:text-2xl font-bold ">ChiqFirg</p>
              <button
                onClick={handleCancelClick}
                className="content-center md:hidden py-2 text-gray-800 font-semibold hover:text-gray-500 text-lg transition"
              >
                Cancel
              </button>
            </div>

            <form
              onSubmit={handleSearchSubmit}
              className={`flex items-center gap-2 hover:bg-gray-300 bg-gray-200 border rounded-full px-4 py-2 transition-all duration-300`}
            >
              <FiSearch size={24} className="text-gray-500 hidden md:block" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search..."
                className={`flex bg-transparent w-[800px] font-semibold outline-none text-gray-800`}
              />
            </form>
            <button
              onClick={handleCancelClick}
              className="content-center hidden md:block py-2 text-gray-800 font-semibold hover:text-gray-500 text-lg transition"
            >
              Cancel
            </button>
          </div>

          {/* Popular Search Terms */}
          <div className="w-[850px] mx-auto ">
            <h4 className="text-gray-500 text-md font-semibold p-4 ">
              Popular Search Terms
            </h4>
            <ul className="flex items-center flex-wrap gap-4 mb-4 px-4">
              {constantItems.concat(recentSearches).map((item, index) => (
                <li
                  key={index}
                  className="text-black text-base py-1.5 hover:bg-gray-300 px-5 rounded-full bg-gray-200 cursor-pointer"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
