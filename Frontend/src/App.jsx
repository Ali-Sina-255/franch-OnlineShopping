// src/App.jsx

import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

import Header from "./components/Header";
import ProductListPage from "./Pages/ProductListPage";
import ProductDetailPage from "./Pages/ProductDetailPage";
import CartPage from "./Pages/CartPage";
import WishlistPage from "./Pages/WishlistPage";
import QuickViewModal from "./Components/QuickViewModal";
import CartDrawer from "./Components/CartDrawer"; // ADD THIS IMPORT

function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false); // ADD CART DRAWER STATE

  React.useEffect(() => {
    // This effect runs whenever the user navigates to a new page
    if (location.pathname !== "/") {
      setSearchQuery("");
    }
    setQuickViewProduct(null); // Always close the Quick View modal on navigation
    setIsCartOpen(false); // Always close the Cart Drawer on navigation
  }, [location.pathname]);

  const handleAddToCart = (productToAdd) => {
    if (cart.find((item) => item.id === productToAdd.id)) {
      toast.error(`${productToAdd.name} is already in your bag.`);
      return;
    }
    setCart((prevCart) => [...prevCart, productToAdd]);
    toast.success(`${productToAdd.name} added to bag!`);
    setIsCartOpen(true); // OPEN CART DRAWER ON ADD
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

  return (
    <>
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

      {/* RENDER THE CART DRAWER GLOBALLY */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemoveItem={handleRemoveFromCart}
      />

      <Header
        cartCount={cart.length}
        wishlistCount={wishlist.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCartClick={() => setIsCartOpen(true)} // PASS DRAWER OPENER FUNCTION
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <ProductListPage
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
        </Routes>
      </main>
    </>
  );
}

export default App;
