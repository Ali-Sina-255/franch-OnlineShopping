import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  updateUserProfile,
} from "../../state/userSlice/userSlice";
import { Loader2, Edit3, User, Mail, Phone, Home, Globe } from "lucide-react";

// A modern, reusable Input component for the form
const FormInput = ({
  control,
  name,
  label,
  errors,
  type = "text",
  icon: Icon,
}) => (
  <div className="relative">
    <Controller
      name={name}
      control={control}
      rules={{ required: `${label} is required.` }}
      render={({ field }) => (
        <>
          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          )}
          <input
            {...field}
            type={type}
            placeholder={label}
            className={`peer block w-full rounded-lg border-gray-300 py-3 shadow-sm transition-colors duration-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
              Icon ? "pl-10" : "pl-4"
            } pr-4 placeholder-transparent`}
          />
          <label
            htmlFor={name}
            className={`absolute left-2 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600 ${
              Icon
                ? "peer-placeholder-shown:left-9"
                : "peer-placeholder-shown:left-3"
            }`}
          >
            {label}
          </label>
        </>
      )}
    />
    {errors[name] && (
      <p className="mt-1 text-xs text-red-600">{errors[name].message}</p>
    )}
  </div>
);

function Profile() {
  const dispatch = useDispatch();
  const { profile, loading, accessToken } = useSelector((state) => state.user);
  const [photoPreview, setPhotoPreview] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }, // Correctly destructuring 'errors' here
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
      about_me: "",
      gender: "M",
      country: "AF",
      city: "",
      profile_photo: null,
    },
  });

  // Fetch profile data on component mount if user is logged in
  useEffect(() => {
    if (accessToken && !profile) {
      // Only fetch if we don't have a profile yet
      dispatch(fetchUserProfile());
    }
  }, [accessToken, profile, dispatch]);

  // When profile data from Redux updates, populate the form
  useEffect(() => {
    if (profile) {
      reset(profile); // Populates all form fields
      setPhotoPreview(profile.profile_photo);
    }
  }, [profile, reset]);

  const onPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("profile_photo", file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data) => {
    dispatch(updateUserProfile(data));
  };

  if (loading && !profile) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 text-center text-gray-600">
        Could not load profile. Please try refreshing.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="p-8 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={photoPreview || "/default-avatar.png"}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
              />
              <label
                htmlFor="photo-upload"
                className="absolute -bottom-1 -right-1 bg-indigo-600 p-2 rounded-full text-white cursor-pointer hover:bg-indigo-700 transition-colors"
              >
                <Edit3 size={16} />
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onPhotoChange}
                />
              </label>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-800">
                {profile.first_name} {profile.last_name}
              </h1>
              <p className="text-md text-gray-500 flex items-center justify-center sm:justify-start gap-2 mt-1">
                <Mail size={16} /> {profile.email}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Update Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
          {/* Personal Information Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                control={control}
                name="first_name"
                label="First Name"
                errors={errors}
                icon={User}
              />
              <FormInput
                control={control}
                name="last_name"
                label="Last Name"
                errors={errors}
                icon={User}
              />
              <FormInput
                control={control}
                name="phone_number"
                label="Phone Number"
                errors={errors}
                icon={Phone}
              />
              <FormInput
                control={control}
                name="city"
                label="City"
                errors={errors}
                icon={Home}
              />
            </div>
          </div>

          {/* About Me Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              About Me
            </h2>
            <Controller
              name="about_me"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows="4"
                  placeholder="Tell us a little about yourself..."
                  className="w-full rounded-lg border-gray-300 shadow-sm transition-colors duration-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              )}
            />
          </div>

          {/* Additional Details Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Additional Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full rounded-lg border-gray-300 py-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                )}
              />
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full rounded-lg border-gray-300 py-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option value="AF">Afghanistan</option>
                    <option value="US">USA</option>
                    <option value="UK">UK</option>
                  </select>
                )}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-gray-200 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
