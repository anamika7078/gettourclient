import { useCallback, useEffect, useState } from "react";
import { FiEdit, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ManageCityPackages() {
  const API_BASE = import.meta.env.VITE_API_URL;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [banner, setBanner] = useState("");
  const navigate = useNavigate();

  // Modal states
  const [showCityModal, setShowCityModal] = useState(false);
  const [cityName, setCityName] = useState("");
  const [cityImage, setCityImage] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Edit states
  const [editingCity, setEditingCity] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  // City-wise category management
  const [selectedCityForCat, setSelectedCityForCat] = useState(null);
  const [selectedCityCategories, setSelectedCityCategories] = useState([]);

  // Lists
  const [cities, setCities] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/city-packages`);
      const data = await res.json();
      if (!res.ok || !data?.success)
        throw new Error(data?.error || "Failed to load");
      setRows(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      console.error("Failed to load city packages:", e);
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  const loadCities = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/cities`);
      const data = await res.json();
      setCities(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      console.error("Failed to load cities:", e);
    }
  }, [API_BASE]);

  useEffect(() => {
    load();
    loadCities();
  }, [load, loadCities]);

  const loadCategoriesByCity = async (city) => {
    if (!city?.name) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/city-tour-categories/by-city/${encodeURIComponent(
          city.name
        )}`
      );
      const data = await res.json();
      const list = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];
      setSelectedCityCategories(list);
    } catch (e) {
      console.error("Failed to load categories for city:", e);
      setSelectedCityCategories([]);
    }
  };

  // Filter city packages based on search
  const filteredRows = rows.filter((pkg) => {
    const matchesSearch =
      pkg.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.cityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.locationUrl?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.duration?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleDelete = async (id, title) => {
    if (
      !confirm(
        `Are you sure you want to delete "${title}"? This action cannot be undone.`
      )
    )
      return;
    try {
      const resp = await fetch(`${API_BASE}/api/city-packages/${id}`, {
        method: "DELETE",
      });
      const j = await resp.json().catch(() => ({}));
      if (!resp.ok || j?.success === false)
        throw new Error(j?.error || "Delete failed");
      setBanner("City package deleted successfully.");
      load();
      setTimeout(() => setBanner(""), 2000);
    } catch (e) {
      alert(e.message || "Failed to delete city package");
    }
  };

  const formatCurrency = (price) => {
    if (!price) return "—";
    return `AED ${Number(price).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  // Add City Handler
  const handleAddCity = async (e) => {
    e.preventDefault();
    if (!cityName.trim()) {
      alert("Please enter city name");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", cityName.trim());
    if (cityImage) {
      formData.append("image", cityImage);
    }

    try {
      const res = await fetch(`${API_BASE}/api/cities`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to add city");
      }
      setBanner("City added successfully!");
      setShowCityModal(false);
      setCityName("");
      setCityImage(null);
      loadCities();
      setTimeout(() => setBanner(""), 3000);
    } catch (error) {
      alert(error.message || "Failed to add city");
    } finally {
      setSubmitting(false);
    }
  };

  // Edit City Handler
  const handleEditCity = async (e) => {
    e.preventDefault();
    if (!cityName.trim()) {
      alert("Please enter city name");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", cityName.trim());
    if (cityImage) {
      formData.append("image", cityImage);
    }

    try {
      const res = await fetch(`${API_BASE}/api/cities/${editingCity.id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to update city");
      }
      setBanner("City updated successfully!");
      setShowCityModal(false);
      setEditingCity(null);
      setCityName("");
      setCityImage(null);
      loadCities();
      setTimeout(() => setBanner(""), 3000);
    } catch (error) {
      alert(error.message || "Failed to update city");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete City Handler
  const handleDeleteCity = async (city) => {
    if (!confirm(`Delete city "${city.name}"? This action cannot be undone.`))
      return;

    try {
      const res = await fetch(`${API_BASE}/api/cities/${city.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to delete city");
      }
      setBanner("City deleted successfully!");
      loadCities();
      setTimeout(() => setBanner(""), 3000);
    } catch (error) {
      alert(error.message || "Failed to delete city");
    }
  };

  // Add Category Handler (city-wise within city modal)
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      alert("Please enter category name");
      return;
    }
    if (!selectedCityForCat?.name) {
      alert("Please select a city to add category for");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", categoryName.trim());
    formData.append("cityName", selectedCityForCat.name);
    if (categoryImage) {
      formData.append("image", categoryImage);
    }

    try {
      const res = await fetch(`${API_BASE}/api/city-tour-categories`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to add category");
      }
      setBanner("Category added successfully!");
      setCategoryName("");
      setCategoryImage(null);
      await loadCategoriesByCity(selectedCityForCat);
      setTimeout(() => setBanner(""), 3000);
    } catch (error) {
      alert(error.message || "Failed to add category");
    } finally {
      setSubmitting(false);
    }
  };

  // Edit Category Handler
  const handleEditCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      alert("Please enter category name");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", categoryName.trim());
    if (categoryImage) {
      formData.append("image", categoryImage);
    }

    try {
      const res = await fetch(
        `${API_BASE}/api/city-tour-categories/${editingCategory.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to update category");
      }
      setBanner("Category updated successfully!");
      setEditingCategory(null);
      setCategoryName("");
      setCategoryImage(null);
      await loadCategoriesByCity(selectedCityForCat);
      setTimeout(() => setBanner(""), 3000);
    } catch (error) {
      alert(error.message || "Failed to update category");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Category Handler
  const handleDeleteCategory = async (category) => {
    if (
      !confirm(
        `Delete category "${category.name}"? This action cannot be undone.`
      )
    )
      return;

    try {
      const res = await fetch(
        `${API_BASE}/api/city-tour-categories/${category.id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to delete category");
      }
      setBanner("Category deleted successfully!");
      await loadCategoriesByCity(selectedCityForCat);
      setTimeout(() => setBanner(""), 3000);
    } catch (error) {
      alert(error.message || "Failed to delete category");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                City Packages
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Manage all your city packages
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setEditingCity(null);
                  setCityName("");
                  setCityImage(null);
                  setShowCityModal(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <FiPlus className="text-lg" />
                Add City
              </button>
              {/* Removed separate Manage Categories button; categories handled inside city modal */}
              <button
                onClick={() => navigate("/admin/city-packages/add")}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FiPlus className="text-lg" />
                Add City Package
              </button>
            </div>
          </div>
        </div>

        {/* Success Banner */}
        {banner && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-3 animate-fade-in">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm font-medium">{banner}</p>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search by title, city, location URL, or duration..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Packages
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {rows.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <FiSearch className="text-white text-2xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Search Results
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredRows.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* City Packages Table */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-12">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">Loading city packages...</p>
            </div>
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-12">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  No packages found
                </h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Get started by adding your first city package"}
                </p>
              </div>
              {!searchTerm && (
                <button
                  onClick={() => navigate("/admin/city-packages/add")}
                  className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-200"
                >
                  <FiPlus />
                  Add Your First Package
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Package
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      City Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Location URL
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-orange-50/50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {row.title?.charAt(0)?.toUpperCase() || "C"}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {row.title || "—"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700 font-medium">
                          {row.cityName || "—"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {row.locationUrl ? (
                          <a
                            href={row.locationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                            View Location
                          </a>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {row.duration || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-orange-600">
                          {formatCurrency(row.price)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/city-packages/edit/${row.id}`)
                            }
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="Edit"
                          >
                            <FiEdit className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDelete(row.id, row.title)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors duration-200"
                            title="Delete"
                          >
                            <FiTrash2 className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {!loading && filteredRows.length > 0 && (
          <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
            <p>
              Showing{" "}
              <span className="font-semibold">{filteredRows.length}</span> of{" "}
              <span className="font-semibold">{rows.length}</span> packages
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit City Modal */}
      {showCityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Add City</h2>
              <button
                onClick={() => {
                  setShowCityModal(false);
                  setEditingCity(null);
                  setCityName("");
                  setCityImage(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Add/Edit Form */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {editingCity ? "Edit City" : "Add New City"}
                  </h3>
                  <form
                    onSubmit={editingCity ? handleEditCity : handleAddCity}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City Name *
                      </label>
                      <input
                        type="text"
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}
                        placeholder="e.g., Dubai"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City Image
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-400 transition-colors bg-white">
                        <div className="space-y-1 text-center">
                          {cityImage || (editingCity && editingCity.image) ? (
                            <div className="relative">
                              <img
                                src={
                                  cityImage
                                    ? URL.createObjectURL(cityImage)
                                    : `${API_BASE}/uploads/cities/${editingCity.image}`
                                }
                                alt="Preview"
                                className="mx-auto h-32 w-32 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => setCityImage(null)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <>
                              <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                              >
                                <path
                                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <div className="flex text-sm text-gray-600">
                                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                                  <span>Upload a file</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                      setCityImage(e.target.files[0])
                                    }
                                    className="sr-only"
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF up to 10MB
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      {editingCity && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCity(null);
                            setCityName("");
                            setCityImage(null);
                          }}
                          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          Cancel Edit
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting
                          ? editingCity
                            ? "Updating..."
                            : "Adding..."
                          : editingCity
                          ? "Update City"
                          : "Add City"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Existing Cities List */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    All Cities ({cities.length})
                  </h3>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {cities.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <p className="text-gray-500">No cities added yet</p>
                      </div>
                    ) : (
                      cities.map((city) => (
                        <div
                          key={city.id}
                          className={`flex items-center gap-4 p-4 border-2 rounded-xl transition-all ${
                            editingCity?.id === city.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300 bg-white"
                          }`}
                        >
                          {city.image && (
                            <img
                              src={`${API_BASE}/uploads/cities/${city.image}`}
                              alt={city.name}
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {city.name}
                            </h4>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => {
                                setEditingCity(city);
                                setCityName(city.name);
                                setCityImage(null);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FiEdit className="text-lg" />
                            </button>
                            <button
                              onClick={() => handleDeleteCity(city)}
                              className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 className="text-lg" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCityForCat(city);
                                setEditingCategory(null);
                                setCategoryName("");
                                setCategoryImage(null);
                                loadCategoriesByCity(city);
                              }}
                              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                selectedCityForCat?.id === city.id
                                  ? "bg-purple-600 text-white"
                                  : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                              }`}
                              title="Manage Categories"
                            >
                              Manage Categories
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              {selectedCityForCat && (
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Add/Edit Category for selected city */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        {editingCategory ? "Edit Category" : "Add New Category"}
                      </h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 font-semibold">
                        City: {selectedCityForCat.name}
                      </span>
                    </div>
                    <form
                      onSubmit={
                        editingCategory ? handleEditCategory : handleAddCategory
                      }
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Category Name *
                        </label>
                        <input
                          type="text"
                          value={categoryName}
                          onChange={(e) => setCategoryName(e.target.value)}
                          placeholder="e.g., Water Sports"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Category Image
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-purple-400 transition-colors bg-white">
                          <div className="space-y-1 text-center">
                            {categoryImage ||
                            (editingCategory && editingCategory.image) ? (
                              <div className="relative">
                                <img
                                  src={
                                    categoryImage
                                      ? URL.createObjectURL(categoryImage)
                                      : `${API_BASE}/uploads/categories/${editingCategory.image}`
                                  }
                                  alt="Preview"
                                  className="mx-auto h-32 w-32 object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => setCategoryImage(null)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ) : (
                              <>
                                <svg
                                  className="mx-auto h-12 w-12 text-gray-400"
                                  stroke="currentColor"
                                  fill="none"
                                  viewBox="0 0 48 48"
                                >
                                  <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500">
                                    <span>Upload a file</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) =>
                                        setCategoryImage(e.target.files[0])
                                      }
                                      className="sr-only"
                                    />
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG, GIF up to 10MB
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        {editingCategory && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCategory(null);
                              setCategoryName("");
                              setCategoryImage(null);
                            }}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            Cancel Edit
                          </button>
                        )}
                        <button
                          type="submit"
                          disabled={submitting}
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submitting
                            ? editingCategory
                              ? "Updating..."
                              : "Adding..."
                            : editingCategory
                            ? "Update Category"
                            : "Add Category"}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Existing Categories List for selected city */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        Categories for {selectedCityForCat.name} (
                        {selectedCityCategories.length})
                      </h3>
                      <button
                        type="button"
                        onClick={() => loadCategoriesByCity(selectedCityForCat)}
                        className="px-3 py-1.5 text-sm rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100"
                      >
                        Refresh
                      </button>
                    </div>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                      {selectedCityCategories.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl">
                          <p className="text-gray-500">
                            No categories for this city yet
                          </p>
                        </div>
                      ) : (
                        selectedCityCategories.map((category) => (
                          <div
                            key={category.id}
                            className={`flex items-center gap-4 p-4 border-2 rounded-xl transition-all ${
                              editingCategory?.id === category.id
                                ? "border-purple-500 bg-purple-50"
                                : "border-gray-200 hover:border-purple-300 bg-white"
                            }`}
                          >
                            {category.image && (
                              <img
                                src={`${API_BASE}/uploads/categories/${category.image}`}
                                alt={category.name}
                                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 truncate">
                                {category.name}
                              </h4>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <button
                                onClick={() => {
                                  setEditingCategory(category);
                                  setCategoryName(category.name);
                                  setCategoryImage(null);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <FiEdit className="text-lg" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(category)}
                                className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <FiTrash2 className="text-lg" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
