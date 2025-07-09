// Dashboard.js
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import { FaBell, FaEnvelope } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [searchOpen, setSearchOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const notificationsCount = 3;
  const messagesCount = 5;
  const user = {
    name: " M Anwar",
    image: "https://i.pravatar.cc/40?img=3", // Replace with your user image
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <Sidebar
        setActiveComponent={setActiveComponent}
        activeComponent={activeComponent}
      />

      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <div className="bg-gray-100 py-2 w-full flex items-center justify-between px-4 shadow-sm">
          {/* Search Box */}
          <div className="relative flex items-center">
            <FaSearch className="absolute left-3 text-gray-600 text-base pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`pl-10 py-1 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all duration-300 ease-in-out
          ${isFocused ? "w-52" : "w-10"} bg-white`}
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <FaBell className="text-gray-600 text-xl cursor-pointer" />
              {notificationsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {notificationsCount}
                </span>
              )}
            </div>

            {/* Messages */}
            <div className="relative">
              <FaEnvelope className="text-gray-600 text-xl cursor-pointer" />
              {messagesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {messagesCount}
                </span>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-2 cursor-pointer">
              <img
                src={user.image}
                alt="User"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className=" font-semibold text-gray-500">{user.name}</span>
            </div>
          </div>
        </div>
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <MainContent activeComponent={activeComponent} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
