// import { useEffect, useMemo, useRef, useState } from "react";
// import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// export default function Hero({ onSearch, defaultDestination = "" }) {
//   const API_URL = import.meta.env.VITE_API_URL;

//   const [destination, setDestination] = useState(defaultDestination);
//   const [suggestOpen, setSuggestOpen] = useState(false);
//   const [options, setOptions] = useState([]);
//   const [bgIndex, setBgIndex] = useState(0);
//   const destWrapRef = useRef(null);

//   // Fetch dynamic backgrounds
//   const [apiBackgrounds, setApiBackgrounds] = useState([]);
//   const defaultBackgrounds = useMemo(
//     () => [
//       "./hotels/h1.jpg",
//       "./hotels/h2.jpg",
//       "./hotels/h3.jpg",
//       "./hotels/h4.jpg",
//     ],
//     []
//   );

//   useEffect(() => {
//     fetch(`${API_URL}/api/hero/hotels`)
//       .then((r) => r.json())
//       .then((res) => {
//         const imgs = res?.data?.images || [];
//         if (imgs.length) setApiBackgrounds(imgs.map((p) => `${API_URL}${p}`));
//       })
//       .catch(() => {});
//   }, [API_URL]);

//   const rotationList = useMemo(() => {
//     return apiBackgrounds.length ? apiBackgrounds : defaultBackgrounds;
//   }, [apiBackgrounds, defaultBackgrounds]);

//   // Auto-rotate backgrounds
//   useEffect(() => {
//     const id = setInterval(() => {
//       setBgIndex((i) => (i + 1) % rotationList.length);
//     }, 7000);
//     return () => clearInterval(id);
//   }, [rotationList]);

//   // Navigation handlers
//   const handlePrev = () => {
//     setBgIndex((prev) => (prev === 0 ? rotationList.length - 1 : prev - 1));
//   };
//   const handleNext = () => {
//     setBgIndex((prev) => (prev + 1) % rotationList.length);
//   };

//   // Fetch hotel/city suggestions
//   useEffect(() => {
//     if (!suggestOpen || options.length) return;
//     let alive = true;
//     fetch(`${API_URL}/api/hotels`)
//       .then((r) => r.json())
//       .then((rows) => {
//         if (!alive) return;
//         const set = new Set();
//         for (const h of Array.isArray(rows) ? rows : []) {
//           if (h.hotel_name) set.add(h.hotel_name);
//           if (h.address) {
//             const parts = h.address.split(",").map((p) => p.trim());
//             if (parts.length) set.add(parts[parts.length - 1]);
//           }
//         }
//         setOptions(Array.from(set));
//       })
//       .catch(() => {});
//     return () => (alive = false);
//   }, [suggestOpen, options.length, API_URL]);

//   const filteredOptions = useMemo(() => {
//     if (!destination) return options.slice(0, 8);
//     return options
//       .filter((o) => o.toLowerCase().includes(destination.toLowerCase()))
//       .slice(0, 8);
//   }, [options, destination]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!destination) return;
//     onSearch?.({ destination });
//   };

//   return (
//     <>
//       {/* Hero Section */}
//       {/* <section className="relative h-[65vh] w-full overflow-hidden select-none flex items-center justify-center"> */}
//       <section className="relative h-[20vh] sm:h-[50vh] md:h-[350px] w-full overflow-hidden select-none flex items-center justify-center">
//         {/* Background Images */}
//         {rotationList.map((src, idx) => (
//           <img
//             key={idx}
//             src={src}
//             alt="Hero Background"
//             className={`absolute inset-0 w-full h-full object-fill transition-opacity duration-1000 ${
//               idx === bgIndex ? "opacity-100" : "opacity-0"
//             }`}
//           />
//         ))}
//         <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />

//         {/* Centered Search Input */}
//         <div className="absolute inset-0 items-center justify-center z-10 px-4 hidden md:flex">
//           <form onSubmit={handleSubmit} className="w-full max-w-md">
//             <div ref={destWrapRef} className="relative">
//               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="w-5 h-5"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M12 2C8.686 2 6 4.686 6 8c0 4.418 6 12 6 12s6-7.582 6-12c0-3.314-2.686-6-6-6Zm0 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
//                 </svg>
//               </span>
//               <input
//                 type="text"
//                 placeholder="Search hotels or cities"
//                 value={destination}
//                 onChange={(e) => {
//                   setDestination(e.target.value);
//                   setSuggestOpen(true);
//                 }}
//                 onFocus={() => setSuggestOpen(true)}
//                 className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white shadow-xl"
//                 autoComplete="off"
//               />
//               {suggestOpen && filteredOptions.length > 0 && (
//                 <ul className="absolute left-0 right-0 mt-1 max-h-60 overflow-auto bg-white border border-gray-200 rounded-xl shadow-lg z-50">
//                   {filteredOptions.map((opt) => (
//                     <li key={opt}>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setDestination(opt);
//                           setSuggestOpen(false);
//                         }}
//                         className="w-full text-left px-3 py-2 hover:bg-gray-50"
//                       >
//                         {opt}
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </form>
//         </div>

