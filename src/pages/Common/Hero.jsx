// import { useEffect, useRef, useState } from "react";
// import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// export default function Hero() {
//   const API_BASE = import.meta.env.VITE_API_URL || "";
//   const fallbackSlides = [
//     "./ActiveHero/1.jpg",
//     "./ActiveHero/2.jpg",
//     "./ActiveHero/3.jpg",
//   ];

//   const [slides, setSlides] = useState(fallbackSlides);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Search state
//   const [query, setQuery] = useState("");
//   const [activities, setActivities] = useState([]);
//   const [suggestions, setSuggestions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [highlighted, setHighlighted] = useState(-1);
//   const [hoveredHeroImage, setHoveredHeroImage] = useState(null);

//   const inputRef = useRef(null);
//   const containerRef = useRef(null);
//   const debounceRef = useRef(null);

//   const navigate = useNavigate();

//   // Fetch hero slides
//   useEffect(() => {
//     let alive = true;
//     fetch(`${API_BASE}/api/hero/home`)
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

//   // Fetch activities
//   useEffect(() => {
//     let alive = true;
//     setLoading(true);
//     fetch(`${API_BASE}/api/activities`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (!alive) return;
//         const raw = Array.isArray(data) ? data : data?.data || [];
//         const normalized = raw.map((a) => {
//           let preview = a.image || "";
//           if (!preview && a.images) {
//             try {
//               const arr =
//                 typeof a.images === "string" ? JSON.parse(a.images) : a.images;
//               if (Array.isArray(arr) && arr.length) preview = arr[0];
//             } catch (err) {
//               void err;
//             }
//           }
//           if (preview && !preview.startsWith("http"))
//             preview = `${API_BASE}/uploads/activities/${preview}`; //${API_BASE}/uploads/activities/${a.image}
//           return { ...a, previewImage: preview };
//         });
//         setActivities(normalized);
//       })
//       .catch(() => {})
//       .finally(() => alive && setLoading(false));
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

//   // Debounced query -> suggestions
//   useEffect(() => {
//     clearTimeout(debounceRef.current);
//     debounceRef.current = setTimeout(() => {
//       if (!query) return setSuggestions(activities.slice(0, 12));
//       const q = query.toLowerCase();
//       const matches = activities.filter(
//         (a) =>
//           (a.title || "").toLowerCase().includes(q) ||
//           (a.location_name || "").toLowerCase().includes(q) ||
//           (a.category || "").toLowerCase().includes(q)
//       );
//       setSuggestions(matches.slice(0, 12));
//     }, 180);
//     return () => clearTimeout(debounceRef.current);
//   }, [query, activities]);

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
//     document.addEventListener("click", handleClick);
//     return () => document.removeEventListener("click", handleClick);
//   }, []);

//   const handlePrev = () =>
//     setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
//   const handleNext = () =>
//     setCurrentIndex((prev) => (prev + 1) % slides.length);

//   const pickSuggestion = (item) => {
//     setQuery(item.title || "");
//     setOpen(false);
//     setSuggestions([]);
//     setHighlighted(-1);
//     if (item && (item.id || item.activity_id)) {
//       const id = item.id || item.activity_id;
//       navigate(`/activities/${id}`, {
//         state: { previewImage: item.previewImage || null },
//       });
//     }
//   };

//   const onKeyDown = (e) => {
//     if (!open) return;
//     if (e.key === "ArrowDown") {
//       e.preventDefault();
//       setHighlighted((h) => Math.min(h + 1, suggestions.length - 1));
//     } else if (e.key === "ArrowUp") {
//       e.preventDefault();
//       setHighlighted((h) => Math.max(h - 1, 0));
//     } else if (e.key === "Enter") {
//       e.preventDefault();
//       if (highlighted >= 0 && suggestions[highlighted])
//         pickSuggestion(suggestions[highlighted]);
//     } else if (e.key === "Escape") {
//       setOpen(false);
//       setHighlighted(-1);
//     }
//   };

