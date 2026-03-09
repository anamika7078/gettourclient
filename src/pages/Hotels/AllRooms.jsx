// // import { useEffect, useMemo, useState } from "react";
// // import {
// //   FaCar,
// //   FaCoffee,
// //   FaStar,
// //   FaSwimmer,
// //   FaUtensils,
// //   FaWifi,
// // } from "react-icons/fa";
// // import { GiGymBag } from "react-icons/gi";
// // import { useNavigate } from "react-router-dom";

// // export default function HotelsList({ filtersSlot, filterQuery = "" }) {
// //   const API_URL = import.meta.env.VITE_API_URL;

// //   const [hotels, setHotels] = useState([]);

// //   useEffect(() => {
// //     fetch(`${API_URL}/api/hotels`)
// //       .then((res) => res.json())
// //       .then((data) => setHotels(data))
// //       .catch((err) => console.error("Error fetching hotels:", err));
// //   }, [API_URL]);

// //   const filteredHotels = useMemo(() => {
// //     const q = (filterQuery || "").trim().toLowerCase();
// //     if (!q) return hotels;
// //     const extractCity = (addr) => {
// //       if (!addr) return "";
// //       const parts = String(addr)
// //         .split(",")
// //         .map((p) => p.trim())
// //         .filter(Boolean);
// //       return parts[parts.length - 1] || parts[0] || "";
// //     };
// //     return hotels.filter((h) => {
// //       const name = String(h.hotel_name || "").toLowerCase();
// //       const addr = String(h.address || "").toLowerCase();
// //       const city = extractCity(h.address).toLowerCase();
// //       return name.includes(q) || addr.includes(q) || city.includes(q);
// //     });
// //   }, [hotels, filterQuery]);

// //   return (
// //     // <section className="relative bg-white py-8 sm:py-12 lg:py-16">
// //     //   <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
// //     //     {/* Filters */}
// //     //     {filtersSlot && (
// //     //       <div className="mb-6 rounded-xl border border-orange-300 bg-white px-4 py-3 shadow-sm">
// //     //         {filtersSlot}
// //     //       </div>
// //     //     )}
// //     //     {/* Header */}
// //     //     <header className="flex flex-col gap-1 mb-6">
// //     //       <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-orange-600">
// //     //         Explore Hotels
// //     //       </h2>
// //     //       <p className="text-sm sm:text-base text-gray-600">
// //     //         Select your hotel for details and booking.
// //     //       </p>
// //     //     </header>
// //     //     <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
// //     //       {filteredHotels.map((hotel) => (
// //     //         <HotelCard key={hotel.id} hotel={hotel} />
// //     //       ))}
// //     //     </div>
// //     //   </div>
// //     // </section>
// //     <section className="relative bg-white py-8 sm:py-12 lg:py-16">
// //       <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
// //         {/* Filters */}
// //         {filtersSlot && (
// //           <div className="mb-6 rounded-xl border border-orange-300 bg-white px-4 py-3 shadow-sm">
// //             {filtersSlot}
// //           </div>
// //         )}

// //         {/* Header with Inline Circular Arrow */}
// //         <header className="flex items-start gap-4 mb-6">
// //           <div className="flex-1">
// //             <div className="flex items-center gap-3 mb-2">
// //               <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-orange-600">
// //                 Explore Hotels
// //               </h2>

// //               {/* Circular Arrow Button inline with heading */}
// //               <div
// //                 className="relative flex-shrink-0"
// //                 style={{
// //                   width: "50px",
// //                   height: "50px",
// //                   color: "#EA580C",
// //                 }}
// //               >
// //                 <svg
// //                   className="animate-spin-slower"
// //                   style={{
// //                     width: "100%",
// //                     height: "100%",
// //                     animationDuration: "8s",
// //                   }}
// //                   viewBox="0 0 100 100"
// //                   aria-hidden="true"
// //                 >
// //                   <circle
// //                     cx="50"
// //                     cy="50"
// //                     r="47"
// //                     fill="none"
// //                     stroke="currentColor"
// //                     strokeWidth="4"
// //                     strokeLinecap="round"
// //                     strokeDasharray="0.1 10.5"
// //                   />
// //                 </svg>

// //                 <button
// //                   type="button"
// //                   aria-label="Explore all hotels"
// //                   className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-600 text-white hover:bg-orange-700 focus:outline-none focus-visible:ring-4 ring-orange-600/40 transition-colors duration-200 rounded-full flex items-center justify-center"
// //                   style={{
// //                     width: "36px",
// //                     height: "36px",
// //                   }}
// //                 >
// //                   <svg
// //                     xmlns="http://www.w3.org/2000/svg"
// //                     style={{ width: "55%", height: "55%" }}
// //                     viewBox="0 0 24 24"
// //                     fill="none"
// //                     stroke="currentColor"
// //                   >
// //                     <path
// //                       d="M7 17 17 7M9 7h8v8"
// //                       strokeWidth="2"
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                     />
// //                   </svg>
// //                 </button>
// //               </div>
// //             </div>
// //             <p className="text-sm sm:text-base text-gray-600">
// //               Select your hotel for details and booking.
// //             </p>
// //           </div>
// //         </header>

