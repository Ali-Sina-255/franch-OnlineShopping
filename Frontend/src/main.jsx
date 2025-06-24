// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // --- ADD THIS IMPORT ---
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* --- WRAP APP IN BROWSER ROUTER --- */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