//   return (
//     <>
//       {/* Hero Section */}
//       <div className="relative h-[20vh] md:h-96 lg:h-[350px] overflow-hidden select-none">
//         {/* Background slides */}
//         <div className="absolute inset-0 transition-all duration-1000">
//           {slides.map((img, i) => (
//             <img
//               key={i}
//               src={img}
//               alt={`slide-${i}`}
//               className={`absolute w-full h-full object-fill transition-opacity duration-1000 ${
//                 i === currentIndex ? "opacity-100" : "opacity-0"
//               }`}
//               draggable={false}
//             />
//           ))}
//           <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30 pointer-events-none"></div>
//         </div>

//         {/* Desktop Search */}
//         <div className="absolute inset-0 items-center justify-center z-10 px-4 hidden md:flex">
//           <div ref={containerRef} className="w-full max-w-md relative">
//             <div className="bg-white rounded-full shadow-xl flex items-center px-5 py-3 w-full backdrop-blur-sm">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="currentColor"
//                 viewBox="0 0 24 24"
//                 className="text-gray-500 mr-3 w-5 h-5"
//               >
//                 <path d="M12 2C8.686 2 6 4.686 6 8c0 4.418 6 12 6 12s6-7.582 6-12c0-3.314-2.686-6-6-6Zm0 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
//               </svg>
//               <input
//                 ref={inputRef}
//                 type="text"
//                 placeholder="Search activities, locations or categories"
//                 className="w-full outline-none text-gray-700 font-medium bg-transparent"
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 onFocus={() => setOpen(true)}
//                 onMouseEnter={() => setOpen(true)}
//                 onKeyDown={onKeyDown}
//                 aria-autocomplete="list"
//                 aria-expanded={open}
//                 aria-controls="hero-search-list"
//               />
//             </div>

//             {/* Suggestions dropdown */}
//             {open && (suggestions.length > 0 || (loading && query)) && (
//               <div
//                 id="hero-search-list"
//                 role="listbox"
//                 className="absolute mt-2 w-full bg-white rounded-lg shadow-lg max-h-80 overflow-auto z-50 border border-gray-100"
//               >
//                 {/* Preview image above dropdown */}
//                 {hoveredHeroImage && (
//                   <div className="absolute -top-44 left-1/2 transform -translate-x-1/2 w-64 h-40 rounded-md overflow-hidden shadow-2xl z-50">
//                     <img
//                       src={hoveredHeroImage}
//                       alt="preview"
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 )}
//                 {loading && query ? (
//                   <div className="p-3 text-sm text-gray-500">Loading...</div>
//                 ) : (
//                   suggestions.map((item, idx) => {
//                     const thumb = item.previewImage || "";
//                     return (
//                       <div
//                         key={item.id || idx}
//                         role="option"
//                         aria-selected={highlighted === idx}
//                         onMouseEnter={() => setHighlighted(idx)}
//                         onMouseLeave={() => setHighlighted(-1)}
//                         onClick={() => pickSuggestion(item)}
//                         className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 ${
//                           highlighted === idx ? "bg-gray-50" : ""
//                         }`}
//                       >
//                         <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
//                           {thumb ? (
//                             <img
//                               src={thumb}
//                               alt={item.title}
//                               className="w-full h-full object-cover"
//                             />
//                           ) : (
//                             <div className="w-full h-full bg-gray-200" />
//                           )}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <div className="text-sm font-medium text-gray-800 truncate">
//                             {item.title}
//                           </div>
//                           <div className="text-xs text-gray-500 truncate">
//                             {item.location_name}
//                           </div>
//                         </div>
//                         {item.price ? (
//                           <div className="text-sm text-gray-700">
//                             {item.price}
//                           </div>
//                         ) : null}
//                       </div>
//                     );
//                   })
//                 )}
//                 {suggestions.length === 0 && !loading && query && (
//                   <div className="p-3 text-sm text-gray-500">No results</div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Navigation Arrows */}
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
//       </div>

