// import Customer from "./pages/ServiceManger";
import Categories from "../../Pages/dashboard/Categories";
import Product from "../../Pages/dashboard/Product";

import Dashboard from "./dashboard";
import Profile from "../../Pages/dashboard/Profiles.jsx";
import Attribute from "./pages/attribute.jsx";
import ProductManager from "./pages/ProductManager.jsx";

const MainContent = ({ activeComponent }) => {
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
      // case "report":
      //   return <Report />;
      case "proflie":
        return <Profile />;
    
   
      default:
        return <Dashboard />;
    }
  };

  return <div className="min-h-[90vh]">{renderContent()}</div>;
};

export default MainContent;
