import React from "react";
import {
  FaTshirt,
  FaUsers,
  FaShoppingCart,
  FaDollarSign,
} from "react-icons/fa";
import { PiChartLineUp } from "react-icons/pi";
import { GiGolfFlag } from "react-icons/gi";
import { SlDirections } from "react-icons/sl";
import OrderStatusChart from "./OrderStatusChart";

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-200">
      {/* Welcome Message */}
      <h1 className="text-center text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
        Welcome to CHIQ FRIP Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-5">
        <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
          <div className="p-2 bg-green-300 rounded-md ">
            <PiChartLineUp className="text-white text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold">Sales</p>
            <h2 className="text-xl font-bold">1,230</h2>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
          <div className="p-2 bg-blue-300 rounded-md ">
            <GiGolfFlag className="text-white text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold">Orders</p>
            <h2 className="text-xl font-bold">$12,340</h2>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
          <div className="p-2 bg-indigo-400 rounded-md ">
            <FaTshirt className="text-white text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold">Products</p>
            <h2 className="text-xl font-bold">540</h2>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
          <div className="p-2 bg-orange-400 rounded-md ">
            <FaUsers className="text-white text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold">Customer</p>
            <h2 className="text-xl font-bold">892</h2>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
          <div className="p-2 bg-rose-400 rounded-md ">
            <SlDirections className="text-white text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold">Returns</p>
            <h2 className="text-xl font-bold">892</h2>
          </div>
        </div>
      </div>
      <div className=" grid grid-cols-2 gap-x-5">
        <div className="text-lg font-semibold rounded-md  bg-white h-fit text-gray-700">
          <OrderStatusChart />
        </div>
        <div className="text-gray-500 bg-white rounded-md"></div>
      </div>
      {/* Add recent orders or top selling products here */}
      <div className="bg-white p-4 mt-10 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Recent Orders
        </h3>
        {/* You can replace this with a table component */}
        <p className="text-gray-500">You can show latest order table here...</p>
      </div>
    </div>
  );
};

export default Dashboard;
