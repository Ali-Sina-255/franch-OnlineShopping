// src/pages/ProductDetailPage.jsx

import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductById } from "../services/api";
import { mapProductFromApi } from "../utils/product-mapper";
import { ShieldCheck, AlertTriangle, Tag, Heart } from "lucide-react";

// A dedicated component for the loading skeleton to keep the main component cleaner
const ProductDetailSkeleton = () => (
  <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8">
      {/* Image Skeleton */}
      <div className="animate-pulse">
        <div className="aspect-h-1 aspect-w-1 w-full bg-gray-200 rounded-lg"></div>
        <div className="mt-6 grid grid-cols-4 gap-6">
          <div className="aspect-h-1 aspect-w-1 bg-gray-200 rounded-md"></div>
          <div className="aspect-h-1 aspect-w-1 bg-gray-200 rounded-md"></div>
          <div className="aspect-h-1 aspect-w-1 bg-gray-200 rounded-md"></div>
          <div className="aspect-h-1 aspect-w-1 bg-gray-200 rounded-md"></div>
        </div>
      </div>
      {/* Info Skeleton */}
      <div className="animate-pulse mt-10 lg:mt-0">
        <div className="h-8 w-3/4 bg-gray-200 rounded-md"></div>
        <div className="mt-4 h-6 w-1/4 bg-gray-200 rounded-md"></div>
        <div className="mt-8 h-10 w-1/3 bg-gray-200 rounded-md"></div>
        <div className="mt-8 h-24 w-full bg-gray-200 rounded-md"></div>
        <div className="mt-10 h-12 w-full bg-gray-200 rounded-md"></div>
      </div>
    </div>
  </div>
);

const ProductDetailPage = ({ onAddToCart, wishlist, onToggleWishlist }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState("");
  const imageRef = useRef(null);

  useEffect(() => {
    const getProduct = async () => {
      setIsLoading(true);
      try {
        const res = await fetchProductById(id);
        const mappedProduct = mapProductFromApi(res.data);
        setProduct(mappedProduct);
        if (mappedProduct && mappedProduct.imageUrl) {
          setCurrentImage(mappedProduct.imageUrl);
        }
      } catch (error) {
        console.error("Failed to fetch product", error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };
    getProduct();
  }, [id]);

  const handleAddToCartClick = () => {
    if (product) {
      // Pass the mapped product object, which is what the rest of the app expects
      onAddToCart(product, imageRef);
    }
  };

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <Link
          to="/"
          className="mt-6 inline-block bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-700"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* --- MODERN & ROBUST IMAGE GALLERY --- */}
          <div className="flex flex-col gap-6">
            {/* Main Image View */}
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg">
              <img
                ref={imageRef}
                src={currentImage}
                alt={product.name}
                className="h-full w-full object-cover object-center transition-opacity duration-300"
              />
            </div>

            {/* Thumbnail Grid */}
            <div className="hidden sm:grid grid-cols-4 gap-6">
              {product.images.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(image)}
                  className={`aspect-h-1 aspect-w-1 rounded-md overflow-hidden ring-2 focus:outline-none transition-all duration-200 ${
                    currentImage === image
                      ? "ring-indigo-500 ring-offset-2"
                      : "ring-transparent hover:ring-indigo-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${idx + 1}`}
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          </div>
          {/* --- END OF IMAGE GALLERY --- */}

          {/* Product Info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>
            <p className="text-xl mt-2 text-gray-500">{product.brand}</p>

            <div className="mt-4">
              <p className="text-3xl tracking-tight text-gray-900">{`€${product.price.toFixed(
                2
              )}`}</p>
            </div>

            <div className="mt-6 flex items-center flex-wrap gap-2">
              <Tag className="h-5 w-5 text-gray-400" />
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-8">
              <div className="flex items-center">
                <ShieldCheck className="h-6 w-6 text-green-600 mr-2" />
                <p className="font-medium text-gray-800">
                  Condition: {product.condition}
                </p>
              </div>
            </div>

            {product.sellerNotes && (
              <div className="mt-6 rounded-lg bg-yellow-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle
                      className="h-5 w-5 text-yellow-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Seller's Note
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>{product.sellerNotes}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900">Description</h3>
              <div className="mt-4 space-y-6 text-base text-gray-700">
                <p>{product.description}</p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900">Details</h3>
              <ul className="list-disc space-y-2 pl-4 mt-4 text-gray-600">
                {product.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex justify-between text-sm">
              <div>
                <span className="font-medium text-gray-900">Color:</span>{" "}
                {product.color}
              </div>
              <div>
                <span className="font-medium text-gray-900">Material:</span>{" "}
                {product.material}
              </div>
              <div>
                <span className="font-medium text-gray-900">Size:</span>{" "}
                {product.size}
              </div>
            </div>

            <div className="mt-10 flex items-center gap-x-4">
              <button
                type="button"
                onClick={handleAddToCartClick}
                className="flex-1 flex items-center justify-center rounded-md border border-transparent bg-gray-900 px-8 py-3 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                Add to bag
              </button>
              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                className="flex items-center justify-center rounded-md p-3 text-gray-400 border border-gray-300 hover:bg-gray-100 hover:text-red-500"
              >
                <span className="sr-only">Add to wishlist</span>
                <Heart
                  className={isWishlisted ? "text-red-500" : "text-gray-500"}
                  fill={isWishlisted ? "currentColor" : "none"}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
