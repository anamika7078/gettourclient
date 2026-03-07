// import { useCallback, useEffect, useRef, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { useCurrency } from "../../contexts/CurrencyContext";
// /**
//  * HotelsDetailPage.jsx
//  * - Fully responsive design for mobile, tablet, and desktop
//  * - Mobile-optimized layouts for all sections
//  * - Touch-friendly buttons and controls
//  */

// export default function HotelsDetailPage({
//   bookingCtaText = "Book Now",
//   onBook,
//   themeColor = "#F17232",
// }) {
//   const API_URL = import.meta.env.VITE_API_URL;

//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const mapRef = useRef(null);

//   const [hotel, setHotel] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [slide, setSlide] = useState(0);
//   const [roomFilter, setRoomFilter] = useState("");
//   const [sortBy, setSortBy] = useState("");
//   const [, setSelectedRoomIndex] = useState(null);
//   const [showMoreRooms, setShowMoreRooms] = useState(false);
//   const [descExpanded, setDescExpanded] = useState(false);

//   const { convertAndFormat } = useCurrency();

//   // Alert / toast state for unauthenticated booking attempts
//   const [authAlert, setAuthAlert] = useState({
//     show: false,
//     message:
//       "Only logged-in users can book rooms. Please login first, then book.",
//   });
//   const alertTimerRef = useRef(null);

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
//         } catch (err) {
//           void err;
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

//   const parseMaxGuests = (val) => {
//     if (val == null) return 1;
//     if (typeof val === "number" && !Number.isNaN(val))
//       return Math.max(1, Math.floor(val));
//     const s = String(val).trim();
//     const n = Number(s);
//     if (!Number.isNaN(n) && n > 0) return Math.floor(n);
//     const m = s.match(/\d+/);
//     if (m) return Math.max(1, Number(m[0]));
//     return 1;
//   };

//   const normalizeRoom = useCallback((raw) => {
//     if (!raw) return null;
//     const r = typeof raw === "string" ? { room_type: raw } : { ...raw };
//     const mg =
//       r.max_guests ??
//       r.max ??
//       r.capacity ??
//       r.maxGuests ??
//       r["max-guests"] ??
//       1;
//     return {
//       ...r,
//       max_guests: parseMaxGuests(mg),
//       price_per_night: Number(r.price_per_night ?? r.price ?? 0) || 0,
//     };
//   }, []);

//   useEffect(() => {
//     if (!id) return;
//     setLoading(true);
//     fetch(`${API_URL}/api/hotels/${id}`)
//       .then((res) => res.json())
//       .then((data) => {
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
//         } else {
//           parsedRooms = [];
//         }
//         const normalizedRooms = parsedRooms.map((r) => normalizeRoom(r));

//         const rawImages = normalizeToArray(data.images);
//         const mappedImages = rawImages
//           .map((img) => {
//             if (!img) return null;
//             const s = String(img).trim();
//             if (s.startsWith("http://") || s.startsWith("https://")) return s;
//             return `${API_URL}/uploads/hotels/${s}`;
//           })
//           .filter(Boolean);

//         const facilities = normalizeToArray(data.facilities);

//         setHotel({
//           ...data,
//           rooms: normalizedRooms,
//           images: mappedImages,
//           facilities,
//         });

//         setSlide(0);
//         setSelectedRoomIndex(0);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching hotel:", err);
//         setLoading(false);
//       });
//   }, [id, normalizeRoom, API_URL]);

//   // cleanup alert timer on unmount
//   useEffect(() => {
//     return () => {
//       if (alertTimerRef.current) {
//         clearTimeout(alertTimerRef.current);
//         alertTimerRef.current = null;
//       }
//     };
//   }, []);

//   if (loading)
//     return <p className="text-center mt-20 p-4">Loading hotel details...</p>;
//   if (!hotel) return <p className="text-center mt-20 p-4">Hotel not found</p>;

//   const images =
//     Array.isArray(hotel.images) && hotel.images.length
//       ? hotel.images
//       : ["https://via.placeholder.com/1600x900"];
//   const rooms = Array.isArray(hotel.rooms) ? hotel.rooms : [];
//   const facilities = Array.isArray(hotel.facilities) ? hotel.facilities : [];

//   const baseFiltered = rooms.filter((r) =>
//     roomFilter
//       ? String(r.room_type || "")
//           .toLowerCase()
//           .includes(roomFilter.toLowerCase())
//       : true
//   );

