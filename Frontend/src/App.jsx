// src/App.jsx

import React, { useState, useRef, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

import Header from "./Components/Header";
import Footer from "./Components/Footer";
import HomePage from "./Pages/HomePage";
import ProductDetailPage from "./Pages/ProductDetailPage";
import CartPage from "./Pages/CartPage";
import WishlistPage from "./Pages/WishlistPage";
import QuickViewModal from "./Components/QuickViewModal";
import CartDrawer from "./Components/CartDrawer";
import FlyingImage from "./Components/FlyingImage";
import PrivateRoute from "./Components/common/PrivateRoute";
import Signin from "./features/authentication/components/Signin";
import SignUp from "./features/authentication/components/Signup";
import DashboardPage from "./Components/dashboard/DashboardPage";

function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [animationData, setAnimationData] = useState(null);
  const cartRef = useRef(null);
  const location = useLocation();

  // Reset state on route change
  useEffect(() => {
    if (location.pathname !== "/") setSearchQuery("");
    setQuickViewProduct(null);
    setIsCartOpen(false);
  }, [location.pathname]);

  const handleAddToCart = (productToAdd, imageRef) => {
    if (cart.find((item) => item.id === productToAdd.id)) {
      toast.error(`${productToAdd.name} is already in your bag.`);
      return;
    }

    if (imageRef?.current && cartRef?.current) {
      const startRect = imageRef.current.getBoundingClientRect();
      const endRect = cartRef.current.getBoundingClientRect();
      setAnimationData({ startRect, endRect, imgSrc: productToAdd.imageUrl });
    }

    setTimeout(() => {
      setCart((prevCart) => [...prevCart, productToAdd]);
      toast.success(`${productToAdd.name} added to bag!`);
    }, 150);
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    toast.error("Item removed from bag.");
  };

  const handleToggleWishlist = (productId) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.includes(productId)) {
        toast.error("Removed from wishlist.");
        return prevWishlist.filter((id) => id !== productId);
      } else {
        toast.success("Added to wishlist!");
        return [...prevWishlist, productId];
      }
    });
  };

  // 👇 Conditionally hide Header and Footer on /dashboard
  const hideLayout = location.pathname.startsWith("/dashboard");

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Toaster
        position="bottom-center"
        toastOptions={{
          success: { style: { background: "#333", color: "#fff" } },
          error: { style: { background: "#D22B2B", color: "#fff" } },
        }}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemoveItem={handleRemoveFromCart}
      />
      <FlyingImage
        animationData={animationData}
        onAnimationComplete={() => setAnimationData(null)}
      />

      {/* ✅ Only show Header if not on dashboard */}
      {!hideLayout && (
        <Header
          cartCount={cart.length}
          wishlistCount={wishlist.length}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onCartClick={() => setIsCartOpen(true)}
          cartRef={cartRef}
        />
      )}

      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                searchQuery={searchQuery}
                onQuickView={setQuickViewProduct}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
              />
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProductDetailPage
                onAddToCart={handleAddToCart}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <CartPage cartItems={cart} onRemoveItem={handleRemoveFromCart} />
            }
          />
          <Route
            path="/wishlist"
            element={
              <WishlistPage
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                onQuickView={setQuickViewProduct}
              />
            }
          />

          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          <Route path="/sign-in" element={<Signin />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="*" element={<Signin />} />
        </Routes>
      </main>

      {/* ✅ Only show Footer if not on dashboard */}
      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;
