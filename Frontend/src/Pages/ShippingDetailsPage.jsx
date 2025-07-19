// src/Pages/ShippingDetailsPage.jsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { createOrder } from "../state/checkoutSlice/checkoutSlice";
import { fetchUserProfile } from "../state/userSlice/userSlice";
import { Loader2 } from "lucide-react";

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
    formState: { errors },
  } = useForm();

  // Fetch user profile to pre-fill the form
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // When profile data is loaded, pre-fill the form fields
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
        // On success, navigate to the payment page with the new order ID
        navigate(`/checkout/${result.order_oid}`);
      });
  };

  if (userLoading) {
    return (
      <div className="text-center py-20">
        <Loader2 className="h-12 w-12 animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Shipping Details
        </h1>
        <p className="mt-2 text-center text-gray-600">
          Please confirm your details to create the order.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 bg-white p-8 rounded-xl shadow-lg space-y-6"
        >
          <div className="grid grid-cols-1 gap-6">
            <input
              {...register("full_name", { required: true })}
              placeholder="Full Name"
              className="p-3 border rounded-md"
            />
            <input
              {...register("email", { required: true })}
              placeholder="Email"
              type="email"
              className="p-3 border rounded-md"
            />
            <input
              {...register("mobile", { required: true })}
              placeholder="Mobile Number"
              type="tel"
              className="p-3 border rounded-md"
            />
            <input
              {...register("address", { required: true })}
              placeholder="Address"
              className="p-3 border rounded-md"
            />
            <input
              {...register("city", { required: true })}
              placeholder="City"
              className="p-3 border rounded-md"
            />
            <input
              {...register("state", { required: true })}
              placeholder="State"
              className="p-3 border rounded-md"
            />
            <input
              {...register("country", { required: true })}
              placeholder="Country"
              className="p-3 border rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={orderLoading}
            className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {orderLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Confirm & Create Order"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingDetailsPage;