//   const filteredRooms = [...baseFiltered].sort((a, b) => {
//     const pa = Number(a.price_per_night || 0);
//     const pb = Number(b.price_per_night || 0);
//     if (sortBy === "price_asc") return pa - pb;
//     if (sortBy === "price_desc") return pb - pa;
//     return 0;
//   });

//   const ROOM_PREVIEW_COUNT = 4;
//   const visibleRooms = showMoreRooms
//     ? filteredRooms
//     : filteredRooms.slice(0, ROOM_PREVIEW_COUNT);

//   const prevSlide = () =>
//     setSlide((s) => (s - 1 + images.length) % images.length);
//   const nextSlide = () => setSlide((s) => (s + 1) % images.length);

//   // Simple auth check
//   const isLoggedIn = () => {
//     try {
//       if (localStorage.getItem("authToken")) return true;
//       const user = JSON.parse(localStorage.getItem("user") || "null");
//       if (user && (user.id || user._id || user.email)) return true;
//     } catch (err) {
//       void err;
//     }
//     return false;
//   };

//   // Show the auth alert (toast) and optionally auto-redirect to login after a delay
//   const showAuthAlertThenRedirect = (intendedBookingData) => {
//     setAuthAlert((a) => ({ ...a, show: true }));
//     if (alertTimerRef.current) {
//       clearTimeout(alertTimerRef.current);
//       alertTimerRef.current = null;
//     }
//     alertTimerRef.current = setTimeout(() => {
//       navigate("/login", {
//         state: {
//           from: location.pathname,
//           intendedBooking: intendedBookingData,
//         },
//       });
//     }, 5500);
//   };

//   const handleBook = (room) => {
//     if (!isLoggedIn()) {
//       const hotelIdForRoute = hotel.id || hotel._id || id;
//       const intendedBooking = {
//         route: `/booking/${hotelIdForRoute}`,
//         hotelId: hotelIdForRoute,
//         room,
//       };
//       showAuthAlertThenRedirect(intendedBooking);
//       return;
//     }

//     onBook?.({ hotel, room });

//     const hotelIdForRoute = hotel.id || hotel._id || id;
//     navigate(`/booking/${hotelIdForRoute}`, {
//       state: {
//         hotel,
//         room,
//         units: 1,
//         checkIn: null,
//         checkOut: null,
//       },
//     });
//   };

//   const closeAuthAlert = () => {
//     setAuthAlert((a) => ({ ...a, show: false }));
//     if (alertTimerRef.current) {
//       clearTimeout(alertTimerRef.current);
//       alertTimerRef.current = null;
//     }
//   };

//   const onAuthAlertLoginNow = () => {
//     if (alertTimerRef.current) {
//       clearTimeout(alertTimerRef.current);
//       alertTimerRef.current = null;
//     }
//     const hotelIdForRoute = hotel.id || hotel._id || id;
//     navigate("/login", {
//       state: {
//         from: location.pathname,
//         intendedBooking: {
//           route: `/booking/${hotelIdForRoute}`,
//           hotelId: hotelIdForRoute,
//         },
//       },
//     });
//   };

//   const scrollToMap = () => {
//     if (mapRef.current) {
//       mapRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
//     }
//   };

//   const formatDescriptionParagraphs = (text) => {
//     if (!text) return [];
//     const cleaned = String(text).replace(/\r/g, "").trim();
//     const parts = cleaned
//       .split(/\n{2,}/)
//       .map((p) => p.trim())
//       .filter(Boolean);
//     if (parts.length > 1) return parts;
//     const sentences = cleaned.split(/(?<=[.!?])\s+/).filter(Boolean);
//     const paragraphs = [];
//     for (let i = 0; i < sentences.length; i += 3) {
//       paragraphs.push(sentences.slice(i, i + 3).join(" "));
//     }
//     return paragraphs.length ? paragraphs : [cleaned];
//   };

//   const descriptionParagraphs = formatDescriptionParagraphs(hotel.description);

//   const PeopleIcon = ({ className = "h-4 w-4 text-gray-600" }) => (
//     <svg
//       className={className}
//       viewBox="0 0 24 24"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M16 11C17.6569 11 19 9.65685 19 8C19 6.34315 17.6569 5 16 5C14.3431 5 13 6.34315 13 8C13 9.65685 14.3431 11 16 11Z"
//         stroke="currentColor"
//         strokeWidth="1.2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <path
//         d="M8 11C9.65685 11 11 9.65685 11 8C11 6.34315 9.65685 5 8 5C6.34315 5 5 6.34315 5 8C5 9.65685 6.34315 11 8 11Z"
//         stroke="currentColor"
//         strokeWidth="1.2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <path
//         d="M3 20C3 16.6863 5.68629 14 9 14H15C18.3137 14 21 16.6863 21 20"
//         stroke="currentColor"
//         strokeWidth="1.2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );

