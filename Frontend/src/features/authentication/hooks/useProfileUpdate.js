import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { updateUser } from "../state/userSlice/userSlice";

const useProfileUpdate = (closeModal) => {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  // Initialize form state with current user data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // The UserSerializer returns these fields, so we can use them
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // When the modal opens, populate the form with the user's current data
  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.first_name || "");
      setLastName(currentUser.last_name || "");
      setCity(currentUser.city || "");
      setPhoneNumber(currentUser.phone_number || "");
    }
  }, [currentUser]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Your backend UserSerializer has profile fields nested.
    // The DRF writable nested serializer might need specific setup.
    // Let's assume your view can handle a flat structure and your serializer
    // can re-organize it. A common approach is a flat payload.
    const userDataToUpdate = {
      first_name: firstName,
      last_name: lastName,
      city: city,
      phone_number: phoneNumber,
      // Add other fields like 'gender', 'country' as needed
    };

    const resultAction = await dispatch(updateUser({ userDataToUpdate }));

    if (updateUser.fulfilled.match(resultAction)) {
      toast.success("Profile updated successfully!");
      closeModal(); // Close the modal on success
    }
    // The error will be handled by the 'error' state from the useSelector hook.
  };

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    city,
    setCity,
    phoneNumber,
    setPhoneNumber,
    handleUpdate,
    isLoading: loading,
    updateError: error,
  };
};

export default useProfileUpdate;
