// src/components/products/ProductCard.jsx

import React from "react";
import { Link } from "react-router-dom"; // Assuming you use react-router for navigation
import { ShoppingCart } from "lucide-react";

const ProductCard = ({ product }) => {
  // --- THIS IS THE FIX ---
  // Add a "guard clause" at the top of the component.
  // If the product prop is missing or invalid, render nothing (or a placeholder).
  if (!product) {
    return null; // or return <div className="product-card-placeholder"></div>;
  }
  // --- END OF FIX ---

  // This line (line 5 in your original file) was causing the error.
  // It will now only run if the 'product' prop exists.
  // We also add a fallback in case multi_images is empty.
  const primaryImage =
    product.multi_images && product.multi_images.length > 0
      ? product.multi_images[0].image
      : "/placeholder.jpg"; // A fallback image if there are no images

  // Add a check for price existence as well, defaulting to 'N/A'
  const displayPrice = product.price
    ? `${parseFloat(product.price).toLocaleString()} افغانی`
    : "قیمت نامشخص";

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden group transition-transform transform hover:-translate-y-1">
      <Link to={`/products/${product.id}`} className="block">
        <div className="w-full h-48 bg-gray-200 overflow-hidden">
          <img
            src={primaryImage}
            alt={product.name || "Product Image"}
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
          />
        </div>
        <div className="p-4">
          <h3
            className="text-lg font-semibold truncate text-gray-800"
            title={product.name}
          >
            {product.name || "محصول بی نام"}
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            {product.category_name || "دسته بندی نشده"}
          </p>
          <p className="text-lg font-bold text-blue-600 mt-2">{displayPrice}</p>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
          <ShoppingCart size={18} />
          <span>افزودن به سبد</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