//   const CheckIcon = ({ size = 16 }) => (
//     <svg
//       className="inline-block"
//       width={size}
//       height={size}
//       viewBox="0 0 20 20"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M16 6L8.5 13.5L5 10"
//         stroke={themeColor}
//         strokeWidth="1.6"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );

//   const mapSrc = (() => {
//     const address = hotel.address ? String(hotel.address).trim() : "";
//     if (hotel.latitude && hotel.longitude) {
//       return `https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}&z=15&output=embed`;
//     }
//     if (address) {
//       return `https://www.google.com/maps?q=${encodeURIComponent(
//         address
//       )}&z=15&output=embed`;
//     }
//     const fallback = hotel.city || hotel.hotel_name || "hotel";
//     return `https://www.google.com/maps?q=${encodeURIComponent(
//       fallback
//     )}&z=12&output=embed`;
//   })();

//   return (
//     <div className="max-w-6xl mx-auto p-3 sm:p-4">
//       {/* AUTH ALERT (toast) - Mobile Optimized */}
//       {authAlert.show && (
//         <div
//           role="status"
//           aria-live="polite"
//           className="fixed inset-x-3 bottom-4 z-50 sm:left-1/2 sm:-translate-x-1/2 sm:bottom-6 sm:w-[90%] sm:max-w-md"
//         >
//           <div className="bg-white border-l-4 border-orange-500 rounded-lg shadow-lg overflow-hidden">
//             <div className="p-3 flex items-start gap-3">
//               <div className="flex-shrink-0 pt-0.5">
//                 <svg
//                   className="h-5 w-5 text-orange-500 sm:h-6 sm:w-6"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeWidth="1.5"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M13 16h-1v-4h-1m1-4h.01M12 20.5C7.857 20.5 4.5 17.143 4.5 13S7.857 5.5 12 5.5 19.5 8.857 19.5 13 16.143 20.5 12 20.5z"
//                   />
//                 </svg>
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="text-sm font-semibold text-orange-600">
//                   Login required
//                 </div>
//                 <div className="text-xs sm:text-sm text-gray-700 mt-1 leading-relaxed">
//                   Only logged-in users can book rooms. Please login first, then
//                   book.
//                 </div>
//                 <div className="mt-2 sm:mt-3 flex flex-wrap gap-2">
//                   <button
//                     onClick={onAuthAlertLoginNow}
//                     className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-white text-xs sm:text-sm font-medium flex-1 sm:flex-none justify-center min-w-[100px]"
//                     style={{ backgroundColor: themeColor }}
//                   >
//                     Login now
//                   </button>
//                   <button
//                     onClick={closeAuthAlert}
//                     className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs sm:text-sm font-medium border flex-1 sm:flex-none justify-center min-w-[80px]"
//                   >
//                     Dismiss
//                   </button>
//                 </div>
//               </div>
//               <div className="ml-1 flex-shrink-0">
//                 <button
//                   onClick={closeAuthAlert}
//                   className="text-gray-400 hover:text-gray-600 p-1"
//                   aria-label="Close"
//                 >
//                   <svg
//                     className="h-4 w-4"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeWidth="1.5"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* HERO SECTION - Mobile Optimized */}
//       <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//         <div className="relative">
//           {/* Image Gallery */}
//           <div className="w-full h-56 sm:h-64 md:h-80 lg:h-96 relative overflow-hidden bg-gray-100 flex items-center justify-center">
//             {/* Mobile-friendly touch buttons */}
//             <button
//               onClick={prevSlide}
//               aria-label="Previous"
//               className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 shadow sm:bg-white"
//               style={{ border: `1px solid rgba(0,0,0,0.06)` }}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M12.707 14.707a1 1 0 01-1.414 0L6.586 10l4.707-4.707a1 1 0 011.414 1.414L9.414 10l3.293 3.293a1 1 0 010 1.414z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </button>

//             <img
//               src={images[slide]}
//               alt={hotel.hotel_name}
//               className="w-full h-full object-cover"
//             />

//             <button
//               onClick={nextSlide}
//               aria-label="Next"
//               className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 shadow sm:bg-white"
//               style={{ border: `1px solid rgba(0,0,0,0.06)` }}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M7.293 5.293a1 1 0 011.414 0L13.414 10l-4.707 4.707a1 1 0 01-1.414-1.414L10.586 10 7.293 6.707a1 1 0 010-1.414z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </button>

