import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    product_name: "",
    description: "",
    price: 0,
    stock: 0,
    is_available: true,
    category: "",
    image: null,
    multi_images: [],
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get(`${BASE_URL}/api/v1/product/product/`);
    setProducts(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get(`${BASE_URL}/api/v1/category/`);
    setCategories(res.data.results);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "multi_images") {
        value.forEach((file) => data.append("uploaded_images", file)); // 🔁 change field name
      } else {
        data.append(key, value);
      }
    });

    try {
      if (editingId) {
        await axios.put(
          `${BASE_URL}/api/v1/product/product/${editingId}/`,
          data
        );
        Swal.fire("ویرایش شد", "محصول با موفقیت ویرایش شد", "success");
      } else {
        await axios.post(`${BASE_URL}/api/v1/product/product/`, data);
        Swal.fire("اضافه شد", "محصول با موفقیت اضافه شد", "success");
      }
      setFormData({
        product_name: "",
        description: "",
        price: 0,
        stock: 0,
        is_available: true,
        category: "",
        image: null,
        multi_images: [],
      });
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.error(error);
      Swal.fire("خطا", "درخواست ناموفق بود", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "آیا مطمئن هستید؟",
      text: "این عملیات قابل بازگشت نیست!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف کن",
    });
    if (result.isConfirmed) {
      await axios.delete(`${BASE_URL}/api/v1/product/product/${id}/`);
      Swal.fire("حذف شد", "محصول با موفقیت حذف شد", "success");
      fetchProducts();
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md space-y-6">
      <h2 className="text-xl font-semibold border-b pb-2 text-right">
        مدیریت محصولات
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6 text-right"
      >
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            نام محصول
          </label>
          <input
            type="text"
            className="input-field w-full"
            value={formData.product_name}
            onChange={(e) =>
              setFormData({ ...formData, product_name: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            قیمت
          </label>
          <input
            type="number"
            className="input-field w-full"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            موجودی
          </label>
          <input
            type="number"
            className="input-field w-full"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            کتگوری
          </label>
          <select
            className="input-field w-full"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
          >
            <option value="">انتخاب کتگوری</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            توضیحات
          </label>
          <textarea
            className="input-field w-full"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            تصویر اصلی
          </label>
          <input
            type="file"
            className="input-field w-full"
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.files[0] })
            }
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            تصاویر چندگانه
          </label>
          <input
            type="file"
            multiple
            className="input-field w-full"
            onChange={(e) =>
              setFormData({
                ...formData,
                multi_images: Array.from(e.target.files),
              })
            }
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.is_available}
              onChange={(e) =>
                setFormData({ ...formData, is_available: e.target.checked })
              }
            />
            در دسترس است؟
          </label>
        </div>

        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {editingId ? "ویرایش محصول" : "اضافه کردن محصول"}
        </button>
      </form>

      <div className="overflow-x-auto mt-6">
        <table className="w-full text-sm text-right border border-gray-300 rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 border-l">نام</th>
              <th className="px-4 py-3 border-l">قیمت</th>
              <th className="px-4 py-3 border-l">موجودی</th>
              <th className="px-4 py-3 border-l">کتگوری</th>
              <th className="px-4 py-3 border-l">در دسترس؟</th>
              <th className="px-4 py-3">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-2">{p.product_name}</td>
                <td className="px-4 py-2">{p.price}</td>
                <td className="px-4 py-2">{p.stock}</td>
                <td className="px-4 py-2">{p.category_name || p.category}</td>
                <td className="px-4 py-2">{p.is_available ? "بله" : "خیر"}</td>
                <td className="px-4 py-2 flex items-center gap-3 justify-end">
                  <button
                    className="text-green-600 hover:scale-105 transition"
                    onClick={() => {
                      setFormData({
                        ...p,
                        category: p.category.id,
                        multi_images: [],
                      });
                      setEditingId(p.id);
                    }}
                  >
                    ویرایش
                  </button>
                  <button
                    className="text-red-600 hover:scale-105 transition"
                    onClick={() => handleDelete(p.id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
