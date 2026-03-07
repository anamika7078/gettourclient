import { useCallback, useEffect, useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiEye,
  FiMail,
  FiPhone,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiUser,
  FiUsers,
  FiXCircle,
} from "react-icons/fi";
import { useLocation } from "react-router-dom";

export default function ManageActivityBooking() {
  const API_BASE = import.meta.env.VITE_API_URL;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [banner, setBanner] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const location = useLocation();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/activity-bookings`);
      const data = await res.json();
      if (!res.ok || !data?.success)
        throw new Error(data?.error || "Failed to load");
      setRows(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      console.error("Failed to load activity bookings:", e);
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    load();
  }, [load]);

  // Show success banner if redirected from other pages
  useEffect(() => {
    if (location.state?.updated) {
      setBanner("Booking information updated successfully.");
      setTimeout(() => setBanner(""), 2500);
      load();
    }
  }, [location.state, load]);

  // Filter bookings based on search and status
  const filteredRows = rows.filter((booking) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      booking.full_name?.toLowerCase().includes(searchLower) ||
      booking.email?.toLowerCase().includes(searchLower) ||
      booking.phone?.toLowerCase().includes(searchLower) ||
      booking.activity_title?.toLowerCase().includes(searchLower) ||
      booking.stripe_session_id?.toLowerCase().includes(searchLower) ||
      String(booking.id).includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" ||
      (booking.payment_status || "").toLowerCase() ===
        statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount) => {
    if (!amount) return "—";
    return `AED ${Number(amount).toLocaleString("en-IN", {
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
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  const formatSimpleDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const openViewModal = (booking) => {
    setSelectedBooking(booking);
    setViewModal(true);
  };

  const openDeleteModal = (id) => {
    setConfirmId(id);
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/activity-bookings/${confirmId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to delete");
      }
      setRows((prev) => prev.filter((r) => r.id !== confirmId));
      setBanner("Booking deleted successfully.");
      setTimeout(() => setBanner(""), 2000);
      setConfirmId(null);
    } catch (e) {
      console.error("Delete activity booking failed:", e);
      setBanner("Failed to delete booking");
      setTimeout(() => setBanner(""), 2500);
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusText = status || "unknown";
    const statusConfig = {
      paid: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: FiCheckCircle,
        label: "Paid",
      },
      succeeded: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: FiCheckCircle,
        label: "Paid",
      },
      pending: {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        icon: FiClock,
        label: "Pending",
      },
      unpaid: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: FiXCircle,
        label: "Unpaid",
      },
      processing: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: FiClock,
        label: "Processing",
      },
    };

    const config = statusConfig[statusText.toLowerCase()] || {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: FiClock,
      label: statusText,
    };
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}
      >
        <IconComponent className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getTotalGuests = (booking) => {
    const adults = booking.adults || 0;
    const children = booking.children || 0;
    return adults + children;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">
                Activity Bookings
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and track all activity bookings
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                {filteredRows.length} bookings
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
                  placeholder="Search by name, email, phone, activity, or session ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="unpaid">Unpaid</option>
                <option value="processing">Processing</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading activity bookings...</p>
          </div>
        )}

        {/* Bookings Table */}
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
                      Activity Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Booking Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Guests
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
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
                          <FiCalendar className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                          <p className="text-sm font-medium">
                            No bookings found
                          </p>
                          <p className="text-xs mt-1">
                            Try adjusting your search or filter
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((booking) => {
                      const totalGuests = getTotalGuests(booking);
                      return (
                        <tr
                          key={booking.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                                <FiUser className="h-5 w-5 text-orange-500" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {booking.full_name || "—"}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  #{booking.id}
                                </div>
                                <div className="text-xs text-gray-600 mt-1 truncate">
                                  {booking.email || "—"}
                                </div>
                                {booking.phone && (
                                  <div className="text-xs text-gray-600 truncate">
                                    {booking.phone}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                {booking.activity_title || "—"}
                              </div>
                              <div className="text-xs text-gray-600">
                                <span className="font-medium">Unit Price:</span>{" "}
                                {formatCurrency(booking.unit_price)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="text-sm text-gray-900 flex items-center gap-1">
                                <FiCalendar className="w-4 h-4 text-gray-400" />
                                {booking.visit_date
                                  ? formatSimpleDate(booking.visit_date)
                                  : "—"}
                              </div>
                              <div className="text-xs text-gray-600">
                                <span className="font-medium">Transfer:</span>{" "}
                                {booking.transfer ? "Yes" : "No"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatDate(booking.created_at)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-4">
                                <div className="text-center">
                                  <div className="text-sm font-semibold text-blue-600">
                                    {booking.adults || 0}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Adults
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-sm font-semibold text-green-600">
                                    {booking.children || 0}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Children
                                  </div>
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs font-medium text-gray-700 bg-gray-100 rounded-full px-2 py-1">
                                  {totalGuests} Total Guests
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {formatCurrency(booking.total_amount)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(booking.payment_status)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => openViewModal(booking)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                              >
                                <FiEye className="w-4 h-4" />
                                <span className="hidden sm:inline">View</span>
                              </button>
                              <button
                                onClick={() => openDeleteModal(booking.id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 border border-red-200 text-sm font-medium rounded-lg text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
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
            {filteredRows.map((booking) => {
              const totalGuests = getTotalGuests(booking);
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl shadow-sm border p-4"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                      <FiUser className="h-6 w-6 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {booking.full_name || "—"}
                      </h3>
                      <div className="mt-1 text-xs text-gray-500">
                        #{booking.id}
                      </div>
                      <div className="mt-2 space-y-2 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <FiMail className="h-3 w-3" />
                          {booking.email || "—"}
                        </div>
                        {booking.phone && (
                          <div className="flex items-center gap-2">
                            <FiPhone className="h-3 w-3" />
                            {booking.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-700 text-xs">
                        Activity
                      </div>
                      <div className="text-gray-900 line-clamp-2">
                        {booking.activity_title || "—"}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700 text-xs">
                        Visit Date
                      </div>
                      <div className="text-gray-900">
                        {booking.visit_date
                          ? formatSimpleDate(booking.visit_date)
                          : "—"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-blue-50 rounded-lg p-2">
                      <div className="text-sm font-semibold text-blue-700">
                        {booking.adults || 0}
                      </div>
                      <div className="text-xs text-blue-600">Adults</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2">
                      <div className="text-sm font-semibold text-green-700">
                        {booking.children || 0}
                      </div>
                      <div className="text-xs text-green-600">Children</div>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-2">
                      <div className="text-sm font-semibold text-gray-700">
                        {totalGuests}
                      </div>
                      <div className="text-xs text-gray-600">Total</div>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(booking.total_amount)}
                    </div>
                    <div>{getStatusBadge(booking.payment_status)}</div>
                  </div>

                  <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                    <span>Transfer: {booking.transfer ? "Yes" : "No"}</span>
                    <span>{formatSimpleDate(booking.created_at)}</span>
                  </div>

                  <div className="mt-4 flex justify-end space-x-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => openViewModal(booking)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <FiEye className="w-4 h-4" />
                      View Details
                    </button>
                    <button
                      onClick={() => openDeleteModal(booking.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 border border-red-200 text-sm font-medium rounded-lg text-red-600 bg-white hover:bg-red-50"
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
        {viewModal && selectedBooking && (
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
                      Booking Details
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      #{selectedBooking.id}
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
                          {selectedBooking.full_name || "Not provided"}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">
                          Email Address
                        </label>
                        <div className="text-sm text-gray-900">
                          {selectedBooking.email || "Not provided"}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">
                          Phone Number
                        </label>
                        <div className="text-sm text-gray-900">
                          {selectedBooking.phone || "Not provided"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <FiCalendar className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Activity Details
                        </h4>
                        <p className="text-sm text-gray-600">
                          Booking information
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pl-13">
                      <div>
                        <label className="text-xs font-medium text-gray-500">
                          Activity Title
                        </label>
                        <div className="text-sm text-gray-900 font-medium">
                          {selectedBooking.activity_title || "Not specified"}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">
                          Visit Date
                        </label>
                        <div className="text-sm text-gray-900 flex items-center gap-2">
                          <FiCalendar className="w-4 h-4 text-gray-400" />
                          {selectedBooking.visit_date
                            ? formatSimpleDate(selectedBooking.visit_date)
                            : "Not specified"}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">
                          Transfer Included
                        </label>
                        <div className="text-sm text-gray-900">
                          {selectedBooking.transfer ? (
                            <span className="inline-flex items-center gap-1 text-green-600">
                              <FiCheckCircle className="w-4 h-4" />
                              Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-gray-600">
                              <FiXCircle className="w-4 h-4" />
                              No
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guest & Pricing Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                        <FiUsers className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Guest Information
                        </h4>
                        <p className="text-sm text-gray-600">
                          Passenger breakdown
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center bg-white rounded-lg p-3 border">
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedBooking.adults || 0}
                        </div>
                        <div className="text-sm font-medium text-gray-700">
                          Adults
                        </div>
                        <div className="text-xs text-gray-500">12+ years</div>
                      </div>
                      <div className="text-center bg-white rounded-lg p-3 border">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedBooking.children || 0}
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
                          Total Guests:
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {getTotalGuests(selectedBooking)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                        <FiDollarSign className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Pricing Information
                        </h4>
                        <p className="text-sm text-gray-600">Payment details</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">
                          Unit Price
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(selectedBooking.unit_price)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">
                          Total Amount
                        </span>
                        <span className="text-lg font-bold text-orange-600">
                          {formatCurrency(selectedBooking.total_amount)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm text-gray-600">
                          Payment Status
                        </span>
                        <div>
                          {getStatusBadge(selectedBooking.payment_status)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedBooking.notes && (
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Additional Notes
                      </h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {selectedBooking.notes}
                      </p>
                    </div>
                  )}

                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Payment Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <label className="text-gray-500">
                          Stripe Session ID
                        </label>
                        <div className="font-mono text-xs text-gray-700 bg-gray-100 p-2 rounded break-all">
                          {selectedBooking.stripe_session_id || "Not available"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 text-center border-t pt-4">
                  Booking created on {formatDate(selectedBooking.created_at)}
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
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => (deleting ? null : setConfirmId(null))}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-xl border overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <FiTrash2 className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete booking?
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    This action can’t be undone. The activity booking will be
                    permanently removed.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-white disabled:opacity-50"
                onClick={() => setConfirmId(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
