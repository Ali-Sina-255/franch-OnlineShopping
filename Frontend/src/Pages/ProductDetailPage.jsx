// src/pages/ProductDetailPage.jsx

import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "../data/products";
import { ShieldCheck, AlertTriangle, Tag, Heart } from "lucide-react";

const ProductDetailPage = ({ onAddToCart, wishlist, onToggleWishlist }) => {
  const { id } = useParams();
  const product = products.find((p) => p.id == id);
  const [currentImage, setCurrentImage] = useState("");
  const isWishlisted = product ? wishlist.includes(product.id) : false;

  const imageRef = useRef(null); // Create a ref for the image

  useEffect(() => {
    if (product) {
      setCurrentImage(product.imageUrl);
    }
  }, [product]);

  const handleAddToCartClick = () => {
    // Pass the product AND the image element's ref to the handler
    onAddToCart(product, imageRef);
  };

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

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          <div className="flex flex-col-reverse">
            <div className="aspect-h-1 aspect-w-1 w-full mt-4">
              <img
                ref={imageRef} // Attach the ref to the main image
                src={currentImage}
                alt={product.name}
                className="h-full w-full object-cover object-center rounded-lg shadow-lg"
              />
            </div>
            <div className="mx-auto w-full max-w-2xl sm:block lg:max-w-none">
              <div className="grid grid-cols-4 gap-6">
                {product.images.map((image) => (
                  <button
                    key={image}
                    onClick={() => setCurrentImage(image)}
                    className={`relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4 ${
                      currentImage === image
                        ? "ring-2 ring-indigo-500"
                        : "ring-1 ring-gray-300"
                    }`}
                  >
                    <span className="absolute inset-0 overflow-hidden rounded-md">
                      <img
                        src={image}
                        alt=""
                        className="h-full w-full object-cover object-center"
                      />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>
            <p className="text-xl mt-2 text-gray-500">{product.brand}</p>
            <div className="mt-4">
              <p className="text-3xl tracking-tight text-gray-900">{`€${product.price.toFixed(
                2
              )}`}</p>
            </div>
            <div className="mt-4 flex items-center flex-wrap gap-2">
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
              <div className="mt-4 rounded-lg bg-yellow-50 p-4">
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
              <ul
                role="list"
                className="list-disc space-y-2 pl-4 mt-4 text-gray-600"
              >
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
                onClick={handleAddToCartClick} // Use the new handler
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
