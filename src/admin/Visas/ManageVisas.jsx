import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL;

export default function ManageVisas() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [banner, setBanner] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/visa-applications`);
      const result = await response.json();

      if (result.success) {
        console.log("Fetched applications:", result.data);
        setApplications(result.data);
      } else {
        console.error("Failed to fetch applications:", result.error);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id) => setConfirmId(id);

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/visa-applications/${confirmId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success)
        throw new Error(data?.error || "Failed to delete");
      setApplications((prev) => prev.filter((a) => a.id !== confirmId));
      setBanner("Application deleted successfully.");
      setTimeout(() => setBanner(""), 2000);
      setConfirmId(null);
    } catch (e) {
      console.error("Delete visa application failed:", e);
      setBanner("Failed to delete application");
      setTimeout(() => setBanner(""), 2500);
    } finally {
      setDeleting(false);
    }
  };

  // Filter applications based on search and status
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.lead_first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.lead_last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.lead_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.country?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || app.payment_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const viewApplicationDetails = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: {
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        label: "Paid",
      },
      pending: {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        label: "Pending",
      },
      unpaid: {
        color: "bg-rose-100 text-rose-800 border-rose-200",
        label: "Unpaid",
      },
      processing: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Processing",
      },
      completed: {
        color: "bg-violet-100 text-violet-800 border-violet-200",
        label: "Completed",
      },
      cancelled: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Cancelled",
      },
    };

    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      label: "Unknown",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount) => {
    return `AED ${Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const getAllPassengers = (application) => {
    if (!application) return [];

    let passengers = [];

    const parsePassengerData = (data) => {
      if (!data) return [];
      if (Array.isArray(data)) return data;
      if (typeof data === "string") {
        try {
          const parsed = JSON.parse(data);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }
      return [];
    };

    passengers = parsePassengerData(application.passengers);
    if (passengers.length === 0) {
      passengers = parsePassengerData(application.extra_passengers);
    }

    // Normalize passenger object structure
    return passengers
      .filter(
        (passenger) =>
          passenger && (passenger.firstName || passenger.first_name)
      )
      .map((passenger) => ({
        title: passenger.title || "",
        firstName: passenger.firstName || passenger.first_name || "",
        lastName: passenger.lastName || passenger.last_name || "",
        gender: passenger.gender || "",
        passport: passenger.passport || "",
        nationality: passenger.nationality || "",
        birthDate: passenger.birthDate || passenger.birth_date || "",
        passengerNumber:
          passenger.passengerNumber || passenger.passenger_number || 1,
      }));
  };

  const getTotalPassengersCount = (application) => {
    const allPassengers = getAllPassengers(application);
    return allPassengers.length;
  };

  const getAdditionalPassengersCount = (application) => {
    const allPassengers = getAllPassengers(application);
    return Math.max(0, allPassengers.length - 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">
                Visa Applications
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and track all visa applications
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                {filteredApplications.length} applications
              </span>
            </div>
          </div>
        </div>

        {/* Success Banner */}
        {!!banner && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center">
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

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
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
                  placeholder="Search by name, email, or country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="unpaid">Unpaid</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Application
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Passengers
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Travel Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
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
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="mt-2 text-sm font-medium">
                          No applications found
                        </p>
                        <p className="text-xs">
                          Try adjusting your search or filter
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((application) => {
                    const totalPassengers =
                      getTotalPassengersCount(application);
                    const additionalPassengers =
                      getAdditionalPassengersCount(application);

                    return (
                      <tr
                        key={application.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {application.country?.charAt(0) || "V"}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {application.lead_first_name}{" "}
                                {application.lead_last_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {application.country}
                              </div>
                              <div className="text-xs text-gray-400">
                                #{application.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <span className="font-semibold">
                              {totalPassengers}
                            </span>{" "}
                            passenger{totalPassengers !== 1 ? "s" : ""}
                          </div>
                          {additionalPassengers > 0 && (
                            <div className="text-xs text-emerald-600 font-medium">
                              +{additionalPassengers} additional
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {application.travel_date
                              ? formatDate(application.travel_date)
                              : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatCurrency(
                              application.price_per_person *
                                application.total_passengers
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(application.payment_status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">
                            {formatDate(application.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                viewApplicationDetails(application)
                              }
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                              <svg
                                className="w-4 h-4 mr-1.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              View
                            </button>
                            <button
                              onClick={() => openDeleteModal(application.id)}
                              className="inline-flex items-center px-3 py-1.5 border border-rose-200 text-sm font-medium rounded-lg text-rose-600 bg-white hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors"
                            >
                              <svg
                                className="w-4 h-4 mr-1.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 7h4m-7 0h10l-1-2a2 2 0 00-1.789-1H8.789A2 2 0 007 5l-1 2z"
                                />
                              </svg>
                              Delete
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

        {/* Application Details Modal */}
        {showModal && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Application #{selectedApplication.id}
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      {selectedApplication.country} •{" "}
                      {formatDate(selectedApplication.created_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-lg"
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

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Visa & Payment Information */}
                  <div className="space-y-6">
                    {/* Visa Information Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg
                          className="w-5 h-5 text-blue-600 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                        Visa Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Country</span>
                          <span className="font-medium text-gray-900">
                            {selectedApplication.country}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Subject</span>
                          <span className="font-medium text-gray-900">
                            {selectedApplication.subject}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Travel Date</span>
                          <span className="font-medium text-gray-900">
                            {selectedApplication.travel_date
                              ? formatDate(selectedApplication.travel_date)
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600">
                            Price per Person
                          </span>
                          <span className="font-medium text-gray-900">
                            {formatCurrency(
                              selectedApplication.price_per_person
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Information Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg
                          className="w-5 h-5 text-green-600 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                        Payment Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Status</span>
                          <div>
                            {getStatusBadge(selectedApplication.payment_status)}
                          </div>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">
                            Total Passengers
                          </span>
                          <span className="font-medium text-gray-900">
                            {selectedApplication.total_passengers}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600">Total Amount</span>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(
                              selectedApplication.price_per_person *
                                selectedApplication.total_passengers
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lead Passenger & Notes */}
                  <div className="space-y-6">
                    {/* Lead Passenger Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg
                          className="w-5 h-5 text-purple-600 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Lead Passenger
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Name</span>
                          <span className="font-medium text-gray-900">
                            {selectedApplication.lead_title}{" "}
                            {selectedApplication.lead_first_name}{" "}
                            {selectedApplication.lead_last_name}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Email</span>
                          <span className="font-medium text-gray-900">
                            {selectedApplication.lead_email}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Phone</span>
                          <span className="font-medium text-gray-900">
                            {selectedApplication.lead_isd}{" "}
                            {selectedApplication.lead_phone}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600">Nationality</span>
                          <span className="font-medium text-gray-900">
                            {selectedApplication.lead_nationality}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Notes Card */}
                    {selectedApplication.notes && (
                      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <svg
                            className="w-5 h-5 text-amber-600 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Notes
                        </h3>
                        <p className="text-gray-700 bg-amber-50 border border-amber-100 rounded-lg p-3">
                          {selectedApplication.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* All Passengers Section */}
                <div className="mt-6">
                  {(() => {
                    const allPassengers = getAllPassengers(selectedApplication);

                    if (allPassengers.length > 0) {
                      return (
                        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <svg
                              className="w-5 h-5 text-emerald-600 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            All Passengers ({allPassengers.length})
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {allPassengers.map((passenger, index) => (
                              <div
                                key={index}
                                className={`border rounded-lg p-4 ${
                                  index === 0
                                    ? "border-emerald-200 bg-emerald-50"
                                    : "border-gray-200 bg-gray-50"
                                }`}
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center">
                                    <div
                                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                                        index === 0
                                          ? "bg-emerald-500"
                                          : "bg-blue-500"
                                      }`}
                                    >
                                      {index + 1}
                                    </div>
                                    <span
                                      className={`ml-2 text-sm font-medium ${
                                        index === 0
                                          ? "text-emerald-800"
                                          : "text-gray-700"
                                      }`}
                                    >
                                      {index === 0
                                        ? "Lead Passenger"
                                        : `Passenger ${index + 1}`}
                                    </span>
                                  </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="text-gray-500">Name:</span>
                                    <span className="font-medium ml-1 text-gray-900">
                                      {passenger.title} {passenger.firstName}{" "}
                                      {passenger.lastName}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">
                                      Gender:
                                    </span>
                                    <span className="font-medium ml-1 text-gray-900">
                                      {passenger.gender}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">
                                      Passport:
                                    </span>
                                    <span className="font-medium ml-1 text-gray-900">
                                      {passenger.passport}
                                    </span>
                                  </div>
                                  {passenger.birthDate && (
                                    <div>
                                      <span className="text-gray-500">
                                        Birth Date:
                                      </span>
                                      <span className="font-medium ml-1 text-gray-900">
                                        {formatDate(passenger.birthDate)}
                                      </span>
                                    </div>
                                  )}
                                  {passenger.nationality && (
                                    <div>
                                      <span className="text-gray-500">
                                        Nationality:
                                      </span>
                                      <span className="font-medium ml-1 text-gray-900">
                                        {passenger.nationality}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
                        <svg
                          className="w-12 h-12 text-gray-400 mx-auto mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <p className="text-gray-500">
                          No passenger details available
                        </p>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Delete Confirm Modal */}
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
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100">
                  <svg
                    className="h-5 w-5 text-rose-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 7h4m-7 0h10l-1-2a2 2 0 00-1.789-1H8.789A2 2 0 007 5l-1 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete application?
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    This action cannot be undone. The visa application will be
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
                className="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
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
