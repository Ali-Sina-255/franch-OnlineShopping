// Sidebar.js (Corrected Role Handling)

import React, { useState } from "react";
import { FaHome, FaServicestack, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { signOutSuccess } from "../../state/userSlice/userSlice"; // Make sure path is correct
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Fa3, FaBuilding } from "react-icons/fa6";
import { MdDashboardCustomize } from "react-icons/md";
import { MdLocalLaundryService } from "react-icons/md";
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
    {
      name: "Home",
      value: "home",
      icon: <MdDashboardCustomize className="text-green-500" />,
    },
    {
      name: "Category Management",
      value: "category",
      icon: <LucideUserRoundPlus className="text-blue-500" />,
    },
    {
      name: "Attribute Management",
      value: "attribute",
      icon: <FaBuilding className="text-blue-500" />,
    },
    {
      name: "New Product",
      value: "products",
      icon: <MdLocalLaundryService className="text-blue-500" />,
    },
    {
      name: "Porducts",
      value: "porductlist",
      icon: <FaBuilding className="text-blue-500" />,
    },
    {
      name: "Profile",
      value: "proflie",
      icon: <FaUser className="text-blue-500" />,
    },

    {
      name: "Logout",
      value: "signout",
      icon: <FaSignOutAlt className="text-rose-500" />,
    },
  ];

  let accessibleComponents = [];

  if (currentUser?.role?.[0] === 0 || currentUser?.role?.[0] === 1) {
    accessibleComponents = AllComponents;
  } else if (currentUser?.role?.[0] === 2) {
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
      className={`h-full transition-all duration-300 ease-in-out w-64 bg-white `}
    >
      <header className="flex items-center gap-5 p-5  font-bold text-xl">
        <Link to="/" className="flex items-center justify-center p-1 bg-gray-300 h-10 w-10 rounded-full">
          {/* <img src="/logo.png" alt="Logo" className="h-10 w-10" /> */}
          <FaUser className=" text-[#7209b7]" size={24} />
        </Link>

        <Link to='/' className="text-lg font-semibold  text-[#7209b7] whitespace-nowrap">
          CHIQ FRIP
        </Link>
      </header>
      <ul className=" mx-2">
        {AllComponents.map((component, index) => (
          <li key={index} className="relative group cursor-pointer ">
            {component.value === "signout" ? (
              <a
                onClick={handleSignOut}
                onMouseEnter={() => setActiveC(component.value)}
                onMouseLeave={() => setActiveC(selectedC)}
                className={`relative flex items-center w-full gap-x-3 px-4 rounded-md py-3 transition-all duration-300
            ${
              activeC === component.value
                ? "bg-gray-200 text-primary"
                : "hover:bg-gray-200 hover:bg-opacity-20 text-black"
                  }`}
                
              >
                <span className="text-xl">{component.icon}</span>
                <span className="text-base font-semibold whitespace-nowrap">
                  {component.name}
                </span>
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
                className={`relative flex items-center gap-x-3 w-full px-4  rounded-md py-3 transition-all duration-300
            ${
              activeC === component.value
                ? "bg-gray-200 text-primary "
                : "hover:bg-gray-200 hover:bg-opacity-20 text-black"
            }`}
              >
                <span className="text-xl">{component.icon}</span>
                <span className="text-base font-semibold whitespace-nowrap">
                  {component.name}
                </span>
              </a>
            )}
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {component.name}
              <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-800"></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
