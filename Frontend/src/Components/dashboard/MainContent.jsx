import React from "react";
import { useSelector } from "react-redux";
import CategoryManagement from "./pages/categoryManager.jsx";
import Dashboard from "./dashboard";
import Profile from "../../Pages/dashboard/Profiles.jsx";
import Attribute from "./pages/attribute.jsx";
import ProductManager from "./pages/ProductManager.jsx";
import ProductList from "./pages/ProductList.jsx";
import OrderManagement from "./pages/OrderManagement.jsx";



const MainContent = ({ activeComponent, setActiveComponent }) => {
  const { profile } = useSelector((state) => state.user);
  const isAdmin = profile?.role === "admin";
  const renderContent = () => {
    switch (activeComponent) {
      case "dashboard":
        return isAdmin ? <Dashboard /> : <OrderManagement userOnly={true} />;
      case "category":
        return isAdmin ? <CategoryManagement /> : null;
      case "attribute":
        return isAdmin ? <Attribute /> : null;
      case "products":
        return isAdmin ? <ProductManager /> : null;
      case "porductlist":
        return isAdmin ? (
          <ProductList setActiveComponent={setActiveComponent} />
        ) : null;
      case "orders":
        return <OrderManagement userOnly={!isAdmin} />;
      case "profile":
        return <Profile />;
      default:
        return isAdmin ? <Dashboard /> : <OrderManagement userOnly={true} />;
    }
  };

  return <div className="min-h-full bg-gray-200">{renderContent()}</div>;
};

export default MainContent;