//             {/* Slide Indicators */}
//             <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
//               {images.map((_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setSlide(i)}
//                   className={`w-6 h-1.5 sm:w-8 sm:h-2 rounded-full transition-all ${
//                     i === slide ? "bg-white" : "bg-white/50"
//                   }`}
//                   aria-label={`Go to slide ${i + 1}`}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Hotel Info Header */}
//           <div className="px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-4">
//             <div className="mb-3 sm:mb-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
//               <div className="flex-1 min-w-0">
//                 <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight truncate">
//                   {hotel.hotel_name}
//                 </h1>
//                 <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
//                   {hotel.address}
//                 </p>
//               </div>

//               {/* Map Buttons - Stack on mobile, row on larger screens */}
//               <div className="flex flex-col xs:flex-row gap-2 mt-3 sm:mt-0 sm:flex-nowrap">
//                 <button
//                   onClick={scrollToMap}
//                   className="text-xs sm:text-sm rounded px-3 py-2 font-medium order-2 xs:order-1"
//                   style={{
//                     backgroundColor: "white",
//                     color: themeColor,
//                     border: `1px solid ${themeColor}`,
//                   }}
//                 >
//                   MAP VIEW
//                 </button>
//                 <a
//                   href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
//                     hotel.address || hotel.hotel_name || ""
//                   )}`}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="text-xs sm:text-sm px-3 py-2 rounded text-center order-1 xs:order-2"
//                   style={{
//                     color: themeColor,
//                     border: `1px solid ${themeColor}`,
//                     backgroundColor: "#fff",
//                   }}
//                 >
//                   Open in Maps
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* MAIN CONTENT LAYOUT */}
//       <div className="mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
//         {/* LEFT - Main Content */}
//         <main className="lg:col-span-8 space-y-4 sm:space-y-6">
//           {/* Available Rooms Section - Mobile Optimized */}
//           <section className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
//               <h2 className="font-semibold text-base sm:text-lg">
//                 Available Rooms
//               </h2>
//               <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
//                 <input
//                   placeholder="Search room category"
//                   value={roomFilter}
//                   onChange={(e) => setRoomFilter(e.target.value)}
//                   className="border rounded px-3 py-2 text-sm w-full xs:w-auto flex-1 min-w-0"
//                 />
//                 <select
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value)}
//                   className="border rounded px-3 py-2 text-sm w-full xs:w-auto"
//                 >
//                   <option value="">Sort By</option>
//                   <option value="price_asc">Price - Low to High</option>
//                   <option value="price_desc">Price - High to Low</option>
//                 </select>
//               </div>
//             </div>

//             <div className="space-y-3">
//               {visibleRooms.length === 0 && (
//                 <p className="text-sm text-gray-500 text-center py-4">
//                   No rooms matching filters.
//                 </p>
//               )}

//               {visibleRooms.map((room, idx) => {
//                 const price = room.price_per_night ?? room.price ?? 0;
//                 const guests = room.max_guests ?? room.max ?? "—";
//                 return (
//                   <div
//                     key={idx}
//                     className="border rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-0 sm:flex sm:items-start sm:justify-between sm:gap-4"
//                   >
//                     <div className="flex-1 min-w-0 space-y-2">
//                       <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
//                         <div className="min-w-0">
//                           <div className="text-sm font-semibold truncate">
//                             {room.room_type || "Standard Room"}
//                           </div>
//                           <div className="text-xs text-orange-600 mt-1">
//                             {room.board_type || "Room Only"}
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-2 xs:gap-3">
//                           <div className="text-xs text-gray-600 flex items-center gap-1">
//                             <PeopleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600" />
//                             <span>Max {guests}</span>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="text-xs text-gray-500 flex flex-wrap items-center gap-x-3 gap-y-1">
//                         <div className="flex items-center gap-1">
//                           <span>Policy:</span>
//                           <span>{room.availability ?? "Available"}</span>
//                         </div>
//                         {room.bed_info && (
//                           <>
//                             <div className="hidden sm:block text-xs text-gray-400">
//                               •
//                             </div>
//                             <div className="flex items-center gap-1">
//                               <span>{room.bed_info}</span>
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     </div>

