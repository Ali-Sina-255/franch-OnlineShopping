import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { Loader2, PackageSearch, Search, Filter } from "lucide-react";
import { store } from "../../../state/store"; // Adjust path if needed
import axios from "axios";

// This function creates an API client that automatically includes the auth token.
const createApiClient = () => {
  const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000",
  });

  api.interceptors.request.use((config) => {
    if (store) {
      const token = store.getState().user.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  return api;
};

const StatusBadge = ({ status }) => {
  const statusStyles = {
    paid: "bg-green-100 text-green-700 ring-green-600/20",
    processing: "bg-yellow-100 text-yellow-800 ring-yellow-600/20",
    failed: "bg-red-100 text-red-700 ring-red-600/20",
    cancelled: "bg-gray-100 text-gray-700 ring-gray-600/20",
    initiated: "bg-blue-100 text-blue-700 ring-blue-600/20",
    pending: "bg-orange-100 text-orange-800 ring-orange-600/20",
    default: "bg-gray-100 text-gray-700 ring-gray-600/20",
  };
  const style = statusStyles[status?.toLowerCase()] || statusStyles.default;
  const capitalizedStatus = status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "Unknown";

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${style}`}
    >
      {capitalizedStatus}
    </span>
  );
};

const OrderManagement = () => {
  const [allOrders, setAllOrders] = useState([]); // Stores the original, full list of orders
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const api = createApiClient();
        const response = await api.get("/api/v1/cart/orders/");
        setAllOrders(response.data);
      } catch (err) {
        const errorMessage =
          err.response?.data?.detail || "Failed to fetch your orders.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // --- NEW: Memoized filtering logic ---
  // This recalculates the filteredOrders only when the source data or filters change.
  const filteredOrders = useMemo(() => {
    return allOrders
      .filter((order) => {
        // Filter by payment status
        if (
          statusFilter !== "all" &&
          order.payment_status.toLowerCase() !== statusFilter
        ) {
          return false;
        }
        return true;
      })
      .filter((order) => {
        // Filter by search term (checks Order ID and Customer Name)
        if (searchTerm.trim() === "") {
          return true;
        }
        const lowercasedSearch = searchTerm.toLowerCase();
        return (
          order.oid.toLowerCase().includes(lowercasedSearch) ||
          order.full_name.toLowerCase().includes(lowercasedSearch)
        );
      });
  }, [allOrders, searchTerm, statusFilter]);

  // Unique payment statuses for the filter dropdown
  const paymentStatuses = useMemo(
    () => [
      "all",
      ...new Set(allOrders.map((o) => o.payment_status.toLowerCase())),
    ],
    [allOrders]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 p-10">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-700 rounded-lg">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6">
      <div className="bg-white p-6 rounded-md shadow-md  min-h-full">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the orders you have placed.
            </p>
          </div>
          {/* --- NEW: Search and Filter UI --- */}
          <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col md:flex-row items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID or Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
              >
                {paymentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              {filteredOrders.length > 0 ? (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Order ID
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Customer
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Total
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Payment Status
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Order Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {/* UPDATED: Map over the `filteredOrders` array */}
                      {filteredOrders.map((order) => (
                        <tr key={order.oid}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-mono text-indigo-600 sm:pl-6">
                            {order.oid}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {order.full_name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(order.date).toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                            €{Number(order.total).toFixed(2)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <StatusBadge status={order.payment_status} />
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {order.order_status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow">
                  <PackageSearch className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No Orders Found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your search or filter criteria did not match any orders.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
