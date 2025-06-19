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
    <div className="p-4 space-y-4">
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="نام محصول"
          value={formData.product_name}
          onChange={(e) =>
            setFormData({ ...formData, product_name: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="قیمت"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="موجودی"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          required
        />
        <select
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
        <textarea
          placeholder="توضیحات"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />
        <input
          type="file"
          onChange={(e) =>
            setFormData({ ...formData, image: e.target.files[0] })
          }
        />
        <input
          type="file"
          multiple
          onChange={(e) =>
            setFormData({
              ...formData,
              multi_images: Array.from(e.target.files),
            })
          }
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_available}
            onChange={(e) =>
              setFormData({ ...formData, is_available: e.target.checked })
            }
          />
          در دسترس است؟
        </label>
        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {editingId ? "ویرایش محصول" : "اضافه کردن محصول"}
        </button>
      </form>

      <table className="min-w-full border mt-8">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">نام</th>
            <th className="p-2">قیمت</th>
            <th className="p-2">موجودی</th>
            <th className="p-2">کتگوری</th>
            <th className="p-2">در دسترس؟</th>
            <th className="p-2">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="text-center border-t">
              <td className="p-2">{p.product_name}</td>
              <td className="p-2">{p.price}</td>
              <td className="p-2">{p.stock}</td>
              <td className="p-2">{p.category_name || p.category}</td>
              <td className="p-2">{p.is_available ? "بله" : "خیر"}</td>
              <td className="p-2 space-x-2">
                <button
                  className="text-green-600"
                  onClick={() =>
                    setFormData({
                      ...p,
                      category: p.category.id,
                      multi_images: [],
                    }) || setEditingId(p.id)
                  }
                >
                  ویرایش
                </button>
                <button
                  className="text-red-600"
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
  );
}
