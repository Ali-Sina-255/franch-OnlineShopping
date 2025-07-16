// src/components/MegaMenu.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { filters } from "../data/products";

const MegaMenu = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed left-0 top-[60px] w-full min-h-[300px] z-40 bg-gradient-to-r from-indigo-50 via-white to-blue-50 backdrop-blur-sm  border-indigo-100 shadow-lg"
      onMouseLeave={onClose}
    >
      <div className="mx-auto max-w-7xl px-6 py-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filters.categories.map((category) => (
          <Link
            key={category}
            to={`/category/${category.toLowerCase()}`}
            className="block text-gray-700 text-sm font-medium hover:text-indigo-600 hover:underline transition-colors"
            onClick={onClose}
          >
            {category}
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default MegaMenu;
