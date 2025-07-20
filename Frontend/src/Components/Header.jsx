import React, { useState, useEffect } from "react";
import { Search, User, ShoppingBag, Menu, X, Heart } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import MegaMenu from "./MegaMenu";
import SearchBar from "./SearchBar";
const navbarItems = [
  { name: "Home", path: "/" },
  { name: "Category", path: "/" },
  { name: "Contact Us", path: "/contact" },
  { name: "About Us", path: "/about" },
];

const Header = ({
  wishlistCount,
  searchQuery,
  setSearchQuery,
  onCartClick,
  cartRef,
}) => {
  const { cartItems } = useSelector((state) => state.user);
  const cartCount = (cartItems || []).reduce((sum, item) => sum + item.qty, 0);

  const navigate = useNavigate();
  const location = useLocation();
  const [isShopMenuOpen, setShopMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true); // Ensure loading is true at the start
        const response = await axios.get(`${BASE_URL}/api/v1/category/`);

        // ========================================================================
        // FIX #1: Handle paginated API response
        // ========================================================================
        if (response.data && Array.isArray(response.data.results)) {
          setCategories(response.data.results);
        } else if (Array.isArray(response.data)) {
          // Handle non-paginated responses just in case
          setCategories(response.data);
        } else {
          toast.error("Received invalid category data.");
        }
        // ========================================================================
        // END OF FIX
        // ========================================================================
      } catch (err) {
        toast.error("Could not load categories.");
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (location.pathname !== "/") navigate("/");
  };

  const mobileMenuVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0, transition: { duration: 0.3, ease: "easeInOut" } },
    exit: { x: "-100%", transition: { duration: 0.2, ease: "easeIn" } },
  };

  return (
    <>
      <header
        className={`sticky top-0 z-30 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-lg border-indigo-100 shadow-sm"
            : "bg-gradient-to-r from-indigo-50 via-white to-blue-50 backdrop-blur-sm border-indigo-100"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile menu button */}
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
                ChigFrip
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-8 relative">
              {navbarItems.map((item, index) => {
                const isCategory = item.name === "Category";
                return (
                  <div
                    key={index}
                    onMouseEnter={() => isCategory && setShopMenuOpen(true)}
                    onMouseLeave={() => isCategory && setShopMenuOpen(false)}
                    className="relative"
                  >
                    <Link
                      to={item.path}
                      className={`text-sm font-medium ${
                        isScrolled ? "text-indigo-800" : "text-indigo-900"
                      } hover:text-indigo-600 transition-colors duration-200`}
                    >
                      {item.name}
                    </Link>
                    {isCategory && (
                      <AnimatePresence>
                        {isShopMenuOpen && (
                          <div
                            onMouseEnter={() => setShopMenuOpen(true)}
                            onMouseLeave={() => setShopMenuOpen(false)}
                          >
                            <MegaMenu onClose={() => setShopMenuOpen(false)} />
                          </div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Icons and Search */}
            <div className="flex items-center justify-end gap-x-4">
              <SearchBar />
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
                ref={cartRef}
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
                {categoriesLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-5 bg-gray-200 rounded-md animate-pulse ml-4"
                      ></div>
                    ))
                  : categories.map((category) => (
                      // ========================================================================
                      // FIX #2: Generate slug from `category.name`
                      // ========================================================================
                      <Link
                        key={category.id || category.name} // Use a guaranteed unique key
                        to={`/?category=${category.name.toLowerCase()}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-gray-700 hover:text-indigo-700 pl-4 py-2 hover:bg-indigo-50 rounded-lg transition-colors duration-150"
                      >
                        {category.name}
                      </Link>
                      // ========================================================================
                      // END OF FIX
                      // ========================================================================
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
