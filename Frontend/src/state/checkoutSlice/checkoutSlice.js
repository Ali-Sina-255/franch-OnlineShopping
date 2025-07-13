import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { fetchUserCart } from "../userSlice/userSlice";
import axios from "axios";

// This function creates an API client instance that can attach the auth token.
const createApiClient = (getState) => {
  const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000",
  });

  api.interceptors.request.use((config) => {
    const token = getState().user.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
};

const initialState = {
  order: null,
  loading: false,
  error: null,
};

// This thunk will take the form data and create the order
export const placeOrder = createAsyncThunk(
  "checkout/placeOrder",
  async (orderData, { dispatch, getState, rejectWithValue }) => {
    try {
      const api = createApiClient(getState);
      // This URL is correct and matches your Django urls.py
      const response = await api.post("/api/v1/orders/orders/", orderData);

      toast.success("Order placed successfully!");

      dispatch(fetchUserCart());

      return response.data;
    } catch (error) {
      // This part handles errors from the server, which will now work correctly
      const message =
        error.response?.data?.detail ||
        "Failed to place order. Please check your details.";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrder } = checkoutSlice.actions;
export default checkoutSlice.reducer;
