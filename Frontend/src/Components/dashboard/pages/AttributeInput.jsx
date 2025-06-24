import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function AttributeInput({ token, categoryId, onChange }) {
  const [allAttributes, setAllAttributes] = useState([]);
  const [values, setValues] = useState({});
  const [lastCategoryId, setLastCategoryId] = useState(null);

  // Fetch all attributes once
  useEffect(() => {
    const fetchAllAttributes = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/category/attribute/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAllAttributes(res.data.results);
      } catch (err) {
        console.error("خطا در دریافت ویژگی‌ها:", err);
      }
    };

    fetchAllAttributes();
  }, []);

  // Reinitialize when category changes
  useEffect(() => {
    if (!categoryId || allAttributes.length === 0) return;

    if (categoryId !== lastCategoryId) {
      const filtered = allAttributes.filter(
        (attr) => attr.category === categoryId
      );

      const initial = {};
      filtered.forEach((attr) => {
        initial[attr.name] = "";
      });

      setValues(initial);
      onChange(initial);
      setLastCategoryId(categoryId);
    }
  }, [categoryId, allAttributes]);

  const handleChange = (name, value) => {
    const updated = { ...values, [name]: value };
    setValues(updated);
    onChange(updated);
  };

  const relevantAttributes = allAttributes.filter(
    (attr) => attr.category == categoryId
  );

  return (
    <div className="col-span-2 space-y-4">
      {relevantAttributes.length == 0 ? (
        <p className="text-sm text-gray-500">
          ویژگی‌ای برای این کتگوری موجود نیست.
        </p>
      ) : (
        relevantAttributes.map((attr) => (
          <div key={attr.id}>
            <label className="block mb-1 font-medium">{attr.name}</label>
            <input
              type="text"
              className="input-field w-full"
              value={values[attr.name] || ""}
              onChange={(e) => handleChange(attr.name, e.target.value)}
            />
          </div>
        ))
      )}
    </div>
  );
}
