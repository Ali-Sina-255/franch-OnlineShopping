import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000";

// A helper to get a clear error message from a failed API call
const getErrorMessage = (error) => {
  const errorData = error.response?.data;
  if (!errorData) return error.message || "An unknown error occurred.";
  if (typeof errorData === "string") return errorData;
  if (errorData.detail) return errorData.detail;
  // This will grab all validation errors from DRF and join them.
  return Object.entries(errorData)
    .map(([key, value]) => `${key}: ${value.join(", ")}`)
    .join("; ");
};

// This needs to be outside so it can be used in injectStore
let store;

// Create a reusable axios instance
const api = axios.create({ baseURL: BASE_URL });

// Use an interceptor to automatically add the auth token to every request
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

// --- ASYNC THUNKS FOR PROFILE MANAGEMENT (TAILORED TO YOUR BACKEND) ---

// Fetches the combined user and profile data from your /profiles/me/ endpoint
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/v1/profiles/me/");
      return response.data;
    } catch (error) {
      toast.error("Could not load profile.");
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Performs the two-step update required by your backend within a single action
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (profileData, { rejectWithValue, dispatch }) => {
    try {
      // --- STEP 1: Update the User model (first_name, last_name) ---
      const userPayload = {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
      };
      // Your CustomUserDetailsView is at `/api/v1/users/me/` from your original code.
      // This view updates the User model.
      await api.put("/api/v1/users/me/", userPayload);

      // --- STEP 2: Update the Profile model (rest of the data) ---
      const profilePayload = new FormData();
      profilePayload.append("phone_number", profileData.phone_number || "");
      profilePayload.append("about_me", profileData.about_me || "");
      profilePayload.append("gender", profileData.gender);
      profilePayload.append("country", profileData.country);
      profilePayload.append("city", profileData.city || "");

      // Only append the photo if a new one was selected (it will be a File object)
      if (
        profileData.profile_photo &&
        typeof profileData.profile_photo !== "string"
      ) {
        profilePayload.append("profile_photo", profileData.profile_photo);
      }

      // Your UpdateProfileAPIView is at `/api/v1/profiles/me/update/`
      // This view updates the Profile model.
      await api.put("/api/v1/profiles/me/update/", profilePayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile updated successfully!");

      // After both updates succeed, re-fetch the profile to get the latest data
      const updatedProfile = await dispatch(fetchUserProfile()).unwrap();
      return updatedProfile;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message || "Failed to update profile.");
      return rejectWithValue(message);
    }
  }
);

// --- INITIAL STATE ---
const initialState = {
  currentUser: null,
  profile: null, // This will hold the detailed profile data
  accessToken: null,
  refreshToken: null,
  cart: null,
  cartItems: [],
  cartLoading: false,
  error: null,
  loading: false, // Unified loading state for auth/profile actions
};

// --- AUTH & CART THUNKS (Provided for completeness) ---

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

      // On sign-in, dispatch actions to get all necessary user data
      dispatch(fetchUserProfile());
      dispatch(fetchUserCart());

      toast.success("Login successful!");
      return { accessToken: access, refreshToken: refresh };
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

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
      toast.error("Item is already in your bag.");
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

export const updateCartItemQuantity = createAsyncThunk(
  "user/updateCartItemQuantity",
  async ({ cartItemId, quantity }, { rejectWithValue }) => {
    if (quantity <= 0) {
      return rejectWithValue("Quantity must be greater than 0.");
    }
    try {
      const response = await api.patch(
        `/api/v1/cart/cart-items/${cartItemId}/`,
        { quantity: quantity }
      );
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
      Object.assign(state, initialState); // Reset all state properties to their initial values
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

      // Cart Reducers
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
      .addCase(addItemToCart.pending, (state) => {
        state.cartLoading = true;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.cartItems.push(action.payload);
        state.cartLoading = false;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.cartLoading = false;
      })
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
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        const index = state.cartItems.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.cartItems[index] = action.payload;
        }
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        console.error("Failed to update quantity:", action.payload);
        state.error = action.payload;
      })

      // --- PROFILE REDUCERS ---
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.currentUser = {
          id: action.payload.user_id,
          email: action.payload.email,
          first_name: action.payload.first_name,
          last_name: action.payload.last_name,
        };
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.currentUser = {
          ...state.currentUser,
          first_name: action.payload.first_name,
          last_name: action.payload.last_name,
        };
        state.loading = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { signOutSuccess, clearUserError } = userSlice.actions;
export default userSlice.reducer;

export const injectStore = (_store) => {
  store = _store;
};