// //         <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
// //           {filteredHotels.map((hotel) => (
// //             <HotelCard key={hotel.id} hotel={hotel} />
// //           ))}
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }

// // function HotelCard({ hotel }) {
// //   const API_URL = import.meta.env.VITE_API_URL;

// //   const navigate = useNavigate();

// //   const rooms = useMemo(() => {
// //     try {
// //       return JSON.parse(hotel.rooms || "[]");
// //     } catch {
// //       return [];
// //     }
// //   }, [hotel.rooms]);

// //   const images = hotel.images
// //     ? (Array.isArray(hotel.images)
// //         ? hotel.images
// //         : hotel.images.split(",")
// //       ).map((img) =>
// //         img.includes("http") ? img : `${API_URL}/uploads/hotels/${img.trim()}`
// //       )
// //     : [];

// //   const amenities = hotel.facilities
// //     ? hotel.facilities.split(",").map((f) => f.trim())
// //     : [];

// //   const [currentImage, setCurrentImage] = useState(0);
// //   const [fade, setFade] = useState(true);

// //   useEffect(() => {
// //     if (images.length <= 1) return;
// //     const interval = setInterval(() => {
// //       setFade(false);
// //       setTimeout(() => {
// //         setCurrentImage((prev) => (prev + 1) % images.length);
// //         setFade(true);
// //       }, 500);
// //     }, 3000);
// //     return () => clearInterval(interval);
// //   }, [images.length]);

// //   const avgRating =
// //     rooms.length > 0
// //       ? rooms.reduce((sum, r) => sum + (r.rating || 4.7), 0) / rooms.length
// //       : 4.7;

// //   const totalReviews =
// //     rooms.length > 0
// //       ? rooms.reduce((sum, r) => sum + (r.reviews || 0), 0)
// //       : 128;

// //   // Facility icons mapping
// //   const facilityIcons = {
// //     wifi: <FaWifi className="text-orange-500 w-4 h-4" />,
// //     pool: <FaSwimmer className="text-orange-500 w-4 h-4" />,
// //     restaurant: <FaUtensils className="text-orange-500 w-4 h-4" />,
// //     parking: <FaCar className="text-orange-500 w-4 h-4" />,
// //     gym: <GiGymBag className="text-orange-500 w-4 h-4" />,
// //     breakfast: <FaCoffee className="text-orange-500 w-4 h-4" />,
// //   };

// //   const getFacilityIcon = (name) => {
// //     name = name.toLowerCase();
// //     for (const key in facilityIcons) {
// //       if (name.includes(key)) return facilityIcons[key];
// //     }
// //     return null;
// //   };

// //   return (
// //     <div className="group block rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1 overflow-hidden ring-1 ring-orange-200">
// //       {/* Image */}
// //       <div className="relative h-56">
// //         {images.length > 0 ? (
// //           <img
// //             src={images[currentImage]}
// //             alt={hotel.hotel_name}
// //             className={`h-56 w-full object-cover transition-opacity duration-500 ${
// //               fade ? "opacity-100" : "opacity-0"
// //             }`}
// //           />
// //         ) : (
// //           <div className="h-56 w-full bg-gray-200 flex items-center justify-center text-gray-400">
// //             No Image
// //           </div>
// //         )}
// //         <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
// //           Top Pick
// //         </div>
// //       </div>

// //       {/* Card Body */}
// //       <div className="px-4 py-3 sm:px-5 sm:py-4">
// //         {/* Amenities */}
// //         {amenities.length > 0 && (
// //           <div className="flex flex-wrap gap-2 mb-3">
// //             {amenities.map((a, i) => (
// //               <span
// //                 key={i}
// //                 className="flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2 py-1 text-[10px] font-medium text-orange-600"
// //               >
// //                 {getFacilityIcon(a)}
// //                 <span>{a}</span>
// //               </span>
// //             ))}
// //           </div>
// //         )}

// //         {/* Hotel name & address */}
// //         <h3 className="text-lg sm:text-xl font-extrabold text-orange-600">
// //           {hotel.hotel_name}
// //         </h3>
// //         <p className="text-sm sm:text-base text-gray-600 mt-1">
// //           {hotel.address}
// //         </p>

// //         {/* Rating */}
// //         <div className="flex items-center gap-1 mt-2">
// //           <Stars rating={avgRating} />
// //           <span className="text-sm text-gray-500 ml-1">
// //             {avgRating.toFixed(1)} ({totalReviews} reviews)
// //           </span>
// //         </div>

