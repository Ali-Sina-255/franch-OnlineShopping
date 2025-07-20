<<<<<<< HEAD
// src/Pages/PaymentsSuccess.jsx

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, ShoppingBag, FileText, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

// A simple loading component for a better user experience
const LoadingState = () => (
  <div className="text-center py-20 flex flex-col items-center justify-center">
    <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
    <h1 className="text-2xl font-semibold mt-4 text-gray-700">
      Finalizing Your Order...
    </h1>
    <p className="text-gray-500 mt-2">
      Just a moment while we confirm the details.
    </p>
  </div>
);

const PaymentsSuccess = () => {
  // The order number is passed in the URL, e.g., /payment-success/2023010112345
  const { order_oid } = useParams();

  // We can get the user's email from the Redux store for a personal touch
  const userEmail = useSelector((state) => state.user.profile?.email);

  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching final order details or other async tasks
  useEffect(() => {
    // In a real app, you might make one final API call here to get full order details.
    // For now, we'll just simulate a short delay for a better UX.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5-second delay to feel like it's "processing"

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-white p-8 md:p-12 rounded-2xl shadow-lg text-center transform transition-all duration-500 ease-in-out scale-100">
        {/* Success Icon */}
        <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto animate-pulse" />

        {/* Main Heading */}
        <h1 className="mt-6 text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">
          Thank You For Your Order!
        </h1>

        {/* Reassurance Text */}
        <p className="mt-4 text-gray-600">
          Your payment was successful and your order is confirmed.
          {userEmail ? (
            <span>
              {" "}
              A confirmation email has been sent to <strong>{userEmail}</strong>
              .
            </span>
          ) : (
            <span> You will receive a confirmation email shortly.</span>
          )}
        </p>

        {/* Order Details Box */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6 text-left">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Order Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Order Number:</span>
              <span className="font-mono text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                {order_oid || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Order Date:</span>
              <span className="font-medium text-gray-700">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Payment Method:</span>
              <span className="font-medium text-gray-700">PayPal</span>
            </div>
          </div>
        </div>

        {/* What's Next Information */}
        <div className="mt-8 text-left">
          <h3 className="font-semibold text-gray-800">What Happens Next?</h3>
          <ul className="mt-2 list-disc list-inside text-gray-600 space-y-1">
            <li>We'll begin processing your order right away.</li>
            <li>
              You will receive a shipping confirmation email once your items are
              on their way.
            </li>
          </ul>
        </div>

        {/* Call-to-Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            Continue Shopping
          </Link>
          <Link
            to="/dashboard/orders" // Adjust this link to your user's order history page
            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 transition-colors"
          >
            <FileText className="h-5 w-5 mr-2" />
=======
import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react"; // Optional icon

const PaymentsSuccess = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-green-500 w-16 h-16" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase! Your payment has been processed
          successfully.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
          >
            Continue Shopping
          </Link>
          <Link
            to="/my-orders"
            className="inline-block border border-green-600 text-green-600 px-6 py-2 rounded-md hover:bg-green-50 transition"
          >
>>>>>>> ali_branch
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentsSuccess;