//                     <div className="flex items-center justify-between sm:flex-col sm:items-end sm:gap-2 sm:w-28 lg:w-32">
//                       <div className="text-sm font-semibold whitespace-nowrap">
//                         {convertAndFormat(price)}
//                       </div>
//                       <button
//                         onClick={() => {
//                           setSelectedRoomIndex(idx);
//                           handleBook(room);
//                         }}
//                         style={{ backgroundColor: themeColor }}
//                         className="px-4 py-2 sm:px-3 sm:py-2 text-white text-sm font-medium rounded-lg min-w-[100px] sm:w-full"
//                       >
//                         {bookingCtaText}
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}

//               {filteredRooms.length > ROOM_PREVIEW_COUNT && (
//                 <div className="pt-3 text-center">
//                   <button
//                     onClick={() => setShowMoreRooms((s) => !s)}
//                     className="text-sm font-medium px-4 py-2 rounded-lg border w-full sm:w-auto"
//                     style={{ borderColor: themeColor, color: themeColor }}
//                   >
//                     {showMoreRooms
//                       ? "Show fewer room types"
//                       : `Show more room types (${
//                           filteredRooms.length - ROOM_PREVIEW_COUNT
//                         } more)`}
//                   </button>
//                 </div>
//               )}
//             </div>
//           </section>

//           {/* Description Section */}
//           <section className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
//             <h3 className="font-semibold text-base sm:text-lg mb-3">
//               Description
//             </h3>
//             <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
//               {descriptionParagraphs.length === 0 && (
//                 <p className="text-gray-500">
//                   No overview available for this property.
//                 </p>
//               )}

//               {descriptionParagraphs
//                 .slice(0, descExpanded ? descriptionParagraphs.length : 2)
//                 .map((p, i) => (
//                   <p
//                     key={i}
//                     className="first-letter:text-3xl sm:first-letter:text-4xl first-letter:font-bold first-letter:text-orange-500 first-letter:mr-2 first-letter:float-left"
//                   >
//                     {p}
//                   </p>
//                 ))}

//               {descriptionParagraphs.length > 2 && (
//                 <div className="pt-2">
//                   <button
//                     onClick={() => setDescExpanded((s) => !s)}
//                     className="text-sm font-medium px-4 py-2 rounded-lg border w-full sm:w-auto"
//                     style={{ borderColor: themeColor, color: themeColor }}
//                   >
//                     {descExpanded ? "Show less" : "Read more"}
//                   </button>
//                 </div>
//               )}
//             </div>
//           </section>
//         </main>

//         {/* RIGHT - Sidebar */}
//         <aside className="lg:col-span-4 space-y-4 sm:space-y-6">
//           {/* Embedded Map */}
//           <div
//             className="bg-white rounded-lg shadow-sm p-3 sm:p-4"
//             ref={mapRef}
//             id="map-section"
//           >
//             <div className="flex items-center justify-between mb-3">
//               <h4 className="font-semibold text-base sm:text-lg">Location</h4>
//               <button
//                 onClick={() =>
//                   window.open(
//                     `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
//                       hotel.address || hotel.hotel_name || ""
//                     )}`,
//                     "_blank"
//                   )
//                 }
//                 className="text-xs px-3 py-1.5 rounded border"
//                 style={{ borderColor: themeColor, color: themeColor }}
//               >
//                 Open Map
//               </button>
//             </div>
//             <div className="w-full h-48 sm:h-56 rounded-lg overflow-hidden border">
//               <iframe
//                 title="hotel-map"
//                 src={mapSrc}
//                 width="100%"
//                 height="100%"
//                 loading="lazy"
//                 referrerPolicy="no-referrer-when-downgrade"
//                 style={{ border: 0 }}
//               />
//             </div>
//             {hotel.address && (
//               <p className="text-xs text-gray-600 mt-2 truncate">
//                 {hotel.address}
//               </p>
//             )}
//           </div>

//           {/* Facilities */}
//           <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
//             <h4 className="font-semibold text-base sm:text-lg mb-3">
//               Facilities
//             </h4>
//             <div className="max-h-60 sm:max-h-72 overflow-auto pr-2">
//               {facilities.length === 0 ? (
//                 <div className="text-sm text-gray-500 text-center py-4">
//                   No facilities listed.
//                 </div>
//               ) : (
//                 <ul className="space-y-2 text-sm text-gray-700">
//                   {facilities.map((f, i) => (
//                     <li key={i} className="flex items-start gap-2">
//                       <span className="min-w-[18px] mt-0.5 flex-shrink-0">
//                         <CheckIcon size={14} />
//                       </span>
//                       <span className="leading-tight break-words">{f}</span>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </div>

