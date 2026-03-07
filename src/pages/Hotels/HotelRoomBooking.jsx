// import { useEffect, useMemo, useState } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import {
//   useLocation,
//   useNavigate,
//   useParams,
//   useSearchParams,
// } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext";
// import { useToast } from "../../hooks/useToast";

// /**
//  * SimpleHotelBooking.jsx
//  *
//  * Notes:
//  * - Normalizes rooms after fetch so each room has numeric max_guests.
//  * - totalGuests coerces to Number and prefers location.state.units first.
//  *
//  * Fixes made:
//  * - Use the route param consistently (destructure id as hotelId).
//  * - Abort fetch on unmount to avoid state updates after the component unmounts.
//  */

// export default function SimpleHotelBooking({ themeColor = "#F17232" }) {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { id: hotelId } = useParams(); // expects route like /booking/:id (canonicalized to "id")

//   // If available, read hotel/room from navigation state (HotelsDetailPage sets this).
//   const hotelFromState = location?.state?.hotel || null;
//   const roomFromState = location?.state?.room || null;

//   // Local state to hold hotel/room when fetched from API or from state
//   const [hotel, setHotel] = useState(hotelFromState);
//   const [room, setRoom] = useState(roomFromState);

//   const [loadingHotel, setLoadingHotel] = useState(false);

//   // Helper: normalize rooms/images/facilities stored as strings in DB
//   const normalizeToArray = (value) => {
//     if (Array.isArray(value)) return value;
//     if (value == null) return [];
//     if (typeof value === "string") {
//       const trimmed = value.trim();
//       if (
//         (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
//         trimmed.startsWith("{")
//       ) {
//         try {
//           const parsed = JSON.parse(trimmed);
//           return Array.isArray(parsed) ? parsed : [];
//         } catch {
//           // ignore JSON parse errors and fall back to comma-split logic
//         }
//       }
//       if (trimmed.includes(",")) {
//         return trimmed
//           .split(",")
//           .map((s) => s.trim())
//           .filter(Boolean);
//       }
//       if (trimmed) return [trimmed];
//       return [];
//     }
//     return [];
//   };

//   // If hotel not provided via navigation state, fetch it from backend by id
//   useEffect(() => {
//     if (hotel || !hotelId) return;

//     const controller = new AbortController();
//     const signal = controller.signal;

//     setLoadingHotel(true);
//     fetch(`http://localhost:5000/api/hotels/${hotelId}`, { signal })
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch hotel");
//         return res.json();
//       })
//       .then((data) => {
//         // parse rooms
//         let parsedRooms = [];
//         if (data.rooms == null) parsedRooms = [];
//         else if (Array.isArray(data.rooms)) parsedRooms = data.rooms;
//         else if (typeof data.rooms === "string") {
//           try {
//             const p = JSON.parse(data.rooms);
//             parsedRooms = Array.isArray(p) ? p : normalizeToArray(data.rooms);
//           } catch {
//             parsedRooms = normalizeToArray(data.rooms);
//           }
//         } else parsedRooms = [];

//         // Normalize each room: ensure max_guests is a Number (handle different keys)
//         const normalizedRooms = parsedRooms.map((raw) => {
//           const r =
//             typeof raw === "string" ? { room_type: raw } : { ...(raw || {}) };
//           const mg =
//             r.max_guests ??
//             r.max ??
//             r.capacity ??
//             r.maxGuests ??
//             r["max-guests"] ??
//             1;
//           const parsedMg = Number(mg) || 1;
//           return {
//             ...r,
//             // canonical numeric property our UI expects:
//             max_guests: parsedMg,
//             // try to canonicalize price field too
//             price_per_night: Number(r.price_per_night ?? r.price ?? 0) || 0,
//           };
//         });

//         // map images if needed (not strictly necessary here)
//         const rawImages = normalizeToArray(data.images);
//         const mappedImages = rawImages
//           .map((img) => {
//             if (!img) return null;
//             const s = String(img).trim();
//             if (s.startsWith("http://") || s.startsWith("https://")) return s;
//             return `http://localhost:5000/uploads/hotels/${s}`;
//           })
//           .filter(Boolean);

//         const hotelObj = {
//           ...data,
//           rooms: normalizedRooms,
//           images: mappedImages,
//         };

//         setHotel(hotelObj);

//         // choose room:
//         // - if location.state.roomIndex provided, use it
//         // - else use first room if exists
//         const requestedRoomIndex =
//           typeof location?.state?.roomIndex === "number"
//             ? location.state.roomIndex
//             : 0;
//         if (normalizedRooms.length > 0) {
//           const chosen =
//             normalizedRooms[requestedRoomIndex] || normalizedRooms[0] || null;
//           setRoom(chosen);
//         } else {
//           setRoom(null);
//         }
//       })
//       .catch((err) => {
//         if (err.name === "AbortError") {
//           // fetch was aborted — no need to log as an application error
//           return;
//         }
//         console.error("Failed to load hotel for booking page:", err);
//       })
//       .finally(() => {
//         // ensure we don't update state after abort
//         if (!signal.aborted) setLoadingHotel(false);
//       });

//     return () => {
//       controller.abort();
//     };
//     // note: include hotel and location.state so we refetch when nav state changes
//   }, [hotelId, hotel, location?.state]);

//   // Compute the room's maximum allowed guests
//   const maxGuests = useMemo(() => {
//     const r = room || roomFromState;
//     const mg = r?.max_guests ?? r?.max ?? r?.capacity ?? r?.maxGuests ?? 1;
//     const parsed = Number(mg);
//     return parsed > 0 ? parsed : 1;
//   }, [room, roomFromState]);

//   // Guests selection (user-adjustable, clamped to maxGuests)
//   const [guests, setGuests] = useState(() => {
//     const fromState = Number(location?.state?.units || 0);
//     return fromState > 0 ? fromState : 1;
//   });

//   useEffect(() => {
//     setGuests((prev) => {
//       if (!maxGuests || maxGuests < 1) return 1;
//       if (prev > maxGuests) return maxGuests;
//       if (prev < 1) return 1;
//       return prev;
//     });
//   }, [maxGuests]);

//   // Form state for non-passenger fields
//   const [form, setForm] = useState({
//     checkIn: location?.state?.checkIn || "",
//     checkOut: location?.state?.checkOut || "",
//     specialRequest: "",
//   });

//   // Passenger templates
//   const emptyLead = {
//     title: "Mr",
//     firstName: "",
//     lastName: "",
//     email: "",
//     nationality: "",
//     countryCode: "+971",
//     phone: "",
//   };
//   const emptyExtra = { title: "Mr", firstName: "", lastName: "" };

//   // Passengers state: regenerate when totalGuests changes
//   const [passengers, setPassengers] = useState(() => {
//     return Array.from({ length: guests }).map((_, i) =>
//       i === 0 ? { ...emptyLead } : { ...emptyExtra }
//     );
//   });

//   // Rebuild passengers array when totalGuests changes (keep existing values where possible)
//   useEffect(() => {
//     setPassengers((prev) => {
//       const next = Array.from({ length: guests }).map((_, i) => {
//         if (i < prev.length) return prev[i];
//         return i === 0 ? { ...emptyLead } : { ...emptyExtra };
//       });
//       return next;
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [guests]);

//   // Prefill lead passenger email with logged-in user's email and lock the field
//   useEffect(() => {
//     if (user?.email) {
//       setPassengers((prev) => {
//         if (!prev || prev.length === 0) return prev;
//         const next = [...prev];
//         next[0] = { ...next[0], email: user.email };
//         return next;
//       });
//     }
//   }, [user?.email]);

//   // Price per night derived from selected room or hotel fallback
//   const pricePerNight = useMemo(() => {
//     const r = room || roomFromState;
//     if (r) return Number(r.price_per_night ?? r.price ?? 0);
//     if (hotel && Array.isArray(hotel.rooms) && hotel.rooms.length) {
//       const rr = hotel.rooms[0];
//       return Number(rr.price_per_night ?? rr.price ?? 0);
//     }
//     return 0;
//   }, [room, roomFromState, hotel]);

