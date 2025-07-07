import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import AttributeInput from "./AttributeInput";
const BASE_URL = import.meta.env.VITE_BASE_URL;
export default function ProductManager() {
  const imageRef = useRef(null);
  const hoverImageRef = useRef(null);
  const multiImageRef = useRef(null);
  const [previewImages, setPreviewImages] = useState({
    main: null,
    hover: null,
    multi: [],
  });

  const token = useSelector((state) => state.user.accessToken);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [Attributes, setAttributes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    product_name: "",
    sku: "",
    brand: "",
    description: "",
    details: "",
    tags: "",
    attributes: "",
    type: "ma",
    condition: "New",
    price: 0,
    stock: 0,
    image_url: null,
    hover_image_url: null,
    image: null,
    seller_notes: "",
    material: "",
    is_available: true,
    category: "",
    multi_images: [],
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get(`${BASE_URL}/api/v1/product/product/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setProducts(res.data.results);
  };

  const fetchCategories = async () => {
    const res = await axios.get(`${BASE_URL}/api/v1/category/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setCategories(res.data.results);
  };
  const fetchAttributes = async () => {
    const res = await axios.get(`${BASE_URL}/api/v1/category/attribute/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setAttributes(res.data.results);
  };

  const fetchBrands = async () => {
    const res = await axios.get(`${BASE_URL}/api/v1/product/brand/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setBrands(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (formData.image_url) {
        data.append("image_url", formData.image_url);
      }
      if (formData.hover_image_url) {
        data.append("hover_image_url", formData.hover_image_url);
      }      
      if (key === "multi_images") {
        value.forEach((file) => data.append("uploaded_images", file));
      } else if (["tags", "details"].includes(key)) {
        data.append(key, JSON.stringify(value.split(",").map((i) => i.trim())));
      } else if (key === "attributes") {
        try {
          data.append("attributes", JSON.stringify(JSON.parse(value)));
        } catch {
          data.append("attributes", JSON.stringify({}));
        }
      } else {
        data.append(key, value);
      }
    });
    try {
      if (editingId) {
        await axios.put(
          `${BASE_URL}/api/v1/product/product/${editingId}/`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire("ویرایش شد", "محصول با موفقیت ویرایش شد", "success");
        // Clear file inputs visually
        if (imageRef.current) imageRef.current.value = "";
        if (hoverImageRef.current) hoverImageRef.current.value = "";
        if (multiImageRef.current) multiImageRef.current.value = "";
      } else {
        await axios.post(`${BASE_URL}/api/v1/product/product/`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire("اضافه شد", "محصول با موفقیت اضافه شد", "success");
      }
      
      setFormData({
        product_name: "",
        sku: "",
        brand: "",
        description: "",
        details: "",
        tags: "",
        attributes: "", // reset attributes
        type: "ma",
        condition: "New",
        price: 0,
        stock: 0,
        image_url: null,
        hover_image_url: null,
        image: null,
        seller_notes: "",
        material: "",
        is_available: true,
        category: "",
        multi_images: [],
      });
      setEditingId(null);
      fetchProducts();

      // ✅ Clear file input elements
      if (imageRef.current) imageRef.current.value = "";
      if (hoverImageRef.current) hoverImageRef.current.value = "";
      if (multiImageRef.current) multiImageRef.current.value = "";
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
      await axios.delete(`${BASE_URL}/api/v1/product/product/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire("حذف شد", "محصول با موفقیت حذف شد", "success");
      fetchProducts();
    }
  };

  return (
    <div className="p-4 mt-10 max-w-lg mx-auto bg-white shadow-md rounded-md">
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        {/* Product Name */}
        <div>
          <label className="block mb-1 font-medium">Product Name</label>
          <input
            type="text"
            value={formData.product_name}
            onChange={(e) =>
              setFormData({ ...formData, product_name: e.target.value })
            }
            className="input-field w-full"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="input-field w-full"
          >
            <option value="">Select Category</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="input-field w-full"
            required
          />
        </div>

        {/* Seller Notes */}
        <div>
          <label className="block mb-1 font-medium">Seller Notes</label>
          <textarea
            value={formData.seller_notes}
            onChange={(e) =>
              setFormData({ ...formData, seller_notes: e.target.value })
            }
            className="input-field w-full"
          />
        </div>

        {/* Material */}
        <div>
          <label className="block mb-1 font-medium">Material</label>
          <input
            type="text"
            value={formData.material}
            onChange={(e) =>
              setFormData({ ...formData, material: e.target.value })
            }
            className="input-field w-full"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-medium">Price</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="input-field w-full"
            required
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block mb-1 font-medium">Stock</label>
          <input
            type="number"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
            className="input-field w-full"
            required
          />
        </div>

        {/* Details */}
        <div>
          <label className="block mb-1 font-medium">
            Details (separated by comma)
          </label>
          <input
            type="text"
            value={formData.details}
            onChange={(e) =>
              setFormData({ ...formData, details: e.target.value })
            }
            className="input-field w-full"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block mb-1 font-medium">
            Tags (separated by comma)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="input-field w-full"
          />
        </div>

        {/* AttributeInput */}
        <AttributeInput
          token={token}
          categoryId={formData.category}
          onChange={(val) => {
            setFormData((prev) => ({
              ...prev,
              attributes: JSON.stringify(val),
            }));
          }}
        />

        {/* Type */}
        <div>
          <label className="block mb-1 font-medium">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="input-field w-full"
          >
            <option value="ma">Men</option>
            <option value="wo">Women</option>
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="block mb-1 font-medium">Condition</label>
          <select
            value={formData.condition}
            onChange={(e) =>
              setFormData({ ...formData, condition: e.target.value })
            }
            className="input-field w-full"
          >
            <option value="New">New</option>
            <option value="Use">Used</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {previewImages.main && (
          <div>
            <p className="text-sm text-gray-600">Current Main Image:</p>
            <img
              src={previewImages.main}
              alt="Main"
              className="h-16 object-cover my-1"
            />
          </div>
        )}

        {previewImages.hover && (
          <div>
            <p className="text-sm text-gray-600">Current Hover Image:</p>
            <img
              src={previewImages.hover}
              alt="Hover"
              className="h-16 object-cover my-1"
            />
          </div>
        )}

        {previewImages.multi.length > 0 && (
          <div>
            <p className="text-sm text-gray-600">Current Multi Images:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {previewImages.multi.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Multi ${idx}`}
                  className="h-16 object-cover"
                />
              ))}
            </div>
          </div>
        )}

        {/* Images */}
        <div>
          <label className="block mb-1 font-medium">Main Image</label>
          <input
            type="file"
            ref={imageRef}
            onChange={(e) =>
              setFormData({ ...formData, image_url: e.target.files[0] })
            }
            className="input-field w-full"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Hover Image</label>
          <input
            type="file"
            ref={hoverImageRef}
            onChange={(e) =>
              setFormData({ ...formData, hover_image_url: e.target.files[0] })
            }
            className="input-field w-full"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Multiple Images</label>
          <input
            type="file"
            ref={multiImageRef}
            multiple
            onChange={(e) =>
              setFormData({
                ...formData,
                multi_images: Array.from(e.target.files),
              })
            }
            className="input-field w-full"
          />
        </div>

        {/* Availability */}
        <div className="flex items-center gap-2 col-span-2">
          <input
            type="checkbox"
            checked={formData.is_available}
            onChange={(e) =>
              setFormData({ ...formData, is_available: e.target.checked })
            }
          />
          <label className="font-medium">Available?</label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded"
        >
          <option value="">انتخاب برند</option>
          {brands?.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="block mb-1 font-medium">کتگوری</label>
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="input-field w-full"
        >
          <option value="">انتخاب کتگوری</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block mb-1 font-medium">توضیحات</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="input-field w-full"
          required
        />
      </div>

      {/* Seller Notes */}
      <div>
        <label className="block mb-1 font-medium">یادداشت فروشنده</label>
        <textarea
          value={formData.seller_notes}
          onChange={(e) =>
            setFormData({ ...formData, seller_notes: e.target.value })
          }
          className="input-field w-full"
        />
      </div>

      {/* Material */}
      <div>
        <label className="block mb-1 font-medium">مواد</label>
        <input
          type="text"
          value={formData.material}
          onChange={(e) =>
            setFormData({ ...formData, material: e.target.value })
          }
          className="input-field w-full"
        />
      </div>

      {/* Price */}
      <div>
        <label className="block mb-1 font-medium">قیمت</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="input-field w-full"
          required
        />
      </div>

      {/* Stock */}
      <div>
        <label className="block mb-1 font-medium">موجودی</label>
        <input
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          className="input-field w-full"
          required
        />
      </div>

      {/* Details */}
      <div>
        <label className="block mb-1 font-medium">جزییات (با , جدا شود)</label>
        <input
          type="text"
          value={formData.details}
          onChange={(e) =>
            setFormData({ ...formData, details: e.target.value })
          }
          className="input-field w-full"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block mb-1 font-medium">
          برچسب‌ها (با , جدا شود)
        </label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="input-field w-full"
        />
      </div>

      {/* Attributes */}
      <div>
        <label className="block mb-1 font-medium">ویژگی‌ها (JSON)</label>
        <input
          type="text"
          value={formData.attributes}
          onChange={(e) =>
            setFormData({ ...formData, attributes: e.target.value })
          }
          className="input-field w-full"
        />
      </div>

      {/* Type */}
      <div>
        <label className="block mb-1 font-medium">نوع</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="input-field w-full"
        >
          <option value="ma">مردانه</option>
          <option value="wo">زنانه</option>
        </select>
      </div>

      {/* Condition */}
      <div>
        <label className="block mb-1 font-medium">وضعیت</label>
        <select
          value={formData.condition}
          onChange={(e) =>
            setFormData({ ...formData, condition: e.target.value })
          }
          className="input-field w-full"
        >
          <option value="New">نو</option>
          <option value="Use">استفاده‌شده</option>
          <option value="Other">دیگر</option>
        </select>
      </div>

      {/* Images */}
      <div>
        <label className="block mb-1 font-medium">تصویر اصلی</label>
        <input
          type="file"
          onChange={(e) =>
            setFormData({ ...formData, image_url: e.target.files[0] })
          }
          className="input-field w-full"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">تصویر هاور</label>
        <input
          type="file"
          onChange={(e) =>
            setFormData({ ...formData, hover_image_url: e.target.files[0] })
          }
          className="input-field w-full"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">تصویر نمایشی</label>
        <input
          type="file"
          onChange={(e) =>
            setFormData({ ...formData, image: e.target.files[0] })
          }
          className="input-field w-full"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">چند تصویر</label>
        <input
          type="file"
          multiple
          onChange={(e) =>
            setFormData({
              ...formData,
              multi_images: Array.from(e.target.files),
            })
          }
          className="input-field w-full"
        />
      </div>

      {/* Availability */}
      <div className="flex items-center gap-2 col-span-2">
        <input
          type="checkbox"
          checked={formData.is_available}
          onChange={(e) =>
            setFormData({ ...formData, is_available: e.target.checked })
          }
        />
        <label className="font-medium">در دسترس؟</label>
      </div>

      <button
        type="submit"
        className="col-span-2 bg-blue-600 text-white py-2 rounded"
      >
        {editingId ? "ویرایش محصول" : "اضافه کردن محصول"}
      </button>
      </form>

      {/* Product Table */}
      <div className="mt-10 overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Available</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">{product.product_name}</td>
                  <td className="border p-2">{product.price}</td>
                  <td className="border p-2">{product.stock}</td>
                  <td className="border p-2">
                    {product.is_available ? "✅" : "❌"}
                  </td>
                  <td className="border p-2 flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditingId(product.id);
                        setFormData({
                          ...formData,
                          ...product,
                          brand: product.brand,
                          category: product.category,
                          tags: product.tags?.join(", "),
                          details: product.details?.join(", "),
                          attributes: JSON.stringify(product.attributes || {}),
                        });
                        setPreviewImages({
                          main: product.image_url,
                          hover: product.hover_image_url,
                          multi: product.multi_images || [],
                        });
                        // Clear file inputs
                        if (imageRef.current) imageRef.current.value = "";
                        if (hoverImageRef.current)
                          hoverImageRef.current.value = "";
                        if (multiImageRef.current)
                          multiImageRef.current.value = "";
                      }}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
