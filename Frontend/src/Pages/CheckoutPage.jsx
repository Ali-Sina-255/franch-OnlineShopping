import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { placeOrder } from "../state/checkoutSlice/checkoutSlice";
import { mapProductFromApi } from "../utils/product-mapper";
import { Loader2 } from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, cartId } = useSelector((state) => state.user);
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

  const onSubmit = (data) => {
    const orderData = {
      ...data,
      order_total: total.toFixed(2),
      payment_method: "Card",
      order_id: cartId,
    };
    dispatch(placeOrder(orderData)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        navigate(`/payment-success/${result.payload.order_number}`);
      }
    });
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

  // New function to call backend payment endpoint after PayPal capture
  const confirmPaymentToBackend = async ({ formData, paypalOrderId }) => {
    try {
      const payload = {
        order_id: cartId,
        session_id: formData.session_id || "", // add session_id if you have it
        paypal_order_id: paypalOrderId,
        ...formData,
        order_total: total.toFixed(2),
        payment_method: "PayPal",
      };

      const response = await fetch("/payment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Backend payment confirmation failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Payment confirmation error:", error);
      throw error;
    }
  };

  return (
    <div className="bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h1 className="sr-only">Checkout</h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16"
          >
            {/* Shipping Info */}
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Shipping Information
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                {/* First Name */}
                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First name
                  </label>
                  <input
                    id="first_name"
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

                {/* Last Name */}
                <div>
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last name
                  </label>
                  <input
                    id="last_name"
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

                {/* Email */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
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

                {/* Phone */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
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

                {/* Address */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="address_line"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <input
                    id="address_line"
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

                {/* City */}
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <input
                    id="city"
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

                {/* State */}
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State / Province
                  </label>
                  <input
                    id="state"
                    type="text"
                    {...register("state", { required: "State is required" })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.state.message}
                    </p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <input
                    id="country"
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

                {/* Postal Code */}
                <div>
                  <label
                    htmlFor="pin_code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Postal code
                  </label>
                  <input
                    id="pin_code"
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

            {/* Order Summary and Payment */}
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
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Payment Method
                  </h3>

                  {/* PayPal Button */}
                  <PayPalScriptProvider options={initialOptions}>
                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      createOrder={async (_, actions) => {
                        // Validate form before creating order
                        const valid = await handleSubmit(() => true)();
                        if (!valid) {
                          throw new Error("Validation failed");
                        }
                        const order = await actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                currency_code: "EUR",
                                value: total.toFixed(2),
                              },
                            },
                          ],
                        });
                        return order;
                      }}
                      onApprove={async (data, actions) => {
                        try {
                          const capture = await actions.order.capture();
                          // Extract buyer and order details from form and capture response
                          const formData = getValues();
                          // Confirm payment to backend
                          const backendResponse = await confirmPaymentToBackend(
                            {
                              formData,
                              paypalOrderId: capture.id,
                            }
                          );
                          navigate(
                            `/payment-success/${backendResponse.order_number}`
                          );
                        } catch (error) {
                          console.error("PayPal payment failed:", error);
                          alert("Payment failed. Please try again.");
                        }
                      }}
                      onError={(err) => {
                        console.error("PayPal error:", err);
                        alert("An error occurred with PayPal payment.");
                      }}
                    />
                  </PayPalScriptProvider>

                  {/* Card Payment Button */}
                  <button
                    type="submit"
                    disabled={isPlacingOrder}
                    className={`mt-6 w-full rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-center font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      isPlacingOrder ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isPlacingOrder ? (
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-white" />
                    ) : (
                      "Place order"
                    )}
                  </button>
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