//         {/* Right Bottom Arrows (Desktop Only) */}
//         <div className="absolute bottom-6 right-6 gap-3 z-20 hidden md:flex">
//           <button
//             onClick={handlePrev}
//             className="w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition"
//           >
//             <FaArrowLeft className="text-gray-800" />
//           </button>
//           <button
//             onClick={handleNext}
//             className="w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition"
//           >
//             <FaArrowRight className="text-gray-800" />
//           </button>
//         </div>
//       </section>

//       {/* Mobile Search Input (same position as main hero) */}
//       <div className="md:hidden relative -top-8 z-20 px-4">
//         <div className="bg-white rounded-full shadow-xl flex items-center px-4 py-4 w-full border border-gray-200">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="currentColor"
//             viewBox="0 0 24 24"
//             className="text-gray-500 mr-3 w-5 h-5"
//           >
//             <path d="M12 2C8.686 2 6 4.686 6 8c0 4.418 6 12 6 12s6-7.582 6-12c0-3.314-2.686-6-6-6Zm0 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
//           </svg>
//           <input
//             type="text"
//             placeholder="Search hotels or cities"
//             className="w-full outline-none text-gray-700 font-medium placeholder-gray-500 text-sm"
//             value={destination}
//             onChange={(e) => setDestination(e.target.value)}
//             readOnly
//           />
//         </div>
//       </div>
//     </>
//   );
// }

// import { useEffect, useRef, useState } from "react";
// import {
//   FaArrowLeft,
//   FaArrowRight,
//   FaClock,
//   FaHotel,
//   FaMapMarkerAlt,
//   FaSearch,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// export default function HotelHero() {
//   const API_BASE = import.meta.env.VITE_API_URL || "";
//   const fallbackSlides = [
//     "./hotels/h1.jpg",
//     "./hotels/h2.jpg",
//     "./hotels/h3.jpg",
//     "./hotels/h4.jpg",
//   ];

//   const [slides, setSlides] = useState(fallbackSlides);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Search state
//   const [query, setQuery] = useState("");
//   const [hotels, setHotels] = useState([]);
//   const [suggestions, setSuggestions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [highlighted, setHighlighted] = useState(-1);
//   const [hoveredHeroImage, setHoveredHeroImage] = useState(null);
//   const [searchHistory, setSearchHistory] = useState([]);

//   const inputRef = useRef(null);
//   const containerRef = useRef(null);
//   const debounceRef = useRef(null);

//   const navigate = useNavigate();

//   // Load search history from localStorage
//   useEffect(() => {
//     const saved = localStorage.getItem("hotelSearchHistory");
//     if (saved) {
//       try {
//         const history = JSON.parse(saved);
//         setSearchHistory(history.slice(0, 5));
//       } catch (e) {
//         console.error("Failed to load search history:", e);
//       }
//     }
//   }, []);

//   // Save search history to localStorage
//   const saveToSearchHistory = (searchTerm) => {
//     if (!searchTerm.trim()) return;

//     const updatedHistory = [
//       searchTerm,
//       ...searchHistory.filter(
//         (item) => item.toLowerCase() !== searchTerm.toLowerCase()
//       ),
//     ].slice(0, 5);

//     setSearchHistory(updatedHistory);
//     localStorage.setItem("hotelSearchHistory", JSON.stringify(updatedHistory));
//   };

//   // Fetch hero slides
//   useEffect(() => {
//     let alive = true;
//     fetch(`${API_BASE}/api/hero/hotels`)
//       .then((res) => res.json())
//       .then((data) => {
//         const imgs = data?.data?.images || [];
//         if (alive && imgs.length) setSlides(imgs.map((p) => `${API_BASE}${p}`));
//       })
//       .catch(() => {});
//     return () => {
//       alive = false;
//     };
//   }, [API_BASE]);

//   // Fetch hotels from your database
//   useEffect(() => {
//     let alive = true;
//     setLoading(true);

//     fetch(`${API_BASE}/api/hotels`)
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch hotels");
//         return res.json();
//       })
//       .then((data) => {
//         if (!alive) return;

//         console.log("Raw hotels data:", data);

//         // Handle different response formats
//         const hotelsData = Array.isArray(data)
//           ? data
//           : data.data || data.rows || [];

//         const normalizedHotels = hotelsData.map((hotel) => {
//           let previewImage = "";

