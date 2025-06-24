// src/pages/HomePage.jsx

import React from "react";
import { Link } from "react-router-dom";
import ProductListPage from "./ProductListPage";
const HomePage = (props) => {
  return (
    <div>
      {/* --- Hero Section --- */}
      <div className="relative bg-gray-900">
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Fashionable clothes on a rack"
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gray-900 opacity-50"
        />

        {/* --- THIS IS THE LINE WE ARE CHANGING --- */}
        {/* Before: py-32 sm:py-64 */}
        {/* After:  py-20 sm:py-32 */}
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center sm:py-32 lg:px-0">
          <h1 className="text-4xl font-bold tracking-tight text-white lg:text-6xl">
            Second-Hand, First-Class Style
          </h1>
          <p className="mt-4 text-xl text-white">
            Discover curated vintage and pre-loved pieces to build a wardrobe
            that's uniquely you and kind to the planet.
          </p>
          <a
            href="#product-grid"
            className="mt-8 inline-block rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-gray-900 hover:bg-gray-100"
          >
            Shop New Arrivals
          </a>
        </div>
      </div>

      <div id="product-grid">
        <ProductListPage {...props} />
      </div>
    </div>
  );
};

export default HomePage;
