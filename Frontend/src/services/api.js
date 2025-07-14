// src/services/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1/";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Or `Token ${token}`
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- PRODUCT API FUNCTIONS ---
export const fetchProducts = (params) => {
  return api.get("product/product/", { params });
};

export const fetchProductById = (productId) => {
  return api.get(`product/product/${productId}/`);
};

export const fetchCategories = () => {
  return api.get("category/", { params: { page_size: 100 } });
};

// --- CART API FUNCTIONS ---
export const getOrCreateCart = async () => {
  try {
    const response = await api.get("cart/cart/");
    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0];
    } else {
      const createResponse = await api.post("cart/cart/", {});
      return createResponse.data;
    }
  } catch (error) {
    console.error(
      "Error getting or creating cart:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getCartItems = async (cartId) => {
  const { data } = await api.get("cart/cart-items/");
  return data.filter((item) => item.cart === cartId);
};

export const addItemToCart = async (itemData) => {
  const { data } = await api.post("cart/cart-items/", itemData);
  return data;
};

export const removeItemFromCart = async (cartItemId) => {
  // IMPORTANT: Backend needs a DELETE route like: /cart/cart-items/<int:pk>/
  await api.delete(`cart/cart-items/${cartItemId}/`);
};

// --- THIS IS THE FIX ---
// Add the missing function and export it.

/**
 * A utility to extract unique attribute values from a list of products.
 * This is crucial for building the dynamic filter sidebar.
 * @param {Array<object>} products - The list of products from the API.
 * @param {string} attributeKey - The key of the attribute (e.g., 'color', 'size', 'brand').
 * @returns {Array<string>} A unique, sorted list of attribute values.
 */
export const extractUniqueAttributes = (products, attributeKey) => {
  const valueSet = new Set();
  products.forEach((product) => {
    // Safely access nested attributes
    if (product.attributes && product.attributes[attributeKey]) {
      valueSet.add(product.attributes[attributeKey]);
    }
  });
  // Return a sorted array for a consistent UI
  return Array.from(valueSet).sort();
};
