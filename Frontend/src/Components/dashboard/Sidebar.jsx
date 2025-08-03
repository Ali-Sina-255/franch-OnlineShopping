import React, { useState } from "react";
import {
  FaBoxOpen,
  FaSignOutAlt,
  FaUser,
  FaBuilding,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { signOutSuccess } from "../../state/userSlice/userSlice";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { MdDashboardCustomize, MdLocalLaundryService } from "react-icons/md";
import { LucideUserRoundPlus } from "lucide-react";

const Sidebar = ({ setActiveComponent, activeComponent }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const { currentUser } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(true); // sidebar toggle for mobile

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

  // Define all possible menu items with an 'adminOnly' flag
  const allMenuItems = [
    {
      name: "Dashboard",
      value: "dashboard",
      icon: <MdDashboardCustomize className="text-green-500" />,
      adminOnly: true,
    },
    {
      name: "Category",
      value: "category",
      icon: <LucideUserRoundPlus className="text-blue-500" />,
      adminOnly: true,
    },
    {
      name: "Attribute",
      value: "attribute",
      icon: <FaBuilding className="text-blue-500" />,
      adminOnly: true,
    },
    {
      name: "New Product",
      value: "products",
      icon: <MdLocalLaundryService className="text-blue-500" />,
      adminOnly: true,
    },
    {
      name: "Product List",
      value: "porductlist",
      icon: <FaBoxOpen className="text-purple-500" />,
      adminOnly: true,
    },
    {
      name: "Orders",
      value: "orders",
      icon: <FaBoxOpen className="text-purple-500" />,
      adminOnly: false,
    }, // Will be used for both roles
    {
      name: "Profile",
      value: "profile",
      icon: <FaUser className="text-blue-500" />,
      adminOnly: false,
    },
    {
      name: "Logout",
      value: "signout",
      icon: <FaSignOutAlt className="text-rose-500" />,
      adminOnly: false,
    },
  ];

  // Filter the list based on the user's role
  const accessibleComponents = allMenuItems.filter((item) => {
    // If user is not an admin, hide admin-only items
    if (currentUser?.role !== "admin" && item.adminOnly) {
      return false;
    }
    return true;
  });

  return (
    <>
      {/* Sidebar */}
      <div
        className={` h-full transition-all duration-300 ease-in-out bg-white shadow-md ${
          isOpen ? "w-[70px] md:w-[80px] lg:w-64" : "w-0"
        } overflow-hidden`}
      >
        <header className="flex items-center justify-center lg:justify-start gap-5 p-5 font-bold text-xl">
          <Link
            to="/"
            className="flex items-center justify-center p-2 bg-gray-300 h-8 w-8 md:h-10 md:w-10 rounded-full"
          >
            <FaUser className="text-[#7209b7]" size={24} />
          </Link>
          <Link
            to="/"
            className="text-lg font-semibold text-[#7209b7] whitespace-nowrap hidden lg:inline"
          >
            CHIQ FRIP
          </Link>
        </header>

        {/* Toggle Button - Inside Sidebar - Mobile Only */}
        <div className="block lg:hidden text-center mb-4">
          <button
            onClick={() => setIsOpen(false)}
            className="text-[#7209b7] text-xl"
          >
            <FaTimes />
          </button>
        </div>

        {/* Sidebar Links */}
        <ul className="mx-2 space-y-1">
          {accessibleComponents.map((component, index) => (
            <li key={index} className="relative group  cursor-pointer">
              <a
                onClick={() => {
                  if (component.value === "signout") {
                    handleSignOut();
                  } else {
                    setActiveComponent(component.value);
                  }

                  // Auto-close sidebar on mobile
                  if (window.innerWidth < 1024) {
                    setIsOpen(false);
                  }
                }}
                className={`relative flex items-center justify-center lg:justify-start gap-x-3 w-full px-4 rounded-md py-3 transition-all duration-300
  ${
    activeComponent === component.value
      ? "bg-gray-200 text-primary"
      : "hover:bg-gray-200 text-black"
  }`}
              >
                <span className="text-xl md:text-2xl lg:text-xl">
                  {component.icon}
                </span>
                <span className="text-base font-semibold whitespace-nowrap hidden lg:inline">
                  {component.value === "orders" && currentUser?.role !== "admin"
                    ? "My Orders"
                    : component.name}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Toggle Button - Show Sidebar when Hidden (Mobile Only) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 left-5 z-40 bg-[#7209b7] text-white p-3 rounded-full shadow-lg block lg:hidden"
        >
          <FaBars size={20} />
        </button>
      )}
    </>
  );
};

export default Sidebar;