//   // Date range state for modern calendar
//   const parseISO = (s) => (s ? new Date(s) : null);
//   const toISO = (d) =>
//     d && !isNaN(d)
//       ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
//           2,
//           "0"
//         )}-${String(d.getDate()).padStart(2, "0")}`
//       : "";
//   const [dateRange, setDateRange] = useState([
//     parseISO(form.checkIn),
//     parseISO(form.checkOut),
//   ]);
//   const [startDate, endDate] = dateRange;

//   const nights = useMemo(() => {
//     if (!form.checkIn || !form.checkOut) return 0;
//     const inDate = new Date(form.checkIn);
//     const outDate = new Date(form.checkOut);
//     const diff = (outDate - inDate) / (1000 * 60 * 60 * 24);
//     return diff > 0 ? Math.floor(diff) : 0;
//   }, [form.checkIn, form.checkOut]);

//   // Pricing breakdown (room charges only; no taxes/fees)
//   const subtotal = useMemo(() => {
//     if (nights > 0) return pricePerNight * nights * Number(guests || 1);
//     return pricePerNight * Number(guests || 1);
//   }, [pricePerNight, nights, guests]);
//   const totalPrice = useMemo(() => subtotal, [subtotal]);

//   // helpers
//   const updatePassenger = (index, key, value) => {
//     setPassengers((prev) => {
//       const next = [...prev];
//       next[index] = { ...next[index], [key]: value };
//       return next;
//     });
//   };
//   const handleChange = (key, value) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const validate = () => {
//     if (!form.checkIn || !form.checkOut) {
//       showToast({
//         type: "warning",
//         message: "Please select check-in and check-out dates.",
//         duration: 2600,
//       });
//       return false;
//     }
//     const lead = passengers[0];
//     if (!lead.firstName || !lead.lastName || !lead.email || !lead.phone) {
//       showToast({
//         type: "warning",
//         message: "Please fill Lead Passenger's full name, email and phone.",
//         duration: 3000,
//       });
//       return false;
//     }
//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailPattern.test(String(lead.email))) {
//       showToast({
//         type: "warning",
//         message: "Please provide a valid email address for the Lead Passenger.",
//         duration: 3000,
//       });
//       return false;
//     }
//     for (let i = 1; i < passengers.length; i++) {
//       const p = passengers[i];
//       if (!p.firstName || !p.lastName) {
//         showToast({
//           type: "warning",
//           message: `Please fill full name for Guest ${i + 1}.`,
//           duration: 2600,
//         });
//         return false;
//       }
//     }
//     return true;
//   };

//   // UI state for submission and modals
//   const [submitting, setSubmitting] = useState(false);
//   const [successOpen, setSuccessOpen] = useState(false);
//   const [termsOpen, setTermsOpen] = useState(false);
//   const [agree, setAgree] = useState(false);
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [paidSuccess, setPaidSuccess] = useState(false);

//   // After Stripe redirect: confirm and save booking
//   useEffect(() => {
//     const success = searchParams.get("success");
//     const sessionId = searchParams.get("session_id");
//     if (success && sessionId) {
//       (async () => {
//         try {
//           const res = await fetch(
//             "http://localhost:5000/api/room-bookings/confirm",
//             {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({ sessionId }),
//             }
//           );
//           const data = await res.json();
//           if (!res.ok || data?.success === false)
//             throw new Error(data?.error || "Confirmation failed");
//           setPaidSuccess(true);
//           setSuccessOpen(true);
//         } catch (err) {
//           console.error("Room confirm failed:", err);
//           showToast({
//             type: "error",
//             message: err.message || "Payment confirmation failed",
//             duration: 3200,
//           });
//         } finally {
//           // clean query params
//           setSearchParams((prev) => {
//             prev.delete("success");
//             prev.delete("session_id");
//             return prev;
//           });
//         }
//       })();
//     }
//   }, [searchParams, setSearchParams, showToast]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!agree) {
//       showToast({
//         type: "warning",
//         message: "Please agree to the Terms & Conditions to continue.",
//         duration: 2800,
//       });
//       return;
//     }
//     if (!validate()) return;

//     const bookingData = {
//       hotel: hotel
//         ? { id: hotel.id ?? hotel._id, name: hotel.hotel_name ?? hotel.name }
//         : hotelFromState
//         ? {
//             id: hotelFromState.id ?? hotelFromState._id,
//             name: hotelFromState.hotel_name ?? hotelFromState.name,
//           }
//         : { id: hotelId || null },
//       room: room
//         ? {
//             type: room.room_type ?? room.roomType,
//             price_per_night: pricePerNight,
//             max_guests: room.max_guests,
//           }
//         : roomFromState
//         ? {
//             type: roomFromState.room_type ?? roomFromState.roomType,
//             price_per_night: pricePerNight,
//             max_guests: roomFromState.max_guests ?? roomFromState.max,
//           }
//         : null,
//       passengers,
//       checkIn: form.checkIn,
//       checkOut: form.checkOut,
//       nights,
//       totalGuests: guests,
//       specialRequest: form.specialRequest,
//       totalPrice,
//     };

//     // Start Stripe checkout
//     setSubmitting(true);
//     fetch("http://localhost:5000/api/room-bookings/checkout-session", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(bookingData),
//     })
//       .then(async (res) => {
//         const data = await res.json().catch(() => ({}));
//         if (!res.ok || data?.success === false || !data?.url) {
//           throw new Error(data?.error || "Failed to start payment");
//         }
//         window.location.href = data.url;
//       })
//       .catch((err) => {
//         console.error("Start payment failed:", err);
//         showToast({
//           type: "error",
//           message: err.message || "Failed to start payment",
//           duration: 3200,
//         });
//       })
//       .finally(() => setSubmitting(false));
//   };

//   if (loadingHotel) {
//     return <p className="text-center mt-20">Loading booking info...</p>;
//   }

//   // If still no hotel/room available, show helpful message
//   if (!hotel && !hotelFromState) {
//     return (
//       <div className="max-w-3xl mx-auto p-4">
//         <h1 className="text-2xl font-bold mb-4">Booking</h1>
//         <div className="bg-white rounded-lg shadow-sm p-6">
//           <p className="text-gray-700 mb-3">
//             No hotel data available. Please open this page from the hotel
//             details.
//           </p>
//           <div className="flex gap-2">
//             <button
//               onClick={() => navigate(-1)}
//               className="px-4 py-2 rounded text-white"
//               style={{ backgroundColor: themeColor }}
//             >
//               Go back
//             </button>
//             <button
//               onClick={() => navigate("/")}
//               className="px-4 py-2 rounded border"
//             >
//               Home
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const hotelName =
//     hotel?.hotel_name ?? hotelFromState?.hotel_name ?? hotelFromState?.name;
//   const roomType =
//     room?.room_type ??
//     roomFromState?.room_type ??
//     roomFromState?.roomType ??
//     (room && (room.roomType || ""));
//   const formatCurrency = (v) =>
//     `AED ${Number(v || 0).toLocaleString("en-IN", {
//       maximumFractionDigits: 2,
//     })}`;

//   // Hotel Summary Card Component
//   const HotelSummaryCard = () => (
//     <div className="rounded-lg shadow-sm border overflow-hidden mb-6 lg:mb-0">
//       <div
//         className="px-4 py-3"
//         style={{ backgroundColor: themeColor, color: "#fff" }}
//       >
//         <div className="text-sm opacity-90">Your Booking</div>
//         <div className="text-lg font-semibold leading-snug">{hotelName}</div>
//         <div className="text-xs opacity-90">{roomType}</div>
//       </div>

//       <div className="p-4 space-y-3 text-sm">
//         <div className="flex items-center justify-between">
//           <span className="text-gray-600">Price per night</span>
//           <span className="font-medium">{formatCurrency(pricePerNight)}</span>
//         </div>
//         <div className="flex items-center justify-between">
//           <span className="text-gray-600">Guests</span>
//           <span className="font-medium">
//             {guests} (max {maxGuests})
//           </span>
//         </div>
//         <div className="flex items-center justify-between">
//           <span className="text-gray-600">Check-in</span>
//           <span className="font-medium">{form.checkIn || "—"}</span>
//         </div>
//         <div className="flex items-center justify-between">
//           <span className="text-gray-600">Check-out</span>
//           <span className="font-medium">{form.checkOut || "—"}</span>
//         </div>
//         <div className="flex items-center justify-between">
//           <span className="text-gray-600">Nights</span>
//           <span className="font-medium">{nights || "—"}</span>
//         </div>

