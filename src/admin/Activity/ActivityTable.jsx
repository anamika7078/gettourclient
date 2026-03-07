

import axios from "axios";
import { useEffect, useState } from "react";
import { FiEdit, FiImage, FiPlus, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ActivityTable() {
  const API_BASE = import.meta.env.VITE_API_URL;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios
      .get(`${API_BASE}/api/activities`)
      .then((res) => {
        if (!mounted) return;
        setRows(res.data || []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(
          err?.response?.data?.error ||
            err?.message ||
            "Failed to load activities"
        );
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [API_BASE]);

  // Get unique categories for filter
  const categories = [
    "all",
    ...new Set(rows.map((row) => row.category).filter(Boolean)),
  ];

  // Filter activities based on search and category
  const filteredRows = rows.filter((activity) => {
    const matchesSearch =
      activity.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.location_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      activity.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || activity.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id, title) => {
    if (
      !confirm(
        `Are you sure you want to delete "${title}"? This action cannot be undone.`
      )
    )
      return;
    axios
      .delete(`${API_BASE}/api/activities/${id}`)
      .then(() => setRows((prev) => prev.filter((r) => r.id !== id)))
      .catch((err) => {
        alert(
          err?.response?.data?.error ||
            err?.message ||
            "Failed to delete activity"
        );
      });
  };

  const formatCurrency = (price) => {
    if (!price) return "—";
    return `AED ${Number(price).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "—";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">Activities</h1>
              <p className="text-gray-600 mt-2">
                Manage and track all activities
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                {filteredRows.length} activities
              </span>
              <button
                onClick={() => navigate("/admin/activities/new")}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2.5 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm font-medium"
              >
                <FiPlus className="text-lg" />
                <span>Add Activity</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search activities by title, location, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Categories</option>
                {categories
                  .filter((cat) => cat !== "all")
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading activities...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-rose-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-rose-800">
                    Error loading activities
                  </h3>
                  <p className="text-sm text-rose-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activities Table */}
        {!loading && !error && (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <FiImage className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                          <p className="text-sm font-medium">
                            No activities found
                          </p>
                          <p className="text-xs mt-1">
                            Try adjusting your search or filter
                          </p>
                          <button
                            onClick={() => navigate("/admin/activities/new")}
                            className="mt-4 inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition font-medium"
                          >
                            <FiPlus />
                            Add Your First Activity
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((activity) => {
                      const imageUrl = activity.image
                        ? `${API_BASE}/uploads/activities/${activity.image}`
                        : null;

                      return (
                        <tr
                          key={activity.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-16 rounded-lg overflow-hidden bg-gray-100">
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt={activity.title}
                                    className="h-12 w-16 object-cover"
                                  />
                                ) : (
                                  <div className="h-12 w-16 flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
                                    <FiImage className="h-6 w-6 text-orange-400" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {activity.title}
                                </div>
                                <div className="text-xs text-gray-500 line-clamp-1">
                                  {activity.description || "No description"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {activity.category ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  {activity.category}
                                </span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {activity.location_name || "—"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {formatCurrency(activity.price)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500">
                              {formatDate(activity.created_at)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() =>
                                  navigate(
                                    `/admin/activities/${activity.id}/edit`
                                  )
                                }
                                className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                              >
                                <FiEdit className="w-4 h-4" />
                                <span className="hidden sm:inline">Edit</span>
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete(activity.id, activity.title)
                                }
                                className="inline-flex items-center gap-1 px-3 py-1.5 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                              >
                                <FiTrash2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mobile Cards View (Hidden on larger screens) */}
        {!loading && !error && filteredRows.length > 0 && (
          <div className="lg:hidden mt-6 space-y-4">
            {filteredRows.map((activity) => {
              const imageUrl = activity.image
                ? `${API_BASE}/uploads/activities/${activity.image}`
                : null;

              return (
                <div
                  key={activity.id}
                  className="bg-white rounded-2xl shadow-sm border p-4"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 h-16 w-20 rounded-lg overflow-hidden bg-gray-100">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={activity.title}
                          className="h-16 w-20 object-cover"
                        />
                      ) : (
                        <div className="h-16 w-20 flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
                          <FiImage className="h-6 w-6 text-orange-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {activity.title}
                      </h3>
                      <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                        {activity.category && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                            {activity.category}
                          </span>
                        )}
                        <span>{activity.location_name || "No location"}</span>
                      </div>
                      <div className="mt-2 text-sm font-semibold text-gray-900">
                        {formatCurrency(activity.price)}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        Created: {formatDate(activity.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() =>
                        navigate(`/admin/activities/${activity.id}/edit`)
                      }
                      className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <FiEdit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(activity.id, activity.title)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
