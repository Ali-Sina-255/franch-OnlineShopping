import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { createOrder } from "../state/checkoutSlice/checkoutSlice";
import { fetchUserProfile } from "../state/userSlice/userSlice";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import shippingImage from "../../public/1.jpeg"; // Import your image

const ShippingDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    cart,
    profile,
    loading: userLoading,
  } = useSelector((state) => state.user);
  const { loading: orderLoading } = useSelector((state) => state.checkout);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      reset({
        full_name: `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
        mobile: profile.phone_number,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        country: profile.country,
      });
    }
  }, [profile, reset]);

  const onSubmit = (data) => {
    if (!cart?.cart_id) {
      toast.error("Cart not found. Please add items to your cart again.");
      return;
    }
    dispatch(createOrder({ shippingDetails: data, cartId: cart.cart_id }))
      .unwrap()
      .then((result) => {
        navigate(`/checkout/${result.order_oid}`);
      });
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col lg:flex-row h-full">
        {/* Image Section */}
        <div className="lg:w-1/2 bg-gray-100 hidden lg:block">
          <div className="h-full w-full flex items-center justify-center p-12">
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <img
                src={shippingImage}
                alt="Shipping illustration"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-end p-8">
                <div className="text-white">
                  <h2 className="text-3xl font-bold mb-2">Almost There!</h2>
                  <p className="text-lg">
                    Just a few details to complete your order
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Shipping Details
              </h1>
              <p className="text-gray-600">
                Please confirm your details to proceed to payment
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  {...register("full_name", {
                    required: "Full name is required",
                  })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.full_name ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                />
                {errors.full_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  {...register("mobile", {
                    required: "Mobile number is required",
                    pattern: {
                      value: /^[0-9\-\+]{9,15}$/,
                      message: "Invalid phone number",
                    },
                  })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.mobile ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                />
                {errors.mobile && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.mobile.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  {...register("address", { required: "Address is required" })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    {...register("city", { required: "City is required" })}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    {...register("state", { required: "State is required" })}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.state ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.state.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  {...register("country", { required: "Country is required" })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.country ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.country.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={orderLoading || !isValid}
                className={`w-full mt-6 py-3 px-4 rounded-lg font-medium text-white transition-all ${
                  orderLoading || !isValid
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {orderLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Processing...
                  </span>
                ) : (
                  "Continue to Payment"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/cart"
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium inline-flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Return to cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingDetailsPage;
