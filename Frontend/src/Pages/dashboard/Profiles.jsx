import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function Profile() {
  const token = useSelector((state) => state.user.accessToken);
  const user = useSelector((state) => state.user.currentUser);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    about_me: "",
    gender: "M",
    country: "AF",
    city: "",
    profile_photo: null,
    profile_photo_preview: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/profiles/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile({
          first_name: res.data.first_name || user?.first_name || "",
          last_name: res.data.last_name || user?.last_name || "",
          phone_number: res.data.phone_number || "",
          about_me: res.data.about_me || "",
          gender: res.data.gender || "M",
          country: res.data.country || "AF",
          city: res.data.city || "",
          profile_photo: null,
          profile_photo_preview: res.data.profile_photo || "",
        });
      } catch (err) {
        console.error("Error loading profile:", err);
        Swal.fire("Error", "Could not load profile", "error");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile((prev) => ({
        ...prev,
        profile_photo: file,
        profile_photo_preview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update user first_name and last_name
      await axios.put(
        `${BASE_URL}/api/v1/users/me/`,
        {
          first_name: profile.first_name,
          last_name: profile.last_name,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update profile details
      const formData = new FormData();
      formData.append("phone_number", profile.phone_number);
      formData.append("about_me", profile.about_me);
      formData.append("gender", profile.gender);
      formData.append("country", profile.country);
      formData.append("city", profile.city);
      if (profile.profile_photo) {
        formData.append("profile_photo", profile.profile_photo);
      }

      await axios.put(`${BASE_URL}/api/v1/profiles/me/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire("Success", "Profile updated successfully", "success");
      setShowForm(false);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update profile", "error");
    }
  };

  if (loading) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Display section */}
      {!showForm && (
        <div className="bg-white shadow-md p-6 rounded-md">
          <h2 className="text-2xl font-bold mb-4">My Profile</h2>
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={profile.profile_photo_preview || "/default-avatar.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border"
            />
            <div>
              <p className="text-xl font-semibold">
                {profile.first_name} {profile.last_name}
              </p>
              <p className="text-gray-600">{profile.phone_number}</p>
            </div>
          </div>
          <p>
            <strong>About Me:</strong> {profile.about_me || "N/A"}
          </p>
          <p>
            <strong>Gender:</strong>{" "}
            {profile.gender === "M" ? "Male" : "Female"}
          </p>
          <p>
            <strong>Country:</strong> {profile.country}
          </p>
          <p>
            <strong>City:</strong> {profile.city}
          </p>

          <button
            onClick={() => setShowForm(true)}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update Profile
          </button>
        </div>
      )}

      {/* Update form section */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md p-6 rounded-md mt-4 space-y-4"
        >
          <h2 className="text-2xl font-bold mb-4">Update Profile</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="first_name"
              value={profile.first_name}
              onChange={handleChange}
              placeholder="First Name"
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="last_name"
              value={profile.last_name}
              onChange={handleChange}
              placeholder="Last Name"
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="phone_number"
              value={profile.phone_number}
              onChange={handleChange}
              placeholder="Phone Number"
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="city"
              value={profile.city}
              onChange={handleChange}
              placeholder="City"
              className="border p-2 rounded"
            />
          </div>

          <textarea
            name="about_me"
            value={profile.about_me}
            onChange={handleChange}
            placeholder="About Me"
            className="border p-2 rounded w-full"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>

            <select
              name="country"
              value={profile.country}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="AF">Afghanistan</option>
              <option value="US">USA</option>
              <option value="UK">UK</option>
              {/* Add more countries here if needed */}
            </select>
          </div>

          <div>
            <label className="block mb-1">Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="border p-2 rounded w-full"
            />
            {profile.profile_photo_preview && (
              <img
                src={profile.profile_photo_preview}
                alt="Preview"
                className="mt-2 w-24 h-24 rounded-full object-cover"
              />
            )}
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Profile;
