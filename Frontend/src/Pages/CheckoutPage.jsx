// src/Pages/CheckoutPage.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { placeOrder } from "../state/checkoutSlice/checkoutSlice"; // Ensure this path is correct
import { mapProductFromApi } from "../utils/product-mapper";
import { Loader2 } from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "react-hot-toast";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.user);
  const { loading: isPlacingOrder } = useSelector((state) => state.checkout);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee = subtotal > 0 ? 0 : 0;
  const total = subtotal + shippingFee;

  const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "EUR",
    intent: "capture",
  };

  // This is for the "Confirm Order" button (Card payment)
  const onSubmit = (data) => {
    // This flow would need its own implementation, similar to the PayPal one.
    // For now, we focus on the PayPal flow.
    toast.error("Card payment is not yet implemented.");
  };

  if (cartItems.length === 0 && !isPlacingOrder) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Your cart is empty.</h1>
        <p className="mt-2">There's nothing to check out!</p>
        <Link
          to="/"
          className="mt-6 inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h1 className="sr-only">Checkout</h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16"
          >
            {/* --- Shipping Information Form (No changes needed here) --- */}
            <div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Shipping Information
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div>
                    <label
                      htmlFor="first_name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        {...register("first_name", {
                          required: "First name is required",
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.first_name && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.first_name.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="last_name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        {...register("last_name", {
                          required: "Last name is required",
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.last_name && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.last_name.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Invalid email address",
                          },
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone
                    </label>
                    <div className="mt-1">
                      <input
                        type="tel"
                        {...register("phone", {
                          required: "Phone number is required",
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="address_line"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Address
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        {...register("address_line", {
                          required: "Address is required",
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.address_line && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.address_line.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      City
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        {...register("city", { required: "City is required" })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700"
                    >
                      State / Province
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        {...register("state", {
                          required: "State is required",
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.state && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.state.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Country
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        {...register("country", {
                          required: "Country is required",
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.country && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.country.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="pin_code"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Postal code
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        {...register("pin_code", {
                          required: "Postal code is required",
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.pin_code && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.pin_code.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Order Summary and Payment Section --- */}
            <div className="mt-10 lg:mt-0">
              <h2 className="text-lg font-medium text-gray-900">
                Order summary
              </h2>
              <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                <ul role="list" className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex py-6 px-4 sm:px-6">
                      <div className="flex-shrink-0">
                        <img
                          src={mapProductFromApi(item.product).imageUrl}
                          alt={item.product.product_name}
                          className="w-20 rounded-md"
                        />
                      </div>
                      <div className="ml-6 flex flex-1 flex-col">
                        <div className="flex">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm">
                              <span className="font-medium text-gray-700 hover:text-gray-800">
                                {item.product.product_name}
                              </span>
                            </h4>
                            <p className="mt-1 text-sm text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="ml-4 flow-root flex-shrink-0">
                            <p className="text-sm font-medium text-gray-900">
                              €{(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <dl className="space-y-6 border-t border-gray-200 py-6 px-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Subtotal</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      €{subtotal.toFixed(2)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Shipping</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      €{shippingFee.toFixed(2)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                    <dt className="text-base font-medium text-gray-900">
                      Total
                    </dt>
                    <dd className="text-base font-medium text-gray-900">
                      €{total.toFixed(2)}
                    </dd>
                  </div>
                </dl>
                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                  <button
                    type="submit"
                    disabled={isPlacingOrder}
                    className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-400"
                  >
                    {isPlacingOrder ? (
                      <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    ) : (
                      "Confirm Order"
                    )}
                  </button>
                  <div className="mt-4">
                    <PayPalScriptProvider options={initialOptions}>
                      <PayPalButtons
                        style={{ layout: "vertical" }}
                        disabled={
                          Object.keys(errors).length > 0 || isPlacingOrder
                        }
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [
                              {
                                amount: {
                                  currency_code: "EUR",
                                  value: total.toFixed(2),
                                },
                              },
                            ],
                          });
                        }}
                        onApprove={(data, actions) => {
                          // Check if the form is valid before proceeding
                          const formValues = getValues();
                          const formIsValid = Object.values(formValues).every(
                            (val) => val !== ""
                          );
                          if (!formIsValid) {
                            toast.error(
                              "Please fill out all shipping information fields before paying."
                            );
                            return Promise.reject(new Error("Form is invalid"));
                          }

                          return actions.order
                            .capture()
                            .then((paypalDetails) => {
                              if (paypalDetails.status === "COMPLETED") {
                                const orderDetails = {
                                  ...getValues(),
                                  order_total: total.toFixed(2),
                                  payment_method: "PayPal", // Set payment method
                                };

                                dispatch(
                                  placeOrder({ orderDetails, paypalDetails })
                                )
                                  .unwrap() // .unwrap() gives us the fulfilled value or throws the rejected value
                                  .then((result) => {
                                    toast.success("Order placed successfully!");
                                    navigate(
                                      `/order-success/${result.order_number}`
                                    );
                                  })
                                  .catch((error) => {
                                    toast.error(
                                      error.detail ||
                                        "Failed to place order. Please try again."
                                    );
                                  });
                              } else {
                                toast.error(
                                  "Payment not completed. Please try again."
                                );
                              }
                            });
                        }}
                      />
                    </PayPalScriptProvider>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
