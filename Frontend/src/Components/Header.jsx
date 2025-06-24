// src/components/Header.jsx

import React, { useState } from "react";
import { Search, User, ShoppingBag, Menu, X, Heart } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { filters } from "../data/products";

// Component now accepts the `cartRef` prop
const Header = ({
  cartCount,
  wishlistCount,
  searchQuery,
  setSearchQuery,
  onCartClick,
  cartRef, // The new prop for the reference
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isShopMenuOpen, setShopMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
    }
    console.log("Searching for:", searchQuery);
  };

  const mobileMenuVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0, transition: { duration: 0.3, ease: "easeInOut" } },
    exit: { x: "-100%", transition: { duration: 0.2, ease: "easeIn" } },
  };

  return (
    <>
      <header className="bg-gradient-to-r from-indigo-50 via-white to-blue-50 backdrop-blur-sm border-b border-indigo-100 sticky top-0 z-30">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-indigo-700 hover:text-indigo-900"
              >
                <Menu size={24} />
              </button>
            </div>

            {/* Logo */}
            <div className="flex items-center">
              <Link
                to="/"
                className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"
              >
                CoolThrift
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-8">
              <div
                className="relative"
                onMouseEnter={() => setShopMenuOpen(true)}
                onMouseLeave={() => setShopMenuOpen(false)}
              >
                <Link
                  to="/"
                  className="text-sm font-medium text-indigo-900 ml-4 hover:text-indigo-600 transition-colors duration-200 flex items-center"
                >
                  Shop
                </Link>
                <AnimatePresence>
                  {isShopMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 rounded-lg shadow-xl bg-white border border-indigo-100"
                    >
                      <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                      >
                        {filters.categories.map((category) => (
                          <Link
                            key={category}
                            to={`/category/${category.toLowerCase()}`}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-150"
                          >
                            {category}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <a
                href="#"
                className="text-sm font-medium text-indigo-900 hover:text-indigo-600 transition-colors duration-200"
              >
                New Arrivals
              </a>
              <a
                href="#"
                className="text-sm font-medium text-indigo-900 hover:text-indigo-600 transition-colors duration-200"
              >
                Brands
              </a>
            </div>

            {/* Icons and Search */}
            <div className="flex items-center justify-end gap-x-4">
              <form
                onSubmit={handleSearchSubmit}
                className="hidden sm:block relative"
              >
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-xl border border-indigo-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all duration-200"
                />
                <Search className="h-5 w-5 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </form>

              <Link
                to="/account"
                className="p-2 text-indigo-700 hover:text-indigo-900 hidden lg:block transition-colors duration-200"
              >
                <User size={24} />
              </Link>

              <Link
                to="/wishlist"
                className="flex items-center p-2 text-indigo-700 hover:text-indigo-900 transition-colors duration-200"
              >
                <Heart size={24} />
                {wishlistCount > 0 && (
                  <span className="ml-2 text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                ref={cartRef} // Attach the ref to the cart button
                type="button"
                onClick={onCartClick}
                className="flex items-center p-2 text-indigo-700 hover:text-indigo-900 transition-colors duration-200"
              >
                <ShoppingBag size={24} />
                {cartCount > 0 && (
                  <span className="ml-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Slide-out */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-gradient-to-b from-indigo-50 to-white z-50 p-6 border-r border-indigo-100"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-indigo-900">Menu</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-indigo-700 hover:text-indigo-900"
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="flex flex-col space-y-4">
                <h3 className="font-semibold text-indigo-800">
                  Shop by Category
                </h3>
                {filters.categories.map((category) => (
                  <Link
                    key={category}
                    to={`/category/${category.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-indigo-700 pl-4 py-2 hover:bg-indigo-50 rounded-lg transition-colors duration-150"
                  >
                    {category}
                  </Link>
                ))}
                <hr className="border-indigo-100" />
                <Link
                  to="/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-indigo-700 py-2 hover:bg-indigo-50 rounded-lg transition-colors duration-150"
                >
                  New Arrivals
                </Link>
                <Link
                  to="/brands"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-indigo-700 py-2 hover:bg-indigo-50 rounded-lg transition-colors duration-150"
                >
                  Brands
                </Link>
                <hr className="border-indigo-100" />
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-indigo-700 py-2 hover:bg-indigo-50 rounded-lg transition-colors duration-150 font-medium"
                >
                  My Wishlist
                </Link>
                <Link
                  to="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-indigo-700 py-2 hover:bg-indigo-50 rounded-lg transition-colors duration-150"
                >
                  My Account
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
