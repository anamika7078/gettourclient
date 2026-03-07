


import { useEffect, useState } from "react";
import {
    FiCalendar,
    FiEye,
    FiMail,
    FiMessageSquare,
    FiPhone,
    FiRefreshCw,
    FiSearch,
    FiTrash2,
    FiUser,
} from "react-icons/fi";
import { useLocation } from "react-router-dom";

export default function ContactMessage() {
  const API_BASE = import.meta.env.VITE_API_URL;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [banner, setBanner] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const location = useLocation();

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/contact`);
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching messages:", error);
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
      setBanner("Message deleted successfully.");
      setTimeout(() => setBanner(""), 2500);
      load();
    }
  }, [location.state]);

  // Filter messages based on search
  const filteredMessages = messages.filter((message) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      message.name?.toLowerCase().includes(searchLower) ||
      message.email?.toLowerCase().includes(searchLower) ||
      message.phone?.toLowerCase().includes(searchLower) ||
      message.subject?.toLowerCase().includes(searchLower) ||
      message.message?.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/contact/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete message");
      setBanner("Message deleted successfully.");
      setConfirmDelete(null);
      load();
      setTimeout(() => setBanner(""), 2000);
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Failed to delete message.");
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

  const openViewModal = (message) => {
    setSelectedMessage(message);
    setViewModal(true);
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "—";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">
                Contact Messages
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and review customer contact form submissions
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                {filteredMessages.length} messages
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
                  placeholder="Search by name, email, phone, subject, or message..."
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
            <p className="mt-4 text-gray-600">Loading contact messages...</p>
          </div>
        )}

        {/* Messages Table */}
        {!loading && (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Contact Information
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Message Preview
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Subject
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
                  {filteredMessages.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <FiMessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                          <p className="text-sm font-medium">
                            No messages found
                          </p>
                          <p className="text-xs mt-1">
                            Try adjusting your search criteria
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredMessages.map((message, index) => (
                      <tr
                        key={message.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                              <FiUser className="h-5 w-5 text-orange-500" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {message.name}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                #{index + 1}
                              </div>
                              <div className="text-xs text-gray-600 mt-1 truncate">
                                {message.email}
                              </div>
                              {message.phone && (
                                <div className="text-xs text-gray-600 truncate">
                                  {message.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            <div className="line-clamp-2">
                              {truncateText(message.message, 120)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {message.subject ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {message.subject}
                              </span>
                            ) : (
                              <span className="text-gray-400">No subject</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">
                            {formatDate(message.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openViewModal(message)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                            >
                              <FiEye className="w-4 h-4" />
                              <span className="hidden sm:inline">View</span>
                            </button>
                            <button
                              onClick={() => setConfirmDelete(message.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                            >
                              <FiTrash2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Delete</span>
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
        {!loading && filteredMessages.length > 0 && (
          <div className="lg:hidden mt-6 space-y-4">
            {filteredMessages.map((message, index) => (
              <div
                key={message.id}
                className="bg-white rounded-2xl shadow-sm border p-4"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                    <FiUser className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {message.name}
                    </h3>
                    <div className="mt-1 text-xs text-gray-500">
                      #{index + 1}
                    </div>
                    <div className="mt-2 space-y-2 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <FiMail className="h-3 w-3" />
                        {message.email}
                      </div>
                      {message.phone && (
                        <div className="flex items-center gap-2">
                          <FiPhone className="h-3 w-3" />
                          {message.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div>
                    <div className="font-medium text-gray-700 text-xs">
                      Subject
                    </div>
                    <div className="text-gray-900">
                      {message.subject ? (
                        <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {message.subject}
                        </span>
                      ) : (
                        "No subject"
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700 text-xs">
                      Message
                    </div>
                    <div className="text-gray-600 text-xs line-clamp-2">
                      {truncateText(message.message, 80)}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                  <span>{formatSimpleDate(message.created_at)}</span>
                </div>

                <div className="mt-4 flex justify-end space-x-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => openViewModal(message)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <FiEye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => setConfirmDelete(message.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Details Modal */}
        {viewModal && selectedMessage && (
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
                      Message Details
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      From: {selectedMessage.name}
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
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                        <FiUser className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Contact Information
                        </h4>
                        <p className="text-sm text-gray-600">Sender details</p>
                      </div>
                    </div>

                    <div className="space-y-3 pl-13">
                      <div>
                        <label className="text-xs font-medium text-gray-500">
                          Full Name
                        </label>
                        <div className="text-sm text-gray-900 font-medium">
                          {selectedMessage.name}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">
                          Email Address
                        </label>
                        <div className="text-sm text-gray-900">
                          {selectedMessage.email}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">
                          Phone Number
                        </label>
                        <div className="text-sm text-gray-900">
                          {selectedMessage.phone || "Not provided"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <FiMessageSquare className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Message Information
                        </h4>
                        <p className="text-sm text-gray-600">
                          Submission details
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pl-13">
                      <div>
                        <label className="text-xs font-medium text-gray-500">
                          Subject
                        </label>
                        <div className="text-sm text-gray-900">
                          {selectedMessage.subject ? (
                            <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              {selectedMessage.subject}
                            </span>
                          ) : (
                            "No subject provided"
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">
                          Submitted On
                        </label>
                        <div className="text-sm text-gray-900 flex items-center gap-2">
                          <FiCalendar className="w-4 h-4 text-gray-400" />
                          {formatDate(selectedMessage.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                      <FiMessageSquare className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Message Content
                      </h4>
                      <p className="text-sm text-gray-600">Full message text</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {selectedMessage.message || "No message content"}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-gray-500 text-center border-t pt-4">
                  Message received on {formatDate(selectedMessage.created_at)}
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
                      setConfirmDelete(selectedMessage.id);
                    }}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Delete Message
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
                Delete Message?
              </h3>
              <p className="text-gray-600 mb-4 text-center">
                Are you sure you want to delete this contact message? This
                action cannot be undone.
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
                  Delete Message
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}