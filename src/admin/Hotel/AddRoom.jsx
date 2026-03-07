import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Icons (using Heroicons)
const icons = {
  back: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </svg>
  ),
  plus: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  ),
  delete: (
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
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  ),
  success: (
    <svg
      className="w-5 h-5"
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
  ),
  error: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  close: (
    <svg
      className="w-5 h-5"
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
  ),
  facility: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  ),
  room: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  ),
};

export default function AddRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;

  const [hotelName, setHotelName] = useState("");
  const [address, setAddress] = useState("");
  const [mapLink, setMapLink] = useState("");
  const [description, setDescription] = useState("");
  const [facilities, setFacilities] = useState([]);
  const [facilityInput, setFacilityInput] = useState("");
  const [rooms, setRooms] = useState([
    {
      room_type: "",
      board_type: "",
      max_guests: 1,
      price_per_night: "",
      availability: "Available",
    },
  ]);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: "success",
    message: "",
  });

  // Fetch hotel data if editing
  useEffect(() => {
    if (!roomId) return;

    async function fetchHotel() {
      try {
        const res = await fetch(`${API_BASE}/api/hotels/${roomId}`);
        if (!res.ok) throw new Error("Hotel not found");
        const data = await res.json();

        console.log("Fetched hotel data:", data); // Debug log

        // Handle different response structures
        const hotelData = data.data || data;

        setHotelName(hotelData.hotel_name || "");
        setAddress(hotelData.address || "");
        setMapLink(hotelData.map_link || "");
        setDescription(hotelData.description || "");

        // Parse facilities - handle both string and array
        let facilitiesArray = [];
        if (Array.isArray(hotelData.facilities)) {
          facilitiesArray = hotelData.facilities;
        } else if (typeof hotelData.facilities === "string") {
          facilitiesArray = hotelData.facilities
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean);
        }
        setFacilities(facilitiesArray);

        // Parse rooms - ensure it's always an array
        let roomsArray = [];
        if (Array.isArray(hotelData.rooms)) {
          roomsArray = hotelData.rooms;
        } else if (hotelData.rooms) {
          try {
            // Try to parse as JSON if it's a string
            const parsedRooms =
              typeof hotelData.rooms === "string"
                ? JSON.parse(hotelData.rooms)
                : hotelData.rooms;
            roomsArray = Array.isArray(parsedRooms) ? parsedRooms : [];
          } catch (e) {
            console.error("Error parsing rooms:", e);
            roomsArray = [];
          }
        }

        // Ensure rooms array has at least one room
        if (roomsArray.length === 0) {
          roomsArray = [
            {
              room_type: "",
              board_type: "",
              max_guests: 1,
              price_per_night: "",
              availability: "Available",
            },
          ];
        }

        console.log("Parsed rooms:", roomsArray); // Debug log
        setRooms(roomsArray);

        // Parse images - handle both string and array
        let imagesArray = [];
        if (Array.isArray(hotelData.images)) {
          imagesArray = hotelData.images;
        } else if (typeof hotelData.images === "string") {
          imagesArray = hotelData.images
            .split(",")
            .map((img) => img.trim())
            .filter(Boolean);
        }
        setExistingImages(imagesArray);

        console.log("Parsed images:", imagesArray); // Debug log
      } catch (err) {
        console.error("Error fetching hotel:", err);
        setAlert({
          show: true,
          type: "error",
          message: "Failed to load hotel data: " + err.message,
        });
      }
    }

    fetchHotel();
  }, [roomId, API_BASE]);

  function addRoom() {
    setRooms([
      ...rooms,
      {
        room_type: "",
        board_type: "",
        max_guests: 1,
        price_per_night: "",
        availability: "Available",
      },
    ]);
  }

  function deleteRoom(index) {
    if (rooms.length === 1) {
      setAlert({
        show: true,
        type: "error",
        message: "At least one room is required!",
      });
      return;
    }
    setRooms(rooms.filter((_, i) => i !== index));
  }

  function updateRoom(index, field, value) {
    setRooms((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  }

  function addFacility() {
    const trimmed = facilityInput.trim();
    if (!trimmed) {
      setAlert({
        show: true,
        type: "error",
        message: "Please enter a facility name.",
      });
      return;
    }
    if (!facilities.includes(trimmed)) {
      setFacilities((p) => [...p, trimmed]);
      setFacilityInput("");
      setAlert({
        show: true,
        type: "success",
        message: "Facility added successfully!",
      });
    } else {
      setAlert({
        show: true,
        type: "error",
        message: "Facility already exists.",
      });
    }
  }

  function removeFacility(index) {
    setFacilities((p) => p.filter((_, i) => i !== index));
  }

  function handleFiles(e) {
    setImages(Array.from(e.target.files));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setAlert({ show: false, type: "success", message: "" });

    if (!hotelName.trim()) {
      setAlert({
        show: true,
        type: "error",
        message: "Please enter hotel name.",
      });
      return;
    }

    // Validate rooms
    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      if (!room.room_type.trim()) {
        setAlert({
          show: true,
          type: "error",
          message: `Room ${i + 1}: Room Type is required`,
        });
        return;
      }
      if (!room.board_type.trim()) {
        setAlert({
          show: true,
          type: "error",
          message: `Room ${i + 1}: Board Type is required`,
        });
        return;
      }
      if (!room.price_per_night || Number(room.price_per_night) <= 0) {
        setAlert({
          show: true,
          type: "error",
          message: `Room ${i + 1}: Valid Price per Night is required`,
        });
        return;
      }
    }

    try {
      setSaving(true);
      const fd = new FormData();
      fd.append("hotel_name", hotelName);
      fd.append("address", address);
      fd.append("map_link", mapLink);
      fd.append("description", description);
      fd.append("facilities", facilities.join(", "));
      fd.append("rooms", JSON.stringify(rooms));
      images.forEach((file) => fd.append("hotel_images", file));

      const url = roomId
        ? `${API_BASE}/api/hotels/${roomId}`
        : `${API_BASE}/api/hotels`;
      const method = roomId ? "PUT" : "POST";

      const res = await fetch(url, { method, body: fd });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || "Server error");
      }

      const data = await res.json();
      setAlert({
        show: true,
        type: "success",
        message: roomId
          ? "Hotel updated successfully!"
          : "Hotel added successfully!",
      });

      setTimeout(() => {
        navigate("/admin/manage-hotels");
      }, 1500);
    } catch (err) {
      console.error(err);
      setAlert({ show: true, type: "error", message: "Error: " + err.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {roomId ? "Edit Hotel" : "Add New Hotel"}
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                {roomId
                  ? "Update hotel details and room information"
                  : "Add a new hotel with room configurations"}
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/manage-hotels")}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 bg-white border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors duration-200 shadow-sm"
            >
              {icons.back}
              Back to Hotels
            </button>
          </div>
        </div>

        {/* Alert */}
        {alert.show && (
          <div
            className={`mb-8 p-4 rounded-xl border ${
              alert.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {alert.type === "success" ? icons.success : icons.error}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{alert.message}</p>
              </div>
              <button
                onClick={() => setAlert({ ...alert, show: false })}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-white/50 transition-colors"
              >
                {icons.close}
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Hotel Information Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Hotel Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Hotel Name *
                  </label>
                  <input
                    type="text"
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="Enter Hotel Name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Address *
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 min-h-24"
                    placeholder="Enter Full Address"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Map Location (Google Maps link)
                  </label>
                  <input
                    type="url"
                    value={mapLink}
                    onChange={(e) => setMapLink(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="https://maps.google.com/..."
                  />
                </div>

                {/* Images Section */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Hotel Images
                  </label>

                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-gray-600">
                        Existing Images:
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {existingImages.map((img, i) => (
                          <div
                            key={i}
                            className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
                          >
                            <img
                              src={
                                img.startsWith("http")
                                  ? img
                                  : `${API_BASE}/uploads/hotels/${img}`
                              }
                              alt={`Hotel ${i + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload New Images */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-600">
                      {roomId ? "Upload Additional Images:" : "Upload Images:"}
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFiles}
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-orange-300"
                    />
                    {images.length > 0 && (
                      <p className="text-sm text-orange-600">
                        {images.length} new image(s) selected for upload
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Rooms Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Room Configuration
                </h2>
                <button
                  type="button"
                  onClick={addRoom}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200"
                >
                  {icons.plus}
                  Add Room
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {rooms.map((r, idx) => (
                  <div
                    key={idx}
                    className="relative p-6 bg-gray-50 rounded-xl border border-gray-200"
                  >
                    <button
                      type="button"
                      onClick={() => deleteRoom(idx)}
                      className="absolute top-4 right-4 p-2 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors duration-200"
                    >
                      {icons.delete}
                    </button>

                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Room {idx + 1}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Room Type *
                        </label>
                        <input
                          type="text"
                          value={r.room_type || ""}
                          onChange={(e) =>
                            updateRoom(idx, "room_type", e.target.value)
                          }
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                          placeholder="e.g. Deluxe Room"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Board Type *
                        </label>
                        <select
                          value={r.board_type || ""}
                          onChange={(e) =>
                            updateRoom(idx, "board_type", e.target.value)
                          }
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white"
                        >
                          <option value="">-- Select Board Type --</option>
                          <option value="RO - Room Only">RO - Room Only</option>
                          <option value="RO - NF (Room Only Non Refundable)">
                            RO - NF (Room Only Non Refundable)
                          </option>
                          <option value="BB - Bed & Breakfast">
                            BB - Bed & Breakfast
                          </option>
                          <option value="HB - Half Board (Breakfast & Lunch or Dinner)">
                            HB - Half Board (Breakfast & Lunch or Dinner)
                          </option>
                          <option value="FB - Full Board (Breakfast & Lunch & Dinner)">
                            FB - Full Board (Breakfast & Lunch & Dinner)
                          </option>
                          <option value="HB LUNCH - Half Board with Lunch Only">
                            HB LUNCH - Half Board with Lunch Only
                          </option>
                          <option value="HB DINNER - Half Board with Dinner Only">
                            HB DINNER - Half Board with Dinner Only
                          </option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Max Guests *
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={r.max_guests || 1}
                          onChange={(e) =>
                            updateRoom(
                              idx,
                              "max_guests",
                              parseInt(e.target.value) || 1
                            )
                          }
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Price per Night (AED) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            AED
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={r.price_per_night || ""}
                            onChange={(e) =>
                              updateRoom(idx, "price_per_night", e.target.value)
                            }
                            required
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Availability *
                        </label>
                        <select
                          value={r.availability || "Available"}
                          onChange={(e) =>
                            updateRoom(idx, "availability", e.target.value)
                          }
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white"
                        >
                          <option value="Available">Available</option>
                          <option value="Booked">Booked</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Description & Facilities Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Additional Information
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Hotel Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 min-h-32"
                  placeholder="Write detailed hotel description..."
                  rows={4}
                />
              </div>

              {/* Facilities */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Hotel Facilities
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    value={facilityInput}
                    onChange={(e) => setFacilityInput(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="Type a facility (e.g., Free Wi-Fi)"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addFacility())
                    }
                  />
                  <button
                    type="button"
                    onClick={addFacility}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors duration-200 font-medium"
                  >
                    {icons.plus}
                    Add Facility
                  </button>
                </div>

                {facilities.length > 0 && (
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-gray-600">
                      Added Facilities:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {facilities.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
                        >
                          <span className="text-sm font-medium text-orange-700">
                            {f}
                          </span>
                          <button
                            type="button"
                            className="p-1 text-rose-600 hover:bg-rose-100 rounded transition-colors duration-200"
                            onClick={() => removeFacility(i)}
                          >
                            {icons.delete}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {roomId ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {roomId ? "Update Hotel" : "Create Hotel"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