//       {/* Mobile Search Input */}
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
//             placeholder="Select Location"
//             className="w-full outline-none text-gray-700 font-medium placeholder-gray-500 text-sm"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onFocus={() => setOpen(true)}
//           />
//         </div>

//         {/* Mobile suggestions */}
//         {open && (suggestions.length > 0 || (loading && query)) && (
//           <div className="mt-2 w-full bg-white rounded-lg shadow-lg max-h-80 overflow-auto z-50 border border-gray-100 relative">
//             {hoveredHeroImage && (
//               <div className="absolute -top-44 left-4 w-64 h-40 rounded-md overflow-hidden shadow-2xl z-50">
//                 <img
//                   src={hoveredHeroImage}
//                   alt="preview"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             )}
//             {loading && query ? (
//               <div className="p-3 text-sm text-gray-500">Loading...</div>
//             ) : (
//               suggestions.map((item, idx) => (
//                 <div
//                   key={item.id || idx}
//                   onClick={() => pickSuggestion(item)}
//                   className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50"
//                 >
//                   <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
//                     {item.previewImage ? (
//                       <img
//                         src={item.previewImage}
//                         alt={item.title}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-full bg-gray-200" />
//                     )}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="text-sm font-medium text-gray-800 truncate">
//                       {item.title}
//                     </div>
//                     <div className="text-xs text-gray-500 truncate">
//                       {item.location_name}
//                     </div>
//                   </div>
//                   {item.price ? (
//                     <div className="text-sm text-gray-700">{item.price}</div>
//                   ) : null}
//                 </div>
//               ))
//             )}
//             {suggestions.length === 0 && !loading && query && (
//               <div className="p-3 text-sm text-gray-500">No results</div>
//             )}
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// import { useEffect, useRef, useState } from "react";
// import {
//     FaArrowLeft,
//     FaArrowRight,
//     FaClock,
//     FaMapMarkerAlt,
//     FaTag,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// export default function Hero() {
//   const API_BASE = import.meta.env.VITE_API_URL || "";
//   const fallbackSlides = [
//     "./ActiveHero/1.jpg",
//     "./ActiveHero/2.jpg",
//     "./ActiveHero/3.jpg",
//   ];

//   const [slides, setSlides] = useState(fallbackSlides);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Search state
//   const [query, setQuery] = useState("");
//   const [activities, setActivities] = useState([]);
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
//     const saved = localStorage.getItem("activitySearchHistory");
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
//     localStorage.setItem(
//       "activitySearchHistory",
//       JSON.stringify(updatedHistory)
//     );
//   };

//   // Fetch hero slides
//   useEffect(() => {
//     let alive = true;
//     fetch(`${API_BASE}/api/hero/home`)
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

//   // Fetch activities from your database
//   useEffect(() => {
//     let alive = true;
//     setLoading(true);

//     fetch(`${API_BASE}/api/activities`)
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch activities");
//         return res.json();
//       })
//       .then((data) => {
//         if (!alive) return;

//         console.log("Raw activities data:", data);

//         // Handle different response formats
//         const activitiesData = Array.isArray(data)
//           ? data
//           : data.data || data.rows || [];

//         const normalizedActivities = activitiesData.map((activity) => {
//           let previewImage = activity.image || "";

//           // Parse images array from LONGTEXT field
//           if (!previewImage && activity.images) {
//             try {
//               const imagesArray =
//                 typeof activity.images === "string"
//                   ? JSON.parse(activity.images)
//                   : activity.images;

//               if (Array.isArray(imagesArray) && imagesArray.length > 0) {
//                 previewImage = imagesArray[0];
//               }
//             } catch (err) {
//               console.error("Error parsing images:", err);
//             }
//           }

//           // Construct proper image URL
//           if (
//             previewImage &&
//             !previewImage.startsWith("http") &&
//             !previewImage.startsWith("data:")
//           ) {
//             previewImage = `${API_BASE}/uploads/activities/${previewImage}`;
//           }

