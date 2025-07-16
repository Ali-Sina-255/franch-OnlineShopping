// src/Pages/CheckoutPage.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { placeOrder } from "../state/checkoutSlice/checkoutSlice";
import { mapProductFromApi } from "../utils/product-mapper";
import { Loader2, User, Mail, Phone, Home, Globe } from "lucide-react"; // Import new icons
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "react-hot-toast";

// A reusable input component for our modern form.
// Placing this helper component inside the file keeps it self-contained.
const FormInput = ({
  id,
  label,
  register,
  errors,
  type = "text",
  icon: Icon,
}) => (
  <div className="relative">
    {Icon && (
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
    )}
    <input
      type={type}
      id={id}
      // Add specific required message for each field
      {...register(id, { required: `${label} is required` })}
      placeholder={label}
      className={`
                block w-full rounded-lg border-gray-300 shadow-sm transition-colors duration-200
                focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                py-3 ${Icon ? "pl-10" : "pl-4"} pr-4
                placeholder-transparent peer
            `}
    />
    <label
      htmlFor={id}
      className={`
                absolute left-2 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all duration-200
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
                peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600
                ${
                  Icon
                    ? "peer-placeholder-shown:left-9"
                    : "peer-placeholder-shown:left-3"
                }
            `}
    >
      {label}
    </label>
    {errors[id] && (
      <p className="mt-1 text-xs text-red-600">{errors[id].message}</p>
    )}
  </div>
);

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.user);
  const { loading: isPlacingOrder } = useSelector((state) => state.checkout);

  const {
    register,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

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

  const isFormValid = Object.keys(errors).length === 0;

  return (
    <div className="bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Checkout
          </h1>
          <p className="text-lg text-gray-600 mb-8 lg:mb-12">
            Please fill in your shipping details to complete your purchase.
          </p>

          <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
            {/* --- NEW STYLED Shipping Information Form --- */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                {/* First Name */}
                <FormInput
                  id="first_name"
                  label="First Name"
                  register={register}
                  errors={errors}
                  icon={User}
                />
                {/* Last Name */}
                <FormInput
                  id="last_name"
                  label="Last Name"
                  register={register}
                  errors={errors}
                  icon={User}
                />
                {/* Email */}
                <div className="sm:col-span-2">
                  <FormInput
                    id="email"
                    label="Email Address"
                    type="email"
                    register={register}
                    errors={errors}
                    icon={Mail}
                  />
                </div>
                {/* Phone */}
                <div className="sm:col-span-2">
                  <FormInput
                    id="phone"
                    label="Phone Number"
                    type="tel"
                    register={register}
                    errors={errors}
                    icon={Phone}
                  />
                </div>
                {/* Address */}
                <div className="sm:col-span-2">
                  <FormInput
                    id="address_line"
                    label="Address"
                    register={register}
                    errors={errors}
                    icon={Home}
                  />
                </div>
                {/* City */}
                <FormInput
                  id="city"
                  label="City"
                  register={register}
                  errors={errors}
                />
                {/* State */}
                <FormInput
                  id="state"
                  label="State / Province"
                  register={register}
                  errors={errors}
                />
                {/* Postal Code */}
                <FormInput
                  id="pin_code"
                  label="Postal Code"
                  register={register}
                  errors={errors}
                />
                {/* Country */}
                <FormInput
                  id="country"
                  label="Country"
                  register={register}
                  errors={errors}
                  icon={Globe}
                />
              </div>
            </div>

            {/* --- Order Summary and Payment Section --- */}
            <div className="mt-10 lg:mt-0">
              <h2 className="text-xl font-semibold text-gray-900">
                Order Summary
              </h2>
              <div className="mt-4 rounded-xl border border-gray-200 bg-white shadow-md">
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
                  {isPlacingOrder && (
                    <div className="flex justify-center items-center mb-4">
                      <Loader2 className="h-6 w-6 animate-spin mr-2 text-indigo-600" />
                      <span className="text-gray-600">
                        Processing your order...
                      </span>
                    </div>
                  )}
                  <PayPalScriptProvider options={initialOptions}>
                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      disabled={!isFormValid || isPlacingOrder}
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
                        return actions.order.capture().then((paypalDetails) => {
                          const orderDetails = {
                            ...getValues(),
                            order_total: total.toFixed(2),
                            payment_method: "PayPal",
                          };

                          dispatch(placeOrder({ orderDetails, paypalDetails }))
                            .unwrap()
                            .then((createdOrder) => {
                              navigate(
                                `/order-success/${createdOrder.order_number}`
                              );
                            })
                            .catch((err) => {
                              console.error("Caught error in component:", err);
                            });
                        });
                      }}
                    />
                  </PayPalScriptProvider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
