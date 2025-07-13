import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

import userReducer, { injectStore } from "./userSlice/userSlice";
import themeReducer from "./Theme/themeSlice";
import checkoutReducer from "./checkoutSlice/checkoutSlice"; // --- IMPORT THIS ---

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  checkout: checkoutReducer, // --- ADD THIS ---
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  // To prevent non-serializable state from being persisted for checkout
  blacklist: ["checkout"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

injectStore(store);

export const persistor = persistStore(store);
