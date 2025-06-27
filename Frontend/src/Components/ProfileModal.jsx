import { motion } from "framer-motion";
import { User, MapPin, Phone, Loader, X } from "lucide-react";
import Input from "./Input"; // Reusing your stylish input component
import useProfileUpdate from "../hooks/useProfileUpdate";

// The modal receives 'isOpen' and 'onClose' props from its parent
const ProfileModal = ({ isOpen, onClose }) => {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    city,
    setCity,
    phoneNumber,
    setPhoneNumber,
    handleUpdate,
    isLoading,
    updateError,
  } = useProfileUpdate(onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
      onClick={onClose}
      dir="rtl"
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="relative max-w-lg w-full bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          ویرایش پروفایل
        </h2>

        <form onSubmit={handleUpdate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              icon={User}
              type="text"
              placeholder="نام"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              icon={User}
              type="text"
              placeholder="نام خانوادگی"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <Input
            icon={MapPin}
            type="text"
            placeholder="شهر"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <Input
            icon={Phone}
            type="tel"
            placeholder="شماره تلفن"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          {updateError && (
            <p className="text-red-400 font-semibold mt-2 text-sm text-right bg-red-900/50 p-2 rounded-md">
              {updateError}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-700 text-white font-bold rounded-lg shadow-lg hover:from-cyan-600 hover:via-blue-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader className="animate-spin mx-auto" size={24} />
            ) : (
              "ذخیره تغییرات"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ProfileModal;
