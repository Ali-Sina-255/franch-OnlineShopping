// import Customer from "./pages/ServiceManger";
import Categories from "../../Pages/dashboard/Categories";
import Product from "../../Pages/dashboard/Product";

import Dashboard from "./dashboard";
import Profile from "../../Pages/dashboard/Profiles.jsx";
import Orders from "../../Pages/dashboard/Orders.jsx";

const MainContent = ({ activeComponent }) => {
  const renderContent = () => {
    switch (activeComponent) {
      case "dashboard":
        return <Dashboard />;
      case "cate":
        return <Categories />;
      case "order":
        return <Orders />;
      case "product":
        return <Product />;
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
