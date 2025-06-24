// src/api/axiosConfig.js

import axios from "axios";

const apiClient = axios.create({
  // Add `/v1` to the baseURL to match your Django URL configuration
  baseURL: "http://127.0.0.1:8000/api/v1/", // <--- THIS IS THE FIX
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
