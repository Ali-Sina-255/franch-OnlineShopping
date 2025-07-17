import React, { useState } from "react";
import SignUpPage from "./Signup";
import LoginPage from "./Signin";

const LoginPagee = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="bg-gradient-to-r from-gray-200 to-indigo-100 min-h-screen flex items-center justify-center">
      <div
        className={`relative w-[768px] max-w-full min-h-[480px] bg-white rounded-[30px] shadow-lg overflow-hidden transition-all duration-500`}
      >
        {/* Sign Up */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-700 ease-in-out transform ${
            isActive
              ? "translate-x-full z-20 opacity-100"
              : "translate-x-0 z-10 opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full px-10 text-center">
            <SignUpPage />
          </div>
        </div>

        {/* Sign In */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-700 ease-in-out transform ${
            isActive
              ? "translate-x-full z-10 opacity-0 pointer-events-none"
              : "translate-x-0 z-20 opacity-100"
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full px-10 text-center">
            <LoginPage />
          </div>
        </div>

        {/* Toggle Panel */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full transition-all duration-700 rounded-l-[150px] z-30 ${
            isActive ? "-translate-x-full rounded-r-[150px] rounded-l-none" : ""
          }`}
        >
          <div
            className={`bg-gradient-to-r from-indigo-500 to-indigo-700 text-white absolute left-[-100%] w-[200%] h-full transition-transform duration-700 ${
              isActive ? "translate-x-1/2" : "translate-x-0"
            }`}
          >
            {/* Left Toggle */}
            <div
              className={`absolute w-1/2 h-full flex flex-col items-center justify-center px-6 text-center transition-all duration-700 ${
                isActive ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <h1 className="text-2xl font-bold">Welcome Back!</h1>
              <p className="text-sm my-4">
                Enter your personal details to use all of site features
              </p>
              <button
                className="mt-2 text-sm font-semibold uppercase border border-white px-8 py-2 rounded-md"
                onClick={() => setIsActive(false)}
              >
                Sign In
              </button>
            </div>

            {/* Right Toggle */}
            <div
              className={`absolute right-0 w-1/2 h-full flex flex-col items-center justify-center px-6 text-center transition-all duration-700 ${
                isActive ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <h1 className="text-2xl font-bold">Hello, Friend!</h1>
              <p className="text-sm my-4">
                Register with your personal details to use all of site features
              </p>
              <button
                className="mt-2 text-sm font-semibold uppercase border border-white px-8 py-2 rounded-md"
                onClick={() => setIsActive(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPagee;
