// src/services/api.js
import axios from "axios";

// --- Configuration ---
// Make sure to replace this with your actual backend URL.
// If your React app and Django backend are on the same domain in production,
// you can use a relative path like '/api/v1/'.
const API_BASE_URL = "http://localhost:8000/api/v1/";

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// You can add an interceptor here to automatically add the auth token to requests
// if you have authentication implemented.
// Example:
/*
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken'); // or wherever you store it
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
*/

// --- API Functions ---

/**
 * Fetches a paginated list of products based on filters.
 * @param {object} params - The query parameters for filtering, sorting, and pagination.
 * @returns {Promise<object>} The API response with product data.
 */
export const fetchProducts = (params) => {
  return api.get("product/product/", { params });
};

/**
 * Fetches a single product by its ID.
 * @param {number|string} productId - The ID of the product.
 * @returns {Promise<object>} The API response with the product detail.
 */
export const fetchProductById = (productId) => {
  return api.get(`product/product/${productId}/`);
};

/**
 * Fetches a list of all available brands.
 * @returns {Promise<object>} The API response with the list of brands.
 */
export const fetchBrands = () => {
  // Assuming pagination is not an issue for brands, or fetching all.
  // You might need to handle pagination if you have many brands.
  return api.get("product/brand/", { params: { page_size: 100 } });
};

/**
 * Fetches a list of all available categories.
 * @returns {Promise<object>} The API response with the list of categories.
 */
export const fetchCategories = () => {
  return api.get("category/", { params: { page_size: 100 } });
};


export const extractUniqueAttributes = (products, attributeKey) => {
  const valueSet = new Set();
  products.forEach((product) => {
    if (product.attributes && product.attributes[attributeKey]) {
      valueSet.add(product.attributes[attributeKey]);
    }
  });
  return Array.from(valueSet);
};