// //         {/* Details button only (price removed from card) */}
// //         <div className="flex justify-end mt-3">
// //           <button
// //             onClick={() => navigate(`/hotels/${hotel.id}`)}
// //             className="bg-orange-500 text-white px-4 py-1.5 rounded hover:bg-orange-600 transition"
// //           >
// //             Details
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function Stars({ rating = 0 }) {
// //   const full = Math.floor(rating);
// //   const half = rating - full >= 0.5;
// //   const total = 5;
// //   return (
// //     <span className="inline-flex items-center text-orange-400">
// //       {Array.from({ length: total }).map((_, i) => {
// //         const state = i < full ? "full" : i === full && half ? "half" : "empty";
// //         return <StarIcon key={i} state={state} />;
// //       })}
// //     </span>
// //   );
// // }

// // function StarIcon({ state }) {
// //   if (state === "full") return <FaStar className="h-3 w-3" />;
// //   if (state === "half") return <FaStar className="h-3 w-3 text-orange-200" />;
// //   return <FaStar className="h-3 w-3 text-gray-300" />;
// // }

// import { useEffect, useState } from "react";
// import {
//   FaCheckCircle,
//   FaClipboardList,
//   FaHotel,
//   FaMap,
//   FaMapMarkerAlt,
//   FaSearch,
//   FaSortAlphaDown,
//   FaSortAlphaUp,
//   FaStar,
//   FaStreetView,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// export default function AllRooms() {
//   const navigate = useNavigate();
//   const API_URL = import.meta.env.VITE_API_URL;

//   const [query, setQuery] = useState("");
//   const [sort, setSort] = useState("price-low");
//   const [nameOrder, setNameOrder] = useState("asc");
//   const [hotels, setHotels] = useState([]);

//   // Fetch hotels from backend
//   useEffect(() => {
//     fetch(`${API_URL}/api/hotels`)
//       .then((res) => res.json())
//       .then((data) => setHotels(data))
//       .catch((err) => console.error("Error fetching hotels:", err));
//   }, [API_URL]);

//   // Filter hotels by name or address
//   let filtered = hotels.filter((h) =>
//     `${h.hotel_name || ""} ${h.address || ""}`
//       .toLowerCase()
//       .includes(query.toLowerCase())
//   );

//   // Sort logic
//   filtered = filtered.sort((a, b) => {
//     if (nameOrder === "asc") return (a.hotel_name || "").localeCompare(b.hotel_name || "");
//     if (nameOrder === "desc") return (b.hotel_name || "").localeCompare(a.hotel_name || "");
//     if (sort === "price-low") return Number(a.price || 0) - Number(b.price || 0);
//     if (sort === "price-high") return Number(b.price || 0) - Number(a.price || 0);
//     if (sort === "rating-high") return (b.rating || 0) - (a.rating || 0);
//     return 0;
//   });

//   const toggleNameOrder = () =>
//     setNameOrder((prev) => (prev === "asc" ? "desc" : "asc"));

//   // Navigate to hotel detail
//   const handleCardClick = (hotelId) => {
//     navigate(`/hotels/${hotelId}`);
//   };

//   return (
//     <section className="max-w-6xl mx-auto px-4 py-6 pb-24">
//       {/* Filter Bar */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 mb-6 flex flex-wrap gap-3 items-center justify-between overflow-hidden">
//         <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
//           <span className="text-sm font-medium text-gray-700">Sort By Hotels</span>

//           <select
//             value={sort}
//             onChange={(e) => setSort(e.target.value)}
//             className="text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded-md shadow-sm outline-none w-full sm:w-auto"
//           >
//             <option value="price-low">Price Low To High</option>
//             <option value="price-high">Price High To Low</option>
//             <option value="rating-high">Rating High To Low</option>
//           </select>

//           <button
//             type="button"
//             onClick={toggleNameOrder}
//             className="flex items-center justify-center gap-2 text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded-md shadow-sm hover:bg-gray-100 w-full sm:w-auto"
//           >
//             <span>Hotel Name</span>
//             {nameOrder === "asc" ? (
//               <FaSortAlphaDown className="text-gray-600" />
//             ) : (
//               <FaSortAlphaUp className="text-gray-600" />
//             )}
//           </button>
//         </div>

//         <div className="relative w-full sm:w-80 mt-2 sm:mt-0">
//           <input
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search Your Hotel"
//             className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md outline-none"
//           />
//           <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//         </div>
//       </div>

//       {/* Cards */}
//       <div className="space-y-4">
//         {filtered.map((hotel, index) => (
//           <div
//             key={index}
//             onClick={() => handleCardClick(hotel.id)}
//             className="relative bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer group"
//           >
//             {/* Mobile View */}
//             <div className="flex sm:hidden items-center p-3 min-h-[120px]">
//               <div className="w-28 h-28 flex-shrink-0">
//                 <img
//                   src={
//                     hotel.images
//                       ? `${API_URL}/uploads/hotels/${
//                           Array.isArray(hotel.images)
//                             ? hotel.images[0]
//                             : String(hotel.images).split(",")[0]
//                         }`
//                       : "https://via.placeholder.com/200x150"
//                   }
//                   alt={hotel.hotel_name}
//                   className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
//                 />
//               </div>
//               <div className="flex-1 ml-3">
//                 <h3 className="text-base font-semibold text-gray-800 group-hover:text-orange-500 transition-colors">
//                   {hotel.hotel_name}
//                 </h3>
//                 <p className="text-xs text-gray-500 mt-1 line-clamp-1">
//                   {hotel.address}
//                 </p>

//                 {/* Stars */}
//                 <div className="flex mt-2 space-x-1">
//                   {Array.from({ length: 5 }).map((_, i) => (
//                     <FaStar
//                       key={i}
//                       className={`text-xs ${
//                         i < (hotel.rating || 4) ? "text-orange-500" : "text-gray-300"
//                       }`}
//                     />
//                   ))}
//                 </div>

//                 <p className="text-sm font-bold text-orange-500 mt-2">
//                   From AED {hotel.price || "—"}
//                 </p>
//               </div>
//             </div>

//             {/* Desktop View */}
//             <div className="hidden sm:flex flex-row items-stretch">
//               <div className="w-full sm:w-1/4 flex-shrink-0 relative left-4 top-[6px]">
//                 <img
//                   src={
//                     hotel.images
//                       ? `${API_URL}/uploads/hotels/${
//                           Array.isArray(hotel.images)
//                             ? hotel.images[0]
//                             : String(hotel.images).split(",")[0]
//                         }`
//                       : "https://via.placeholder.com/250x150"
//                   }
//                   alt={hotel.hotel_name}
//                   className="w-[90%] h-36 object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
//                 />
//               </div>

//               <div className="flex-1 px-4 py-4">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h3 className="text-base md:text-lg font-semibold text-gray-800 group-hover:text-orange-500 transition-colors">
//                       {hotel.hotel_name}
//                     </h3>
//                     <p className="text-sm text-gray-500 mt-1 flex items-center">
//                       <FaMapMarkerAlt className="text-orange-500 mr-2" />
//                       {hotel.address}
//                     </p>

//                     {hotel.instantConfirmation && (
//                       <p className="flex items-center text-sm text-gray-600 mt-3">
//                         <FaCheckCircle className="text-orange-500 mr-2" />
//                         INSTANT CONFIRMATION
//                       </p>
//                     )}

//                     <div className="mt-3 flex flex-wrap gap-3">
//                       <span className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1 rounded">
//                         <FaClipboardList className="text-orange-500" /> Description
//                       </span>
//                       <span className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1 rounded">
//                         <FaHotel className="text-orange-500" /> Facilities
//                       </span>
//                       <span className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1 rounded">
//                         <FaMap className="text-orange-500" /> Map
//                       </span>
//                       <span className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1 rounded">
//                         <FaStreetView className="text-orange-500" /> Street View
//                       </span>
//                     </div>
//                   </div>

//                   <div className="hidden md:flex flex-col items-end ml-4">
//                     <div className="flex space-x-1 mb-2">
//                       {Array.from({ length: 5 }).map((_, i) => (
//                         <FaStar
//                           key={i}
//                           className={`text-sm ${
//                             i < (hotel.rating || 4)
//                               ? "text-orange-500"
//                               : "text-gray-200"
//                           }`}
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="w-56 flex-shrink-0 border-l border-gray-100 flex flex-col justify-between items-center p-4">
//                 <div className="text-center sm:text-right">
//                   <p className="text-xs text-gray-400 uppercase">From AED</p>
//                   <p className="text-xl md:text-2xl font-bold text-gray-800">
//                     {hotel.price || "—"}
//                   </p>
//                   <p className="text-blue-500 text-xs md:text-sm font-medium">
//                     PER NIGHT
//                   </p>
//                 </div>

//                 <button className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-3 py-2 rounded">
//                   SELECT
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}

