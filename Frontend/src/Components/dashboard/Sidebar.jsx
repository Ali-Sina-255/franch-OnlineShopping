// Sidebar.js (Corrected Role Handling)

import React, { useState } from "react";
import { FaHome, FaServicestack, FaSignOutAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { signOutSuccess } from "../../state/userSlice/userSlice"; // Make sure path is correct
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Fa3, FaBuilding } from "react-icons/fa6";
import { MdDashboardCustomize } from "react-icons/md";
import { FaShop } from "react-icons/fa6";
import { GiTakeMyMoney } from "react-icons/gi";
import { LuActivity } from "react-icons/lu";
import { MdLocalLaundryService } from "react-icons/md";
import { LuCable } from "react-icons/lu";
import { FaUserGear } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { Home, LucideUserRoundPlus } from "lucide-react";

const Sidebar = ({ setActiveComponent }) => {
  const [selectedC, setSelectedC] = useState("home");
  const [activeC, setActiveC] = useState("home");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const MySwal = withReactContent(Swal);

  const handleSignOut = () => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, sign out!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(signOutSuccess());
        navigate("/sign-in");
      }
    });
  };

  const AllComponents = [
    { name: "home", value: "home", icon: <LuActivity /> },
    { name: "category management", value: "category", icon: <LucideUserRoundPlus /> },
    { name: "attribute management", value: "attribute", icon: <FaBuilding /> },
    { name: "products", value: "products", icon: <MdLocalLaundryService /> },
    { name: "profile", value: "proflie", icon: <GiTakeMyMoney /> },
  
    { name: "logout", value: "signout", icon: <FaSignOutAlt /> },
  ];

  let accessibleComponents = [];

  if (currentUser?.role?.[0] === 0 || currentUser?.role?.[0] === 1) {
    // نقش 0 و 1 => دسترسی کامل به همه منوها
    accessibleComponents = AllComponents;
  } else if (currentUser?.role?.[0] === 2) {
    // نقش 2 => فقط منوهای خاص
    const allowedForRole2 = [
      "home",
      "ServiceManager",
      "RentManger",
      "Salaries",
      "Expenses",
      "Blockes",
      "financial",
      "signout",
    ];
    accessibleComponents = AllComponents.filter((item) =>
      allowedForRole2.includes(item.value)
    );
  } else {
    // نقش‌های دیگر یا کاربر لاگین نشده => فقط خروج
    accessibleComponents = AllComponents.filter(
      (item) => item.value === "signout"
    );
  }

  return (
    <div 
      className={`h-full transition-all duration-300 ease-in-out w-64 bg-gradient-to-b from-[#2a2185] to-[#3a32a8] overflow-y-auto `}
    >
      <header className="flex items-center gap-5 p-5 text-white font-bold text-xl">
        <div className="flex items-center justify-center p-1 bg-white rounded-full">
          <img src="/logo.png" alt="Logo" className="h-10 w-10" />
        </div>

        <span className="text-lg font-semibold  text-white whitespace-nowrap">
          CHIQ FRIP
        </span>
      </header>

      <ul className=" mr-1">
        {AllComponents.map((component, index) => (
          <li key={index} className="relative group cursor-pointer">
            {component.value === "signout" ? (
              <a
                onClick={handleSignOut}
                className={`relative flex items-center w-full px-6 py-3 transition-all duration-300 rounded-r-3xl
                ${
                  activeC === component.value
                    ? "bg-white text-primary"
                    : "hover:bg-white hover:bg-opacity-20 text-white"
                }`}
              >
                <span className="text-xl">{component.icon}</span>

                <span className="mr-4 text-lg font-semibold whitespace-nowrap">
                  {component.name}
                </span>

                <span
                  className={`absolute left-0 -top-12 w-12 h-12 bg-transparent rounded-full shadow-[-35px_35px_0_10px_white]
                      transition-opacity duration-100
                      ${
                        activeC === component.value
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                ></span>
                <span
                  className={`absolute left-0 -bottom-12 w-12 h-12 bg-transparent rounded-full shadow-[-35px_-35px_0_10px_white]
                      transition-opacity duration-100
                      ${
                        activeC === component.value
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                ></span>
              </a>
            ) : (
              <a
                onClick={() => {
                  setActiveComponent(component.value);
                  setSelectedC(component.value);
                  setActiveC(component.value);
                }}
                onMouseEnter={() => setActiveC(component.value)}
                onMouseLeave={() => setActiveC(selectedC)}
                className={`relative flex items-center w-full px-6 py-3 transition-all duration-300 rounded-r-3xl
                ${
                  activeC === component.value
                    ? "bg-white text-primary"
                    : "hover:bg-white hover:bg-opacity-20 text-white"
                }`}
              >
                <span className="text-xl">{component.icon}</span>

                <span className="mr-4 text-lg font-semibold whitespace-nowrap">
                  {component.name}
                </span>

                <>
                  <span
                    className={`absolute left-0 -top-12 w-12 h-12 bg-transparent rounded-full shadow-[-35px_35px_0_10px_white]
                      transition-opacity duration-100
                      ${
                        activeC === component.value
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                  ></span>
                  <span
                    className={`absolute left-0 -bottom-12 w-12 h-12 bg-transparent rounded-full shadow-[-35px_-35px_0_10px_white]
                      transition-opacity duration-100
                      ${
                        activeC === component.value
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                  ></span>
                </>
              </a>
            )}

            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {component.name}
              {/* Arrow for tooltip */}
              <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-800"></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