//           // Parse images array from images field
//           if (hotel.images) {
//             try {
//               const imagesArray =
//                 typeof hotel.images === "string"
//                   ? JSON.parse(hotel.images)
//                   : hotel.images;

//               if (Array.isArray(imagesArray) && imagesArray.length > 0) {
//                 previewImage = imagesArray[0];
//               }
//             } catch (err) {
//               // If JSON parsing fails, try comma-separated
//               if (
//                 typeof hotel.images === "string" &&
//                 hotel.images.includes(",")
//               ) {
//                 const images = hotel.images
//                   .split(",")
//                   .map((img) => img.trim())
//                   .filter((img) => img);
//                 if (images.length > 0) previewImage = images[0];
//               } else if (hotel.images) {
//                 previewImage = hotel.images;
//               }
//             }
//           }

//           // Construct proper image URL
//           if (
//             previewImage &&
//             !previewImage.startsWith("http") &&
//             !previewImage.startsWith("data:")
//           ) {
//             previewImage = `${API_BASE}/uploads/hotels/${previewImage}`;
//           }

//           // Extract city from address for better search
//           let city = "";
//           if (hotel.address) {
//             const addressParts = hotel.address
//               .split(",")
//               .map((part) => part.trim());
//             if (addressParts.length > 1) {
//               city =
//                 addressParts[addressParts.length - 2] ||
//                 addressParts[addressParts.length - 1];
//             } else {
//               city = hotel.address;
//             }
//           }

//           return {
//             id: hotel.id,
//             hotel_name: hotel.hotel_name || "Unnamed Hotel",
//             address: hotel.address || "",
//             city: city,
//             description: hotel.description || "",
//             facilities: hotel.facilities || "",
//             previewImage: previewImage,
//             searchableText: `
//               ${hotel.hotel_name || ""} 
//               ${hotel.address || ""} 
//               ${city}
//               ${hotel.facilities || ""}
//             `.toLowerCase(),
//             ...hotel,
//           };
//         });

//         console.log("Normalized hotels:", normalizedHotels);
//         setHotels(normalizedHotels);
//       })
//       .catch((error) => {
//         console.error("Failed to fetch hotels:", error);
//         setHotels([]);
//       })
//       .finally(() => {
//         if (alive) setLoading(false);
//       });

//     return () => {
//       alive = false;
//     };
//   }, [API_BASE]);

//   // Auto-slide
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % slides.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [slides.length]);

//   // Search functionality
//   useEffect(() => {
//     clearTimeout(debounceRef.current);

//     debounceRef.current = setTimeout(() => {
//       if (!query.trim()) {
//         setSuggestions([]);
//         return;
//       }

//       const searchTerm = query.toLowerCase().trim();

//       const matches = hotels.filter((hotel) => {
//         return hotel.searchableText.includes(searchTerm);
//       });

//       console.log("Search matches:", matches);
//       setSuggestions(matches.slice(0, 8));
//     }, 200);

//     return () => clearTimeout(debounceRef.current);
//   }, [query, hotels]);

//   // Update hovered image
//   useEffect(() => {
//     if (highlighted >= 0 && suggestions[highlighted]) {
//       setHoveredHeroImage(suggestions[highlighted].previewImage || null);
//     } else {
//       setHoveredHeroImage(null);
//     }
//   }, [highlighted, suggestions]);

//   // Close dropdown on outside click
//   useEffect(() => {
//     function handleClick(e) {
//       if (containerRef.current && !containerRef.current.contains(e.target)) {
//         setOpen(false);
//         setHighlighted(-1);
//       }
//     }

//     const timer = setTimeout(() => {
//       document.addEventListener("click", handleClick);
//     }, 100);

//     return () => {
//       clearTimeout(timer);
//       document.removeEventListener("click", handleClick);
//     };
//   }, []);

//   const handlePrev = () =>
//     setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

//   const handleNext = () =>
//     setCurrentIndex((prev) => (prev + 1) % slides.length);

//   // Navigate to hotel detail page
//   const pickSuggestion = (hotel) => {
//     console.log("Selected hotel:", hotel);
//     const searchText = hotel.hotel_name || "";
//     setQuery(searchText);
//     setOpen(false);
//     setSuggestions([]);
//     setHighlighted(-1);
//     saveToSearchHistory(searchText);