//           return {
//             id: activity.id,
//             title: activity.title || "Untitled Activity",
//             location_name: activity.location_name || "No location",
//             category: activity.category || "Uncategorized",
//             price: activity.price || "",
//             details: activity.details || "",
//             previewImage: previewImage,
//             ...activity,
//           };
//         });

//         console.log("Normalized activities:", normalizedActivities);
//         setActivities(normalizedActivities);
//       })
//       .catch((error) => {
//         console.error("Failed to fetch activities:", error);
//         setActivities([]);
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

//       const matches = activities.filter((activity) => {
//         const searchableText = `
//           ${activity.title || ""}
//           ${activity.location_name || ""}
//           ${activity.category || ""}
//         `.toLowerCase();

//         return searchableText.includes(searchTerm);
//       });

//       console.log("Search matches:", matches);
//       setSuggestions(matches.slice(0, 8));
//     }, 200);

//     return () => clearTimeout(debounceRef.current);
//   }, [query, activities]);

//   // Update hovered image
//   useEffect(() => {
//     if (highlighted >= 0 && suggestions[highlighted]) {
//       setHoveredHeroImage(suggestions[highlighted].previewImage || null);
//     } else {
//       setHoveredHeroImage(null);
//     }
//   }, [highlighted, suggestions]);

//   // Improved close dropdown logic - only close when clicking outside the entire search container
//   useEffect(() => {
//     function handleClick(e) {
//       if (containerRef.current && !containerRef.current.contains(e.target)) {
//         setOpen(false);
//         setHighlighted(-1);
//       }
//     }

//     // Use a slight delay to prevent immediate closing
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

//   // Navigate to activity detail page
//   const pickSuggestion = (activity) => {
//     console.log("Selected activity:", activity);
//     const searchText = activity.title || "";
//     setQuery(searchText);
//     setOpen(false);
//     setSuggestions([]);
//     setHighlighted(-1);
//     saveToSearchHistory(searchText);

