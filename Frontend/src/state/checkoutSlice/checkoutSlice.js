// src/state/checkoutSlice/js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { fetchUserCart } from "../userSlice/userSlice"; // To refresh the cart after order
import axios from "axios";

// This helper function creates an API client instance that attaches the auth token.
// It's the same as your code, just ensures we have the `api` object.
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

// **THIS IS THE CORRECTED THUNK**
// It now accepts a structured payload with both order and payment details
export const placeOrder = createAsyncThunk(
  "checkout/placeOrder",
  async (
    { orderDetails, paypalDetails },
    { dispatch, getState, rejectWithValue }
  ) => {
    const api = createApiClient(getState);
    try {
      // --- STEP 1: Create the Payment Record ---
      console.log(
        "STEP 1: Creating Payment record with payload:",
        paypalDetails
      );
      const paymentPayload = {
        payment_id: paypalDetails.id, // The PayPal transaction ID
        payment_method: "PayPal",
        amount_paid: paypalDetails.purchase_units[0].amount.value,
        status: paypalDetails.status, // e.g., "COMPLETED"
      };

      const paymentResponse = await api.post(
        "/api/v1/orders/payments/",
        paymentPayload
      );
      const paymentId = paymentResponse.data.id; // Get the DB ID of the new Payment
      console.log(`SUCCESS: Payment record created with ID: ${paymentId}`);

      // --- STEP 2: Create the Order Record, linking the Payment ---
      console.log("STEP 2: Creating Order record...");
      const finalOrderPayload = {
        ...orderDetails, // All the shipping form data
        payment: paymentId, // **This is the critical part that was missing**
      };

      const orderResponse = await api.post(
        "/api/v1/orders/orders/",
        finalOrderPayload
      );
      console.log("SUCCESS: Order record created:", orderResponse.data);

      toast.success("Order placed successfully!");

      // Refresh the user's cart, which should now be empty on the backend
      dispatch(fetchUserCart());

      // Return the final, complete order data
      return orderResponse.data;
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.payment?.[0] ||
        "Failed to place order. Please check your details.";
      console.error("Order placement failed:", error.response?.data);
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
