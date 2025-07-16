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

  // Calculate totals
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

  // Card payment submit handler
  const onSubmit = (data) => {
    const orderData = {
      ...data,
      order_total: total.toFixed(2),
      payment_method: "Card",
      order_id: cartId, // backend expects this
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

              <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm px-4 py-6">
                <ul role="list" className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex py-6">
                      <div className="flex-shrink-0">
                        <img
                          src={mapProductFromApi(item.product).imageUrl}
                          alt={item.product.product_name}
                          className="w-20 rounded-md"
                        />
                      </div>
                      <div className="ml-6 flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <h4 className="text-sm font-medium text-gray-700 hover:text-gray-800">
                            {item.product.product_name}
                          </h4>
                          <p className="text-sm font-medium text-gray-900">
                            €{(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <dl className="space-y-6 border-t border-gray-200 pt-6">
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

                {/* Pay with Card (submit form) */}
                <button
                  type="submit"
                  disabled={isPlacingOrder}
                  className="w-full mt-6 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {isPlacingOrder ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Pay with Card"
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">
                      Or pay with PayPal
                    </span>
                  </div>
                </div>

                {/* PayPal Buttons */}
                <PayPalScriptProvider options={initialOptions}>
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: total.toFixed(2),
                              currency_code: "EUR",
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      try {
                        // Capture the order on PayPal
                        const details = await actions.order.capture();
                        console.log("PayPal order details:", details);

                        // Prepare order data for backend
                        const orderData = {
                          // Include all form data you need to send (use getValues() from react-hook-form)
                          ...getValues(),
                          order_total: total.toFixed(2),
                          payment_method: "PayPal",
                          order_id: cartId,
                          paypal_order_id: data.orderID,

                          // session_id can be optional or generated here if backend requires it
                          // For now, we send null or omit if backend accepts that
                          session_id: null,
                        };

                        console.log("Dispatching placeOrder with:", orderData);

                        // Dispatch your redux thunk to place order
                        const result = await dispatch(placeOrder(orderData));

                        if (result.meta.requestStatus === "fulfilled") {
                          navigate(
                            `/payment-success/${result.payload.order_number}`
                          );
                        } else {
                          alert("Failed to place order. Please try again.");
                          console.error("Place order rejected:", result);
                        }
                      } catch (err) {
                        alert(
                          "Error completing PayPal payment. Please try again."
                        );
                        console.error("PayPal onApprove error:", err);
                      }
                    }}
                    onError={(err) => {
                      alert("PayPal payment error. Please try again.");
                      console.error("PayPal Buttons error:", err);
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
