

import { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiEdit,
  FiHome,
  FiMapPin,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiXCircle,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

export default function ManageHotel() {
  const API_BASE = import.meta.env.VITE_API_URL;
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [banner, setBanner] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/hotels`);
      const data = await res.json();
      setHotels(data || []);
    } catch (err) {
      console.error("Error fetching hotels:", err);
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
        created ? "Hotel created successfully." : "Hotel updated successfully."
      );
      // clear state so refresh doesn't re-show
      navigate(location.pathname, { replace: true });
      setTimeout(() => setBanner(""), 2500);
      // reload list to ensure fresh data
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  // Filter hotels based on search
  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.hotel_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.address?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleDelete = async (hotel) => {
    try {
      const res = await fetch(`${API_BASE}/api/hotels/${hotel.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBanner("Hotel deleted successfully.");
        setConfirmDelete(false);
        setDeleteTarget(null);
        load();
        setTimeout(() => setBanner(""), 2000);
      } else {
        const result = await res.json();
        alert(result.error || "Failed to delete hotel.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Server error while deleting hotel.");
    }
  };

  const getRoomStats = (rooms) => {
    const roomArray = Array.isArray(rooms) ? rooms : [];
    const totalAvailable = roomArray.filter(
      (r) => r.availability === "Available" || r.availability === "available"
    ).length;
    const totalBooked = roomArray.filter(
      (r) => r.availability === "Booked" || r.availability === "booked"
    ).length;

    return {
      total: roomArray.length,
      available: totalAvailable,
      booked: totalBooked,
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">
                Hotel Management
              </h1>
              <p className="text-gray-600 mt-2">
                Create and manage hotels and rooms
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                {filteredHotels.length} hotels
              </span>
              <button
                onClick={() => navigate("/admin/add-room")}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2.5 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm font-medium"
              >
                <FiPlus className="text-lg" />
                <span>Add Hotel</span>
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
                  placeholder="Search by hotel name or address..."
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
            <p className="mt-4 text-gray-600">Loading hotels...</p>
          </div>
        )}

        {/* Hotels Table */}
        {!loading && (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Hotel Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Rooms & Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredHotels.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <FiHome className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                          <p className="text-sm font-medium">No hotels found</p>
                          <p className="text-xs mt-1">
                            Try adjusting your search or add a new hotel
                          </p>
                          <button
                            onClick={() => navigate("/admin/add-room")}
                            className="mt-4 inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition font-medium"
                          >
                            <FiPlus />
                            Add Your First Hotel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredHotels.map((hotel, index) => {
                      const roomStats = getRoomStats(hotel.rooms);
                      const rooms = Array.isArray(hotel.rooms)
                        ? hotel.rooms
                        : [];

                      return (
                        <tr
                          key={hotel.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                                <FiHome className="h-6 w-6 text-orange-500" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                  {hotel.hotel_name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  #{index + 1}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-start gap-2">
                              <FiMapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div className="text-sm text-gray-900 line-clamp-2">
                                {hotel.address || "—"}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              {rooms.length === 0 ? (
                                <span className="text-sm text-gray-400">
                                  No rooms
                                </span>
                              ) : (
                                <>
                                  <div className="space-y-1">
                                    {rooms.slice(0, 2).map((room, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center gap-2 text-xs"
                                      >
                                        <span className="font-medium text-gray-700 min-w-[100px]">
                                          {room.room_type || "Unnamed Room"}
                                        </span>
                                        <span
                                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                            room.availability === "Booked" ||
                                            room.availability === "booked"
                                              ? "bg-red-100 text-red-800"
                                              : "bg-green-100 text-green-800"
                                          }`}
                                        >
                                          {room.availability === "Booked" ||
                                          room.availability === "booked" ? (
                                            <FiXCircle className="w-3 h-3" />
                                          ) : (
                                            <FiCheckCircle className="w-3 h-3" />
                                          )}
                                          {room.availability || "Available"}
                                        </span>
                                      </div>
                                    ))}
                                    {rooms.length > 2 && (
                                      <div className="text-xs text-gray-500">
                                        +{rooms.length - 2} more rooms
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="inline-flex items-center gap-1">
                                      <FiCheckCircle className="w-3 h-3 text-green-500" />
                                      {roomStats.available} available
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                      <FiXCircle className="w-3 h-3 text-red-500" />
                                      {roomStats.booked} booked
                                    </span>
                                    <span className="text-gray-400">
                                      {roomStats.total} total
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() =>
                                  navigate(`/admin/rooms/edit/${hotel.id}`)
                                }
                                className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                              >
                                <FiEdit className="w-4 h-4" />
                                <span className="hidden sm:inline">Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteTarget(hotel);
                                  setConfirmDelete(true);
                                }}
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
        {!loading && filteredHotels.length > 0 && (
          <div className="lg:hidden mt-6 space-y-4">
            {filteredHotels.map((hotel, index) => {
              const roomStats = getRoomStats(hotel.rooms);
              const rooms = Array.isArray(hotel.rooms) ? hotel.rooms : [];

              return (
                <div
                  key={hotel.id}
                  className="bg-white rounded-2xl shadow-sm border p-4"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 h-16 w-16 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                      <FiHome className="h-6 w-6 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                        {hotel.hotel_name}
                      </h3>
                      <div className="mt-1 text-xs text-gray-500">
                        Hotel #{index + 1}
                      </div>
                      <div className="mt-2 flex items-start gap-2 text-xs text-gray-600">
                        <FiMapPin className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">
                          {hotel.address || "No address"}
                        </span>
                      </div>
                      <div className="mt-3 space-y-2">
                        <div className="text-xs font-medium text-gray-700">
                          Rooms: {roomStats.total}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <FiCheckCircle className="w-3 h-3" />
                            {roomStats.available} available
                          </span>
                          <span className="inline-flex items-center gap-1 text-red-600">
                            <FiXCircle className="w-3 h-3" />
                            {roomStats.booked} booked
                          </span>
                        </div>
                        {rooms.length > 0 && (
                          <div className="text-xs text-gray-400">
                            {rooms.length} room{rooms.length !== 1 ? "s" : ""}{" "}
                            total
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => navigate(`/admin/rooms/edit/${hotel.id}`)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <FiEdit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeleteTarget(hotel);
                        setConfirmDelete(true);
                      }}
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

        {/* Delete Confirmation Modal */}
        {confirmDelete && deleteTarget && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setConfirmDelete(false)}
          >
            <div
              className="bg-white rounded-2xl p-6 w-[90%] max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center mb-4 text-orange-500">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <FiHome className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                Delete Hotel?
              </h3>
              <p className="text-gray-600 mb-4 text-center">
                Are you sure you want to delete{" "}
                <strong>"{deleteTarget.hotel_name}"</strong>? This action cannot
                be undone and all associated rooms will be removed.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  onClick={() => handleDelete(deleteTarget)}
                >
                  Delete Hotel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