//         {filtered.length === 0 && (
//           <div className="text-center py-8 text-gray-500">
//             No hotels match your search
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

// import { useEffect, useMemo, useState } from "react";
// import {
//   FaCheckCircle,
//   FaClipboardList,
//   FaFilter,
//   FaHotel,
//   FaMap,
//   FaMapMarkerAlt,
//   FaSearch,
//   FaSortAlphaDown,
//   FaSortAlphaUp,
//   FaStar,
//   FaStreetView,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// export default function AllRooms() {
//   const navigate = useNavigate();
//   const API_URL = import.meta.env.VITE_API_URL;

//   const [query, setQuery] = useState("");
//   const [sort, setSort] = useState("price-low");
//   const [nameOrder, setNameOrder] = useState("asc");
//   const [hotels, setHotels] = useState([]);
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [minRating, setMinRating] = useState(0);

//   // ✅ Fetch hotels dynamically
//   useEffect(() => {
//     fetch(`${API_URL}/api/hotels`)
//       .then((res) => res.json())
//       .then((data) => setHotels(data || []))
//       .catch((err) => console.error("Error fetching hotels:", err));
//   }, [API_URL]);

//   // ✅ Normalize dynamic price key
//   const getHotelPrice = (h) =>
//     Number(
//       h.price_per_night ?? h.pricePerNight ?? h.room_price ?? h.price ?? 0
//     );