//     if (activity.id) {
//       navigate(`/activities/${activity.id}`);
//     }
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (query.trim()) {
//       saveToSearchHistory(query.trim());
//       navigate(`/activities?search=${encodeURIComponent(query)}`);
//     }
//   };

//   const clearSearchHistory = () => {
//     setSearchHistory([]);
//     localStorage.removeItem("activitySearchHistory");
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

//   // Handle input focus - improved to prevent immediate closing
//   const handleInputFocus = () => {
//     setOpen(true);
//   };

//   // Handle input change - keep dropdown open
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
//       {/* Hero Section - Increased height to accommodate dropdown */}
//       <div className="relative h-[20vh] md:h-[500px] lg:h-[350px] overflow-visible select-none">
//         {/* Background slides */}
//         <div className="absolute inset-0 transition-all duration-1000">
//           {slides.map((img, i) => (
//             <img
//               key={i}
//               src={img}
//               alt={`slide-${i}`}
//               className={`absolute w-full h-full object-fill transition-opacity duration-1000 ${
//                 i === currentIndex ? "opacity-100" : "opacity-0"
//               }`}
//               draggable={false}
//             />
//           ))}
//           <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30 pointer-events-none"></div>
//         </div>

//         {/* Desktop Search - Moved higher up with better positioning */}
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 px-4 py-4 hidden md:flex h-2 w-[600px]  max-w-4xl">
//           <div ref={containerRef} className="w-full relative">
//             <form onSubmit={handleSearchSubmit} className="relative">
//               <div className="bg-white rounded-2xl shadow-2xl flex items-center px-6 py-4 w-full backdrop-blur-sm border border-gray-100">
//                 <FaMapMarkerAlt className="text-gray-400 mr-3 w-5 h-5 flex-shrink-0" />
//                 <input
//                   ref={inputRef}
//                   type="text"
//                   placeholder="Search activities, locations, or categories..."
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

//             {/* Search Results Dropdown - Improved positioning and styling */}
//             {open && (
//               <div className="absolute mt-4 w-full bg-white rounded-2xl shadow-2xl max-h-96 overflow-hidden z-50 border border-gray-200">
//                 {/* Preview image - Better positioning */}
//                 {hoveredHeroImage && (
//                   <div className="absolute -top-52 left-1/2 transform -translate-x-1/2 w-80 h-48 rounded-xl overflow-hidden shadow-2xl z-50 border-2 border-white">
//                     <img
//                       src={hoveredHeroImage}
//                       alt="preview"
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
//                     Searching activities...
//                   </div>
//                 )}

//                 {/* Search Results */}
//                 {!loading && suggestions.length > 0 && (
//                   <>
//                     <div className="p-4 border-b border-gray-100 bg-gray-50">
//                       <div className="text-sm font-semibold text-gray-700">
//                         Activities ({suggestions.length})
//                       </div>
//                     </div>
//                     <div className="max-h-80 overflow-y-auto">
//                       {suggestions.map((activity, index) => (
//                         <div
//                           key={activity.id || index}
//                           className={`flex items-center gap-4 p-4 cursor-pointer transition-all duration-200 border-b border-gray-100 last:border-b-0 ${
//                             highlighted === index
//                               ? "bg-blue-50 border-l-4 border-l-blue-500"
//                               : "hover:bg-gray-50"
//                           }`}
//                           onMouseEnter={() => setHighlighted(index)}
//                           onClick={() => pickSuggestion(activity)}
//                         >
//                           <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
//                             {activity.previewImage ? (
//                               <img
//                                 src={activity.previewImage}
//                                 alt={activity.title}
//                                 className="w-full h-full object-cover"
//                                 onError={(e) => {
//                                   e.target.style.display = "none";
//                                   e.target.nextSibling.style.display = "flex";
//                                 }}
//                               />
//                             ) : null}
//                             <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center hidden">
//                               <FaMapMarkerAlt className="text-gray-400" />
//                             </div>
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <div className="text-base font-semibold text-gray-900 mb-1">
//                               <HighlightText
//                                 text={activity.title}
//                                 highlight={query}
//                               />
//                             </div>
//                             <div className="flex items-center gap-3 text-sm text-gray-600 mb-1">
//                               {activity.location_name &&
//                                 activity.location_name !== "No location" && (
//                                   <span className="flex items-center gap-1">
//                                     <FaMapMarkerAlt className="w-3 h-3" />
//                                     <HighlightText
//                                       text={activity.location_name}
//                                       highlight={query}
//                                     />
//                                   </span>
//                                 )}
//                               {activity.category &&
//                                 activity.category !== "Uncategorized" && (
//                                   <span className="flex items-center gap-1">
//                                     <FaTag className="w-3 h-3" />
//                                     <HighlightText
//                                       text={activity.category}
//                                       highlight={query}
//                                     />
//                                   </span>
//                                 )}
//                             </div>
//                             {activity.price && (
//                               <div className="text-sm font-medium text-green-600">
//                                 {activity.price}
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
//                     <FaMapMarkerAlt className="mx-auto text-gray-300 text-3xl mb-3" />
//                     <div className="text-gray-500 font-medium mb-2">
//                       No activities found
//                     </div>
//                     <div className="text-sm text-gray-400">
//                       Try different keywords
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
//                     <div className="text-sm">
//                       Start typing to search activities
//                     </div>
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

//       {/* Mobile Search - Improved positioning */}
//       <div className="md:hidden relative -top-12 z-30 px-4">
//         <div ref={containerRef} className="relative">
//           <form onSubmit={handleSearchSubmit}>
//             <div className="bg-white rounded-2xl shadow-xl flex items-center px-4 py-4 w-full border border-gray-200">
//               <FaMapMarkerAlt className="text-gray-400 mr-3 w-5 h-5 flex-shrink-0" />
//               <input
//                 type="text"
//                 placeholder="Search activities..."
//                 className="w-full outline-none text-gray-700 font-medium placeholder-gray-500 text-base"
//                 value={query}
//                 onChange={handleInputChange}
//                 onFocus={handleInputFocus}
//               />
//             </div>
//           </form>

//           {/* Mobile Suggestions - Better positioning */}
//           {open && (suggestions.length > 0 || searchHistory.length > 0) && (
//             <div className="absolute mt-3 w-full bg-white rounded-2xl shadow-2xl max-h-80 overflow-auto z-50 border border-gray-200">
//               {suggestions.length > 0
//                 ? suggestions.map((activity, index) => (
//                     <div
//                       key={activity.id || index}
//                       onClick={() => pickSuggestion(activity)}
//                       className="flex items-center gap-3 p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
//                     >
//                       <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
//                         {activity.previewImage ? (
//                           <img
//                             src={activity.previewImage}
//                             alt={activity.title}
//                             className="w-full h-full object-cover"
//                           />
//                         ) : (
//                           <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                             <FaMapMarkerAlt className="text-gray-400" />
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <div className="text-sm font-semibold text-gray-800 truncate">
//                           {activity.title}
//                         </div>
//                         <div className="text-xs text-gray-500 truncate">
//                           {activity.location_name}
//                         </div>
//                         {activity.price && (
//                           <div className="text-xs font-medium text-green-600 mt-1">
//                             {activity.price}
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
    FaMapMarkerAlt,
    FaSearch,
    FaTag,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const API_BASE = import.meta.env.VITE_API_URL || "";
  const fallbackSlides = [
    "./ActiveHero/1.jpg",
    "./ActiveHero/2.jpg",
    "./ActiveHero/3.jpg",
  ];

  const [slides, setSlides] = useState(fallbackSlides);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Search state
  const [query, setQuery] = useState("");
  const [activities, setActivities] = useState([]);
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
    const saved = localStorage.getItem("activitySearchHistory");
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
    localStorage.setItem(
      "activitySearchHistory",
      JSON.stringify(updatedHistory)
    );
  };

  // Fetch hero slides
  useEffect(() => {
    let alive = true;
    fetch(`${API_BASE}/api/hero/home`)
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

  // Fetch activities from your database
  useEffect(() => {
    let alive = true;
    setLoading(true);

    fetch(`${API_BASE}/api/activities`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch activities");
        return res.json();
      })
      .then((data) => {
        if (!alive) return;

        console.log("Raw activities data:", data);

        // Handle different response formats
        const activitiesData = Array.isArray(data)
          ? data
          : data.data || data.rows || [];

        const normalizedActivities = activitiesData.map((activity) => {
          let previewImage = activity.image || "";

          // Parse images array from LONGTEXT field
          if (!previewImage && activity.images) {
            try {
              const imagesArray =
                typeof activity.images === "string"
                  ? JSON.parse(activity.images)
                  : activity.images;

              if (Array.isArray(imagesArray) && imagesArray.length > 0) {
                previewImage = imagesArray[0];
              }
            } catch (err) {
              console.error("Error parsing images:", err);
            }
          }

          // Construct proper image URL
          if (
            previewImage &&
            !previewImage.startsWith("http") &&
            !previewImage.startsWith("data:")
          ) {
            previewImage = `${API_BASE}/uploads/activities/${previewImage}`;
          }

          return {
            id: activity.id,
            title: activity.title || "Untitled Activity",
            location_name: activity.location_name || "No location",
            category: activity.category || "Uncategorized",
            price: activity.price || "",
            details: activity.details || "",
            previewImage: previewImage,
            ...activity,
          };
        });

        console.log("Normalized activities:", normalizedActivities);
        setActivities(normalizedActivities);
      })
      .catch((error) => {
        console.error("Failed to fetch activities:", error);
        setActivities([]);
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

      const matches = activities.filter((activity) => {
        const searchableText = `
          ${activity.title || ""} 
          ${activity.location_name || ""} 
          ${activity.category || ""}
        `.toLowerCase();

        return searchableText.includes(searchTerm);
      });

      console.log("Search matches:", matches);
      setSuggestions(matches.slice(0, 8));
    }, 200);

    return () => clearTimeout(debounceRef.current);
  }, [query, activities]);

  // Update hovered image
  useEffect(() => {
    if (highlighted >= 0 && suggestions[highlighted]) {
      setHoveredHeroImage(suggestions[highlighted].previewImage || null);
    } else {
      setHoveredHeroImage(null);
    }
  }, [highlighted, suggestions]);

  // Improved close dropdown logic - only close when clicking outside the entire search container
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setHighlighted(-1);
      }
    }

    // Use a slight delay to prevent immediate closing
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

  // Navigate to activity detail page
  const pickSuggestion = (activity) => {
    console.log("Selected activity:", activity);
    const searchText = activity.title || "";
    setQuery(searchText);
    setOpen(false);
    setSuggestions([]);
    setHighlighted(-1);
    saveToSearchHistory(searchText);

    if (activity.id) {
      navigate(`/activities/${activity.id}`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      saveToSearchHistory(query.trim());
      navigate(`/activities?search=${encodeURIComponent(query)}`);
    }
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("activitySearchHistory");
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

  // Handle input focus - improved to prevent immediate closing
  const handleInputFocus = () => {
    setOpen(true);
  };

  // Handle input change - keep dropdown open
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
              alt={`slide-${i}`}
              className={`absolute w-full h-full object-fill transition-opacity duration-1000 ${
                i === currentIndex ? "opacity-100" : "opacity-0"
              }`}
              draggable={false}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30 pointer-events-none"></div>
        </div>

        {/* Desktop Search - Same design as CruisesHero */}
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
                  placeholder="Search activities..."
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
                      alt="preview"
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
                    Searching activities...
                  </div>
                )}

                {/* Search Results */}
                {!loading && suggestions.length > 0 && (
                  <>
                    <div className="p-3 border-b border-gray-100 bg-gray-50">
                      <div className="text-sm font-semibold text-gray-700">
                        Activities ({suggestions.length})
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {suggestions.map((activity, index) => (
                        <div
                          key={activity.id || index}
                          className={`flex items-center gap-3 p-3 cursor-pointer transition-all duration-200 border-b border-gray-100 last:border-b-0 ${
                            highlighted === index
                              ? "bg-blue-50 border-l-4 border-l-blue-500"
                              : "hover:bg-gray-50"
                          }`}
                          onMouseEnter={() => setHighlighted(index)}
                          onClick={() => pickSuggestion(activity)}
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {activity.previewImage ? (
                              <img
                                src={activity.previewImage}
                                alt={activity.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center hidden">
                              <FaMapMarkerAlt className="text-gray-400" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 mb-1">
                              <HighlightText
                                text={activity.title}
                                highlight={query}
                              />
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                              {activity.location_name &&
                                activity.location_name !== "No location" && (
                                  <span className="flex items-center gap-1">
                                    <FaMapMarkerAlt className="w-3 h-3" />
                                    <HighlightText
                                      text={activity.location_name}
                                      highlight={query}
                                    />
                                  </span>
                                )}
                              {activity.category &&
                                activity.category !== "Uncategorized" && (
                                  <span className="flex items-center gap-1">
                                    <FaTag className="w-3 h-3" />
                                    <HighlightText
                                      text={activity.category}
                                      highlight={query}
                                    />
                                  </span>
                                )}
                            </div>
                            {activity.price && (
                              <div className="text-sm font-medium text-green-600">
                                {activity.price}
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
                      No activities found
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
                    <div className="text-sm">
                      Start typing to search activities
                    </div>
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
                  placeholder="Search activities..."
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
                  ? suggestions.map((activity, index) => (
                      <div
                        key={activity.id || index}
                        onClick={() => pickSuggestion(activity)}
                        className="flex items-center gap-2 p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          {activity.previewImage ? (
                            <img
                              src={activity.previewImage}
                              alt={activity.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <FaMapMarkerAlt className="text-gray-400 text-xs" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-800 truncate">
                            {activity.title}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {activity.location_name}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            {activity.price && (
                              <span className="font-medium text-green-600">
                                {activity.price}
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
