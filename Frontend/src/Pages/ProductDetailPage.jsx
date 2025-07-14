import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShieldCheck, AlertTriangle, Tag, Heart, Loader2 } from "lucide-react";
import { fetchProductById } from "../services/api.js";
import { mapProductFromApi } from "../utils/product-mapper";
import { toast } from "react-hot-toast";

// Redux Imports for state and actions
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../state/userSlice/userSlice";

// Skeleton component for a clean loading state
const ProductDetailSkeleton = () => (
  <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8">
      <div className="space-y-6">
        <div className="aspect-square w-full bg-gray-200 rounded-lg" />
        <div className="grid grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-md" />
          ))}
        </div>
      </div>
      <div className="mt-10 lg:mt-0 space-y-6">
        <div className="h-8 w-3/4 bg-gray-200 rounded-md" />
        <div className="h-6 w-1/4 bg-gray-200 rounded-md" />
        <div className="h-10 w-1/3 bg-gray-200 rounded-md" />
        <div className="h-24 w-full bg-gray-200 rounded-md" />
        <div className="h-12 w-full bg-gray-200 rounded-md" />
      </div>
    </div>
  </div>
);

const ProductDetailPage = ({ wishlist = [], onToggleWishlist = () => {} }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- Redux Hooks ---
  const dispatch = useDispatch();
  const { accessToken, cartItems, cartLoading } = useSelector(
    (state) => state.user
  );

  // --- Component State ---
  const [product, setProduct] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState("");
  const imageRef = useRef(null);

  // Effect to fetch product details on component mount or ID change
  useEffect(() => {
    const loadProduct = async () => {
      setIsPageLoading(true);
      try {
        const { data } = await fetchProductById(id);
        const mappedProduct = mapProductFromApi(data);
        setProduct(mappedProduct);
        if (mappedProduct?.imageUrl) {
          setCurrentImage(mappedProduct.imageUrl);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error("Could not load the requested product.");
        setProduct(null);
      } finally {
        setIsPageLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  // Handler for adding an item to the cart with built-in debugging
  const handleAddToCart = () => {
    console.log("--- [DEBUG] handleAddToCart triggered ---");

    // Check 1: Is the product object available?
    if (!product) {
      console.error(
        "❌ DEBUG: 'Add to Cart' clicked, but 'product' state is null. Aborting."
      );
      return;
    }
    console.log("✅ DEBUG: Product is loaded:", product);

    // Check 2: Is the user logged in?
    if (!accessToken) {
      console.error(
        "❌ DEBUG: User is not logged in ('accessToken' is falsy). Aborting."
      );
      toast.error("Please sign in to add items to your bag.");
      navigate("/signin"); // Redirect user to sign-in page
      return;
    }
    console.log("✅ DEBUG: User is logged in. Token found.");

    // Check 3: Is the item already in the cart?
    console.log(
      `🔎 DEBUG: Checking if product ID ${product.id} is in cartItems:`,
      cartItems
    );

    const isAlreadyInCart = cartItems.some((item) => {
      // Critical check for data integrity from the cart API
      if (!item.product || typeof item.product.id === "undefined") {
        console.warn(
          "⚠️ DEBUG: A cart item is malformed (missing 'product' or 'product.id'):",
          item
        );
        return false;
      }
      return item.product.id === product.id;
    });

    if (isAlreadyInCart) {
      console.error(
        `❌ DEBUG: Product ID ${product.id} is already in the cart. Aborting.`
      );
      toast.error(`${product.name} is already in your bag.`);
      return;
    }
    console.log(`✅ DEBUG: Product ID ${product.id} is not in the cart.`);

    // If all checks pass, dispatch the action.
    const itemData = { product_id: product.id, quantity: 1 };
    console.log(
      "🚀 DEBUG: All checks passed. Dispatching 'addItemToCart' with payload:",
      itemData
    );
    dispatch(addItemToCart(itemData));
  };

  // --- Render Logic ---
  if (isPageLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
        <p className="text-gray-600 mt-2">
          The item you are looking for may have been sold or removed.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors font-semibold"
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
          {/* Image gallery */}
          <div className="flex flex-col gap-6">
            <div className="aspect-square w-full overflow-hidden rounded-lg">
              <img
                ref={imageRef}
                src={currentImage}
                alt={product.name}
                className="h-full w-full object-cover object-center transition-opacity duration-300"
              />
            </div>
            <div className="hidden sm:grid grid-cols-4 gap-6">
              {(product.images || []).map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(image)}
                  className={`aspect-square rounded-md overflow-hidden transition-all duration-200 ${
                    currentImage === image
                      ? "ring-2 ring-indigo-500 ring-offset-2"
                      : "hover:ring-2 hover:ring-indigo-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  {product.name}
                </h1>
                <p className="text-xl mt-2 text-gray-500">{product.brand}</p>
              </div>
              <p className="text-3xl tracking-tight text-gray-900">
                €{product.price.toFixed(2)}
              </p>
              <div className="flex items-center flex-wrap gap-2">
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
              <div className="flex items-center">
                <ShieldCheck className="h-6 w-6 text-green-600 mr-2" />
                <p className="font-medium text-gray-800">
                  Condition: {product.condition}
                </p>
              </div>
              {product.sellerNotes && (
                <div className="rounded-lg bg-yellow-50 p-4">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Seller's Note
                      </h3>
                      <p className="mt-2 text-sm text-yellow-700">
                        {product.sellerNotes}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Description
                </h3>
                <p className="mt-4 text-base text-gray-700">
                  {product.description}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Details</h3>
                <ul className="list-disc space-y-2 pl-4 mt-4 text-gray-600">
                  {(product.details || []).map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
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
            </div>
            <div className="mt-10 flex items-center gap-x-4">
              <button
                onClick={handleAddToCart}
                disabled={isPageLoading || cartLoading} // Disable button when page or cart is loading
                className="flex-1 flex items-center justify-center rounded-md border border-transparent bg-gray-900 px-8 py-3 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {cartLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Add to bag"
                )}
              </button>
              <button
                onClick={() => onToggleWishlist(product.id)}
                disabled={isPageLoading} // Disable wishlist button too while page is loading
                className="flex items-center justify-center rounded-md p-3 text-gray-400 border border-gray-300 hover:bg-gray-100 hover:text-red-500 transition-colors disabled:opacity-50"
              >
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