//           {/* Hotel Summary Card */}
//           <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
//             <h4 className="font-semibold text-base sm:text-lg mb-3">
//               Hotel Info
//             </h4>
//             <div className="text-sm text-gray-700 space-y-3">
//               <div className="flex items-center justify-between pb-2 border-b">
//                 <div className="text-gray-600">Name</div>
//                 <div className="font-medium text-right truncate ml-2">
//                   {hotel.hotel_name}
//                 </div>
//               </div>
//               <div className="flex items-start justify-between pb-2 border-b">
//                 <div className="text-gray-600 flex-shrink-0">Address</div>
//                 <div className="text-right text-sm break-words ml-2">
//                   {hotel.address}
//                 </div>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div className="text-gray-600">Currency</div>
//                 <div className="font-medium">AED</div>
//               </div>
//             </div>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }


import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCurrency } from "../../contexts/CurrencyContext";
import {
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle,
  ShieldCheck,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Coffee,
  X,
} from "lucide-react";

const BRAND = "#F17232";

function SectionCard({ id, title, children, className = "" }) {
  return (
    <section
      id={id}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 ${className}`}
    >
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-200">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

export default function HotelsDetailPage({
  bookingCtaText = "Book Now",
  onBook,
  themeColor = "#F17232",
}) {
  const API_URL = import.meta.env.VITE_API_URL;

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const mapRef = useRef(null);

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [roomFilter, setRoomFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(null);
  const [showMoreRooms, setShowMoreRooms] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { convertAndFormat } = useCurrency();

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
        } catch (err) {
          void err;
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

  const parseMaxGuests = (val) => {
    if (val == null) return 1;
    if (typeof val === "number" && !Number.isNaN(val))
      return Math.max(1, Math.floor(val));
    const s = String(val).trim();
    const n = Number(s);
    if (!Number.isNaN(n) && n > 0) return Math.floor(n);
    const m = s.match(/\d+/);
    if (m) return Math.max(1, Number(m[0]));
    return 1;
  };

  const normalizeRoom = useCallback((raw) => {
    if (!raw) return null;
    const r = typeof raw === "string" ? { room_type: raw } : { ...raw };
    const mg =
      r.max_guests ??
      r.max ??
      r.capacity ??
      r.maxGuests ??
      r["max-guests"] ??
      1;
    return {
      ...r,
      max_guests: parseMaxGuests(mg),
      price_per_night: Number(r.price_per_night ?? r.price ?? 0) || 0,
    };
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API_URL}/api/hotels/${id}`)
      .then((res) => res.json())
      .then((data) => {
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
        } else {
          parsedRooms = [];
        }
        const normalizedRooms = parsedRooms.map((r) => normalizeRoom(r));

        const rawImages = normalizeToArray(data.images);
        const mappedImages = rawImages
          .map((img) => {
            if (!img) return null;
            const s = String(img).trim();
            if (s.startsWith("http://") || s.startsWith("https://")) return s;
            return `${API_URL}/uploads/hotels/${s}`;
          })
          .filter(Boolean);

        const facilities = normalizeToArray(data.facilities);

        setHotel({
          ...data,
          rooms: normalizedRooms,
          images: mappedImages,
          facilities,
        });

        setCurrentImageIndex(0);
        setSelectedRoomIndex(0);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching hotel:", err);
        setLoading(false);
      });
  }, [id, normalizeRoom, API_URL]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading hotel details...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!hotel) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Hotel Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The requested hotel was not found.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={() => navigate("/hotels")}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Browse Hotels
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const images =
    Array.isArray(hotel.images) && hotel.images.length
      ? hotel.images
      : ["https://via.placeholder.com/1600x900"];
  const rooms = Array.isArray(hotel.rooms) ? hotel.rooms : [];
  const facilities = Array.isArray(hotel.facilities) ? hotel.facilities : [];

  const baseFiltered = rooms.filter((r) =>
    roomFilter
      ? String(r.room_type || "")
          .toLowerCase()
          .includes(roomFilter.toLowerCase())
      : true
  );

  const filteredRooms = [...baseFiltered].sort((a, b) => {
    const pa = Number(a.price_per_night || 0);
    const pb = Number(b.price_per_night || 0);
    if (sortBy === "price_asc") return pa - pb;
    if (sortBy === "price_desc") return pb - pa;
    return 0;
  });

  const ROOM_PREVIEW_COUNT = 4;
  const visibleRooms = showMoreRooms
    ? filteredRooms
    : filteredRooms.slice(0, ROOM_PREVIEW_COUNT);

  const handleNextImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const isLoggedIn = () => {
    try {
      const u = localStorage.getItem("user");
      const t = localStorage.getItem("token");
      return !!u || !!t;
    } catch {
      return false;
    }
  };

  const handleBook = (room) => {
    if (!isLoggedIn()) {
      setShowAuthModal(true);
      return;
    }

    onBook?.({ hotel, room });

    const hotelIdForRoute = hotel.id || hotel._id || id;
    navigate(`/booking/${hotelIdForRoute}`, {
      state: {
        hotel,
        room,
        units: 1,
        checkIn: null,
        checkOut: null,
      },
    });
  };

  const scrollToMap = () => {
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const formatDescriptionParagraphs = (text) => {
    if (!text) return [];
    const cleaned = String(text).replace(/\r/g, "").trim();
    const parts = cleaned
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length > 1) return parts;
    const sentences = cleaned.split(/(?<=[.!?])\s+/).filter(Boolean);
    const paragraphs = [];
    for (let i = 0; i < sentences.length; i += 3) {
      paragraphs.push(sentences.slice(i, i + 3).join(" "));
    }
    return paragraphs.length ? paragraphs : [cleaned];
  };

  const descriptionParagraphs = formatDescriptionParagraphs(hotel.description);

  const getFacilityIcon = (facility) => {
    const lowerFacility = facility.toLowerCase();
    if (lowerFacility.includes('wifi')) return <Wifi className="w-4 h-4" />;
    if (lowerFacility.includes('parking') || lowerFacility.includes('car')) return <Car className="w-4 h-4" />;
    if (lowerFacility.includes('restaurant') || lowerFacility.includes('dining')) return <Utensils className="w-4 h-4" />;
    if (lowerFacility.includes('gym') || lowerFacility.includes('fitness')) return <Dumbbell className="w-4 h-4" />;
    if (lowerFacility.includes('breakfast') || lowerFacility.includes('coffee')) return <Coffee className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const mapSrc = (() => {
    const address = hotel.address ? String(hotel.address).trim() : "";
    if (hotel.latitude && hotel.longitude) {
      return `https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}&z=15&output=embed`;
    }
    if (address) {
      return `https://www.google.com/maps?q=${encodeURIComponent(
        address
      )}&z=15&output=embed`;
    }
    const fallback = hotel.city || hotel.hotel_name || "hotel";
    return `https://www.google.com/maps?q=${encodeURIComponent(
      fallback
    )}&z=12&output=embed`;
  })();

  // Static reviews data
  const staticReviews = {
    avg: 4.5,
    total: 234,
    counts: { 5: 150, 4: 70, 3: 10, 2: 3, 1: 1 },
  };

  return (
    <main className="min-h-screen bg-gray-50" style={{ "--brand": BRAND }}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <a href="/" className="hover:text-orange-500 transition-colors">
            Home
          </a>
          <span>/</span>
          <a href="/hotels" className="hover:text-orange-500 transition-colors">
            Hotels
          </a>
          <span>/</span>
          <span className="text-gray-900 font-medium line-clamp-1">
            {hotel.hotel_name}
          </span>
        </nav>

        {/* Hero Section */}
        <section className="mb-6">
          <div className="relative rounded-2xl overflow-hidden shadow-lg h-72 md:h-96 lg:h-[500px]">
            {images[currentImageIndex] ? (
              <img
                src={images[currentImageIndex]}
                alt={hotel.hotel_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-2">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <p>No image available</p>
                </div>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />

            {images.length > 1 && (
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                📷 {currentImageIndex + 1}/{images.length}
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  aria-label="previous"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all hover:scale-110"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  aria-label="next"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all hover:scale-110"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? "border-orange-500 ring-2 ring-orange-200 scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Title & Quick Info Bar */}
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {hotel.hotel_name}
          </h1>

          {/* Icon Features Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Wifi className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-gray-700 text-xs">Free WiFi</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-gray-700 text-xs">Best Rates</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-gray-700 text-xs">Secure Booking</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                  <Utensils className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-gray-700 text-xs">Restaurant</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Car className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-gray-700 text-xs">Parking</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Dumbbell className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-gray-700 text-xs">Fitness Center</span>
              </div>
            </div>
          </div>

          {/* Rating & Location Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-current text-green-600"
                      fill="currentColor"
                    />
                  ))}
                </div>
                <span className="text-green-700 font-semibold">
                  {staticReviews.avg.toFixed(1)}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">{staticReviews.total}</span>{" "}
                Reviews
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-700">{hotel.address}</span>
              <button
                onClick={scrollToMap}
                className="text-orange-500 hover:text-orange-600 text-sm font-medium"
              >
                View on Map
              </button>
            </div>
          </div>
        </header>

        {/* Available Rooms Section */}
        <SectionCard id="rooms" title="Available Rooms">
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                placeholder="Search room category..."
                value={roomFilter}
                onChange={(e) => setRoomFilter(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Sort by</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {/* Rooms List */}
            <div className="space-y-4">
              {visibleRooms.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No rooms matching your criteria.
                </div>
              )}

              {visibleRooms.map((room, idx) => {
                const price = room.price_per_night ?? room.price ?? 0;
                const guests = room.max_guests ?? room.max ?? "—";
                
                return (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {room.room_type || "Standard Room"}
                          </h3>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Users className="w-4 h-4" />
                              <span>Max {guests}</span>
                            </div>
                            <div className="text-lg font-bold text-orange-600">
                              {convertAndFormat(price)}
                              <span className="text-sm font-normal text-gray-500"> / night</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {room.board_type && (
                            <div className="text-sm text-orange-600 font-medium">
                              {room.board_type}
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            {room.availability && (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>{room.availability}</span>
                              </div>
                            )}
                            {room.bed_info && (
                              <div className="flex items-center gap-1">
                                <span>🛏️ {room.bed_info}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedRoomIndex(idx);
                          handleBook(room);
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>{bookingCtaText}</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredRooms.length > ROOM_PREVIEW_COUNT && (
                <div className="text-center pt-4">
                  <button
                    onClick={() => setShowMoreRooms((s) => !s)}
                    className="px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                  >
                    {showMoreRooms
                      ? "Show fewer rooms"
                      : `Show more rooms (${
                          filteredRooms.length - ROOM_PREVIEW_COUNT
                        } more)`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Hotel Description */}
        <SectionCard id="overview" title="Hotel Overview">
          {descriptionParagraphs.length === 0 ? (
            <div className="flex items-start gap-3 text-gray-500 bg-gray-50 p-4 rounded-lg">
              <div className="w-5 h-5 mt-0.5 flex-shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <p className="text-sm">
                No description available for this hotel.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="prose prose-gray prose-sm max-w-none text-gray-700 leading-relaxed">
                {descriptionParagraphs
                  .slice(0, descExpanded ? descriptionParagraphs.length : 2)
                  .map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
              </div>

              {descriptionParagraphs.length > 2 && (
                <button
                  onClick={() => setDescExpanded((s) => !s)}
                  className="px-4 py-2 border-2 border-orange-500 text-orange-500 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                >
                  {descExpanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          )}
        </SectionCard>

        {/* Facilities Section */}
        {facilities.length > 0 && (
          <SectionCard id="facilities" title="Hotel Facilities">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {facilities.map((facility, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-orange-500">
                    {getFacilityIcon(facility)}
                  </div>
                  <span className="text-gray-700 font-medium">{facility}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Location Section */}
        <SectionCard id="location" title="Location">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{hotel.hotel_name}</div>
                  <div className="text-sm text-gray-600">{hotel.address}</div>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  hotel.address || hotel.hotel_name || ""
                )}`}
                target="_blank"
                rel="noreferrer"
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors w-fit"
              >
                Open in Maps
              </a>
            </div>

            <div className="w-full h-96 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
              <iframe
                title="hotel-location-map"
                src={mapSrc}
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
              />
            </div>
          </div>
        </SectionCard>

        {/* Trust Badges */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  Secure Booking
                </div>
                <div className="text-sm text-gray-600">
                  SSL encrypted payments
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <CheckCircle className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  Best Price Guarantee
                </div>
                <div className="text-sm text-gray-600">
                  Find a lower price? We'll match it
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  24/7 Support
                </div>
                <div className="text-sm text-gray-600">
                  We're here to help you
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom CTA - Mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg lg:hidden z-40">
          <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto">
            <div>
              <div className="text-xs text-gray-500">Starting from</div>
              <div className="text-xl font-bold text-orange-600">
                {rooms.length > 0 ? convertAndFormat(Math.min(...rooms.map(r => r.price_per_night || r.price || 0))) : "—"}
              </div>
            </div>
            <button
              onClick={() => {
                if (rooms.length > 0) {
                  handleBook(rooms[0]);
                }
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Book Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Auth Required Modal */}
      {showAuthModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAuthModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Login Required
                  </h3>
                </div>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Please login to book this hotel and access exclusive deals.
              </p>
              <div className="flex gap-3">
                <button
                  className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  onClick={() => setShowAuthModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                  onClick={() =>
                    navigate("/login", { state: { from: location.pathname } })
                  }
                >
                  Login Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}