//   // ✅ Apply all filters + sorting dynamically
//   const filtered = useMemo(() => {
//     let result = hotels.filter((h) => {
//       const price = getHotelPrice(h);
//       const rating = Number(h.rating || 0);
//       const matchesQuery = `${h.hotel_name || ""} ${h.address || ""}`
//         .toLowerCase()
//         .includes(query.toLowerCase());

//       const matchesPrice =
//         (!minPrice || price >= minPrice) && (!maxPrice || price <= maxPrice);

//       const matchesRating = rating >= minRating;

//       return matchesQuery && matchesPrice && matchesRating;
//     });

//     // ✅ Sorting Logic
//     result.sort((a, b) => {
//       const priceA = getHotelPrice(a);
//       const priceB = getHotelPrice(b);
//       if (sort === "price-low") return priceA - priceB;
//       if (sort === "price-high") return priceB - priceA;
//       if (sort === "rating-high") return (b.rating || 0) - (a.rating || 0);
//       if (nameOrder === "asc")
//         return (a.hotel_name || "").localeCompare(b.hotel_name || "");
//       if (nameOrder === "desc")
//         return (b.hotel_name || "").localeCompare(a.hotel_name || "");
//       return 0;
//     });

//     return result;
//   }, [hotels, query, sort, nameOrder, minPrice, maxPrice, minRating]);

//   const toggleNameOrder = () =>
//     setNameOrder((prev) => (prev === "asc" ? "desc" : "asc"));

//   const handleCardClick = (hotelId) => {
//     navigate(`/hotels/${hotelId}`);
//   };

//   return (
//     <section className="max-w-6xl mx-auto px-4 py-6 pb-24">
//       {/* 🔍 Filter Bar */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap gap-3 items-center justify-between">
//         <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
//           <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
//             <FaFilter className="text-orange-500" /> Filters
//           </span>

//           <select
//             value={sort}
//             onChange={(e) => setSort(e.target.value)}
//             className="text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded-md shadow-sm outline-none w-full sm:w-auto"
//           >
//             <option value="price-low">Price: Low to High</option>
//             <option value="price-high">Price: High to Low</option>
//             <option value="rating-high">Rating: High to Low</option>
//           </select>

//           <button
//             type="button"
//             onClick={toggleNameOrder}
//             className="flex items-center justify-center gap-2 text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded-md shadow-sm hover:bg-gray-100 w-full sm:w-auto"
//           >
//             <span>Hotel Name</span>
//             {nameOrder === "asc" ? (
//               <FaSortAlphaDown className="text-gray-600" />
//             ) : (
//               <FaSortAlphaUp className="text-gray-600" />
//             )}
//           </button>
//         </div>

//         {/* Price Range Filter */}
//         <div className="flex items-center gap-2 text-sm mt-2 sm:mt-0">
//           <input
//             type="number"
//             placeholder="Min ₹"
//             value={minPrice}
//             onChange={(e) => setMinPrice(e.target.value)}
//             className="w-20 sm:w-24 px-2 py-1 border border-gray-200 rounded-md bg-gray-50 outline-none"
//           />
//           <span>-</span>
//           <input
//             type="number"
//             placeholder="Max ₹"
//             value={maxPrice}
//             onChange={(e) => setMaxPrice(e.target.value)}
//             className="w-20 sm:w-24 px-2 py-1 border border-gray-200 rounded-md bg-gray-50 outline-none"
//           />
//         </div>

//         {/* Rating Filter */}
//         <div className="flex items-center gap-2 text-sm">
//           <span>Min Rating:</span>
//           <select
//             value={minRating}
//             onChange={(e) => setMinRating(Number(e.target.value))}
//             className="px-2 py-1 border border-gray-200 rounded-md bg-gray-50"
//           >
//             <option value={0}>All</option>
//             <option value={3}>3+</option>
//             <option value={4}>4+</option>
//             <option value={5}>5</option>
//           </select>
//         </div>

