import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Loader,
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "./Input"; // Assuming this is your custom input
import { useDispatch, useSelector } from "react-redux";
import { signIn, clearUserError } from "../../../state/userSlice/userSlice";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(clearUserError());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const handleSignin = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(signIn({ email, password }));
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
          backgroundImage: 'url("/1.jpg")',
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
          {/* Left Side - Branding (Hidden on mobile) */}
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
                Welcome back to the
                {/* UPDATED: Using 'primary' color */}
                <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent block">
                  future of work
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-xl text-gray-300 mb-8 leading-relaxed"
              >
                Sign in to access your personalized ChiqFirp dashboard and
                continue where you left off.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex items-center space-x-6 text-gray-400"
              >
                {/* UPDATED: Using theme colors */}
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                  <span>Secure Login</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span>Fast Access</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-secondary rounded-full mr-2"></div>
                  <span>24/7 Support</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
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
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Sign In
                    </h2>
                    <p className="text-gray-300 text-sm">
                      Enter your credentials to access your ChiqFirp account
                    </p>
                  </motion.div>

                  {/* Enhanced Form */}
                  <form onSubmit={handleSignin} className="space-y-6">
                    {/* Email Input */}
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Input
                          icon={Mail}
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          // UPDATED: Input focus colors
                          className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
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
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          // UPDATED: Input focus colors
                          className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </motion.div>

                    {/* Remember Me & Forgot Password */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1 }}
                      className="flex items-center justify-between"
                    >
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          // UPDATED: Checkbox colors
                          className="w-4 h-4 text-primary bg-white/10 border-white/20 rounded focus:ring-primary/50 focus:ring-2"
                        />
                        <span className="ml-2 text-sm text-gray-300">
                          Remember me
                        </span>
                      </label>

                      <Link
                        to="/forgot-password"
                        // UPDATED: Link color
                        className="text-sm text-primary hover:brightness-110 transition-all duration-200 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </motion.div>

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

                    {/* Enhanced Login Button */}
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
                      {/* Button Background Animation */}
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-blue-700 to-purple-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Button Content */}
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
                            <span className="mr-2">Sign In</span>
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
                    Don't have an account?{" "}
                    <Link
                      to="/sign-up"
                      // UPDATED: Link color
                      className="text-primary hover:brightness-110 font-semibold transition-all duration-200 hover:underline"
                    >
                      Create one now
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

export default LoginPage;
