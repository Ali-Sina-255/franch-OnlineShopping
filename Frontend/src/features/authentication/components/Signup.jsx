import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../components/Input";
import {
  Loader,
  Lock,
  Mail,
  User,
  Shield,
  ArrowRight,
  ArrowLeft, // Import the ArrowLeft icon
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useDispatch, useSelector } from "react-redux";
import { createUser, clearUserError } from "../../../state/userSlice/userSlice";

const SignUpPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  // Clear previous errors when the component mounts
  useEffect(() => {
    dispatch(clearUserError());
  }, [dispatch]);

  const handleSignup = (e) => {
    e.preventDefault();
    const userData = {
      first_name: firstName,
      last_name: lastName,
      username,
      email,
      password,
    };
    dispatch(createUser(userData))
      .unwrap()
      .then(() => {
        // On successful registration, navigate to the sign-in page
        navigate("/sign-in");
      })
      .catch((err) => {
        // Error is already handled by toast in the slice, no need to do anything here
        console.error("Signup failed:", err);
      });
  };

  // Enhanced floating particles animation
  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          // UPDATED: Using 'primary' color from your config
          className="absolute w-2 h-2 bg-gradient-to-r from-primary to-blue-500 rounded-full opacity-20"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [null, -20, 20, -10, 0],
            x: [null, -10, 10, -5, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );

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
          backgroundImage: 'url("/1.jpg")', // Using same background as login
        }}
      />

      {/* Multi-layered Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-purple-900/95" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {/* Floating Elements */}
      <FloatingElements />

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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center mb-8"
              >
                {/* UPDATED: Using 'primary' color */}
                <Shield className="w-12 h-12 text-primary mr-4" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                  ChiqFirp.com
                </h1>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-5xl font-extrabold mb-6 leading-tight"
              >
                Join the ChiqFirp
                {/* UPDATED: Using 'primary' color */}
                <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent block">
                  community today
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-xl text-gray-300 mb-8 leading-relaxed"
              >
                Create your account and unlock exclusive features on
                ChiqFirp.com
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex items-center space-x-6 text-gray-400"
              >
                {/* UPDATED: Using 'primary' and 'secondary' colors */}
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                  <span>Secure Registration</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span>Fast Setup</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-secondary rounded-full mr-2"></div>
                  <span>24/7 Support</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - SignUp Form */}
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
                {/* UPDATED: Animated Border Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-500/20 rounded-3xl opacity-50 animate-pulse" />

                {/* Header */}
                <div className="relative p-8 pb-6">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mb-8"
                  >
                    <div className="flex justify-center mb-4">
                      {/* UPDATED: Using 'primary' color */}
                      <div className="w-16 h-16 bg-gradient-to-r from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <User className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Create Account
                    </h2>
                    <p className="text-gray-300 text-sm">
                      Join ChiqFirp.com and start your journey
                    </p>
                  </motion.div>

                  {/* Enhanced Form */}
                  <form onSubmit={handleSignup} className="space-y-6">
                    {/* Name Fields in Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          First Name
                        </label>
                        <div className="relative">
                          <Input
                            icon={User}
                            type="text"
                            placeholder="Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            // UPDATED: Input focus colors
                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                            required
                          />
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <User className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Last Name
                        </label>
                        <div className="relative">
                          <Input
                            icon={User}
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            // UPDATED: Input focus colors
                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                            required
                          />
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <User className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Username Input */}
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <Input
                          icon={User}
                          type="text"
                          placeholder="User Name"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          // UPDATED: Input focus colors
                          className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                          required
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <User className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </motion.div>

                    {/* Email Input */}
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.7 }}
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Input
                          icon={Mail}
                          type="email"
                          placeholder="Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          // UPDATED: Input focus colors
                          className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                          required
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </motion.div>

                    {/* Password Input */}
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          icon={Lock}
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          // UPDATED: Input focus colors
                          className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                          required
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </motion.div>

                    {/* Password Strength Meter */}
                    {password && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-4"
                      >
                        <PasswordStrengthMeter password={password} />
                      </motion.div>
                    )}

                    {/* Error Message */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="bg-red-500/20 border border-red-500/30 rounded-xl p-4"
                        >
                          <p className="text-red-300 text-sm text-center">
                            {error}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Enhanced Register Button */}
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.2 }}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      // UPDATED: Button gradient and focus ring
                      className="group relative w-full py-4 px-6 bg-gradient-to-r from-primary via-blue-600 to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-primary/25 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 overflow-hidden"
                      type="submit"
                      disabled={loading}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-blue-700 to-purple-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative flex items-center justify-center">
                        {loading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <Loader className="w-6 h-6" />
                          </motion.div>
                        ) : (
                          <>
                            <span className="mr-2">Register</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                          </>
                        )}
                      </div>
                    </motion.button>
                  </form>
                </div>

                {/* Enhanced Footer */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.8 }}
                  className="relative px-8 py-6 bg-white/5 border-t border-white/10"
                >
                  <p className="text-center text-gray-300">
                    Already have an account?{" "}
                    <Link
                      to="/sign-in"
                      // UPDATED: Link color
                      className="text-primary hover:brightness-110 font-semibold transition-all duration-200 hover:underline"
                    >
                      Sign in here
                    </Link>
                  </p>
                </motion.div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-purple-500" />
    </div>
  );
};

export default SignUpPage;
