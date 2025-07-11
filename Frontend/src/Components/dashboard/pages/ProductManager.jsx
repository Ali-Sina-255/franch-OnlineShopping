import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import AttributeInput from "./AttributeInput";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function ProductManager() {
  const token = useSelector((state) => state.user.accessToken);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    product_name: "",
    description: "",
    details: "",
    tags: "",
    attributes: "{}",
    type: "ma",
    condition: "New",
    price: "",
    stock: "",
    image_url: null,
    hover_image_url: null,
    seller_notes: "",
    material: "",
    is_available: true,
    category: "",
    multi_images: [],
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (token) {
      fetchCategories();
    }
  }, [token]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/category/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data.results || []);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "multi_images") {
      setFormData((prev) => ({ ...prev, [name]: Array.from(files) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleAttributeChange = (attributeValues) => {
    setFormData((prev) => ({
      ...prev,
      attributes: JSON.stringify(attributeValues),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "multi_images" && Array.isArray(value)) {
        value.forEach((file) => data.append("uploaded_images", file));
      } else if (key === "details") {
        const detailList = value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
        data.append(key, JSON.stringify(detailList));
      } else if (value !== null && value !== undefined) {
        data.append(key, value);
      }
    });

    const url = editingId
      ? `${BASE_URL}/api/v1/product/product/${editingId}/`
      : `${BASE_URL}/api/v1/product/product/`;
    const method = editingId ? "put" : "post";

    try {
      await axios[method](url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire(
        "Success!",
        `Product successfully ${editingId ? "updated" : "added"}.`,
        "success"
      );
      setEditingId(null);
    } catch (error) {
      console.error("Product submission error:", error.response?.data || error);
      Swal.fire(
        "Error",
        "Submission failed. Check the developer console and backend server logs for more details.",
        "error"
      );
    }
    setFormData({
      product_name: "",
      description: "",
      details: "",
      tags: "",
      attributes: "{}",
      type: "ma",
      condition: "New",
      price: "",
      stock: "",
      image_url: null,
      hover_image_url: null,
      seller_notes: "",
      material: "",
      is_available: true,
      category: "",
      multi_images: [],
    });
  };

  return (
    <div className="p-6 ">
      <div className=" bg-white p-6 shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-6">
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>
        <form onSubmit={handleSubmit} className="">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block mb-1 font-medium">Product Name</label>
              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded  bg-gray-200 text-black focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded  bg-gray-200 text-black focus:outline-none"
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded  bg-gray-200 text-black focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded  bg-gray-200 text-black focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded  bg-gray-200 text-black focus:outline-none"
                required
              >
                <option value="ma">Man</option>
                <option value="wo">Woman</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded  bg-gray-200 text-black focus:outline-none"
                required
              >
                <option value="New">New</option>
                <option value="Use">Use</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="col-span-1">
              <label className="block mb-1 font-medium">Material</label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded  bg-gray-200 text-black focus:outline-none"
                required
              />
            </div>

            <div className="col-span-1">
              <label className="block mb-1 font-medium">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded  bg-gray-200 text-black focus:outline-none"
                placeholder="e.g. summer, casual, cotton"
              />
            </div>
          </div>

          <div className="col-span-2">
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              className="input-field w-full"
              rows="4"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-1 font-medium">
              Details (comma-separated list)
            </label>
            <input
              type="text"
              name="details"
              value={formData.details}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border rounded  bg-gray-200 text-black focus:outline-none"
              placeholder="e.g. 100% Cotton, Machine Washable"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-1 font-medium">Seller Notes</label>
            <textarea
              name="seller_notes"
              value={formData.seller_notes}
              onChange={handleFormChange}
              className="input-field w-full"
              rows="3"
              required
            />
          </div>

          <AttributeInput
            categoryId={formData.category}
            onAttributeChange={handleAttributeChange}
          />

          <div className="col-span-2 p-4 border rounded-md space-y-4">
            <h3 className="font-medium text-lg">Product Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 font-medium">
                  Main Image (image_url)
                </label>
                <input
                  type="file"
                  name="image_url"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border rounded file:bg-blue-500 file:border-none file:py-1 file:text-white  cursor-pointer file:rounded-md bg-gray-200 text-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  Hover Image (hover_image_url)
                </label>
                <input
                  type="file"
                  name="hover_image_url"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border rounded file:bg-blue-500 file:border-none file:py-1 file:text-white  cursor-pointer file:rounded-md bg-gray-200 text-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  Additional Images (for Gallery)
                </label>
                <input
                  type="file"
                  name="multi_images"
                  multiple
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border rounded file:bg-blue-500 file:border-none file:py-1 file:text-white  cursor-pointer file:rounded-md bg-gray-200 text-black focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 my-5 col-span-2">
            <input
              type="checkbox"
              name="is_available"
              checked={formData.is_available}
              onChange={handleFormChange}
              className="h-5 w-5"
            />
            <label className="font-medium">
              Is this product available for sale?
            </label>
          </div>
          <div className="flex justify-center mt-6">
            <button type="submit" className=" primary-btn">
              {editingId ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
