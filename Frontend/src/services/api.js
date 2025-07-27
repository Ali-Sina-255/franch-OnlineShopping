import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1/";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fetches a paginated list of products, returns the paginated object { count, results, ... }
export const fetchProduct = async (params) => {
  const response = await api.get("product/product/", { params });
  return response.data;
};

export const fetchProducts = async (params) => {
  return api.get("product/product/", { params });
  return 
};

// Fetches a single product by its ID
export const fetchProductById = (productId) => {
  return api.get(`product/product/${productId}/`);
};

// Fetches all categories
export const fetchCategories = () => {
  return api.get("category/", { params: { page_size: 100 } });
};

// Fetches the user's cart or creates one if it doesn't exist
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

// Fetches items in a specific cart
export const getCartItems = async (cartId) => {
  const { data } = await api.get("cart/cart-items/");
  return data.filter((item) => item.cart === cartId);
};

// Adds an item to a cart
export const addItemToCart = async (itemData) => {
  const { data } = await api.post("cart/cart-items/", itemData);
  return data;
};

// Removes an item from a cart
export const removeItemFromCart = async (cartItemId) => {
  await api.delete(`cart/cart-items/${cartItemId}/`);
};

// Helper function to extract unique product attributes
export const extractUniqueAttributes = (products, attributeKey) => {
  const valueSet = new Set();
  products.forEach((product) => {
    if (product.attributes && product.attributes[attributeKey]) {
      valueSet.add(product.attributes[attributeKey]);
    }
  });
  return Array.from(valueSet).sort();
};

// Fetches aggregated sales summary data for the dashboard
export const fetchProductSalesSummary = async () => {
  try {
    const response = await api.get("cart/product-sales-summary/");
    return response.data;
  } catch (error) {
    console.error("Error fetching sales summary:", error);
    throw error;
  }
};

// Fetches the most recent orders for the dashboard
export const fetchRecentOrders = async () => {
  try {
    const response = await api.get("cart/orders/", {
      params: {
        ordering: "-date",
        page_size: 5,
      },
    });
    // This API returns a direct array, not a paginated object
    return response.data || [];
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    throw error;
  }
};

// Fetches ALL products by handling pagination
export const fetchAllProducts = async () => {
  let allProducts = [];
  let currentPageUrl = "product/product/";

  try {
    while (currentPageUrl) {
      const response = await api.get(currentPageUrl);
      const data = response.data;

      if (data.results) {
        allProducts = allProducts.concat(data.results);
      }
      currentPageUrl = data.next ? data.next.replace(API_BASE_URL, "") : null;
    }
    return allProducts;
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw error;
  }
};
