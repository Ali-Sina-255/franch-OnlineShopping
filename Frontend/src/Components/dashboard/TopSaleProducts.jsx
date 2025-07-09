import React, { useState } from "react";

const products = [
  {
    id: 1,
    name: "Vintage Jacket",
    price: "$45.00",
    image:
      "https://images.unsplash.com/photo-1602810311520-0b7d93d5565e?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 2,
    name: "Retro Shoes",
    price: "$30.00",
    image:
      "https://images.unsplash.com/photo-1580316019432-dbcad658bd1e?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 3,
    name: "Denim Shirt",
    price: "$25.00",
    image:
      "https://images.unsplash.com/photo-1618354691408-6f2c665c86d6?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 4,
    name: "Classic Sweater",
    price: "$35.00",
    image:
      "https://images.unsplash.com/photo-1583001805765-fbd6e1ec6b94?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 5,
    name: "Leather Boots",
    price: "$60.00",
    image:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1a2?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 6,
    name: "Checked Blazer",
    price: "$55.00",
    image:
      "https://images.unsplash.com/photo-1605426734477-8b54c0cfe929?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 7,
    name: "Plaid Skirt",
    price: "$28.00",
    image:
      "https://images.unsplash.com/photo-1618354691408-6f2c665c86d6?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 8,
    name: "Oversized Hoodie",
    price: "$32.00",
    image:
      "https://images.unsplash.com/photo-1603252110480-3f5e09c4099e?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 9,
    name: "Canvas Sneakers",
    price: "$22.00",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80",
  },
];

const TopSaleProducts = () => {
  const [selectedMonth, setSelectedMonth] = useState("July");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="text-gray-700 bg-white rounded-md p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Top Sale Products</h2>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border border-gray-300 rounded-md px-5 py-1 text-sm focus:outline-none"
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-lg flex h-20 gap-x-2 items-center  shadow-sm"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 border object-cover rounded"
            />
            <div>
              <h3 className=" text-sm font-medium">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSaleProducts;
