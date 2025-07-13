import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// --- 1. ADD THIS IMPORT ---
// Import the injector function from your userSlice in addition to the reducer.
import userReducer, { injectStore } from "./userSlice/userSlice";
import themeReducer from "./Theme/themeSlice";

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

// Fixed typo: 'persisteReducer' -> 'persistedReducer'
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // This is okay for redux-persist
    }),
});

// --- 2. ADD THIS LINE ---
// This is the CRITICAL step. It gives the axios interceptor in `userSlice.js`
// access to the store, allowing it to get the auth token for all API calls.
injectStore(store);

export const persistor = persistStore(store);