//         <hr className="my-2" />

//         {/* Cost breakdown */}
//         <div className="space-y-1">
//           <div className="flex items-center justify-between">
//             <span className="text-gray-600">
//               Room x {guests}
//               {nights > 0
//                 ? ` x ${nights} night${nights > 1 ? "s" : ""}`
//                 : " (est.)"}
//             </span>
//             <span className="font-medium">{formatCurrency(subtotal)}</span>
//           </div>
//         </div>

//         <div className="flex items-center justify-between pt-2 border-t mt-2">
//           <span className="font-semibold">Total</span>
//           <span className="font-semibold">{formatCurrency(totalPrice)}</span>
//         </div>

//         <div className="text-[11px] text-gray-500 pt-2">
//           Total shows room charges only.
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Hotel Booking</h1>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//         {/* Mobile/Tablet: Hotel Summary Card at the top */}
//         <div className="lg:hidden">
//           <HotelSummaryCard />
//         </div>

//         {/* LEFT: Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="lg:col-span-8 bg-white rounded-lg shadow-sm p-4 space-y-6"
//         >
//           {/* Lead Passenger Details */}
//           <section>
//             <h2 className="font-semibold text-lg mb-3">
//               Lead Passenger Details
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
//               <div className="md:col-span-1">
//                 <label className="block text-xs text-gray-600 mb-1">
//                   Title
//                 </label>
//                 <select
//                   value={passengers[0]?.title || "Mr"}
//                   onChange={(e) => updatePassenger(0, "title", e.target.value)}
//                   className="border border-gray-300 rounded px-2 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
//                 >
//                   <option>Mr</option>
//                   <option>Mrs</option>
//                   <option>Ms</option>
//                 </select>
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-xs text-gray-600 mb-1">
//                   First name *
//                 </label>
//                 <input
//                   type="text"
//                   value={passengers[0]?.firstName || ""}
//                   onChange={(e) =>
//                     updatePassenger(0, "firstName", e.target.value)
//                   }
//                   className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
//                   required
//                 />
//               </div>

//               <div className="md:col-span-3">
//                 <label className="block text-xs text-gray-600 mb-1">
//                   Last name *
//                 </label>
//                 <input
//                   type="text"
//                   value={passengers[0]?.lastName || ""}
//                   onChange={(e) =>
//                     updatePassenger(0, "lastName", e.target.value)
//                   }
//                   className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
//                   required
//                 />
//               </div>

//               <div className="md:col-span-3">
//                 <label className="block text-xs text-gray-600 mb-1">
//                   Email address *
//                 </label>
//                 <input
//                   type="email"
//                   value={user?.email ?? passengers[0]?.email ?? ""}
//                   onChange={(e) => updatePassenger(0, "email", e.target.value)}
//                   disabled={Boolean(user?.email)}
//                   readOnly={Boolean(user?.email)}
//                   className={`border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors ${
//                     user?.email
//                       ? "bg-gray-100 text-gray-700 cursor-not-allowed"
//                       : ""
//                   }`}
//                   required
//                 />
//                 {user?.email && (
//                   <p className="text-[11px] text-gray-500 mt-1">
//                     Prefilled from your account
//                   </p>
//                 )}
//               </div>

//               <div className="md:col-span-3">
//                 <label className="block text-xs text-gray-600 mb-1">
//                   Nationality
//                 </label>
//                 <input
//                   type="text"
//                   value={passengers[0]?.nationality || ""}
//                   onChange={(e) =>
//                     updatePassenger(0, "nationality", e.target.value)
//                   }
//                   placeholder="Country name"
//                   className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-xs text-gray-600 mb-1">
//                   Country code
//                 </label>
//                 <input
//                   type="text"
//                   value={passengers[0]?.countryCode || "+971"}
//                   onChange={(e) =>
//                     updatePassenger(0, "countryCode", e.target.value)
//                   }
//                   placeholder="+971"
//                   className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
//                 />
//               </div>

//               <div className="md:col-span-4">
//                 <label className="block text-xs text-gray-600 mb-1">
//                   Phone number *
//                 </label>
//                 <input
//                   type="tel"
//                   value={passengers[0]?.phone || ""}
//                   onChange={(e) => updatePassenger(0, "phone", e.target.value)}
//                   placeholder="e.g. 501234567"
//                   className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
//                   required
//                 />
//               </div>
//             </div>
//           </section>

//           {/* Dates (modern calendar with range selection) */}
//           <section>
//             <h2 className="font-semibold text-lg mb-3">Stay Dates</h2>
//             <div>
//               <label className="block text-xs text-gray-600 mb-1">
//                 Select your dates *
//               </label>
//               <DatePicker
//                 selectsRange
//                 startDate={startDate}
//                 endDate={endDate}
//                 onChange={(update) => {
//                   const [start, end] = update;
//                   setDateRange([start, end]);
//                   setForm((prev) => ({
//                     ...prev,
//                     checkIn: start ? toISO(start) : "",
//                     checkOut: end ? toISO(end) : "",
//                   }));
//                 }}
//                 minDate={new Date()}
//                 calendarClassName="gtg-datepicker"
//                 dateFormat="dd MMM, yyyy"
//                 placeholderText="Check-in — Check-out"
//                 className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
//               />
//               <div className="text-xs text-gray-500 mt-2">
//                 {startDate && !endDate && "Select a check-out date"}
//                 {startDate &&
//                   endDate &&
//                   `${toISO(startDate)} → ${toISO(endDate)} (${nights} night${
//                     nights !== 1 ? "s" : ""
//                   })`}
//                 {!startDate && !endDate && "Choose check-in and check-out"}
//               </div>
//             </div>
//           </section>

//           {/* Guests selection */}
//           <section>
//             <h2 className="font-semibold text-lg mb-3">Guests</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
//               <div>
//                 <label className="block text-xs text-gray-600 mb-1">
//                   Number of guests (max {maxGuests})
//                 </label>
//                 <select
//                   value={guests}
//                   onChange={(e) =>
//                     setGuests(
//                       Math.min(
//                         Math.max(1, Number(e.target.value) || 1),
//                         maxGuests
//                       )
//                     )
//                   }
//                   className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
//                 >
//                   {Array.from({ length: maxGuests }).map((_, i) => {
//                     const n = i + 1;
//                     return (
//                       <option key={n} value={n}>
//                         {n} Guest{n > 1 ? "s" : ""}
//                       </option>
//                     );
//                   })}
//                 </select>
//               </div>
//               <div className="text-xs text-gray-500 md:col-span-2">
//                 Your selected room allows up to {maxGuests} guest
//                 {maxGuests > 1 ? "s" : ""}. We'll collect details for each guest
//                 below.
//               </div>
//             </div>
//           </section>

//           {/* Special requests */}
//           <section>
//             <label className="block text-xs text-gray-600 mb-1">
//               Special request (optional)
//             </label>
//             <textarea
//               value={form.specialRequest}
//               onChange={(e) => handleChange("specialRequest", e.target.value)}
//               className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
//               rows={3}
//               placeholder="Any special requests (e.g., early check-in, high floor)"
//             />
//           </section>

