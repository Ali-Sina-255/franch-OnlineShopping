import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashSharp } from "react-icons/io5";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// This component now takes 'setCurrentView' to control the parent dashboard's state
export default function ProductList({ setCurrentView }) {
  const token = useSelector((state) => state.user.accessToken);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/category/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page_size: 1000 },
      });
      const categoryMap = res.data.results.reduce((acc, category) => {
        acc[category.id] = category.name;
        return acc;
      }, {});
      setCategories(categoryMap);
    } catch (error) {
      console.error("Error fetching categories for list view:", error);
    }
  };

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/product/product/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page },
      });
      setProducts(res.data.results);
      setTotalProducts(res.data.count);
      setTotalPages(Math.ceil(res.data.count / 20));
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCategories();
      fetchProducts(currentPage);
    }
  }, [token, currentPage]);

  const handleDelete = async (productId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/api/v1/product/product/${productId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Deleted!", "The product has been deleted.", "success");
        fetchProducts(currentPage);
      } catch (error) {
        Swal.fire("Error", "Failed to delete the product.", "error");
      }
    }
  };

  const handleEdit = (productId) => {
    setCurrentView({ name: "editProduct", data: { productId } });
  };

  const handleAddNew = () => {
    setCurrentView({ name: "addProduct", data: null });
  };

  const filteredProducts = products.filter((product) =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 mt-10 max-w-7xl mx-auto bg-white shadow-md rounded-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Product List ({totalProducts})</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field w-full md:w-64"
          />
          <button
            onClick={handleAddNew}
                      className="primary-btn whitespace-nowrap"
            
          >
            + Add New Product
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3">
                Image
              </th>
              <th scope="col" className="px-6 py-3">
                Product Name
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Stock
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-8">
                  Loading...
                </td>
              </tr>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <img
                      src={
                        product.image_url || "https://via.placeholder.com/60"
                      }
                      alt={product.product_name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {product.product_name}
                  </td>
                  <td className="px-6 py-4">
                    {categories[product.category] || "N/A"}
                  </td>
                  <td className="px-6 py-4">${product.price}</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4 flex items-center gap-4">
                    <button
                      onClick={() => handleEdit(product.id)}
                      className="text-blue-600"
                    >
                      <FaRegEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600"
                    >
                      <IoTrashSharp size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-8">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
