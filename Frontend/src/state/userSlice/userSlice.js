import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper to get the base URL from environment variables or a default for development
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000";

// A utility function to parse complex DRF errors into a single string
const getErrorMessage = (error) => {
  const errorData = error.response?.data;
  if (!errorData) {
    return error.message || "An unknown error occurred.";
  }
  if (typeof errorData === "string") {
    return errorData;
  }
  // Handles errors like {"email": ["email already exists"], "username": ["..."]}
  return Object.values(errorData).flat().join(" ");
};

const initialState = {
  currentUser: null,
  accessToken: null,
  refreshToken: null,
  error: null,
  loading: false,
};

/**
 * ASYNC THUNK: User Registration
 * Corresponds to your backend's `/api/v1/auth/register/` endpoint.
 */
export const createUser = createAsyncThunk(
  "user/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const endpoint = `${BASE_URL}/api/v1/auth/register/`;
      // Your backend serializer expects password1 and password2
      const response = await axios.post(endpoint, {
        ...userData,
        password1: userData.password,
        password2: userData.password,
      });
      // A successful registration returns the new user object but doesn't log them in.
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

/**
 * ASYNC THUNK: User Login
 * Implements a two-step login: 1. Get tokens, 2. Get user details.
 */
export const signIn = createAsyncThunk(
  "user/signIn",
  async (credentials, { rejectWithValue }) => {
    try {
      // Step 1: Get access and refresh tokens
      const tokenResponse = await axios.post(
        `${BASE_URL}/api/v1/auth/token/`,
        credentials
      );
      const { access, refresh } = tokenResponse.data;

      // Step 2: Use the access token to get user details.
      // NOTE: Ensure '/api/user/' is a valid endpoint in your Django urls.py
      // pointing to a view like `CustomUserDetailsView`.
      const userDetailsResponse = await axios.get(`${BASE_URL}/api/user/`, {
        headers: { Authorization: `Bearer ${access}` },
      });

      return {
        accessToken: access,
        refreshToken: refresh,
        userData: userDetailsResponse.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || getErrorMessage(error)
      );
    }
  }
);

/**
 * ASYNC THUNK: Update User Profile
 * Corresponds to a PATCH request to your `CustomUserDetailsView`.
 */
export const updateUser = createAsyncThunk(
  "user/updateUser",
  // Expects an object with fields to update, e.g., { first_name, city }
  async (userDataToUpdate, { getState, rejectWithValue }) => {
    try {
      // Get the current access token from the Redux state
      const { accessToken } = getState().user;
      if (!accessToken) {
        return rejectWithValue("Not authenticated. Please log in again.");
      }

      const endpoint = `${BASE_URL}/api/user/`;

      const response = await axios.patch(endpoint, userDataToUpdate, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Backend should return the fully updated user object
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  // Synchronous actions
  reducers: {
    signOutSuccess: (state) => {
      state.currentUser = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = null;
      state.loading = false;
    },
    clearUserError: (state) => {
      state.error = null;
    },
  },
  // Handles state changes for asynchronous actions
  extraReducers: (builder) => {
    builder
      // Sign In Reducers
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.userData;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create User (Registration) Reducers
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.loading = false;
        // Successful registration, but we don't log the user in here.
        // The user is redirected to the login page by the UI.
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update User Reducers
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        // Update the currentUser state with the fresh data from the backend
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

// Export the synchronous actions
export const { signOutSuccess, clearUserError } = userSlice.actions;

// Export the reducer as the default export
export default userSlice.reducer;
