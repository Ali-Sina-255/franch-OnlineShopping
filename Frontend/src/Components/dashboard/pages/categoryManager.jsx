import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaChevronDown, FaRegEdit } from "react-icons/fa";
import { IoTrashSharp } from "react-icons/io5";
import CryptoJS from "crypto-js";
import { useSelector } from "react-redux";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const CategoryManagement = () => {
  const token = useSelector((state) => state.user.accessToken);
  const [categoryName, setCategoryName] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editingCategory, setEditingCategory] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [categoryList, setCategoryList] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const secretKey = "TET4-1"; // Use a strong secret key
  const decryptData = (hashedData) => {
    if (!hashedData) {
      console.error("No data to decrypt");
      return null;
    }
    try {
      const bytes = CryptoJS.AES.decrypt(hashedData, secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error("Decryption failed:", error);
      return null;
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/category/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data.results);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const actionType = editingCategory ? "ویرایش" : "اضافه کردن";

    try {
      let response;      
      const authToken = decryptData(localStorage.getItem("auth_token")); // ✅ Retrieve token from localStorage


      if (editingCategory) {
        response = await axios.put(
          `${BASE_URL}/api/v1/category/${editingCategory.id}/`,
          {
            name: categoryName, // ✅ Include category list in update
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          Swal.fire({
            title: "ویرایش موفق!",
            text: "کتگوری با موفقیت ویرایش شد.",
            icon: "success",
            timer: 3000,
            timerProgressBar: true,
          });
          fetchCategories();
          setEditingCategory(null);
        } else {
          throw new Error("ویرایش کتگوری ناموفق بود.");
        }
      } else {
        response = await axios.post(
          `${BASE_URL}/api/v1/category/`,
          {
            name: categoryName, // ✅ Include category list in creation
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          Swal.fire({
            title: "اضافه شد!",
            text: "کتگوری با موفقیت اضافه شد.",
            icon: "success",
            timer: 3000,
            timerProgressBar: true,
          });
        } else {
          throw new Error("اضافه کردن کتگوری ناموفق بود.");
        }
      }

      setCategoryName("");
      setSelectedRoles([]);
      fetchCategories();
    } catch (error) {
      Swal.fire({
        title: "خطا",
        text: "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
        icon: "error",
      });
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "آیا مطمئن هستید؟",
      text: "این عملیات قابل بازگشت نیست!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "بله، حذف شود!",
      cancelButtonText: "لغو",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await axios.delete(
          `${BASE_URL}/api/v1/category/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 204) {
          Swal.fire({
            title: "حذف شد!",
            text: "کتگوری با موفقیت حذف شد.",
            icon: "success",
            timer: 3000,
            timerProgressBar: true,
          });
          fetchCategories();
        } else {
          Swal.fire({
            title: "خطا",
            text: "حذف کتگوری ناموفق بود.",
            icon: "error",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "خطا",
          text: "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
          icon: "error",
        });
        console.error("Error:", error);
      }
    }
  };

const handleEdit = (category) => {
  setCategoryName(category.name);
  setSelectedRoles(category.stages || []);
  setCategoryList(category.category_list || ""); // ✅ This line fixes the issue
  setEditingCategory(category);
};

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = Array.isArray(filteredCategories)
    ? filteredCategories.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  return (
    <div className="py-10 bg-gray-200 w-full min-h-[91vh] px-5">
      <div className="max-w-3xl mx-auto py-4 px-5 shadow-lg bg-white rounded-md">
        <h2 className="text-xl text-center font-bold mb-4">
          {editingCategory ? "Edit Category" : "Add New Category"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Name */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-3 py-2 border rounded bg-gray-200 text-black focus:outline-none"
              placeholder="Enter category name"
              required
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-center gap-4 mt-4">
            <button type="submit" className="secondry-btn">
              {editingCategory ? "Update" : "Add"}
            </button>
            {editingCategory && (
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="tertiary-btn"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Category List */}
      <div className="w-full max-w-4xl mx-auto mt-10 bg-white shadow-lg rounded-md overflow-hidden">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-green text-gray-100 text-center">
              <th className="border border-gray-300 px-6 py-2.5 text-sm font-semibold">
                Category Name
              </th>
              <th className="border border-gray-300 px-6 py-2.5 text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(categories) &&
              categories.map((category) => (
                <tr
                  key={category.id}
                  className="text-center border-b border-gray-200 bg-white hover:bg-gray-200 transition-all"
                >
                  <td className="border-gray-300 px-6 py-2 text-gray-700">
                    {category.name}
                  </td>
                  <td className="flex items-center justify-center gap-x-5 border-gray-300 px-6 py-2 text-gray-700">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-green hover:scale-105 transition-all duration-300"
                    >
                      <FaRegEdit size={24} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:scale-105 transition-all duration-300"
                    >
                      <IoTrashSharp size={24} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Component */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default CategoryManagement;
