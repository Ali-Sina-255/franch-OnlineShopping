// src/components/ProductCardSkeleton.jsx

import React from "react";

const ProductCardSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Image Placeholder */}
      <div className="w-full bg-gray-200 rounded-md aspect-w-1 aspect-h-1 lg:h-80"></div>

      <div className="mt-4 flex justify-between">
        <div>
          {/* Brand Placeholder */}
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          {/* Name Placeholder */}
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="text-right">
          {/* Price Placeholder */}
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
