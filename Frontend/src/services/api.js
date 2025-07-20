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
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchProducts = (params) => {
  return api.get("product/product/", { params });
};

export const fetchProductById = (productId) => {
  return api.get(`product/product/${productId}/`);
};

export const fetchCategories = () => {
  return api.get("category/", { params: { page_size: 100 } });
};

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
  await api.delete(`cart/cart-items/${cartItemId}/`);
};


export const extractUniqueAttributes = (products, attributeKey) => {
  const valueSet = new Set();
  products.forEach((product) => {
    if (product.attributes && product.attributes[attributeKey]) {
      valueSet.add(product.attributes[attributeKey]);
    }
  });
  return Array.from(valueSet).sort();
};
