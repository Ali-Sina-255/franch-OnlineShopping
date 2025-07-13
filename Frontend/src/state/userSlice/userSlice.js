import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000";

const getErrorMessage = (error) => {
  const errorData = error.response?.data;
  if (!errorData) return error.message || "An unknown error occurred.";
  if (typeof errorData === "string") return errorData;
  if (errorData.detail) return errorData.detail;
  return Object.values(errorData).flat().join(" ");
};

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  try {
    const token = store.getState().user.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn(
      "Could not get token for request. Store might not be injected yet."
    );
  }
  return config;
});

const initialState = {
  currentUser: null,
  accessToken: null,
  refreshToken: null,
  cart: null,
  cartItems: [],
  cartLoading: false,
  error: null,
  loading: false,
};

// --- AUTH ASYNC THUNKS ---

export const createUser = createAsyncThunk(
  "user/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const endpoint = `/api/v1/auth/register/`;
      const response = await axios.post(`${BASE_URL}${endpoint}`, {
        ...userData,
        password1: userData.password,
        password2: userData.password,
      });
      toast.success("Registration successful! Please sign in.");
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const signIn = createAsyncThunk(
  "user/signIn",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const tokenResponse = await axios.post(
        `${BASE_URL}/api/v1/auth/token/`,
        credentials
      );
      const { access, refresh } = tokenResponse.data;

      const userDetailsResponse = await axios.get(
        `${BASE_URL}/api/v1/auth/register/`,
        {
          headers: { Authorization: `Bearer ${access}` },
        }
      );

      dispatch(fetchUserCart());
      toast.success("Login successful!");
      return {
        accessToken: access,
        refreshToken: refresh,
        userData: Array.isArray(userDetailsResponse.data)
          ? userDetailsResponse.data[0]
          : userDetailsResponse.data,
      };
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// --- CART ASYNC THUNKS ---

export const fetchUserCart = createAsyncThunk(
  "user/fetchUserCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/v1/cart/cart/");
      let cartData = response.data.results?.[0];
      if (!cartData) {
        const createResponse = await api.post("/api/v1/cart/cart/", {});
        cartData = createResponse.data;
      }
      return cartData;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const addItemToCart = createAsyncThunk(
  "user/addItemToCart",
  async (itemData, { getState, rejectWithValue }) => {
    const { cartItems } = getState().user;
    const existingItem = cartItems.find(
      (item) => item.product.id === itemData.product_id
    );
    if (existingItem) {
      return rejectWithValue("Item already in cart.");
    }
    try {
      const response = await api.post("/api/v1/cart/cart-items/", itemData);
      toast.success("Item added to bag!");
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  "user/removeItemFromCart",
  async (cartItemId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/cart/cart-items/${cartItemId}/`);
      toast.success("Item removed from bag.");
      return cartItemId;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// --- NEW THUNK FOR QUANTITY UPDATE ---
export const updateCartItemQuantity = createAsyncThunk(
  "user/updateCartItemQuantity",
  async ({ cartItemId, quantity }, { rejectWithValue }) => {
    if (quantity <= 0) {
      return rejectWithValue("Quantity must be greater than 0.");
    }
    try {
      const response = await api.patch(
        `/api/v1/cart/cart-items/${cartItemId}/`,
        {
          quantity: quantity,
        }
      );
      // We don't toast here to avoid it being too "noisy" on every click
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// --- THE SLICE DEFINITION ---

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signOutSuccess: (state) => {
      state.currentUser = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.cart = null;
      state.cartItems = [];
      state.error = null;
      state.loading = false;
      toast("You have been signed out.");
    },
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Auth Reducers
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.userData;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cart Fetching Reducers
      .addCase(fetchUserCart.pending, (state) => {
        state.cartLoading = true;
      })
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.cartItems = action.payload.items || [];
        state.cartLoading = false;
      })
      .addCase(fetchUserCart.rejected, (state, action) => {
        state.error = action.payload;
        state.cartLoading = false;
      })

      // Add Item Reducers
      .addCase(addItemToCart.pending, (state) => {
        state.cartLoading = true;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.cartItems.push(action.payload);
        state.cartLoading = false;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        if (action.payload !== "Item already in cart.") {
          state.error = action.payload;
        }
        state.cartLoading = false;
      })

      // Remove Item Reducers
      .addCase(removeItemFromCart.pending, (state) => {
        state.cartLoading = true;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.cartItems = state.cartItems.filter(
          (item) => item.id !== action.payload
        );
        state.cartLoading = false;
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.cartLoading = false;
        state.error = action.payload;
      })

      // --- NEW REDUCER CASE FOR QUANTITY UPDATE ---
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        const index = state.cartItems.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          // Replace the old item in the array with the updated one from the server
          state.cartItems[index] = action.payload;
        }
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        // Log error but don't disrupt UX too much for a quantity update fail
        console.error("Failed to update quantity:", action.payload);
        state.error = action.payload;
      });
  },
});

export const { signOutSuccess, clearUserError } = userSlice.actions;
export default userSlice.reducer;

let store;
export const injectStore = (_store) => {
  store = _store;
};
