// Sidebar.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { signOutSuccess } from "../../state/userSlice/userSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  LuActivity,
  LucideUserRoundPlus,
  FaBuilding,
  MdLocalLaundryService,
  FaSignOutAlt,
  FaUserGear,
} from "react-icons/all";

const MySwal = withReactContent(Swal);

const Sidebar = ({ setActiveComponent, activeComponent }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const handleSignOut = () => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, sign out!",
      customClass: {
        container: "swal-z-index",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(signOutSuccess());
        navigate("/sign-in");
      }
    });
  };

  const AllComponents = [
    {
      name: "Dashboard",
      value: "dashboard",
      icon: <LuActivity className="text-lg" />,
    },
    {
      name: "Categories",
      value: "category",
      icon: <LucideUserRoundPlus className="text-lg" />,
    },
    {
      name: "Attributes",
      value: "attribute",
      icon: <FaBuilding className="text-lg" />,
    },
    {
      name: "Products",
      value: "products",
      icon: <MdLocalLaundryService className="text-lg" />,
    },
    {
      name: "Product List",
      value: "porductlist",
      icon: <FaUserGear className="text-lg" />,
    },
    {
      name: "Profile",
      value: "profile",
      icon: <FaUserGear className="text-lg" />,
    },
    {
      name: "Logout",
      value: "signout",
      icon: <FaSignOutAlt className="text-lg" />,
    },
  ];

  // Role-based access control
  const accessibleComponents = (() => {
    if (currentUser?.role?.[0] === 0 || currentUser?.role?.[0] === 1) {
      return AllComponents;
    } else if (currentUser?.role?.[0] === 2) {
      return AllComponents.filter((item) =>
        ["dashboard", "products", "porductlist", "signout"].includes(item.value)
      );
    } else {
      return AllComponents.filter((item) => item.value === "signout");
    }
  })();

  return (
    <div className="h-full w-64 bg-gradient-to-b from-indigo-900 to-indigo-700 text-white transition-all duration-300 overflow-y-auto">
      <header className="flex items-center p-5 border-b border-indigo-600">
        <div className="bg-white rounded-full p-2 mr-3">
          <img src="/logo.png" alt="Logo" className="h-10 w-10" />
        </div>
        <span className="text-xl font-bold">CHIQ FRIP</span>
      </header>

      <nav className="py-4">
        <ul>
          {accessibleComponents.map((component, index) => (
            <li key={index} className="relative mb-1 mx-2">
              {component.value === "signout" ? (
                <button
                  onClick={handleSignOut}
                  className={`w-full flex items-center p-4 rounded-xl transition-all duration-300
                    ${
                      activeComponent === component.value
                        ? "bg-white text-indigo-700 shadow-lg"
                        : "hover:bg-indigo-800"
                    }`}
                >
                  <span className="mr-3">{component.icon}</span>
                  <span className="font-medium">{component.name}</span>
                </button>
              ) : (
                <button
                  onClick={() => setActiveComponent(component.value)}
                  className={`w-full flex items-center p-4 rounded-xl transition-all duration-300
                    ${
                      activeComponent === component.value
                        ? "bg-white text-indigo-700 shadow-lg"
                        : "hover:bg-indigo-800"
                    }`}
                >
                  <span className="mr-3">{component.icon}</span>
                  <span className="font-medium">{component.name}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
