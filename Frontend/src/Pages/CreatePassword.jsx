import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast"; // Using react-hot-toast for consistency
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Loader, Shield, ArrowLeft } from "lucide-react"; // Added Shield and ArrowLeft

const BASE_URL = import.meta.env.VITE_BASE_URL;

function CreateNewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const otp = searchParams.get("otp");
  const uuidb64 = searchParams.get("uuidb64");
  const refresh_token = searchParams.get("refresh_token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill out both password fields.");
      return;
    }
    if (confirmPassword !== password) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    const data = { password, otp, uuidb64, refresh_token };

    try {
      await axios.post(`${BASE_URL}/api/v1/auth/user/password-change/`, data);
      toast.success("Password changed successfully! You can now log in.");
      navigate("/sign-in");
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "An error occurred. The link may be invalid or expired."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Back to Home Link */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute top-6 left-6 z-20"
      >
        <Link
          to="/"
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-semibold">Back to Home</span>
        </Link>
      </motion.div>

      {/* Enhanced Background with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: 'url("/1.jpg")',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-purple-900/95" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl flex items-center justify-center">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:flex lg:w-1/2 flex-col justify-center items-start pr-16"
          >
            <div className="text-white">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-5xl font-extrabold mb-6 leading-tight"
              >
                Secure Your
                {/* UPDATED: Using 'primary' color */}
                <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent block">
                  Account
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-xl text-gray-300 leading-relaxed"
              >
                Your new password must be secure and different from any you've
                used before.
              </motion.p>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 flex justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-md relative"
            >
              {/* Glassmorphism Card */}
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                {/* Animated Border Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-500/20 rounded-3xl opacity-50 animate-pulse" />

                {/* Header */}
                <div className="relative p-8">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mb-8"
                  >
                    <div className="flex justify-center mb-4">
                      {/* UPDATED: Using 'primary' color */}
                      <div className="w-16 h-16 bg-gradient-to-r from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Lock className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Create New Password
                    </h2>
                    <p className="text-gray-300 text-sm">
                      Enter and confirm your new password below.
                    </p>
                  </motion.div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* New Password Input */}
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          placeholder="Enter new password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)} // TYPO FIXED HERE
                          required
                          className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </motion.div>

                    {/* Confirm Password Input */}
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </motion.div>

                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.2 }}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative w-full py-4 px-6 bg-gradient-to-r from-primary via-blue-600 to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-primary/25 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                      type="submit"
                      disabled={isLoading}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-blue-700 to-purple-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative flex items-center justify-center">
                        {isLoading ? (
                          <Loader className="w-6 h-6 animate-spin" />
                        ) : (
                          "Save New Password"
                        )}
                      </div>
                    </motion.button>
                  </form>
                </div>

                {/* Footer */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.8 }}
                  className="relative px-8 py-6 bg-white/5 border-t border-white/10"
                >
                  <p className="text-center text-gray-300">
                    Back to{" "}
                    <Link
                      to="/sign-in"
                      className="text-primary hover:brightness-110 font-semibold transition-all duration-200 hover:underline"
                    >
                      Sign In
                    </Link>
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default CreateNewPassword;
