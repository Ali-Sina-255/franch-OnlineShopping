// import Customer from "./pages/ServiceManger";
import CategoryManagement from './pages/categoryManager.jsx'
import Product from "../../Pages/dashboard/Product";

import Dashboard from "./dashboard";
import Profile from "../../Pages/dashboard/Profiles.jsx";
import Attribute from "./pages/attribute.jsx";
import ProductManager from "./pages/ProductManager.jsx";
import ProductList from './pages/ProductList.jsx';
import OrderManagement from "./pages/OrderManagement.jsx"; 

const MainContent = ({ activeComponent, setActiveComponent }) => {
  const renderContent = () => {
    switch (activeComponent) {
      case "dashboard":
        return <Dashboard />;
      case "category":
        return <CategoryManagement />;
      case "attribute":
        return <Attribute />;
      case "products":
        return <ProductManager />;
      case "porductlist":
        return <ProductList setActiveComponent={setActiveComponent} />;
      // case "report":
      //   return <Report />;
      case "orders": // --- ADD THIS CASE ---
        return <OrderManagement />;
      case "proflie":
        return <Profile />;

      default:
        return <Dashboard />;
    }
  };

  return <div className="min-h-[93.5vh] bg-gray-200">{renderContent()}</div>;
};

export default MainContent;
