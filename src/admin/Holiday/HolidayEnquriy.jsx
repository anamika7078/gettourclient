

import { useEffect, useState } from "react";
import {
  FiClock,
  FiEye,
  FiMail,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { useLocation } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;

export default function HolidayEnquiry() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [banner, setBanner] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const location = useLocation();

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/holiday-enquiries`);
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.message || "Failed");
      setRows(json.data || []);
    } catch (e) {
      console.error("Failed to load enquiries:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_BASE]);

  // Show success banner if redirected from other pages
  useEffect(() => {
    if (location.state?.deleted) {
      setBanner("Enquiry deleted successfully.");
      setTimeout(() => setBanner(""), 2500);
      load();
    }
  }, [location.state]);

  // Filter enquiries based on search
  const filteredRows = rows.filter((enquiry) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      enquiry.name?.toLowerCase().includes(searchLower) ||
      enquiry.email?.toLowerCase().includes(searchLower) ||
      enquiry.package_title?.toLowerCase().includes(searchLower) ||
      enquiry.destination?.toLowerCase().includes(searchLower) ||
      enquiry.phone?.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      const res = await fetch(`${API_BASE}/api/holiday-enquiries/${id}`, {
        method: "DELETE",
      });
      const j = await res.json().catch(() => null);
      if (!res.ok || j?.success === false) {
        throw new Error(j?.message || "Delete failed");
      }
      setBanner("Enquiry deleted successfully.");
      setConfirmDelete(null);
      load();
      setTimeout(() => setBanner(""), 2000);
    } catch (e) {
      alert(e.message || "Failed to delete enquiry");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  // Note: Simple date helper removed to avoid unused-var lint error

  const formatCurrency = (price) => {
    if (price == null || price === "") return "—";
    try {
      return `AED ${Number(price).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      })}`;
    } catch {
      return `AED ${price}`;
    }
  };

  const openViewModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setViewModal(true);
  };

  const getTravellerSummary = (enquiry) => {
    const adults = enquiry.adults || 0;
    const children = enquiry.children || 0;
    const total = adults + children;

    return { adults, children, total };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">
                Holiday Enquiries
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and review customer holiday package enquiries
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                {filteredRows.length} enquiries
              </span>
              <button
                onClick={load}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2.5 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm font-medium"
              >
                <FiRefreshCw className="text-lg" />
                <span>Refresh</span>
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

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email, package, destination, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading holiday enquiries...</p>
          </div>
        )}

        {/* Enquiries Table */}
        {!loading && (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Customer & Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Package Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Price / Person
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Travellers
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Flight
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <FiPackage className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                          <p className="text-sm font-medium">
                            No enquiries found
                          </p>
                          <p className="text-xs mt-1">
                            Try adjusting your search criteria
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((enquiry) => {
                      const travellers = getTravellerSummary(enquiry);
                      return (
                        <tr
                          key={enquiry.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                                <FiUser className="h-5 w-5 text-orange-500" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {enquiry.name}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  #{enquiry.id}
                                </div>
                                <div className="text-xs text-gray-600 mt-1 truncate">
                                  {enquiry.email}
                                </div>
                                {enquiry.phone && (
                                  <div className="text-xs text-gray-600 truncate">
                                    {enquiry.phone}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                {enquiry.package_title || "—"}
                              </div>
                              <div className="text-xs text-gray-600 flex items-center gap-1">
                                <FiMapPin className="w-3 h-3" />
                                {enquiry.destination || "—"}
                              </div>
                              {enquiry.duration && (
                                <div className="text-xs text-gray-600 flex items-center gap-1">
                                  <FiClock className="w-3 h-3" />
                                  {enquiry.duration}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {enquiry.price != null ? (
                                <span>
                                  {formatCurrency(enquiry.price)}
                                  <span className="text-gray-500 font-normal">
                                    {" "}
                                    / person
                                  </span>
                                </span>
                              ) : (
                                "—"
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-4">
                                <div className="text-center">
                                  <div className="text-sm font-semibold text-blue-600">
                                    {travellers.adults}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Adults
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-sm font-semibold text-green-600">
                                    {travellers.children}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Children
                                  </div>
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs font-medium text-gray-700 bg-gray-100 rounded-full px-2 py-1">
                                  {travellers.total} Total Travellers
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  enquiry.flight_booked === "Yes" ||
                                  enquiry.flight_booked === "yes"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {enquiry.flight_booked || "No"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500">
                              {formatDate(enquiry.created_at)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => openViewModal(enquiry)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                              >
                                <FiEye className="w-4 h-4" />
                                <span className="hidden sm:inline">View</span>
                              </button>
                              <button
                                onClick={() => setConfirmDelete(enquiry.id)}
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

        {/* Mobile Cards View */}
        {!loading && filteredRows.length > 0 && (
          <div className="lg:hidden mt-6 space-y-4">
            {filteredRows.map((enquiry) => {
              const travellers = getTravellerSummary(enquiry);
              return (
                <div
                  key={enquiry.id}
                  className="bg-white rounded-2xl shadow-sm border p-4"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                      <FiUser className="h-6 w-6 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {enquiry.name}
                      </h3>
                      <div className="mt-1 text-xs text-gray-500">
                        #{enquiry.id}
                      </div>
                      <div className="mt-2 space-y-2 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <FiMail className="h-3 w-3" />
                          {enquiry.email}
                        </div>
                        {enquiry.phone && (
                          <div className="flex items-center gap-2">
                            <FiPhone className="h-3 w-3" />
                            {enquiry.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-700 text-xs">
                        Package
                      </div>
                      <div className="text-gray-900 line-clamp-2">
                        {enquiry.package_title || "—"}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700 text-xs">
                        Destination
                      </div>
                      <div className="text-gray-900">
                        {enquiry.destination || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-700 text-xs">
                        Price / Person
                      </div>
                      <div className="text-gray-900">
                        {enquiry.price != null ? (
                          <span>
                            {formatCurrency(enquiry.price)}{" "}
                            <span className="text-gray-500">/ person</span>
                          </span>
                        ) : (
                          "—"
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-blue-50 rounded-lg p-2">
                      <div className="text-sm font-semibold text-blue-700">
                        {travellers.adults}
                      </div>
                      <div className="text-xs text-blue-600">Adults</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2">
                      <div className="text-sm font-semibold text-green-700">
                        {travellers.children}
                      </div>
                      <div className="text-xs text-green-600">Children</div>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-2">
                      <div className="text-sm font-semibold text-gray-700">
                        {travellers.total}
                      </div>
                      <div className="text-xs text-gray-600">Total</div>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-xs">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          enquiry.flight_booked === "Yes" ||
                          enquiry.flight_booked === "yes"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        Flight: {enquiry.flight_booked || "No"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(enquiry.created_at)}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end space-x-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => openViewModal(enquiry)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <FiEye className="w-4 h-4" />
                      Details
                    </button>
                    <button
                      onClick={() => setConfirmDelete(enquiry.id)}
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

        {/* View Details Modal */}
        {viewModal && selectedEnquiry && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setViewModal(false)}
          >
            <div
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Holiday Enquiry Details
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      #{selectedEnquiry.id}
                    </p>
                  </div>
                  <button
                    onClick={() => setViewModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
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
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                        <FiUser className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Customer Information
                        </h4>
                        <p className="text-sm text-gray-600">
                          Personal details
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pl-13">
                      <div>
                        <label className="text-xs font-medium text-gray-500">
                          Full Name
                        </label>
                        <div className="text-sm text-gray-900 font-medium">
                          {selectedEnquiry.name}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">
                          Email Address
                        </label>
                        <div className="text-sm text-gray-900">
                          {selectedEnquiry.email}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">
                          Phone Number
                        </label>
                        <div className="text-sm text-gray-900">
                          {selectedEnquiry.phone || "Not provided"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <FiPackage className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Package Details
                        </h4>
                        <p className="text-sm text-gray-600">
                          Holiday information
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pl-13">
                      <div>
                        <label className="text-xs font-medium text-gray-500">
                          Package Title
                        </label>
                        <div className="text-sm text-gray-900 font-medium">
                          {selectedEnquiry.package_title || "Not specified"}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">
                          Destination
                        </label>
                        <div className="text-sm text-gray-900 flex items-center gap-2">
                          <FiMapPin className="w-4 h-4 text-gray-400" />
                          {selectedEnquiry.destination || "Not specified"}
                        </div>
                      </div>
                      {selectedEnquiry.duration && (
                        <div>
                          <label className="text-xs font-medium text-gray-500">
                            Duration
                          </label>
                          <div className="text-sm text-gray-900 flex items-center gap-2">
                            <FiClock className="w-4 h-4 text-gray-400" />
                            {selectedEnquiry.duration}
                          </div>
                        </div>
                      )}
                      <div>
                        <label className="text-xs font-medium text-gray-500">
                          Price / Person
                        </label>
                        <div className="text-sm text-gray-900">
                          {selectedEnquiry.price != null ? (
                            <span>
                              {formatCurrency(selectedEnquiry.price)}{" "}
                              <span className="text-gray-500">/ person</span>
                            </span>
                          ) : (
                            "—"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Traveller Information */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                      <FiUsers className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Traveller Information
                      </h4>
                      <p className="text-sm text-gray-600">
                        Passenger breakdown
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center bg-white rounded-lg p-4 border">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedEnquiry.adults || 0}
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        Adults
                      </div>
                      <div className="text-xs text-gray-500">12+ years</div>
                    </div>
                    <div className="text-center bg-white rounded-lg p-4 border">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedEnquiry.children || 0}
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        Children
                      </div>
                      <div className="text-xs text-gray-500">
                        Under 12 years
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                      <span className="text-sm font-semibold text-gray-700">
                        Total Travellers:
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {getTravellerSummary(selectedEnquiry).total}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Flight Information */}
                <div className="bg-white border rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Flight Information
                  </h4>
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                        selectedEnquiry.flight_booked === "Yes" ||
                        selectedEnquiry.flight_booked === "yes"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
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
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Flight Booking: {selectedEnquiry.flight_booked || "No"}
                      </div>
                      <div className="text-xs text-gray-600">
                        {selectedEnquiry.flight_booked === "Yes" ||
                        selectedEnquiry.flight_booked === "yes"
                          ? "Customer requires flight booking"
                          : "Flight booking not required"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 text-center border-t pt-4">
                  Enquiry submitted on {formatDate(selectedEnquiry.created_at)}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setViewModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setViewModal(false);
                      setConfirmDelete(selectedEnquiry.id);
                    }}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Delete Enquiry
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDelete && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setConfirmDelete(null)}
          >
            <div
              className="bg-white rounded-2xl p-6 w-[90%] max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center mb-4 text-red-500">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <FiTrash2 className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                Delete Enquiry?
              </h3>
              <p className="text-gray-600 mb-4 text-center">
                Are you sure you want to delete this enquiry? This action cannot
                be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  onClick={() => setConfirmDelete(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  onClick={() => handleDelete(confirmDelete)}
                >
                  Delete Enquiry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