//         {/* Search */}
//         <div className="relative w-full sm:w-72 mt-2 sm:mt-0">
//           <input
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search by name or address..."
//             className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md outline-none"
//           />
//           <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//         </div>
//       </div>

//       {/* 🏨 Hotel Cards */}
//       <div className="space-y-4">
//         {filtered.map((hotel, index) => {
//           const price = getHotelPrice(hotel);

//           return (
//             <div
//               key={index}
//               onClick={() => handleCardClick(hotel.id)}
//               className="relative bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer group"
//             >
//               {/* Mobile View */}
//               <div className="flex sm:hidden items-center p-3 min-h-[120px]">
//                 <div className="w-28 h-28 flex-shrink-0">
//                   <img
//                     src={
//                       hotel.images
//                         ? `${API_URL}/uploads/hotels/${
//                             Array.isArray(hotel.images)
//                               ? hotel.images[0]
//                               : String(hotel.images).split(",")[0]
//                           }`
//                         : "https://via.placeholder.com/200x150"
//                     }
//                     alt={hotel.hotel_name}
//                     className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
//                   />
//                 </div>
//                 <div className="flex-1 ml-3">
//                   <h3 className="text-base font-semibold text-gray-800 group-hover:text-orange-500 transition-colors">
//                     {hotel.hotel_name}
//                   </h3>
//                   <p className="text-xs text-gray-500 mt-1 line-clamp-1">
//                     {hotel.address}
//                   </p>

//                   {/* Stars */}
//                   <div className="flex mt-2 space-x-1">
//                     {Array.from({ length: 5 }).map((_, i) => (
//                       <FaStar
//                         key={i}
//                         className={`text-xs ${
//                           i < (hotel.rating || 4)
//                             ? "text-orange-500"
//                             : "text-gray-300"
//                         }`}
//                       />
//                     ))}
//                   </div>

//                   <p className="text-sm font-bold text-orange-500 mt-2">
//                     From ₹{price.toLocaleString("en-IN")}
//                   </p>
//                 </div>
//               </div>

//               {/* Desktop View */}
//               <div className="hidden sm:flex flex-row items-stretch">
//                 <div className="w-1/4 flex-shrink-0 relative left-4 top-[6px]">
//                   <img
//                     src={
//                       hotel.images
//                         ? `${API_URL}/uploads/hotels/${
//                             Array.isArray(hotel.images)
//                               ? hotel.images[0]
//                               : String(hotel.images).split(",")[0]
//                           }`
//                         : "https://via.placeholder.com/250x150"
//                     }
//                     alt={hotel.hotel_name}
//                     className="w-[90%] h-36 object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
//                   />
//                 </div>

//                 <div className="flex-1 px-4 py-4">
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <h3 className="text-base md:text-lg font-semibold text-gray-800 group-hover:text-orange-500 transition-colors">
//                         {hotel.hotel_name}
//                       </h3>
//                       <p className="text-sm text-gray-500 mt-1 flex items-center">
//                         <FaMapMarkerAlt className="text-orange-500 mr-2" />
//                         {hotel.address}
//                       </p>

//                       {hotel.instantConfirmation && (
//                         <p className="flex items-center text-sm text-gray-600 mt-3">
//                           <FaCheckCircle className="text-orange-500 mr-2" />
//                           INSTANT CONFIRMATION
//                         </p>
//                       )}

//                       <div className="mt-3 flex flex-wrap gap-3">
//                         <span className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1 rounded">
//                           <FaClipboardList className="text-orange-500" />{" "}
//                           Description
//                         </span>
//                         <span className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1 rounded">
//                           <FaHotel className="text-orange-500" /> Facilities
//                         </span>
//                         <span className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1 rounded">
//                           <FaMap className="text-orange-500" /> Map
//                         </span>
//                         <span className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1 rounded">
//                           <FaStreetView className="text-orange-500" /> Street
//                           View
//                         </span>
//                       </div>
//                     </div>

//                     <div className="hidden md:flex flex-col items-end ml-4">
//                       <div className="flex space-x-1 mb-2">
//                         {Array.from({ length: 5 }).map((_, i) => (
//                           <FaStar
//                             key={i}
//                             className={`text-sm ${
//                               i < (hotel.rating || 4)
//                                 ? "text-orange-500"
//                                 : "text-gray-200"
//                             }`}
//                           />
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="w-56 flex-shrink-0 border-l border-gray-100 flex flex-col justify-between items-center p-4">
//                   <div className="text-center sm:text-right">
//                     <p className="text-xs text-gray-400 uppercase">From</p>
//                     <p className="text-xl md:text-2xl font-bold text-gray-800">
//                       ₹{price.toLocaleString("en-IN")}
//                     </p>
//                     <p className="text-blue-500 text-xs md:text-sm font-medium">
//                       PER NIGHT
//                     </p>
//                   </div>