//     if (hotel.id) {
//       navigate(`/hotels/${hotel.id}`);
//     }
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (query.trim()) {
//       saveToSearchHistory(query.trim());
//       navigate(`/hotels?search=${encodeURIComponent(query)}`);
//     }
//   };

//   const clearSearchHistory = () => {
//     setSearchHistory([]);
//     localStorage.removeItem("hotelSearchHistory");
//   };

//   const onKeyDown = (e) => {
//     if (!open) return;

//     switch (e.key) {
//       case "ArrowDown":
//         e.preventDefault();
//         setHighlighted((prev) =>
//           prev < suggestions.length - 1 ? prev + 1 : 0
//         );
//         break;
//       case "ArrowUp":
//         e.preventDefault();
//         setHighlighted((prev) =>
//           prev > 0 ? prev - 1 : suggestions.length - 1
//         );
//         break;
//       case "Enter":
//         e.preventDefault();
//         if (highlighted >= 0 && suggestions[highlighted]) {
//           pickSuggestion(suggestions[highlighted]);
//         } else if (query.trim()) {
//           handleSearchSubmit(e);
//         }
//         break;
//       case "Escape":
//         setOpen(false);
//         setHighlighted(-1);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle input focus
//   const handleInputFocus = () => {
//     setOpen(true);
//   };

//   // Handle input change
//   const handleInputChange = (e) => {
//     setQuery(e.target.value);
//     setOpen(true);
//   };

//   // Simple text highlighter
//   const HighlightText = ({ text, highlight }) => {
//     if (!text || !highlight) return text;

//     try {
//       const parts = text.split(new RegExp(`(${highlight})`, "gi"));
//       return (
//         <span>
//           {parts.map((part, i) =>
//             part.toLowerCase() === highlight.toLowerCase() ? (
//               <mark key={i} className="bg-yellow-200 px-1 rounded">
//                 {part}
//               </mark>
//             ) : (
//               part
//             )
//           )}
//         </span>
//       );
//     } catch (error) {
//       return text;
//     }
//   };

//   return (
//     <>
//       {/* Hero Section */}
//       <div className="relative h-[20vh] md:h-[500px] lg:h-[350px] overflow-visible select-none">
//         {/* Background slides */}
//         <div className="absolute inset-0 transition-all duration-1000">
//           {slides.map((img, i) => (
//             <img
//               key={i}
//               src={img}
//               alt={`hotel-slide-${i}`}
//               className={`absolute w-full h-full object-fill transition-opacity duration-1000 ${
//                 i === currentIndex ? "opacity-100" : "opacity-0"
//               }`}
//               draggable={false}
//             />
//           ))}
//           <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30 pointer-events-none"></div>
//         </div>

//         {/* Desktop Search */}
//         <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 px-4 hidden md:flex w-full max-w-4xl">
//           <div
//             ref={containerRef}
//             className="w-full max-w-[600px]  mx-auto top-16 relative"
//           >
//             <form onSubmit={handleSearchSubmit} className="relative">
//               <div className="bg-white rounded-2xl shadow-2xl flex items-center px-6 py-4 w-full backdrop-blur-sm border border-gray-100">
//                 <FaSearch className="text-gray-400 mr-3 w-5 h-5 flex-shrink-0" />
//                 <input
//                   ref={inputRef}
//                   type="text"
//                   placeholder="Search hotels, cities, or locations..."
//                   className="w-full outline-none text-gray-700 font-medium bg-transparent placeholder-gray-400 text-lg"
//                   value={query}
//                   onChange={handleInputChange}
//                   onFocus={handleInputFocus}
//                   onKeyDown={onKeyDown}
//                 />
//                 {query && (
//                   <button
//                     type="button"
//                     onClick={() => setQuery("")}
//                     className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
//                   >
//                     ✕
//                   </button>
//                 )}
//               </div>
//             </form>

//             {/* Search Results Dropdown */}
//             {open && (
//               <div className="absolute mt-4 w-full bg-white rounded-2xl shadow-2xl max-h-96 overflow-hidden z-50 border border-gray-200">
//                 {/* Preview image */}
//                 {hoveredHeroImage && (
//                   <div className="absolute -top-52 left-1/2 transform -translate-x-1/2 w-80 h-48 rounded-xl overflow-hidden shadow-2xl z-50 border-2 border-white">
//                     <img
//                       src={hoveredHeroImage}
//                       alt="hotel preview"
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         e.target.style.display = "none";
//                       }}
//                     />
//                   </div>
//                 )}

//                 {/* Loading State */}
//                 {loading && query && (
//                   <div className="p-6 text-center text-gray-500">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
//                     Searching hotels...
//                   </div>
//                 )}

//                 {/* Search Results */}
//                 {!loading && suggestions.length > 0 && (
//                   <>
//                     <div className="p-4 border-b border-gray-100 bg-gray-50">
//                       <div className="text-sm font-semibold text-gray-700">
//                         Hotels ({suggestions.length})
//                       </div>
//                     </div>
//                     <div className="max-h-80 overflow-y-auto">
//                       {suggestions.map((hotel, index) => (
//                         <div
//                           key={hotel.id || index}
//                           className={`flex items-center gap-4 p-4 cursor-pointer transition-all duration-200 border-b border-gray-100 last:border-b-0 ${
//                             highlighted === index
//                               ? "bg-blue-50 border-l-4 border-l-blue-500"
//                               : "hover:bg-gray-50"
//                           }`}
//                           onMouseEnter={() => setHighlighted(index)}
//                           onClick={() => pickSuggestion(hotel)}
//                         >
//                           <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
//                             {hotel.previewImage ? (
//                               <img
//                                 src={hotel.previewImage}
//                                 alt={hotel.hotel_name}
//                                 className="w-full h-full object-cover"
//                                 onError={(e) => {
//                                   e.target.style.display = "none";
//                                   e.target.nextSibling.style.display = "flex";
//                                 }}
//                               />
//                             ) : null}
//                             <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center hidden">
//                               <FaHotel className="text-gray-400" />
//                             </div>
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <div className="text-base font-semibold text-gray-900 mb-1">
//                               <HighlightText
//                                 text={hotel.hotel_name}
//                                 highlight={query}
//                               />
//                             </div>
//                             <div className="flex items-center gap-3 text-sm text-gray-600 mb-1">
//                               {hotel.city && (
//                                 <span className="flex items-center gap-1">
//                                   <FaMapMarkerAlt className="w-3 h-3" />
//                                   <HighlightText
//                                     text={hotel.city}
//                                     highlight={query}
//                                   />
//                                 </span>
//                               )}
//                               {hotel.facilities && (
//                                 <span className="flex items-center gap-1">
//                                   <FaHotel className="w-3 h-3" />
//                                   <span className="truncate">
//                                     {hotel.facilities
//                                       .split(",")
//                                       .slice(0, 2)
//                                       .join(", ")}
//                                   </span>
//                                 </span>
//                               )}
//                             </div>
//                             {hotel.description && (
//                               <div className="text-sm text-gray-500 line-clamp-1">
//                                 {hotel.description}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 )}

//                 {/* No Results */}
//                 {!loading && query && suggestions.length === 0 && (
//                   <div className="p-8 text-center">
//                     <FaSearch className="mx-auto text-gray-300 text-3xl mb-3" />
//                     <div className="text-gray-500 font-medium mb-2">
//                       No hotels found
//                     </div>
//                     <div className="text-sm text-gray-400">
//                       Try different keywords or locations
//                     </div>
//                   </div>
//                 )}

//                 {/* Recent Searches */}
//                 {!loading && !query && searchHistory.length > 0 && (
//                   <>
//                     <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
//                       <div className="text-sm font-semibold text-gray-700">
//                         Recent Searches
//                       </div>
//                       <button
//                         onClick={clearSearchHistory}
//                         className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
//                       >
//                         Clear all
//                       </button>
//                     </div>
//                     <div className="p-2">
//                       {searchHistory.map((search, index) => (
//                         <button
//                           key={index}
//                           onClick={() => setQuery(search)}
//                           className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700"
//                         >
//                           <FaClock className="text-gray-400 w-4 h-4" />
//                           {search}
//                         </button>
//                       ))}
//                     </div>
//                   </>
//                 )}

//                 {/* Empty State */}
//                 {!loading && !query && searchHistory.length === 0 && (
//                   <div className="p-6 text-center text-gray-500">
//                     <div className="text-sm">Start typing to search hotels</div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Navigation Arrows */}
//         <div className="absolute bottom-8 right-8 gap-3 z-20 hidden md:flex">
//           <button
//             onClick={handlePrev}
//             className="w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
//           >
//             <FaArrowLeft className="text-gray-800" />
//           </button>
//           <button
//             onClick={handleNext}
//             className="w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
//           >
//             <FaArrowRight className="text-gray-800" />
//           </button>
//         </div>
//       </div>

//       {/* Mobile Search */}
//       <div className="md:hidden relative -top-12 z-30 px-4">
//         <div ref={containerRef} className="relative">
//           <form onSubmit={handleSearchSubmit}>
//             <div className="bg-white rounded-2xl shadow-xl flex items-center px-4 py-4 w-full border border-gray-200">
//               <FaSearch className="text-gray-400 mr-3 w-5 h-5 flex-shrink-0" />
//               <input
//                 type="text"
//                 placeholder="Search hotels..."
//                 className="w-full outline-none text-gray-700 font-medium placeholder-gray-500 text-base"
//                 value={query}
//                 onChange={handleInputChange}
//                 onFocus={handleInputFocus}
//               />
//             </div>
//           </form>

//           {/* Mobile Suggestions */}
//           {open && (suggestions.length > 0 || searchHistory.length > 0) && (
//             <div className="absolute mt-3 w-full bg-white rounded-2xl shadow-2xl max-h-80 overflow-auto z-50 border border-gray-200">
//               {suggestions.length > 0
//                 ? suggestions.map((hotel, index) => (
//                     <div
//                       key={hotel.id || index}
//                       onClick={() => pickSuggestion(hotel)}
//                       className="flex items-center gap-3 p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
//                     >
//                       <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
//                         {hotel.previewImage ? (
//                           <img
//                             src={hotel.previewImage}
//                             alt={hotel.hotel_name}
//                             className="w-full h-full object-cover"
//                           />
//                         ) : (
//                           <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                             <FaHotel className="text-gray-400" />
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <div className="text-sm font-semibold text-gray-800 truncate">
//                           {hotel.hotel_name}
//                         </div>
//                         <div className="text-xs text-gray-500 truncate">
//                           {hotel.city}
//                         </div>
//                         {hotel.facilities && (
//                           <div className="text-xs text-gray-400 mt-1 truncate">
//                             {hotel.facilities.split(",").slice(0, 2).join(", ")}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))
//                 : searchHistory.map((search, index) => (
//                     <button
//                       key={index}
//                       onClick={() => setQuery(search)}
//                       className="w-full text-left p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700"
//                     >
//                       <FaClock className="text-gray-400 w-3 h-3" />
//                       {search}
//                     </button>
//                   ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }


import { useEffect, useRef, useState } from "react";
import {
    FaArrowLeft,
    FaArrowRight,
    FaClock,
    FaHotel,
    FaMapMarkerAlt,
    FaSearch,
    FaTag,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function HotelHero() {
  const API_BASE = import.meta.env.VITE_API_URL || "";
  const fallbackSlides = [
    "./hotels/h1.jpg",
    "./hotels/h2.jpg",
    "./hotels/h3.jpg",
    "./hotels/h4.jpg",
  ];

  const [slides, setSlides] = useState(fallbackSlides);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Search state
  const [query, setQuery] = useState("");
  const [hotels, setHotels] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [hoveredHeroImage, setHoveredHeroImage] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  const navigate = useNavigate();

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("hotelSearchHistory");
    if (saved) {
      try {
        const history = JSON.parse(saved);
        setSearchHistory(history.slice(0, 5));
      } catch (e) {
        console.error("Failed to load search history:", e);
      }
    }
  }, []);

  // Save search history to localStorage
  const saveToSearchHistory = (searchTerm) => {
    if (!searchTerm.trim()) return;

    const updatedHistory = [
      searchTerm,
      ...searchHistory.filter(
        (item) => item.toLowerCase() !== searchTerm.toLowerCase()
      ),
    ].slice(0, 5);

    setSearchHistory(updatedHistory);
    localStorage.setItem("hotelSearchHistory", JSON.stringify(updatedHistory));
  };

  // Fetch hero slides
  useEffect(() => {
    let alive = true;
    fetch(`${API_BASE}/api/hero/hotels`)
      .then((res) => res.json())
      .then((data) => {
        const imgs = data?.data?.images || [];
        if (alive && imgs.length) setSlides(imgs.map((p) => `${API_BASE}${p}`));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [API_BASE]);

  // Fetch hotels from your database
  useEffect(() => {
    let alive = true;
    setLoading(true);

    fetch(`${API_BASE}/api/hotels`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch hotels");
        return res.json();
      })
      .then((data) => {
        if (!alive) return;

        console.log("Raw hotels data:", data);

        // Handle different response formats
        const hotelsData = Array.isArray(data)
          ? data
          : data.data || data.rows || [];

        const normalizedHotels = hotelsData.map((hotel) => {
          let previewImage = "";

          // Parse images array from images field
          if (hotel.images) {
            try {
              const imagesArray =
                typeof hotel.images === "string"
                  ? JSON.parse(hotel.images)
                  : hotel.images;

              if (Array.isArray(imagesArray) && imagesArray.length > 0) {
                previewImage = imagesArray[0];
              }
            } catch (err) {
              // If JSON parsing fails, try comma-separated
              if (
                typeof hotel.images === "string" &&
                hotel.images.includes(",")
              ) {
                const images = hotel.images
                  .split(",")
                  .map((img) => img.trim())
                  .filter((img) => img);
                if (images.length > 0) previewImage = images[0];
              } else if (hotel.images) {
                previewImage = hotel.images;
              }
            }
          }

          // Construct proper image URL
          if (
            previewImage &&
            !previewImage.startsWith("http") &&
            !previewImage.startsWith("data:")
          ) {
            previewImage = `${API_BASE}/uploads/hotels/${previewImage}`;
          }

          // Extract city from address for better search
          let city = "";
          if (hotel.address) {
            const addressParts = hotel.address
              .split(",")
              .map((part) => part.trim());
            if (addressParts.length > 1) {
              city =
                addressParts[addressParts.length - 2] ||
                addressParts[addressParts.length - 1];
            } else {
              city = hotel.address;
            }
          }

          return {
            id: hotel.id,
            hotel_name: hotel.hotel_name || "Unnamed Hotel",
            address: hotel.address || "",
            city: city,
            description: hotel.description || "",
            facilities: hotel.facilities || "",
            previewImage: previewImage,
            searchableText: `
              ${hotel.hotel_name || ""} 
              ${hotel.address || ""} 
              ${city}
              ${hotel.facilities || ""}
            `.toLowerCase(),
            ...hotel,
          };
        });

        console.log("Normalized hotels:", normalizedHotels);
        setHotels(normalizedHotels);
      })
      .catch((error) => {
        console.error("Failed to fetch hotels:", error);
        setHotels([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [API_BASE]);

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Search functionality
  useEffect(() => {
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      const searchTerm = query.toLowerCase().trim();

      const matches = hotels.filter((hotel) => {
        return hotel.searchableText.includes(searchTerm);
      });

      console.log("Search matches:", matches);
      setSuggestions(matches.slice(0, 8));
    }, 200);

    return () => clearTimeout(debounceRef.current);
  }, [query, hotels]);

  // Update hovered image
  useEffect(() => {
    if (highlighted >= 0 && suggestions[highlighted]) {
      setHoveredHeroImage(suggestions[highlighted].previewImage || null);
    } else {
      setHoveredHeroImage(null);
    }
  }, [highlighted, suggestions]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setHighlighted(-1);
      }
    }

    const timer = setTimeout(() => {
      document.addEventListener("click", handleClick);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % slides.length);

  // Navigate to hotel detail page
  const pickSuggestion = (hotel) => {
    console.log("Selected hotel:", hotel);
    const searchText = hotel.hotel_name || "";
    setQuery(searchText);
    setOpen(false);
    setSuggestions([]);
    setHighlighted(-1);
    saveToSearchHistory(searchText);

    if (hotel.id) {
      navigate(`/hotels/${hotel.id}`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      saveToSearchHistory(query.trim());
      navigate(`/hotels?search=${encodeURIComponent(query)}`);
    }
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("hotelSearchHistory");
  };

  const onKeyDown = (e) => {
    if (!open) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlighted((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlighted((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlighted >= 0 && suggestions[highlighted]) {
          pickSuggestion(suggestions[highlighted]);
        } else if (query.trim()) {
          handleSearchSubmit(e);
        }
        break;
      case "Escape":
        setOpen(false);
        setHighlighted(-1);
        break;
      default:
        break;
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    setOpen(true);
  };

  // Handle input change
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setOpen(true);
  };

  // Simple text highlighter
  const HighlightText = ({ text, highlight }) => {
    if (!text || !highlight) return text;

    try {
      const parts = text.split(new RegExp(`(${highlight})`, "gi"));
      return (
        <span>
          {parts.map((part, i) =>
            part.toLowerCase() === highlight.toLowerCase() ? (
              <mark key={i} className="bg-yellow-200 px-1 rounded">
                {part}
              </mark>
            ) : (
              part
            )
          )}
        </span>
      );
    } catch (error) {
      return text;
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[20vh] md:h-[500px] lg:h-[350px] overflow-visible select-none">
        {/* Background slides */}
        <div className="absolute inset-0 transition-all duration-1000">
          {slides.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`hotel-slide-${i}`}
              className={`absolute w-full h-full object-fill transition-opacity duration-1000 ${
                i === currentIndex ? "opacity-100" : "opacity-0"
              }`}
              draggable={false}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30 pointer-events-none"></div>
        </div>

        {/* Desktop Search - Same compact design as CruisesHero */}
        <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 px-4 hidden md:flex w-full max-w-4xl">
          <div
            ref={containerRef}
            className="w-full max-w-[450px] mx-auto relative"
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="bg-white rounded-lg shadow-md flex items-center px-3 py-2 w-full border border-gray-200">
                <FaMapMarkerAlt className="text-gray-400 mr-2 w-4 h-4 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search hotels..."
                  className="w-full outline-none text-gray-700 font-medium bg-transparent placeholder-gray-400 text-sm"
                  value={query}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onKeyDown={onKeyDown}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="ml-1 text-gray-400 hover:text-gray-600 transition-colors text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </form>

            {/* Desktop Search Results Dropdown */}
            {open && (
              <div className="absolute mt-2 w-full bg-white rounded-xl shadow-lg max-h-80 overflow-hidden z-50 border border-gray-200">
                {/* Preview image */}
                {hoveredHeroImage && (
                  <div className="absolute -top-48 left-1/2 transform -translate-x-1/2 w-72 h-40 rounded-lg overflow-hidden shadow-xl z-50 border-2 border-white">
                    <img
                      src={hoveredHeroImage}
                      alt="hotel preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}

                {/* Loading State */}
                {loading && query && (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    Searching hotels...
                  </div>
                )}

                {/* Search Results */}
                {!loading && suggestions.length > 0 && (
                  <>
                    <div className="p-3 border-b border-gray-100 bg-gray-50">
                      <div className="text-sm font-semibold text-gray-700">
                        Hotels ({suggestions.length})
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {suggestions.map((hotel, index) => (
                        <div
                          key={hotel.id || index}
                          className={`flex items-center gap-3 p-3 cursor-pointer transition-all duration-200 border-b border-gray-100 last:border-b-0 ${
                            highlighted === index
                              ? "bg-blue-50 border-l-4 border-l-blue-500"
                              : "hover:bg-gray-50"
                          }`}
                          onMouseEnter={() => setHighlighted(index)}
                          onClick={() => pickSuggestion(hotel)}
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {hotel.previewImage ? (
                              <img
                                src={hotel.previewImage}
                                alt={hotel.hotel_name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center hidden">
                              <FaHotel className="text-gray-400" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 mb-1">
                              <HighlightText
                                text={hotel.hotel_name}
                                highlight={query}
                              />
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                              {hotel.city && (
                                <span className="flex items-center gap-1">
                                  <FaMapMarkerAlt className="w-3 h-3" />
                                  <HighlightText
                                    text={hotel.city}
                                    highlight={query}
                                  />
                                </span>
                              )}
                              {hotel.facilities && (
                                <span className="flex items-center gap-1">
                                  <FaTag className="w-3 h-3" />
                                  <span className="truncate">
                                    {hotel.facilities
                                      .split(",")
                                      .slice(0, 2)
                                      .join(", ")}
                                  </span>
                                </span>
                              )}
                            </div>
                            {hotel.description && (
                              <div className="text-sm text-gray-500 line-clamp-1">
                                {hotel.description}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* No Results */}
                {!loading && query && suggestions.length === 0 && (
                  <div className="p-6 text-center">
                    <FaSearch className="mx-auto text-gray-300 text-2xl mb-2" />
                    <div className="text-gray-500 font-medium mb-1">
                      No hotels found
                    </div>
                    <div className="text-xs text-gray-400">
                      Try different keywords
                    </div>
                  </div>
                )}

                {/* Recent Searches */}
                {!loading && !query && searchHistory.length > 0 && (
                  <>
                    <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                      <div className="text-sm font-semibold text-gray-700">
                        Recent Searches
                      </div>
                      <button
                        onClick={clearSearchHistory}
                        className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="p-2">
                      {searchHistory.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => setQuery(search)}
                          className="w-full text-left p-2 rounded hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm text-gray-700"
                        >
                          <FaClock className="text-gray-400 w-3 h-3" />
                          {search}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* Empty State */}
                {!loading && !query && searchHistory.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    <div className="text-sm">Start typing to search hotels</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute bottom-8 right-8 gap-3 z-20 hidden md:flex">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <FaArrowLeft className="text-gray-800" />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <FaArrowRight className="text-gray-800" />
          </button>
        </div>
      </div>

      {/* Mobile Search - Same design as CruisesHero */}
      <div className="md:hidden relative z-30">
        <div className="relative px-4" style={{ marginTop: "-2rem" }}>
          <div ref={containerRef} className="relative">
            <form onSubmit={handleSearchSubmit}>
              <div className="bg-white rounded-xl shadow-2xl flex items-center px-4 py-3 w-full border border-gray-200">
                <FaMapMarkerAlt className="text-gray-500 mr-3 w-5 h-5 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search hotels..."
                  className="w-full outline-none text-gray-700 font-medium placeholder-gray-500 text-base"
                  value={query}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                />
              </div>
            </form>

            {/* Mobile Suggestions */}
            {open && (suggestions.length > 0 || searchHistory.length > 0) && (
              <div className="absolute mt-2 w-full bg-white rounded-xl shadow-2xl max-h-64 overflow-auto z-50 border border-gray-200">
                {suggestions.length > 0
                  ? suggestions.map((hotel, index) => (
                      <div
                        key={hotel.id || index}
                        onClick={() => pickSuggestion(hotel)}
                        className="flex items-center gap-2 p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          {hotel.previewImage ? (
                            <img
                              src={hotel.previewImage}
                              alt={hotel.hotel_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <FaHotel className="text-gray-400 text-xs" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-800 truncate">
                            {hotel.hotel_name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {hotel.city}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            {hotel.facilities && (
                              <span className="truncate">
                                {hotel.facilities
                                  .split(",")
                                  .slice(0, 2)
                                  .join(", ")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  : searchHistory.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(search)}
                        className="w-full text-left p-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700"
                      >
                        <FaClock className="text-gray-400 w-3 h-3" />
                        {search}
                      </button>
                    ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}