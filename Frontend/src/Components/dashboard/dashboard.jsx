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
import TopSaleProducts from "./TopSaleProducts";

const Dashboard = () => {
  const orders = [
    {
      id: 1,
      sku: "CT-00001",
      name: "Long Floral Dress",
      brand: "Sézane",
      price: 89.99,
      quantity: 1,
      shippingCost: 5.99,
      category: "Apparel",
      customerImage: "https://randomuser.me/api/portraits/women/44.jpg",
      imageUrl: "https://placehold.co/800x1200/D4A5A5/FFFFFF?text=Dress+Front",
      dateAdded: "2023-10-26T10:00:00Z",
    },
    {
      id: 2,
      sku: "CT-00002",
      name: "Canvas Sneakers",
      brand: "Nike",
      price: 65.0,
      quantity: 2,
      shippingCost: 7.5,
      category: "Footwear",
      customerImage: "https://randomuser.me/api/portraits/men/32.jpg",
      imageUrl: "https://placehold.co/800x1200/ADD8E6/FFFFFF?text=Sneakers",
      dateAdded: "2023-11-10T15:30:00Z",
    },
    {
      id: 3,
      sku: "CT-00003",
      name: "Leather Backpack",
      brand: "Fossil",
      price: 120.0,
      quantity: 1,
      shippingCost: 6.99,
      category: "Accessories",
      customerImage: "https://randomuser.me/api/portraits/women/21.jpg",
      imageUrl: "https://placehold.co/800x1200/BDB76B/FFFFFF?text=Backpack",
      dateAdded: "2024-01-05T09:20:00Z",
    },
    {
      id: 4,
      sku: "CT-00004",
      name: "Denim Jacket",
      brand: "Levi’s",
      price: 75.5,
      quantity: 1,
      shippingCost: 5.0,
      category: "Outerwear",
      customerImage: "https://randomuser.me/api/portraits/men/67.jpg",
      imageUrl: "https://placehold.co/800x1200/87CEFA/FFFFFF?text=Denim+Jacket",
      dateAdded: "2024-02-14T12:10:00Z",
    },
    {
      id: 5,
      sku: "CT-00005",
      name: "Wool Scarf",
      brand: "Acne Studios",
      price: 45.25,
      quantity: 3,
      shippingCost: 4.25,
      category: "Accessories",
      customerImage: "https://randomuser.me/api/portraits/women/18.jpg",
      imageUrl: "https://placehold.co/800x1200/D8BFD8/FFFFFF?text=Wool+Scarf",
      dateAdded: "2024-03-01T08:00:00Z",
    },
  ];

  return (
    <div className="p-6 bg-gray-200">
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
        <div className="text-gray-500 bg-white rounded-md">
          <TopSaleProducts />
        </div>
      </div>
      {/* Add recent orders or top selling products here */}
      <div className="bg-white p-5 mt-10 rounded-lg shadow-md overflow-x-auto">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Recent Orders
        </h2>
        <table className="w-full text-sm text-left text-gray-600">
          <thead>
            <tr className="bg-gray-100 text-xs text-gray-500 uppercase">
              <th className="p-3">Date</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Product</th>
              <th className="p-3">Details</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Price</th>
              <th className="p-3">Shipping</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b hover:bg-gray-50 transition duration-200"
              >
                {/* Date */}
                <td className="p-3 whitespace-nowrap">
                  {new Date(order.dateAdded).toLocaleDateString()}
                </td>

                {/* Customer */}
                <td className="p-3">
                  <img
                    src={order.customerImage}
                    alt="Customer"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>

                {/* Product Image & Name */}
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={order.imageUrl}
                    alt={order.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <span className="font-medium">{order.name}</span>
                </td>

                {/* Details */}
                <td className="p-3">
                  <p className="text-xs text-gray-500">{order.brand}</p>
                  <p className="text-xs">{order.category}</p>
                </td>

                {/* Quantity */}
                <td className="p-3">{order.quantity}</td>

                {/* Price */}
                <td className="p-3 font-semibold">${order.price.toFixed(2)}</td>

                {/* Shipping */}
                <td className="p-3">${order.shippingCost.toFixed(2)}</td>

                {/* Action */}
                <td className="p-3 text-center">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
