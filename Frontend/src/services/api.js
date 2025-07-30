import axios from "axios";
import { store } from "../state/store";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to add the auth token from the Redux store. This part is correct.
api.interceptors.request.use(
  (config) => {
    const token = store.getState().user.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);




export const fetchProducts = async (params) => {
  return api.get("/api/v1/product/product/", { params });
};

export const fetchProduct = async (params) => {
  const response = await api.get("/api/v1/product/product/", { params });
  return response.data;
};

export const fetchProductById = (productId) => {
  return api.get(`/api/v1/product/product/${productId}/`);
};

export const fetchCategories = () => {
  return api.get("/api/v1/category/", { params: { page_size: 100 } });
};


export const getOrCreateCart = async () => {
  try {
    const response = await api.get("/api/v1/cart/cart/");
    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0];
    } else {
      const createResponse = await api.post("/api/v1/cart/cart/", {});
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
  const { data } = await api.get("/api/v1/cart/cart/");
  return data;
};

export const addItemToCart = async (itemData) => {
  const { data } = await api.post("/api/v1/cart/cart/", itemData);
  return data;
};

export const removeItemFromCart = async (cartItemId) => {
};

export const applyDeliveryAPI = ({ orderId, deliveryData }) => {
  return api.post(`/api/v1/product/delivery/create/${orderId}/`, deliveryData);
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

export const fetchProductSalesSummary = async () => {
  try {
    const response = await api.get("/api/v1/cart/product-sales-summary/");
    return response.data;
  } catch (error) {
    console.error("Error fetching sales summary:", error);
    throw error;
  }
};

export const fetchRecentOrders = async () => {
  try {
    const response = await api.get("/api/v1/cart/orders/", {
      params: {
        ordering: "-date",
        page_size: 5,
      },
    });
    return response.data || [];
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    throw error;
  }
};

export const fetchAllProducts = async () => {
  let allProducts = [];
  let currentPageUrl = "/api/v1/product/product/"; 

  try {
    while (currentPageUrl) {
      const response = await api.get(currentPageUrl);
      const data = response.data;

      if (data.results) {
        allProducts = allProducts.concat(data.results);
      }
      currentPageUrl = data.next
        ? new URL(data.next).pathname + new URL(data.next).search
        : null;
    }
    return allProducts;
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw error;
  }
};