//           {/* Extra Details (other guests) */}
//           {guests > 1 && (
//             <section>
//               <h2 className="font-semibold text-lg mb-3">Extra Details</h2>
//               <div className="space-y-4">
//                 {passengers.slice(1).map((p, idx) => {
//                   const passengerIndex = idx + 1; // actual index in passengers
//                   return (
//                     <div key={idx} className="border rounded p-3">
//                       <div className="text-sm font-medium mb-2">
//                         Guest {passengerIndex + 1}
//                       </div>
//                       <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
//                         <div className="md:col-span-1">
//                           <label className="block text-xs text-gray-600 mb-1">
//                             Title
//                           </label>
//                           <select
//                             value={p.title}
//                             onChange={(e) =>
//                               updatePassenger(
//                                 passengerIndex,
//                                 "title",
//                                 e.target.value
//                               )
//                             }
//                             className="border border-gray-300 rounded px-2 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
//                           >
//                             <option>Mr</option>
//                             <option>Mrs</option>
//                             <option>Ms</option>
//                           </select>
//                         </div>
//                         <div className="md:col-span-2">
//                           <label className="block text-xs text-gray-600 mb-1">
//                             First name *
//                           </label>
//                           <input
//                             type="text"
//                             value={p.firstName}
//                             onChange={(e) =>
//                               updatePassenger(
//                                 passengerIndex,
//                                 "firstName",
//                                 e.target.value
//                               )
//                             }
//                             className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
//                             required
//                           />
//                         </div>
//                         <div className="md:col-span-3">
//                           <label className="block text-xs text-gray-600 mb-1">
//                             Last name *
//                           </label>
//                           <input
//                             type="text"
//                             value={p.lastName}
//                             onChange={(e) =>
//                               updatePassenger(
//                                 passengerIndex,
//                                 "lastName",
//                                 e.target.value
//                               )
//                             }
//                             className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
//                             required
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </section>
//           )}

//           {/* Terms & Conditions consent */}
//           <div className="pt-2">
//             <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer select-none">
//               <input
//                 type="checkbox"
//                 checked={agree}
//                 onChange={(e) => setAgree(e.target.checked)}
//                 className="mt-0.5 h-4 w-4 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-200 text-orange-600"
//               />
//               <span>
//                 By clicking <span className="font-semibold">Pay Now</span>, you
//                 confirm you've read and agree to our{" "}
//                 <button
//                   type="button"
//                   onClick={() => setTermsOpen(true)}
//                   className="underline text-orange-600 hover:text-orange-700"
//                 >
//                   Terms & Conditions
//                 </button>
//                 .
//               </span>
//             </label>
//           </div>

//           {/* Submit */}
//           <div className="pt-3">
//             <button
//               type="submit"
//               disabled={!agree || submitting}
//               className={`w-full py-3 rounded text-white font-semibold ${
//                 !agree || submitting ? "opacity-80 cursor-not-allowed" : ""
//               }`}
//               style={{ backgroundColor: themeColor }}
//             >
//               {submitting ? "Submitting..." : "Pay Now"}
//             </button>
//           </div>
//         </form>

//         {/* RIGHT: Invoice / Summary Card - Desktop only */}
//         <aside className="hidden lg:block lg:col-span-4">
//           <div className="lg:sticky lg:top-4">
//             <HotelSummaryCard />
//           </div>
//         </aside>
//       </div>

//       {/* Terms & Conditions Modal */}
//       {termsOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//           <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full overflow-hidden">
//             <div
//               className="px-5 py-4 text-white flex items-center justify-between"
//               style={{ backgroundColor: themeColor }}
//             >
//               <div className="font-semibold">General Terms and Conditions</div>
//               <button
//                 onClick={() => setTermsOpen(false)}
//                 className="text-white/90 hover:text-white"
//               >
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                   <path
//                     d="M6 6l12 12M18 6L6 18"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                   />
//                 </svg>
//               </button>
//             </div>
//             <div className="p-5 text-sm text-gray-800 max-h-[70vh] overflow-y-auto leading-relaxed space-y-4">
//               <p>
//                 <strong>HOLIDAY PACKAGES</strong>
//                 <br />
//                 Our holiday packages are subject to the following terms and
//                 conditions. In fact, you (clients or guests) agree to be bound
//                 by these contractual conditions upon booking a holiday package
//                 through us. We, therefore, strongly recommend you to carefully
//                 read and understand the below points before you make a booking
//                 of holiday package with us.
//               </p>
//               <div>
//                 <p className="font-semibold">1. OUR HOLIDAY PACKAGES CONCEPT</p>
//                 <p>
//                   Each of our holiday packages is a combination of two or more
//                   of our travel services. This mainly includes:
//                 </p>
//                 <ul className="list-disc pl-5 space-y-1">
//                   <li>Roundtrip Airport Transfers</li>
//                   <li>Accommodation in a hotel or resort of guest's choice</li>
//                   <li>Sightseeing tours</li>
//                   <li>
//                     Dinner cruises, safaris, shopping tours and other activities
//                   </li>
//                 </ul>
//               </div>
//               <div>
//                 <p className="font-semibold">2. BOOKING TERMS</p>
//                 <p>
//                   By making a booking, the Client / Guest (hereafter used with
//                   appendices such as 'You' and 'Your') explicitly agrees to
//                   completely comprehend and accept the company's Terms and
//                   Conditions (hereafter used with appendices such as 'We', 'Us'
//                   and 'Our'). This agreement will come into effect as soon as
//                   your holiday package booking is confirmed and you make the
//                   payment. We may, in our discretion, amend or update the terms
//                   of this Agreement from time to time. We, therefore, request
//                   our clients and other interested parties to visit our website
//                   from time to time and review our terms and conditions´ most
//                   up-to-date versi
//                 </p>
//               </div>
//               <div>
//                 <p className="font-semibold">3. PRICING & PAYMENT CONDITIONS</p>
//                 <p>
//                   Your holiday package comes with an upfront rate. The price you
//                   pay normally covers:
//                 </p>
//                 <ul className="list-disc pl-5 space-y-1">
//                   <li>
//                     Charges of all accommodations, activities and transfers
//                     included in your chosen package.
//                   </li>
//                   <li>
//                     Taxes or other mandatory service charges as imposed by the
//                     government
//                   </li>
//                   <li>
//                     Your holiday package may contain services by third party
//                     suppliers (mainly accommodation, airline tickets etc).
//                   </li>
//                 </ul>
//                 <p>
//                   All holiday packages' rates and pricing quoted on our website,
//                   brochure etc, are subject to vary at any time. Al though this
//                   price change is not applicable for already confirmed bookings,
//                   we hold the complete right to alter rates of confirmed
//                   bookings, provided the reason behind the price change is
//                   unavoidable, such as the renewal of government tax policy or
//                   fluctuation in currency rates.
//                 </p>
//               </div>
//               <div>
//                 <p className="font-semibold">4. TRAVEL FORMALITIES</p>
//                 <p>
//                   It's your sole responsibility to ensure that you duly comply
//                   with all travel formalities of the place that you're planning
//                   to visit. We can only give you an overview or general
//                   information of the place you visit. So inquire about all
//                   travel essentials (with the respective Consulate or Embassy)
//                   prior to your travel and make sure that you fulfill visa
//                   requirements, meet all health criteria (as set forth by the
//                   destination) and carry a valid passport.
//                 </p>
//               </div>
//               <div>
//                 <p className="font-semibold">
//                   5. AMENDMENTS & CANCELLATIONS BY GUESTS
//                 </p>
//                 <p>
//                   Should you wish to make any amendment or cancellation of your
//                   confirmed holiday package booking, you can do so in writing
//                   only by forwarding us an email (with all relevant details)
//                   during our business hours. Any request arrived after this time
//                   will be considered as having received on the following working
//                   day. A confirmation email will be sent to you as soon as we're
//                   in receipt of your cancellation or amendment request. If you
//                   do not receive this email, you've to notify us at the
//                   earliest, or else, this may cause us to cancel your refund
//                   claim and subsequently charge you for a non-arrival.
//                 </p>
//               </div>
//               <div>
//                 <p className="font-semibold">
//                   6. AMENDMENTS & CANCELLATIONS BY Rayna Tours
//                 </p>
//                 <p>
//                   It's unlikely that we make changes or cancellation of a part
//                   or whole of your package. But if such a situation transpires,
//                   we shall notify you in writing about any change along with the
//                   resulting rate variations. In rare instance if we've to cancel
//                   your booking, we will take reasonable steps to make full or
//                   partial refund of your booking payment. With third party
//                   services included in most packages, we should not be held
//                   liable for any cancellation or alteration of bookings made via
//                   third party suppliers. Refund, however, will be made for the
//                   cancellation of only those bookings: Wherein we have received
//                   full payment; Eligible for the refund as per the terms and
//                   conditions. We shall not be held responsible for any
//                   cancellation or change in holiday program due to any
//                   unpredictable causes or reasons beyond our control, such as
//                   force de majeure, strikes, change of government laws, and
//                   certain third party actions.
//                 </p>
//               </div>
//               <div>
//                 <p className="font-semibold">7. LIABILITY & EXCLUSIONS</p>
//                 <p>
//                   Our entity, its partners or suppliers do not represent that
//                   the materials provided on this website is perfect,
//                   comprehensive, or up to date. While it is true that we make
//                   constant effort to ensure the accurateness of its content, the
//                   website may contain certain imprecision and errors. We
//                   disclaim all warranties pertaining to the information,
//                   software, and service packages listed on this website. This
//                   covers every implied and express contract of non-encroachment
//                   and merchantability. We do not guarantee that the products or
//                   service packages made available through this website is free
//                   of any mistake or virus and would fulfill your needs.
//                   Nevertheless, by employing latest technological innovations,
//                   we strive to assure you of a safe and unperturbed booking
//                   experience with us. To the maximum extent permissible under
//                   the applicable law, our company or any of its employees,
//                   agents, or managers will not be liable for any kind of damages
//                   or loss as part of the use or availing of any product or
//                   services provided through this website. This is applicable to
//                   damages of all nature, such as express, implied, compensatory,
//                   property damage, and third party claims.
//                 </p>
//               </div>
//               <div>
//                 <p className="font-semibold">
//                   8. GOVERNING LAW AND JURISDICTION
//                 </p>
//                 <p>
//                   Everything pertaining to this Agreement shall be governed by
//                   the laws of the respective jurisdiction (where the contract
//                   was signed or originated).
//                 </p>
//               </div>
//               <div>
//                 <p className="font-semibold">9. COMPLAINTS</p>
//                 <p>
//                   You shall direct us any complaint related to the booking of
//                   our products and services only. In the case of third party
//                   services, you may report your complaint directly to the
//                   respective supplier with a copy of the same to our company
//                   Email ID. But, we shall not cater to any complaint that is not
//                   notified to us at the time of the service.
//                 </p>
//               </div>
//             </div>
//             <div className="px-5 py-3 flex items-center justify-end gap-2">
//               <button
//                 onClick={() => setTermsOpen(false)}
//                 className="px-4 py-2 rounded border border-gray-300"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={() => {
//                   setTermsOpen(false);
//                   setAgree(true);
//                 }}
//                 className="px-4 py-2 rounded text-white"
//                 style={{ backgroundColor: themeColor }}
//               >
//                 I Agree
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Success Popup */}
//       {successOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//           <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
//             <div
//               className="px-5 py-4 text-white"
//               style={{ backgroundColor: themeColor }}
//             >
//               <div className="flex items-center gap-2">
//                 <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
//                   <path
//                     d="M20 6L9 17L4 12"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//                 <div className="font-semibold">
//                   {paidSuccess
//                     ? "Payment successful"
//                     : "Booking request submitted"}
//                 </div>
//               </div>
//             </div>
//             <div className="p-5 text-sm text-gray-700 space-y-3">
//               {paidSuccess ? (
//                 <p>
//                   Thank you! Your payment for{" "}
//                   <span className="font-medium">{hotelName}</span>
//                   {roomType ? <> ({roomType})</> : null} was successful. A
//                   confirmation email has been sent.
//                 </p>
//               ) : (
//                 <p>
//                   Thank you! We've received your booking details for{" "}
//                   <span className="font-medium">{hotelName}</span>
//                   {roomType ? <> ({roomType})</> : null}. We'll contact you
//                   shortly to confirm your stay.
//                 </p>
//               )}
//               <div className="bg-gray-50 rounded-md p-3 space-y-1">
//                 <div className="flex justify-between">
//                   <span>Dates</span>
//                   <span>
//                     {form.checkIn || "—"} → {form.checkOut || "—"}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Guests</span>
//                   <span>{guests}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Total</span>
//                   <span className="font-semibold">
//                     {formatCurrency(totalPrice)}
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <div className="px-5 pb-5 flex items-center justify-end gap-2">
//               <button
//                 onClick={() => setSuccessOpen(false)}
//                 className="px-4 py-2 rounded border border-gray-300"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={() => {
//                   setSuccessOpen(
//                     false
//                   ); /* navigate to home or dashboard if desired */
//                 }}
//                 className="px-4 py-2 rounded text-white"
//                 style={{ backgroundColor: themeColor }}
//               >
//                 {paidSuccess ? "Done" : "Done"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import { useToast } from "../../hooks/useToast";

