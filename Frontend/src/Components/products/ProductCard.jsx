// src/components/ProductCard.jsx

import React from "react";
import { Heart, Eye } from "lucide-react";
import { Link } from "react-router-dom";

// This component now receives the CLEAN, MAPPED product object.
const ProductCard = ({ product, onQuickView, wishlist, onToggleWishlist }) => {
  const isWishlisted = wishlist.includes(product.id);

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView(product);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist(product.id);
  };

  return (
    <div className="group relative">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
          {/* USE THE MAPPED 'imageUrl' (camelCase) */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover object-center"
          />

          {/* USE THE MAPPED 'hoverImageUrl' */}
          {product.hoverImageUrl && (
            <img
              src={product.hoverImageUrl}
              alt={`${product.name} hover`}
              className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}
        </div>
      </Link>

      <div className="absolute inset-x-0 bottom-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4">
        <button
          onClick={handleQuickViewClick}
          className="w-full bg-white/80 backdrop-blur-sm text-gray-900 font-semibold py-2 px-4 rounded-md shadow-md hover:bg-white flex items-center justify-center"
        >
          <Eye className="mr-2 h-5 w-5" />
          Quick View
        </button>
      </div>

      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            <Link to={`/product/${product.id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.brand}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.name}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">{`€${product.price.toFixed(
            2
          )}`}</p>
          <p className="mt-1 text-xs text-gray-500">Size: {product.size}</p>
        </div>
      </div>

      <button
        onClick={handleWishlistClick}
        className="absolute top-2 right-2 p-1.5 bg-white/70 rounded-full text-gray-500 hover:text-red-500 transition-all duration-200 z-10"
      >
        <Heart
          size={20}
          className={isWishlisted ? "text-red-500" : "text-gray-500"}
          fill={isWishlisted ? "currentColor" : "none"}
        />
      </button>
    </div>
  );
};

export default ProductCard;