//                   <button className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-3 py-2 rounded">
//                     SELECT
//                   </button>
//                 </div>
//               </div>
//             </div>
//           );
//         })}

//         {filtered.length === 0 && (
//           <div className="text-center py-8 text-gray-500">
//             No hotels match your filters
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import {
  FaCheckCircle,
  FaClipboardList,
  FaFilter,
  FaHotel,
  FaMap,
  FaMapMarkerAlt,
  FaSearch,
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaStar,
  FaStreetView,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../../contexts/CurrencyContext";

export default function AllRooms() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const { convertAndFormat } = useCurrency();

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("price-low");
  const [nameOrder, setNameOrder] = useState("asc");
  const [hotels, setHotels] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Hardcoded hotels data as fallback
  const hardcodedHotels = [
    {
      id: 1,
      hotel_name: "Grand Luxury Hotel",
      address: "123 Main Street, Dubai, UAE",
      description: "A luxurious 5-star hotel in the heart of Dubai with stunning views and world-class amenities.",
      facilities: "Swimming Pool, Spa, Gym, Restaurant, Bar, Free WiFi, Parking, Airport Shuttle",
      rooms: [
        { type: "Deluxe Room", price: 200, price_per_night: 200 },
        { type: "Suite", price: 400, price_per_night: 400 },
      ],
      images: JSON.stringify(["hotel1.jpg", "hotel2.jpg"]),
    },
    {
      id: 2,
      hotel_name: "Seaside Resort",
      address: "456 Beach Road, Maldives",
      description: "Beautiful beachfront resort with private villas and direct beach access.",
      facilities: "Private Beach, Water Sports, Spa, Restaurant, Bar, Free WiFi",
      rooms: [
        { type: "Beach Villa", price: 300, price_per_night: 300 },
        { type: "Water Villa", price: 500, price_per_night: 500 },
      ],
      images: JSON.stringify(["resort1.jpg", "resort2.jpg"]),
    },
    {
      id: 3,
      hotel_name: "City Center Hotel",
      address: "789 Downtown Avenue, New York, USA",
      description: "Modern hotel in the heart of Manhattan, close to major attractions.",
      facilities: "Fitness Center, Business Center, Restaurant, Bar, Free WiFi",
      rooms: [
        { type: "Standard Room", price: 150, price_per_night: 150 },
        { type: "Executive Room", price: 250, price_per_night: 250 },
      ],
      images: JSON.stringify(["cityhotel1.jpg", "cityhotel2.jpg"]),
    },
  ];

  // ✅ Fetch all hotels with room data
  useEffect(() => {
    fetch(`${API_URL}/api/hotels`)
      .then((res) => res.json())
      .then((data) => {
        const hotelsData = Array.isArray(data) ? data : [];
        setHotels(hotelsData.length > 0 ? hotelsData : hardcodedHotels);
      })
      .catch((err) => {
        console.error("Error fetching hotels:", err);
        setHotels(hardcodedHotels);
      });
  }, [API_URL]);

  // ✅ Extract dynamic price from any available key or nested room
  const getHotelPrice = (h) => {
    if (h.rooms && h.rooms.length > 0) {
      return (
        Number(
          h.rooms[0].price_per_night ??
            h.rooms[0].price ??
            h.rooms[0].room_price ??
            0
        ) || 0
      );
    }
    return (
      Number(
        h.price_per_night ?? h.pricePerNight ?? h.room_price ?? h.price ?? 0
      ) || 0
    );
  };

  // ✅ Filter & Sort hotels
  const filtered = useMemo(() => {
    let result = hotels.filter((h) => {
      const price = getHotelPrice(h);
      const matchesQuery = `${h.hotel_name || ""} ${h.address || ""}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesPrice =
        (!minPrice || price >= minPrice) && (!maxPrice || price <= maxPrice);
      return matchesQuery && matchesPrice;
    });

    result.sort((a, b) => {
      const priceA = getHotelPrice(a);
      const priceB = getHotelPrice(b);
      if (sort === "price-low") return priceA - priceB;
      if (sort === "price-high") return priceB - priceA;
      if (nameOrder === "asc")
        return (a.hotel_name || "").localeCompare(b.hotel_name || "");
      if (nameOrder === "desc")
        return (b.hotel_name || "").localeCompare(a.hotel_name || "");
      return 0;
    });

    return result;
  }, [hotels, query, sort, nameOrder, minPrice, maxPrice]);

  const toggleNameOrder = () =>
    setNameOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  const handleCardClick = (hotelId) => navigate(`/hotels/${hotelId}`);

  return (
    <section className="max-w-6xl mx-auto px-4 py-6 pb-24">
      {/* 🔍 Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <FaFilter className="text-orange-500" /> Filters
          </span>

          {/* Sort dropdown */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded-md shadow-sm outline-none w-full sm:w-auto"
          >
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          {/* Sort by name */}
          <button
            type="button"
            onClick={toggleNameOrder}
            className="flex items-center justify-center gap-2 text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded-md shadow-sm hover:bg-gray-100 w-full sm:w-auto"
          >
            <span>Hotel Name</span>
            {nameOrder === "asc" ? (
              <FaSortAlphaDown className="text-gray-600" />
            ) : (
              <FaSortAlphaUp className="text-gray-600" />
            )}
          </button>
        </div>

        {/* 💰 Price Range */}
        <div className="flex items-center gap-2 text-sm mt-2 sm:mt-0">
          <input
            type="number"
            placeholder="Min ₹"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-20 sm:w-24 px-2 py-1 border border-gray-200 rounded-md bg-gray-50 outline-none"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max ₹"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-20 sm:w-24 px-2 py-1 border border-gray-200 rounded-md bg-gray-50 outline-none"
          />
        </div>

        {/* 🔎 Search */}
        <div className="relative w-full sm:w-72 mt-2 sm:mt-0">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or address..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md outline-none"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* 🏨 Hotel Cards */}
      <div className="space-y-4">
        {filtered.map((hotel, index) => {
          const price = getHotelPrice(hotel);

          return (
            <div
              key={index}
              onClick={() => handleCardClick(hotel.id)}
              className="relative bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer group"
            >
              {/* 📱 Mobile View */}
              <div className="flex sm:hidden items-center p-3 min-h-[120px]">
                <div className="w-28 h-28 flex-shrink-0">
                  <img
                    src={
                      hotel.images
                        ? `${API_URL}/uploads/hotels/${
                            Array.isArray(hotel.images)
                              ? hotel.images[0]
                              : String(hotel.images).split(",")[0]
                          }`
                        : "https://via.placeholder.com/200x150"
                    }
                    alt={hotel.hotel_name}
                    className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 ml-3">
                  <h3 className="text-base font-semibold text-gray-800 group-hover:text-orange-500 transition-colors">
                    {hotel.hotel_name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {hotel.address}
                  </p>

                  <div className="flex mt-2 space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-xs ${
                          i < (hotel.rating || 4)
                            ? "text-orange-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-sm font-bold text-orange-500 mt-2">
                    From ₹{price.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* 💻 Desktop View */}
              <div className="hidden sm:flex flex-row items-stretch">
                <div className="w-1/4 flex-shrink-0 relative left-4 top-[6px]">
                  <img
                    src={
                      hotel.images
                        ? `${API_URL}/uploads/hotels/${
                            Array.isArray(hotel.images)
                              ? hotel.images[0]
                              : String(hotel.images).split(",")[0]
                          }`
                        : "https://via.placeholder.com/250x150"
                    }
                    alt={hotel.hotel_name}
                    className="w-[90%] h-36 object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex-1 px-4 py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-gray-800 group-hover:text-orange-500 transition-colors">
                        {hotel.hotel_name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 flex items-center">
                        <FaMapMarkerAlt className="text-orange-500 mr-2" />
                        {hotel.address}
                      </p>

                      {hotel.instantConfirmation && (
                        <p className="flex items-center text-sm text-gray-600 mt-3">
                          <FaCheckCircle className="text-orange-500 mr-2" />
                          INSTANT CONFIRMATION
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-3">
                        <span className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1 rounded">
                          <FaClipboardList className="text-orange-500" />{" "}
                          Description
                        </span>
                        <span className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1 rounded">
                          <FaHotel className="text-orange-500" /> Facilities
                        </span>
                        <span className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1 rounded">
                          <FaMap className="text-orange-500" /> Map
                        </span>
                        <span className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1 rounded">
                          <FaStreetView className="text-orange-500" /> Street
                          View
                        </span>
                      </div>
                    </div>

                    <div className="hidden md:flex flex-col items-end ml-4">
                      <div className="flex space-x-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-sm ${
                              i < (hotel.rating || 4)
                                ? "text-orange-500"
                                : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-56 flex-shrink-0 border-l border-gray-100 flex flex-col justify-between items-center p-4">
                  <div className="text-center sm:text-right">
                    <p className="text-xs text-gray-400 uppercase">From</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-800">
                      {convertAndFormat(price)}
                    </p>
                    <p className="text-blue-500 text-xs md:text-sm font-medium">
                      PER NIGHT
                    </p>
                  </div>

                  <button className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-3 py-2 rounded">
                    SELECT
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hotels match your filters
          </div>
        )}
      </div>
    </section>
  );
}