/**
 * SimpleHotelBooking.jsx
 *
 * Notes:
 * - Normalizes rooms after fetch so each room has numeric max_guests.
 * - totalGuests coerces to Number and prefers location.state.units first.
 *
 * Fixes made:
 * - Use the route param consistently (destructure id as hotelId).
 * - Abort fetch on unmount to avoid state updates after the component unmounts.
 * - Persist booking summary in localStorage before Stripe redirect to restore after page reload.
 * - Restore summary from localStorage in success useEffect for popup display.
 * - Clear localStorage after successful confirmation.
 */

export default function SimpleHotelBooking({ themeColor = "#F17232" }) {
  const API_URL = import.meta.env.VITE_API_URL;

  const { user } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { id: hotelId } = useParams(); // expects route like /booking/:id (canonicalized to "id")

  // If available, read hotel/room from navigation state (HotelsDetailPage sets this).
  const hotelFromState = location?.state?.hotel || null;
  const roomFromState = location?.state?.room || null;

  // Local state to hold hotel/room when fetched from API or from state
  const [hotel, setHotel] = useState(hotelFromState);
  const [room, setRoom] = useState(roomFromState);

  const [loadingHotel, setLoadingHotel] = useState(false);
  const { convertAndFormat } = useCurrency();

  // State for restored booking summary after Stripe redirect
  const [bookingSummary, setBookingSummary] = useState(null);

  // Helper: normalize rooms/images/facilities stored as strings in DB
  const normalizeToArray = (value) => {
    if (Array.isArray(value)) return value;
    if (value == null) return [];
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (
        (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
        trimmed.startsWith("{")
      ) {
        try {
          const parsed = JSON.parse(trimmed);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          // ignore JSON parse errors and fall back to comma-split logic
        }
      }
      if (trimmed.includes(",")) {
        return trimmed
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      if (trimmed) return [trimmed];
      return [];
    }
    return [];
  };

  // If hotel not provided via navigation state, fetch it from backend by id
  useEffect(() => {
    if (hotel || !hotelId) return;

    const controller = new AbortController();
    const signal = controller.signal;

    setLoadingHotel(true);
    fetch(`${API_URL}/api/hotels/${hotelId}`, { signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch hotel");
        return res.json();
      })
      .then((data) => {
        // parse rooms
        let parsedRooms = [];
        if (data.rooms == null) parsedRooms = [];
        else if (Array.isArray(data.rooms)) parsedRooms = data.rooms;
        else if (typeof data.rooms === "string") {
          try {
            const p = JSON.parse(data.rooms);
            parsedRooms = Array.isArray(p) ? p : normalizeToArray(data.rooms);
          } catch {
            parsedRooms = normalizeToArray(data.rooms);
          }
        } else parsedRooms = [];

        // Normalize each room: ensure max_guests is a Number (handle different keys)
        const normalizedRooms = parsedRooms.map((raw) => {
          const r =
            typeof raw === "string" ? { room_type: raw } : { ...(raw || {}) };
          const mg =
            r.max_guests ??
            r.max ??
            r.capacity ??
            r.maxGuests ??
            r["max-guests"] ??
            1;
          const parsedMg = Number(mg) || 1;
          return {
            ...r,
            // canonical numeric property our UI expects:
            max_guests: parsedMg,
            // try to canonicalize price field too
            price_per_night: Number(r.price_per_night ?? r.price ?? 0) || 0,
          };
        });

        // map images if needed (not strictly necessary here)
        const rawImages = normalizeToArray(data.images);
        const mappedImages = rawImages
          .map((img) => {
            if (!img) return null;
            const s = String(img).trim();
            if (s.startsWith("http://") || s.startsWith("https://")) return s;
            return `${API_URL}/uploads/hotels/${s}`;
          })
          .filter(Boolean);

        const hotelObj = {
          ...data,
          rooms: normalizedRooms,
          images: mappedImages,
        };

        setHotel(hotelObj);

        // choose room:
        // - if location.state.roomIndex provided, use it
        // - else use first room if exists
        const requestedRoomIndex =
          typeof location?.state?.roomIndex === "number"
            ? location.state.roomIndex
            : 0;
        if (normalizedRooms.length > 0) {
          const chosen =
            normalizedRooms[requestedRoomIndex] || normalizedRooms[0] || null;
          setRoom(chosen);
        } else {
          setRoom(null);
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          // fetch was aborted — no need to log as an application error
          return;
        }
        console.error("Failed to load hotel for booking page:", err);
      })
      .finally(() => {
        // ensure we don't update state after abort
        if (!signal.aborted) setLoadingHotel(false);
      });

    return () => {
      controller.abort();
    };
    // note: include hotel and location.state so we refetch when nav state changes
  }, [hotelId, hotel, location?.state]);

  // Compute the room's maximum allowed guests
  const maxGuests = useMemo(() => {
    const r = room || roomFromState;
    const mg = r?.max_guests ?? r?.max ?? r?.capacity ?? r?.maxGuests ?? 1;
    const parsed = Number(mg);
    return parsed > 0 ? parsed : 1;
  }, [room, roomFromState]);

  // Guests selection (user-adjustable, clamped to maxGuests)
  const [guests, setGuests] = useState(() => {
    const fromState = Number(location?.state?.units || 0);
    return fromState > 0 ? fromState : 1;
  });

  useEffect(() => {
    setGuests((prev) => {
      if (!maxGuests || maxGuests < 1) return 1;
      if (prev > maxGuests) return maxGuests;
      if (prev < 1) return 1;
      return prev;
    });
  }, [maxGuests]);

  // Form state for non-passenger fields
  const [form, setForm] = useState({
    checkIn: location?.state?.checkIn || "",
    checkOut: location?.state?.checkOut || "",
    specialRequest: "",
  });

  // Passenger templates
  const emptyLead = {
    title: "Mr",
    firstName: "",
    lastName: "",
    email: "",
    nationality: "",
    countryCode: "+971",
    phone: "",
  };
  const emptyExtra = { title: "Mr", firstName: "", lastName: "" };

  // Passengers state: regenerate when totalGuests changes
  const [passengers, setPassengers] = useState(() => {
    return Array.from({ length: guests }).map((_, i) =>
      i === 0 ? { ...emptyLead } : { ...emptyExtra }
    );
  });

  // Rebuild passengers array when totalGuests changes (keep existing values where possible)
  useEffect(() => {
    setPassengers((prev) => {
      const next = Array.from({ length: guests }).map((_, i) => {
        if (i < prev.length) return prev[i];
        return i === 0 ? { ...emptyLead } : { ...emptyExtra };
      });
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guests]);

  // Prefill lead passenger email with logged-in user's email and lock the field
  useEffect(() => {
    if (user?.email) {
      setPassengers((prev) => {
        if (!prev || prev.length === 0) return prev;
        const next = [...prev];
        next[0] = { ...next[0], email: user.email };
        return next;
      });
    }
  }, [user?.email]);

  // Price per night derived from selected room or hotel fallback
  const pricePerNight = useMemo(() => {
    const r = room || roomFromState;
    if (r) return Number(r.price_per_night ?? r.price ?? 0);
    if (hotel && Array.isArray(hotel.rooms) && hotel.rooms.length) {
      const rr = hotel.rooms[0];
      return Number(rr.price_per_night ?? rr.price ?? 0);
    }
    return 0;
  }, [room, roomFromState, hotel]);

  // Date range state for modern calendar
  const parseISO = (s) => (s ? new Date(s) : null);
  const toISO = (d) =>
    d && !isNaN(d)
      ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(d.getDate()).padStart(2, "0")}`
      : "";
  const [dateRange, setDateRange] = useState([
    parseISO(form.checkIn),
    parseISO(form.checkOut),
  ]);
  const [startDate, endDate] = dateRange;

  const nights = useMemo(() => {
    if (!form.checkIn || !form.checkOut) return 0;
    const inDate = new Date(form.checkIn);
    const outDate = new Date(form.checkOut);
    const diff = (outDate - inDate) / (1000 * 60 * 60 * 24);
    return diff > 0 ? Math.floor(diff) : 0;
  }, [form.checkIn, form.checkOut]);

  // Pricing breakdown (room charges only; no taxes/fees)
  const subtotal = useMemo(() => {
    if (nights > 0) return pricePerNight * nights * Number(guests || 1);
    return pricePerNight * Number(guests || 1);
  }, [pricePerNight, nights, guests]);
  const totalPrice = useMemo(() => subtotal, [subtotal]);

  // helpers
  const updatePassenger = (index, key, value) => {
    setPassengers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    if (!form.checkIn || !form.checkOut) {
      showToast({
        type: "warning",
        message: "Please select check-in and check-out dates.",
        duration: 2600,
      });
      return false;
    }
    const lead = passengers[0];
    if (!lead.firstName || !lead.lastName || !lead.email || !lead.phone) {
      showToast({
        type: "warning",
        message: "Please fill Lead Passenger's full name, email and phone.",
        duration: 3000,
      });
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(String(lead.email))) {
      showToast({
        type: "warning",
        message: "Please provide a valid email address for the Lead Passenger.",
        duration: 3000,
      });
      return false;
    }
    for (let i = 1; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.firstName || !p.lastName) {
        showToast({
          type: "warning",
          message: `Please fill full name for Guest ${i + 1}.`,
          duration: 2600,
        });
        return false;
      }
    }
    return true;
  };

  // UI state for submission and modals
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [agree, setAgree] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [paidSuccess, setPaidSuccess] = useState(false);

  // After Stripe redirect: confirm and save booking, restore summary from localStorage
  useEffect(() => {
    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id");
    if (success && sessionId) {
      // Restore booking summary from localStorage
      const savedSummary = localStorage.getItem("bookingSummary");
      if (savedSummary) {
        try {
          setBookingSummary(JSON.parse(savedSummary));
        } catch (err) {
          console.error("Failed to parse saved booking summary:", err);
        }
      }

      (async () => {
        try {
          const res = await fetch(`${API_URL}/api/room-bookings/confirm`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          });
          const data = await res.json();
          if (!res.ok || data?.success === false)
            throw new Error(data?.error || "Confirmation failed");
          setPaidSuccess(true);
          setSuccessOpen(true);
          // Clear localStorage after successful confirmation
          localStorage.removeItem("bookingSummary");
        } catch (err) {
          console.error("Room confirm failed:", err);
          showToast({
            type: "error",
            message: err.message || "Payment confirmation failed",
            duration: 3200,
          });
        } finally {
          // clean query params
          setSearchParams((prev) => {
            prev.delete("success");
            prev.delete("session_id");
            return prev;
          });
        }
      })();
    }
  }, [searchParams, setSearchParams, showToast, API_URL]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agree) {
      showToast({
        type: "warning",
        message: "Please agree to the Terms & Conditions to continue.",
        duration: 2800,
      });
      return;
    }
    if (!validate()) return;

    const hotelName =
      hotel?.hotel_name ?? hotelFromState?.hotel_name ?? hotelFromState?.name;
    const roomType =
      room?.room_type ??
      roomFromState?.room_type ??
      roomFromState?.roomType ??
      (room && (room.roomType || ""));
    const summary = {
      hotelName,
      roomType,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      guests,
      totalPrice,
    };
    // Save summary to localStorage before redirect
    localStorage.setItem("bookingSummary", JSON.stringify(summary));

    const bookingData = {
      hotel: hotel
        ? { id: hotel.id ?? hotel._id, name: hotel.hotel_name ?? hotel.name }
        : hotelFromState
        ? {
            id: hotelFromState.id ?? hotelFromState._id,
            name: hotelFromState.hotel_name ?? hotelFromState.name,
          }
        : { id: hotelId || null },
      room: room
        ? {
            type: room.room_type ?? room.roomType,
            price_per_night: pricePerNight,
            max_guests: room.max_guests,
          }
        : roomFromState
        ? {
            type: roomFromState.room_type ?? roomFromState.roomType,
            price_per_night: pricePerNight,
            max_guests: roomFromState.max_guests ?? roomFromState.max,
          }
        : null,
      passengers,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      nights,
      totalGuests: guests,
      specialRequest: form.specialRequest,
      totalPrice,
      // Additional details for Stripe metadata/line items (backend can use these)
      metadata: {
        hotelName,
        roomType,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests,
        nights,
      },
    };

    // Start Stripe checkout
    setSubmitting(true);
    fetch(`${API_URL}/api/room-bookings/checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data?.success === false || !data?.url) {
          throw new Error(data?.error || "Failed to start payment");
        }
        window.location.href = data.url;
      })
      .catch((err) => {
        console.error("Start payment failed:", err);
        showToast({
          type: "error",
          message: err.message || "Failed to start payment",
          duration: 3200,
        });
        // Clear localStorage on error
        localStorage.removeItem("bookingSummary");
      })
      .finally(() => setSubmitting(false));
  };

  if (loadingHotel) {
    return <p className="text-center mt-20">Loading booking info...</p>;
  }

  // If still no hotel/room available, show helpful message
  if (!hotel && !hotelFromState) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Booking</h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-700 mb-3">
            No hotel data available. Please open this page from the hotel
            details.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded text-white"
              style={{ backgroundColor: themeColor }}
            >
              Go back
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 rounded border"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const hotelName =
    hotel?.hotel_name ?? hotelFromState?.hotel_name ?? hotelFromState?.name;
  const roomType =
    room?.room_type ??
    roomFromState?.room_type ??
    roomFromState?.roomType ??
    (room && (room.roomType || ""));
  const formatCurrency = (v) => convertAndFormat(v);

  // Use bookingSummary for popup if available, fallback to current state
  const popupCheckIn = bookingSummary?.checkIn || form.checkIn;
  const popupCheckOut = bookingSummary?.checkOut || form.checkOut;
  const popupGuests = bookingSummary?.guests || guests;
  const popupTotal = bookingSummary?.totalPrice || totalPrice;
  const popupHotelName = bookingSummary?.hotelName || hotelName;
  const popupRoomType = bookingSummary?.roomType || roomType;

  // Hotel Summary Card Component
  const HotelSummaryCard = () => (
    <div className="rounded-lg shadow-sm border overflow-hidden mb-6 lg:mb-0">
      <div
        className="px-4 py-3"
        style={{ backgroundColor: themeColor, color: "#fff" }}
      >
        <div className="text-sm opacity-90">Your Booking</div>
        <div className="text-lg font-semibold leading-snug">{hotelName}</div>
        <div className="text-xs opacity-90">{roomType}</div>
      </div>

      <div className="p-4 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Price per night</span>
          <span className="font-medium">{formatCurrency(pricePerNight)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Guests</span>
          <span className="font-medium">
            {guests} (max {maxGuests})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Check-in</span>
          <span className="font-medium">{form.checkIn || "—"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Check-out</span>
          <span className="font-medium">{form.checkOut || "—"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Nights</span>
          <span className="font-medium">{nights || "—"}</span>
        </div>

        <hr className="my-2" />

        {/* Cost breakdown */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">
              Room x {guests}
              {nights > 0
                ? ` x ${nights} night${nights > 1 ? "s" : ""}`
                : " (est.)"}
            </span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t mt-2">
          <span className="font-semibold">Total</span>
          <span className="font-semibold">{formatCurrency(totalPrice)}</span>
        </div>

        <div className="text-[11px] text-gray-500 pt-2">
          Total shows room charges only.
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hotel Booking</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mobile/Tablet: Hotel Summary Card at the top */}
        <div className="lg:hidden">
          <HotelSummaryCard />
        </div>

        {/* LEFT: Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-8 bg-white rounded-lg shadow-sm p-4 space-y-6"
        >
          {/* Lead Passenger Details */}
          <section>
            <h2 className="font-semibold text-lg mb-3">
              Lead Passenger Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <div className="md:col-span-1">
                <label className="block text-xs text-gray-600 mb-1">
                  Title
                </label>
                <select
                  value={passengers[0]?.title || "Mr"}
                  onChange={(e) => updatePassenger(0, "title", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                >
                  <option>Mr</option>
                  <option>Mrs</option>
                  <option>Ms</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs text-gray-600 mb-1">
                  First name *
                </label>
                <input
                  type="text"
                  value={passengers[0]?.firstName || ""}
                  onChange={(e) =>
                    updatePassenger(0, "firstName", e.target.value)
                  }
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                  required
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs text-gray-600 mb-1">
                  Last name *
                </label>
                <input
                  type="text"
                  value={passengers[0]?.lastName || ""}
                  onChange={(e) =>
                    updatePassenger(0, "lastName", e.target.value)
                  }
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                  required
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs text-gray-600 mb-1">
                  Email address *
                </label>
                <input
                  type="email"
                  value={user?.email ?? passengers[0]?.email ?? ""}
                  onChange={(e) => updatePassenger(0, "email", e.target.value)}
                  disabled={Boolean(user?.email)}
                  readOnly={Boolean(user?.email)}
                  className={`border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors ${
                    user?.email
                      ? "bg-gray-100 text-gray-700 cursor-not-allowed"
                      : ""
                  }`}
                  required
                />
                {user?.email && (
                  <p className="text-[11px] text-gray-500 mt-1">
                    Prefilled from your account
                  </p>
                )}
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs text-gray-600 mb-1">
                  Nationality
                </label>
                <input
                  type="text"
                  value={passengers[0]?.nationality || ""}
                  onChange={(e) =>
                    updatePassenger(0, "nationality", e.target.value)
                  }
                  placeholder="Country name"
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs text-gray-600 mb-1">
                  Country code
                </label>
                <input
                  type="text"
                  value={passengers[0]?.countryCode || "+971"}
                  onChange={(e) =>
                    updatePassenger(0, "countryCode", e.target.value)
                  }
                  placeholder="+971"
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs text-gray-600 mb-1">
                  Phone number *
                </label>
                <input
                  type="tel"
                  value={passengers[0]?.phone || ""}
                  onChange={(e) => updatePassenger(0, "phone", e.target.value)}
                  placeholder="e.g. 501234567"
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                  required
                />
              </div>
            </div>
          </section>

          {/* Dates (modern calendar with range selection) */}
          <section>
            <h2 className="font-semibold text-lg mb-3">Stay Dates</h2>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Select your dates *
              </label>
              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  const [start, end] = update;
                  setDateRange([start, end]);
                  setForm((prev) => ({
                    ...prev,
                    checkIn: start ? toISO(start) : "",
                    checkOut: end ? toISO(end) : "",
                  }));
                }}
                minDate={new Date()}
                calendarClassName="gtg-datepicker"
                dateFormat="dd MMM, yyyy"
                placeholderText="Check-in — Check-out"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
              />
              <div className="text-xs text-gray-500 mt-2">
                {startDate && !endDate && "Select a check-out date"}
                {startDate &&
                  endDate &&
                  `${toISO(startDate)} → ${toISO(endDate)} (${nights} night${
                    nights !== 1 ? "s" : ""
                  })`}
                {!startDate && !endDate && "Choose check-in and check-out"}
              </div>
            </div>
          </section>

          {/* Guests selection */}
          <section>
            <h2 className="font-semibold text-lg mb-3">Guests</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Number of guests (max {maxGuests})
                </label>
                <select
                  value={guests}
                  onChange={(e) =>
                    setGuests(
                      Math.min(
                        Math.max(1, Number(e.target.value) || 1),
                        maxGuests
                      )
                    )
                  }
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                >
                  {Array.from({ length: maxGuests }).map((_, i) => {
                    const n = i + 1;
                    return (
                      <option key={n} value={n}>
                        {n} Guest{n > 1 ? "s" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="text-xs text-gray-500 md:col-span-2">
                Your selected room allows up to {maxGuests} guest
                {maxGuests > 1 ? "s" : ""}. We'll collect details for each guest
                below.
              </div>
            </div>
          </section>

          {/* Special requests */}
          <section>
            <label className="block text-xs text-gray-600 mb-1">
              Special request (optional)
            </label>
            <textarea
              value={form.specialRequest}
              onChange={(e) => handleChange("specialRequest", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
              rows={3}
              placeholder="Any special requests (e.g., early check-in, high floor)"
            />
          </section>

          {/* Extra Details (other guests) */}
          {guests > 1 && (
            <section>
              <h2 className="font-semibold text-lg mb-3">Extra Details</h2>
              <div className="space-y-4">
                {passengers.slice(1).map((p, idx) => {
                  const passengerIndex = idx + 1; // actual index in passengers
                  return (
                    <div key={idx} className="border rounded p-3">
                      <div className="text-sm font-medium mb-2">
                        Guest {passengerIndex + 1}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                        <div className="md:col-span-1">
                          <label className="block text-xs text-gray-600 mb-1">
                            Title
                          </label>
                          <select
                            value={p.title}
                            onChange={(e) =>
                              updatePassenger(
                                passengerIndex,
                                "title",
                                e.target.value
                              )
                            }
                            className="border border-gray-300 rounded px-2 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                          >
                            <option>Mr</option>
                            <option>Mrs</option>
                            <option>Ms</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-600 mb-1">
                            First name *
                          </label>
                          <input
                            type="text"
                            value={p.firstName}
                            onChange={(e) =>
                              updatePassenger(
                                passengerIndex,
                                "firstName",
                                e.target.value
                              )
                            }
                            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                            required
                          />
                        </div>
                        <div className="md:col-span-3">
                          <label className="block text-xs text-gray-600 mb-1">
                            Last name *
                          </label>
                          <input
                            type="text"
                            value={p.lastName}
                            onChange={(e) =>
                              updatePassenger(
                                passengerIndex,
                                "lastName",
                                e.target.value
                              )
                            }
                            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Terms & Conditions consent */}
          <div className="pt-2">
            <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 h-4 w-4 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-200 text-orange-600"
              />
              <span>
                By clicking <span className="font-semibold">Pay Now</span>, you
                confirm you've read and agree to our{" "}
                <button
                  type="button"
                  onClick={() => setTermsOpen(true)}
                  className="underline text-orange-600 hover:text-orange-700"
                >
                  Terms & Conditions
                </button>
                .
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={!agree || submitting}
              className={`w-full py-3 rounded text-white font-semibold ${
                !agree || submitting ? "opacity-80 cursor-not-allowed" : ""
              }`}
              style={{ backgroundColor: themeColor }}
            >
              {submitting ? "Submitting..." : "Pay Now"}
            </button>
          </div>
        </form>

        {/* RIGHT: Invoice / Summary Card - Desktop only */}
        <aside className="hidden lg:block lg:col-span-4">
          <div className="lg:sticky lg:top-4">
            <HotelSummaryCard />
          </div>
        </aside>
      </div>

      {/* Terms & Conditions Modal */}
      {termsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden animate-fadeIn">
            {/* Header */}
            <div
              className="px-6 py-4 text-white flex items-center justify-between"
              style={{ backgroundColor: themeColor }}
            >
              <h2 className="font-semibold text-lg">Terms & Conditions</h2>
              <button
                onClick={() => setTermsOpen(false)}
                className="text-white/90 hover:text-white transition"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 text-gray-800 text-sm max-h-[70vh] overflow-y-auto leading-relaxed space-y-6">
              <section>
                <h3 className="font-semibold text-base text-[#FF6A00] mb-2">
                  1. Booking & Payments
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    All bookings are subject to confirmation and availability.
                  </li>
                  <li>
                    Prices are quoted in UAE Dirhams (AED) unless otherwise
                    specified.
                  </li>
                  <li>
                    Payment can be made via bank transfer, credit/debit card, or
                    approved online payment gateway.
                  </li>
                  <li>
                    For group or corporate bookings, specific payment terms may
                    apply and will be communicated separately.
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base text-[#FF6A00] mb-2">
                  2. Cancellation Policy
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Cancellation requests must be made in writing.</li>
                  <li>
                    Cancellations made less than 24 hours before the trip are
                    non-refundable.
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base text-[#FF6A00] mb-2">
                  3. Health, Safety & Conduct
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Clients must disclose any medical conditions or disabilities
                    that may affect participation in the tour.
                  </li>
                  <li>
                    The company reserves the right to refuse service to anyone
                    who poses a safety risk or engages in unlawful behavior.
                  </li>
                  <li>
                    Participants must comply with UAE laws, cultural norms, and
                    tour guide instructions at all times.
                  </li>
                  <li>
                    Alcohol consumption, public indecency, and disrespectful
                    behavior toward local customs or religion are strictly
                    prohibited.
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base text-[#FF6A00] mb-2">
                  4. Insurance
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    All travelers are advised to have valid travel insurance
                    covering medical expenses, cancellation, and personal
                    accidents.
                  </li>
                  <li>
                    For adventure tours, participants must ensure their
                    insurance includes high-risk activity coverage.
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base text-[#FF6A00] mb-2">
                  5. Complaints & Dispute Resolution
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Any complaint during a tour must be reported immediately to
                    the tour guide or company representative.
                  </li>
                  <li>
                    Written complaints must be submitted within 10 days after
                    the tour ends if unresolved.
                  </li>
                  <li>
                    These Terms & Conditions are governed by the laws of the
                    United Arab Emirates.
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base text-[#FF6A00] mb-2">
                  6. Intellectual Property
                </h3>
                <p>
                  All materials—including text, photos, logos, and designs—are
                  owned by Get Tour Guide. Unauthorized reproduction or misuse
                  is strictly prohibited.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base text-[#FF6A00] mb-2">
                  7. Privacy Policy
                </h3>
                <p>
                  Your personal data is processed according to UAE data
                  protection regulations. We do not share your information with
                  third parties except as required to complete your booking or
                  by law.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base text-[#FF6A00] mb-2">
                  8. Acceptance of Terms
                </h3>
                <p>
                  By booking or participating in any of our tours, you confirm
                  that you have read, understood, and agreed to abide by these
                  Terms & Conditions.
                </p>
              </section>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setTermsOpen(false)}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setTermsOpen(false);
                  setAgree(true);
                }}
                className="px-5 py-2 rounded-md text-white font-medium shadow-md hover:shadow-lg transition"
                style={{ backgroundColor: themeColor }}
              >
                I Agree
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {successOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div
              className="px-5 py-4 text-white"
              style={{ backgroundColor: themeColor }}
            >
              <div className="flex items-center gap-2">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="font-semibold">
                  {paidSuccess
                    ? "Payment successful"
                    : "Booking request submitted"}
                </div>
              </div>
            </div>
            <div className="p-5 text-sm text-gray-700 space-y-3">
              {paidSuccess ? (
                <p>
                  Thank you! Your payment for{" "}
                  <span className="font-medium">{popupHotelName}</span>
                  {popupRoomType ? <> ({popupRoomType})</> : null} was
                  successful. A confirmation email has been sent.
                </p>
              ) : (
                <p>
                  Thank you! We've received your booking details for{" "}
                  <span className="font-medium">{popupHotelName}</span>
                  {popupRoomType ? <> ({popupRoomType})</> : null}. We'll
                  contact you shortly to confirm your stay.
                </p>
              )}
              <div className="bg-gray-50 rounded-md p-3 space-y-1">
                <div className="flex justify-between">
                  <span>Dates</span>
                  <span>
                    {popupCheckIn || "—"} → {popupCheckOut || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Guests</span>
                  <span>{popupGuests}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="font-semibold">
                    {formatCurrency(popupTotal)}
                  </span>
                </div>
              </div>
            </div>
            <div className="px-5 pb-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setSuccessOpen(false)}
                className="px-4 py-2 rounded border border-gray-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSuccessOpen(
                    false
                  ); /* navigate to home or dashboard if desired */
                }}
                className="px-4 py-2 rounded text-white"
                style={{ backgroundColor: themeColor }}
              >
                {paidSuccess ? "Done" : "Done"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
