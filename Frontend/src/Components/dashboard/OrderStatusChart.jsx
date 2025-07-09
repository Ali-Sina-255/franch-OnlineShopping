// components/OrderStatusChart.js
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { name: "Jan", Orders: 120, Sales: 100, Returns: 10 },
  { name: "Feb", Orders: 150, Sales: 130, Returns: 5 },
  { name: "Mar", Orders: 170, Sales: 160, Returns: 8 },
  { name: "Apr", Orders: 140, Sales: 120, Returns: 12 },
  { name: "May", Orders: 200, Sales: 180, Returns: 15 },
  { name: "Jun", Orders: 160, Sales: 150, Returns: 9 },
  { name: "Jul", Orders: 180, Sales: 170, Returns: 7 },
  { name: "Aug", Orders: 190, Sales: 175, Returns: 6 },
  { name: "Sep", Orders: 170, Sales: 160, Returns: 10 },
  { name: "Oct", Orders: 210, Sales: 195, Returns: 4 },
  { name: "Nov", Orders: 220, Sales: 200, Returns: 6 },
  { name: "Dec", Orders: 250, Sales: 230, Returns: 11 },
];

const OrderStatusChart = () => {
  return (
    <div className="bg-white p-5 rounded-md shadow-md">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Order Status</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Orders" fill="#3b82f6" />
          <Bar dataKey="Sales" fill="#10b981" />
          <Bar dataKey="Returns" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderStatusChart;
