

import { useEffect, useState } from "react";
import { FiEdit, FiImage, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

export default function ManageHoliday() {
  const API_BASE = import.meta.env.VITE_API_URL;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [banner, setBanner] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/holidays`);
      const data = await res.json();
      if (!res.ok || !data?.success)
        throw new Error(data?.error || "Failed to load");
      setRows(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      console.error("Failed to load holidays:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_BASE]);

  // Show success banner if redirected from create or update page
  useEffect(() => {
    const created = location.state && location.state.created;
    const updated = location.state && location.state.updated;
    if (created || updated) {
      setBanner(
        created
          ? "Holiday package created successfully."
          : "Holiday package updated successfully."
      );
      // clear state so refresh doesn't re-show
      navigate(location.pathname, { replace: true });
      setTimeout(() => setBanner(""), 2500);
      // reload list to ensure fresh data
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  // Get unique categories for filter
  const categories = [
    "all",
    ...new Set(rows.map((row) => row.category).filter(Boolean)),
  ];

  // Filter holidays based on search and category
  const filteredRows = rows.filter((holiday) => {
    const matchesSearch =
      holiday.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holiday.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holiday.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holiday.duration?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || holiday.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id, title) => {
    if (
      !confirm(
        `Are you sure you want to delete "${title}"? This action cannot be undone.`
      )
    )
      return;
    try {
      const resp = await fetch(`${API_BASE}/api/holidays/${id}`, {
        method: "DELETE",
      });
      const j = await resp.json().catch(() => ({}));
      if (!resp.ok || j?.success === false)
        throw new Error(j?.error || "Delete failed");
      setBanner("Holiday package deleted successfully.");
      load();
      setTimeout(() => setBanner(""), 2000);
    } catch (e) {
      alert(e.message || "Failed to delete holiday package");
    }
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

  const getImageCount = (images) => {
    try {
      const arr = typeof images === "string" ? JSON.parse(images) : images;
      return Array.isArray(arr) ? arr.length : 0;
    } catch {
      return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">
                Holiday Packages
              </h1>
              <p className="text-gray-600 mt-2">
                Create and manage holiday packages
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                {filteredRows.length} packages
              </span>
              <button
                onClick={() => navigate("/admin/holidays/new")}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2.5 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm font-medium"
              >
                <FiPlus className="text-lg" />
                <span>Add Holiday Package</span>
              </button>
            </div>
          </div>
        </div>

        {/* Success Banner */}
        {!!banner && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {banner}
          </div>
        )}

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by package name, destination, category, or duration..."
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
            <p className="mt-4 text-gray-600">Loading holiday packages...</p>
          </div>
        )}

        {/* Holidays Table */}
        {!loading && (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Package Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Destination
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Price / Person
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Images
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
                      <td colSpan="8" className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <FiImage className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                          <p className="text-sm font-medium">
                            No holiday packages found
                          </p>
                          <p className="text-xs mt-1">
                            Try adjusting your search or filter
                          </p>
                          <button
                            onClick={() => navigate("/admin/holidays/new")}
                            className="mt-4 inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition font-medium"
                          >
                            <FiPlus />
                            Add Your First Package
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((holiday) => {
                      const imageCount = getImageCount(holiday.images);

                      return (
                        <tr
                          key={holiday.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                                <FiImage className="h-6 w-6 text-orange-500" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                  {holiday.title}
                                </div>
                                <div className="text-xs text-gray-500">
                                  #{holiday.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {holiday.destination || "—"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {holiday.duration || "—"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {formatCurrency(holiday.price)}{" "}
                              <span className="text-gray-500 font-normal">
                                / person
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {holiday.category ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  {holiday.category}
                                </span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              <span className="inline-flex items-center gap-1">
                                <FiImage className="w-4 h-4 text-gray-400" />
                                {imageCount}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500">
                              {formatDate(holiday.created_at)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() =>
                                  navigate(`/admin/holidays/${holiday.id}/edit`)
                                }
                                className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                              >
                                <FiEdit className="w-4 h-4" />
                                <span className="hidden sm:inline">Edit</span>
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete(holiday.id, holiday.title)
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
        {!loading && filteredRows.length > 0 && (
          <div className="lg:hidden mt-6 space-y-4">
            {filteredRows.map((holiday) => {
              const imageCount = getImageCount(holiday.images);

              return (
                <div
                  key={holiday.id}
                  className="bg-white rounded-2xl shadow-sm border p-4"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 h-16 w-16 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                      <FiImage className="h-6 w-6 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                        {holiday.title}
                      </h3>
                      <div className="mt-1 text-xs text-gray-500">
                        Package ID: #{holiday.id}
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div>
                          <span className="font-medium">Destination:</span>
                          <div>{holiday.destination || "—"}</div>
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span>
                          <div>{holiday.duration || "—"}</div>
                        </div>
                        <div>
                          <span className="font-medium">Price:</span>
                          <div className="font-semibold">
                            {formatCurrency(holiday.price)}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Category:</span>
                          <div>
                            {holiday.category ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                                {holiday.category}
                              </span>
                            ) : (
                              "—"
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        <span>Images: {imageCount}</span>
                        <span>Created: {formatDate(holiday.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() =>
                        navigate(`/admin/holidays/${holiday.id}/edit`)
                      }
                      className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <FiEdit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(holiday.id, holiday.title)}
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
