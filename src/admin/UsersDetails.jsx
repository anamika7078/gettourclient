

import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiEye,
  FiMail,
  FiMapPin,
  FiPhone,
  FiRefreshCw,
  FiSearch,
  FiUser,
  FiXCircle,
} from "react-icons/fi";
import { useLocation } from "react-router-dom";

export default function UsersDetails() {
  const API_BASE = import.meta.env.VITE_API_URL;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [banner, setBanner] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const location = useLocation();

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/users`);
      const rows = await res.json();
      setUsers(Array.isArray(rows) ? rows : []);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(`${API_BASE}/api/users`)
      .then((res) => res.json())
      .then((rows) => {
        if (!alive) return;
        setUsers(Array.isArray(rows) ? rows : []);
      })
      .catch((err) => console.error("Failed to load users:", err))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [API_BASE]);

  // Show success banner if redirected from other pages
  useEffect(() => {
    if (location.state?.updated) {
      setBanner("User information updated successfully.");
      setTimeout(() => setBanner(""), 2500);
      load();
    }
  }, [location.state]);

  // Filter users based on search
  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.phone?.toLowerCase().includes(searchLower) ||
      user.countryCode?.toLowerCase().includes(searchLower) ||
      String(user.id).includes(searchTerm)
    );
  });

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

  const openViewModal = (user) => {
    setSelectedUser(user);
    setViewModal(true);
  };

  const getFullName = (user) => {
    return `${user.firstName || ""} ${user.lastName || ""}`.trim() || "—";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">
                User Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and view all registered user accounts
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                {filteredUsers.length} users
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
                  placeholder="Search by name, email, phone, country, or ID..."
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
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        )}

        {/* Users Table */}
        {!loading && (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      User Profile
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Contact Information
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Terms Accepted
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Registered
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <FiUser className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                          <p className="text-sm font-medium">No users found</p>
                          <p className="text-xs mt-1">
                            Try adjusting your search criteria
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                              <FiUser className="h-5 w-5 text-orange-500" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {getFullName(user)}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                #{user.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-900">
                              <FiMail className="h-4 w-4 text-gray-400" />
                              {user.email || "—"}
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FiPhone className="h-4 w-4 text-gray-400" />
                                {user.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {user.countryCode ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <FiMapPin className="w-3 h-3" />
                                {user.countryCode}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            {user.acceptedTos ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <FiCheckCircle className="w-3 h-3" />
                                Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <FiXCircle className="w-3 h-3" />
                                No
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">
                            {formatDate(user.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openViewModal(user)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                            >
                              <FiEye className="w-4 h-4" />
                              <span className="hidden sm:inline">View</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mobile Cards View */}
        {!loading && filteredUsers.length > 0 && (
          <div className="lg:hidden mt-6 space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-2xl shadow-sm border p-4"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                    <FiUser className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {getFullName(user)}
                    </h3>
                    <div className="mt-1 text-xs text-gray-500">#{user.id}</div>
                    <div className="mt-2 space-y-2 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <FiMail className="h-3 w-3" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2">
                          <FiPhone className="h-3 w-3" />
                          {user.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-700 text-xs">
                      Country
                    </div>
                    <div className="text-gray-900">
                      {user.countryCode ? (
                        <span className="inline-flex items-center gap-1 text-xs">
                          <FiMapPin className="w-3 h-3" />
                          {user.countryCode}
                        </span>
                      ) : (
                        "—"
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700 text-xs">
                      Terms
                    </div>
                    <div className="text-gray-900">
                      {user.acceptedTos ? (
                        <span className="inline-flex items-center gap-1 text-green-600 text-xs">
                          <FiCheckCircle className="w-3 h-3" />
                          Accepted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-600 text-xs">
                          <FiXCircle className="w-3 h-3" />
                          Not Accepted
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                  <span>Registered: {formatSimpleDate(user.createdAt)}</span>
                </div>

                <div className="mt-4 flex justify-end space-x-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => openViewModal(user)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <FiEye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Details Modal */}
        {viewModal && selectedUser && (
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
                      User Details
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      #{selectedUser.id}
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
                {/* User Profile */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                    <FiUser className="h-8 w-8 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">
                      {getFullName(selectedUser)}
                    </h4>
                    <p className="text-sm text-gray-600">
                      User ID: #{selectedUser.id}
                    </p>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <FiUser className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Personal Information
                        </h4>
                        <p className="text-sm text-gray-600">User details</p>
                      </div>
                    </div>

                    <div className="space-y-3 pl-13">
                      <div>
                        <label className="text-xs font-medium text-gray-500">
                          First Name
                        </label>
                        <div className="text-sm text-gray-900 font-medium">
                          {selectedUser.firstName || "Not provided"}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">
                          Last Name
                        </label>
                        <div className="text-sm text-gray-900 font-medium">
                          {selectedUser.lastName || "Not provided"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                        <FiMail className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Contact Information
                        </h4>
                        <p className="text-sm text-gray-600">
                          Communication details
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pl-13">
                      <div>
                        <label className="text-xs font-medium text-gray-500">
                          Email Address
                        </label>
                        <div className="text-sm text-gray-900">
                          {selectedUser.email || "Not provided"}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">
                          Phone Number
                        </label>
                        <div className="text-sm text-gray-900">
                          {selectedUser.phone || "Not provided"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                        <FiMapPin className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Location
                        </h4>
                        <p className="text-sm text-gray-600">
                          Geographical information
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pl-13">
                      <div>
                        <label className="text-xs font-medium text-gray-500">
                          Country Code
                        </label>
                        <div className="text-sm text-gray-900">
                          {selectedUser.countryCode ? (
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              <FiMapPin className="w-3 h-3" />
                              {selectedUser.countryCode}
                            </span>
                          ) : (
                            "Not specified"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                        <FiCheckCircle className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Account Status
                        </h4>
                        <p className="text-sm text-gray-600">
                          Terms and registration
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pl-13">
                      <div>
                        <label className="text-xs font-medium text-gray-500">
                          Terms Accepted
                        </label>
                        <div className="text-sm text-gray-900">
                          {selectedUser.acceptedTos ? (
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              <FiCheckCircle className="w-3 h-3" />
                              Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                              <FiXCircle className="w-3 h-3" />
                              No
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration Information */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <FiCalendar className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Registration Information
                      </h4>
                      <p className="text-sm text-gray-600">
                        Account creation details
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pl-13">
                    <div>
                      <label className="text-xs font-medium text-gray-500">
                        Registered On
                      </label>
                      <div className="text-sm text-gray-900 font-medium">
                        {formatDate(selectedUser.createdAt)}
                      </div>
                    </div>
                  </div>
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
    </div>
  );
}
