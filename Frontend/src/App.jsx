// src/App.jsx

import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

import Header from "./Components/Header";
import Footer from "./Components/Footer"; // Import the new Footer
import HomePage from "./Pages/HomePage"; // Import the new HomePage
import ProductDetailPage from "./Pages/ProductDetailPage";
import CartPage from "./Pages/CartPage";
import WishlistPage from "./Pages/WishlistPage";
import QuickViewModal from "./Components/QuickViewModal";
import CartDrawer from "./Components/CartDrawer";

function App() {
  // All state variables remain the same
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // This effect runs whenever the user navigates to a new page
  React.useEffect(() => {
    if (location.pathname !== "/") {
      setSearchQuery("");
    }
    setQuickViewProduct(null); // Always close Quick View on navigation
    setIsCartOpen(false); // Always close Cart Drawer on navigation
  }, [location.pathname]);

  // Handler for adding a product to the cart
  const handleAddToCart = (productToAdd) => {
    if (cart.find((item) => item.id === productToAdd.id)) {
      toast.error(`${productToAdd.name} is already in your bag.`);
      return;
    }
    setCart((prevCart) => [...prevCart, productToAdd]);
    toast.success(`${productToAdd.name} added to bag!`);
    setIsCartOpen(true);
  };

  // Handler for removing a product from the cart
  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    toast.error("Item removed from bag.");
  };

  // Handler for adding/removing a product from the wishlist
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
    // We wrap the entire app in a flex container to make the footer sticky
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

      <Header
        cartCount={cart.length}
        wishlistCount={wishlist.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* The main content area will grow to fill available space */}
      <main className="flex-grow">
        <Routes>
          {/* The root path "/" now renders the HomePage component */}
          <Route
            path="/"
            element={
              <HomePage
                // We pass down all the props that the embedded ProductListPage needs
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

      {/* The Footer is now part of the main app layout */}
      <Footer />
    </div>
  );
}

export default App;