// import { useEffect, useMemo, useState } from "react";
// import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// export default function HolidayHero({
//   backgroundUrl,
//   backgroundUrls,
//   rotateIntervalMs = 8000,
//   themeColor = "#F17232",
// }) {
//   const navigate = useNavigate();
//   const API_BASE = import.meta.env.VITE_API_URL;

//   const [holidays, setHolidays] = useState([]);
//   const [query, setQuery] = useState("");
//   const [open, setOpen] = useState(false);

//   // Fetch holiday suggestions
//   useEffect(() => {
//     let ignore = false;
//     (async () => {
//       try {
//         const res = await fetch(`${API_BASE}/api/holidays`);
//         const j = await res.json();
//         if (!ignore) setHolidays(Array.isArray(j?.data) ? j.data : []);
//       } catch {
//         if (!ignore) setHolidays([]);
//       }
//     })();
//     return () => (ignore = true);
//   }, [API_BASE]);

//   const filteredHolidays = useMemo(() => {
//     const t = query.trim().toLowerCase();
//     if (!t) return holidays;
//     return holidays.filter((h) =>
//       [h.title, h.destination, h.category]
//         .filter(Boolean)
//         .some((v) => String(v).toLowerCase().includes(t))
//     );
//   }, [holidays, query]);

//   // Background rotation logic
//   const [apiBackgrounds, setApiBackgrounds] = useState([]);
//   const defaultBackgrounds = useMemo(
//     () => [
//       "./holiday/h1.jpg",
//       "./holiday/h2.jpg",
//       "./holiday/h3.jpg",
//       "./holiday/h4.jpg",
//     ],
//     []
//   );

//   useEffect(() => {
//     fetch(`${API_BASE}/api/hero/holidays`)
//       .then((r) => r.json())
//       .then((res) => {
//         const imgs = res?.data?.images || [];
//         if (imgs.length) setApiBackgrounds(imgs.map((p) => `${API_BASE}${p}`));
//       })
//       .catch(() => {});
//   }, [API_BASE]);

//   const rotationList = useMemo(() => {
//     if (apiBackgrounds.length) return apiBackgrounds;
//     if (backgroundUrls?.length) return backgroundUrls;
//     if (backgroundUrl) return [backgroundUrl, ...defaultBackgrounds.slice(1)];
//     return defaultBackgrounds;
//   }, [apiBackgrounds, backgroundUrl, backgroundUrls, defaultBackgrounds]);

//   const [bgIndex, setBgIndex] = useState(0);
//   useEffect(() => {
//     if (!rotationList?.length) return;
//     const id = setInterval(() => {
//       setBgIndex((i) => (i + 1) % rotationList.length);
//     }, rotateIntervalMs);
//     return () => clearInterval(id);
//   }, [rotationList, rotateIntervalMs]);

//   const handlePrev = () => {
//     setBgIndex((prev) => (prev === 0 ? rotationList.length - 1 : prev - 1));
//   };

//   const handleNext = () => {
//     setBgIndex((prev) => (prev + 1) % rotationList.length);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (filteredHolidays.length > 0)
//       navigate(`/holidays/${filteredHolidays[0].id}`);
//     else navigate(`/tours`);
//   };

//   return (
//     <>
//       {/* Hero Section */}
//       <section className="relative h-[20vh] sm:h-[50vh] md:h-[350px] w-full overflow-hidden select-none flex items-center justify-center">
//         {/* Background rotation */}
//         <div className="absolute inset-0 -z-10 overflow-hidden">
//           {rotationList.map((src, idx) => (
//             <img
//               key={idx}
//               src={src}
//               alt="Holiday background"
//               className={`absolute inset-0 w-full h-full object-fill transition-opacity duration-1000 ${
//                 idx === bgIndex ? "opacity-100" : "opacity-0"
//               }`}
//             />
//           ))}
//           <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30 pointer-events-none"></div>
//         </div>

//         {/* Desktop Search Bar */}
//         <div className="absolute inset-0 items-center justify-center z-10 px-4 hidden md:flex">
//           <form onSubmit={handleSubmit} className="w-full max-w-md relative">
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
//                 type="text"
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 onFocus={() => setOpen(true)}
//                 placeholder="Search holiday packages"
//                 className="w-full outline-none text-gray-700 font-medium"
//               />
//             </div>
//             {open && filteredHolidays.length > 0 && (
//               <ul className="absolute left-0 right-0 mt-2 max-h-60 overflow-auto bg-white border border-gray-200 rounded-xl shadow-lg z-50">
//                 {filteredHolidays.map((h) => (
//                   <li key={h.id}>
//                     <button
//                       type="button"
//                       onClick={() => navigate(`/holidays/${h.id}`)}
//                       className="w-full text-left px-3 py-2 hover:bg-gray-50"
//                     >
//                       {h.title}
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </form>
//         </div>

//         {/* Navigation Arrows (Desktop only) */}
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

//       {/* Mobile Search Input */}
//       <div className="md:hidden relative -top-8 z-20 px-4">
//         <form onSubmit={handleSubmit}>
//           <div className="bg-white rounded-full shadow-xl flex items-center px-4 py-4 w-full border border-gray-200">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="currentColor"
//               viewBox="0 0 24 24"
//               className="text-gray-500 mr-3 w-5 h-5"
//             >
//               <path d="M12 2C8.686 2 6 4.686 6 8c0 4.418 6 12 6 12s6-7.582 6-12c0-3.314-2.686-6-6-6Zm0 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
//             </svg>
//             <input
//               type="text"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               onFocus={() => setOpen(true)}
//               placeholder="Search holiday packages"
//               className="w-full outline-none text-gray-700 font-medium placeholder-gray-500 text-sm"
//             />
//           </div>
//         </form>
//       </div>
//     </>
//   );
// // }

// import { useEffect, useRef, useState } from "react";
// import {
//   FaArrowLeft,
//   FaArrowRight,
//   FaCalendar,
//   FaClock,
//   FaSearch,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// export default function HolidayHero({
//   backgroundUrl,
//   backgroundUrls,
//   rotateIntervalMs = 8000,
//   themeColor = "#F17232",
// }) {
//   const navigate = useNavigate();
//   const API_BASE = import.meta.env.VITE_API_URL;

//   const [holidays, setHolidays] = useState([]);
//   const [query, setQuery] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [highlighted, setHighlighted] = useState(-1);
//   const [hoveredHeroImage, setHoveredHeroImage] = useState(null);
//   const [searchHistory, setSearchHistory] = useState([]);

//   const inputRef = useRef(null);
//   const containerRef = useRef(null);
//   const debounceRef = useRef(null);

//   // Load search history from localStorage
//   useEffect(() => {
//     const saved = localStorage.getItem("holidaySearchHistory");
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
//       "holidaySearchHistory",
//       JSON.stringify(updatedHistory)
//     );
//   };

//   // Fetch holidays from your database
//   useEffect(() => {
//     let alive = true;
//     setLoading(true);

//     fetch(`${API_BASE}/api/holidays`)
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch holidays");
//         return res.json();
//       })
//       .then((data) => {
//         if (!alive) return;

//         console.log("Raw holidays data:", data);

//         // Handle different response formats
//         const holidaysData = Array.isArray(data)
//           ? data
//           : data.data || data.rows || [];

//         const normalizedHolidays = holidaysData.map((holiday) => {
//           let previewImage = "";

//           // Parse images array from images field
//           if (holiday.images) {
//             try {
//               const imagesArray =
//                 typeof holiday.images === "string"
//                   ? JSON.parse(holiday.images)
//                   : holiday.images;

//               if (Array.isArray(imagesArray) && imagesArray.length > 0) {
//                 previewImage = imagesArray[0];
//               }
//             } catch (err) {
//               // If JSON parsing fails, try comma-separated
//               if (
//                 typeof holiday.images === "string" &&
//                 holiday.images.includes(",")
//               ) {
//                 const images = holiday.images
//                   .split(",")
//                   .map((img) => img.trim())
//                   .filter((img) => img);
//                 if (images.length > 0) previewImage = images[0];
//               } else if (holiday.images) {
//                 previewImage = holiday.images;
//               }
//             }
//           }

//           // Construct proper image URL
//           if (
//             previewImage &&
//             !previewImage.startsWith("http") &&
//             !previewImage.startsWith("data:")
//           ) {
//             previewImage = `${API_BASE}/uploads/holidays/${previewImage}`;
//           }

//           return {
//             id: holiday.id,
//             title: holiday.title || "Unnamed Holiday Package",
//             destination: holiday.destination || "",
//             duration: holiday.duration || "",
//             price: holiday.price || 0,
//             category: holiday.category || "",
//             details: holiday.details || "",
//             previewImage: previewImage,
//             searchableText: `
//               ${holiday.title || ""}
//               ${holiday.destination || ""}
//               ${holiday.category || ""}
//               ${holiday.duration || ""}
//             `.toLowerCase(),
//             ...holiday,
//           };
//         });

//         console.log("Normalized holidays:", normalizedHolidays);
//         setHolidays(normalizedHolidays);
//       })
//       .catch((error) => {
//         console.error("Failed to fetch holidays:", error);
//         setHolidays([]);
//       })
//       .finally(() => {
//         if (alive) setLoading(false);
//       });

//     return () => {
//       alive = false;
//     };
//   }, [API_BASE]);

//   // Background rotation logic
//   const [apiBackgrounds, setApiBackgrounds] = useState([]);
//   const defaultBackgrounds = [
//     "./holiday/h1.jpg",
//     "./holiday/h2.jpg",
//     "./holiday/h3.jpg",
//     "./holiday/h4.jpg",
//   ];

//   useEffect(() => {
//     fetch(`${API_BASE}/api/hero/holidays`)
//       .then((r) => r.json())
//       .then((res) => {
//         const imgs = res?.data?.images || [];
//         if (imgs.length) setApiBackgrounds(imgs.map((p) => `${API_BASE}${p}`));
//       })
//       .catch(() => {});
//   }, [API_BASE]);

//   const rotationList = apiBackgrounds.length
//     ? apiBackgrounds
//     : defaultBackgrounds;

//   const [bgIndex, setBgIndex] = useState(0);
//   useEffect(() => {
//     if (!rotationList?.length) return;
//     const id = setInterval(() => {
//       setBgIndex((i) => (i + 1) % rotationList.length);
//     }, rotateIntervalMs);
//     return () => clearInterval(id);
//   }, [rotationList, rotateIntervalMs]);

//   // Search functionality
//   useEffect(() => {
//     clearTimeout(debounceRef.current);

//     debounceRef.current = setTimeout(() => {
//       if (!query.trim()) {
//         setSuggestions([]);
//         return;
//       }

//       const searchTerm = query.toLowerCase().trim();

//       const matches = holidays.filter((holiday) => {
//         return holiday.searchableText.includes(searchTerm);
//       });

//       console.log("Search matches:", matches);
//       setSuggestions(matches.slice(0, 8));
//     }, 200);

//     return () => clearTimeout(debounceRef.current);
//   }, [query, holidays]);

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

//   const handlePrev = () => {
//     setBgIndex((prev) => (prev === 0 ? rotationList.length - 1 : prev - 1));
//   };

//   const handleNext = () => {
//     setBgIndex((prev) => (prev + 1) % rotationList.length);
//   };

//   // Navigate to holiday detail page
//   const pickSuggestion = (holiday) => {
//     console.log("Selected holiday:", holiday);
//     const searchText = holiday.title || "";
//     setQuery(searchText);
//     setOpen(false);
//     setSuggestions([]);
//     setHighlighted(-1);
//     saveToSearchHistory(searchText);

//     if (holiday.id) {
//       navigate(`/holidays/${holiday.id}`);
//     }
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (query.trim()) {
//       saveToSearchHistory(query.trim());
//       navigate(`/holidays?search=${encodeURIComponent(query)}`);
//     }
//   };

//   const clearSearchHistory = () => {
//     setSearchHistory([]);
//     localStorage.removeItem("holidaySearchHistory");
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
//           {rotationList.map((img, i) => (
//             <img
//               key={i}
//               src={img}
//               alt={`holiday-slide-${i}`}
//               className={`absolute w-full h-full object-fill transition-opacity duration-1000 ${
//                 i === bgIndex ? "opacity-100" : "opacity-0"
//               }`}
//               draggable={false}
//             />
//           ))}
//           <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30 pointer-events-none"></div>
//         </div>

//         {/* Desktop Search */}
//         <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 px-4 hidden md:flex w-full max-w-4xl">
//           <div
//             ref={containerRef}
//             className="w-full max-w-[450px] mx-auto relative"
//           >
//             <form onSubmit={handleSearchSubmit} className="relative">
//               <div className="bg-white rounded-lg shadow-md flex items-center px-3 py-2 w-full border border-gray-200">
//                 <FaSearch className="text-gray-400 mr-2 w-4 h-4 flex-shrink-0" />
//                 <input
//                   ref={inputRef}
//                   type="text"
//                   placeholder="Search holiday packages..."
//                   className="w-full outline-none text-gray-700 font-medium bg-transparent placeholder-gray-400 text-sm"
//                   value={query}
//                   onChange={handleInputChange}
//                   onFocus={handleInputFocus}
//                   onKeyDown={onKeyDown}
//                 />
//                 {query && (
//                   <button
//                     type="button"
//                     onClick={() => setQuery("")}
//                     className="ml-1 text-gray-400 hover:text-gray-600 transition-colors text-xs"
//                   >
//                     ✕
//                   </button>
//                 )}
//               </div>
//             </form>

//             {/* Search Results Dropdown - Same as before */}
//             {open && (
//               <div className="absolute mt-2 w-full bg-white rounded-xl shadow-lg max-h-80 overflow-hidden z-50 border border-gray-200">
//                 {/* Dropdown content remains same */}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Navigation Arrows */}
//         <div className="absolute bottom-8 right-8 gap-3 z-20 hidden md:flex">
//           <button
//             onClick={handlePrev}
//             className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
//           >
//             <FaArrowLeft className="text-gray-800" />
//           </button>
//           <button
//             onClick={handleNext}
//             className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
//           >
//             <FaArrowRight className="text-gray-800" />
//           </button>
//         </div>
//       </div>

//       {/* Mobile Search - Half inside hero, half outside with shadow */}
//       <div className="md:hidden relative z-30">
//         <div className="relative px-4" style={{ marginTop: "-2rem" }}>
//           <div ref={containerRef} className="relative">
//             <form onSubmit={handleSearchSubmit}>
//               <div className="bg-white rounded-xl shadow-2xl flex items-center px-4 py-3 w-full border border-gray-200">
//                 <FaSearch className="text-gray-500 mr-3 w-5 h-5 flex-shrink-0" />
//                 <input
//                   type="text"
//                   placeholder="Search holiday packages..."
//                   className="w-full outline-none text-gray-700 font-medium placeholder-gray-500 text-base"
//                   value={query}
//                   onChange={handleInputChange}
//                   onFocus={handleInputFocus}
//                 />
//               </div>
//             </form>

//             {/* Mobile Suggestions */}
//             {open && (suggestions.length > 0 || searchHistory.length > 0) && (
//               <div className="absolute mt-2 w-full bg-white rounded-xl shadow-2xl max-h-64 overflow-auto z-50 border border-gray-200">
//                 {suggestions.length > 0
//                   ? suggestions.map((holiday, index) => (
//                       <div
//                         key={holiday.id || index}
//                         onClick={() => pickSuggestion(holiday)}
//                         className="flex items-center gap-2 p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
//                       >
//                         <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
//                           {holiday.previewImage ? (
//                             <img
//                               src={holiday.previewImage}
//                               alt={holiday.title}
//                               className="w-full h-full object-cover"
//                             />
//                           ) : (
//                             <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                               <FaCalendar className="text-gray-400 text-xs" />
//                             </div>
//                           )}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <div className="text-sm font-semibold text-gray-800 truncate">
//                             {holiday.title}
//                           </div>
//                           <div className="text-xs text-gray-500 truncate">
//                             {holiday.destination}
//                           </div>
//                           <div className="flex items-center gap-2 text-xs text-gray-400">
//                             {holiday.duration && (
//                               <span>{holiday.duration}</span>
//                             )}
//                             {holiday.price && (
//                               <span className="font-medium text-green-600">
//                                 ${holiday.price}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   : searchHistory.map((search, index) => (
//                       <button
//                         key={index}
//                         onClick={() => setQuery(search)}
//                         className="w-full text-left p-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700"
//                       >
//                         <FaClock className="text-gray-400 w-3 h-3" />
//                         {search}
//                       </button>
//                     ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import { useEffect, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaSearch,
  FaTag,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function HolidayHero({
  backgroundUrl,
  backgroundUrls,
  rotateIntervalMs = 8000,
  themeColor = "#F17232",
}) {
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;

  const [holidays, setHolidays] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [hoveredHeroImage, setHoveredHeroImage] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("holidaySearchHistory");
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
      "holidaySearchHistory",
      JSON.stringify(updatedHistory)
    );
  };

  // Fetch holidays from your database
  useEffect(() => {
    let alive = true;
    setLoading(true);

    fetch(`${API_BASE}/api/holidays`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch holidays");
        return res.json();
      })
      .then((data) => {
        if (!alive) return;

        console.log("Raw holidays data:", data);

        // Handle different response formats
        const holidaysData = Array.isArray(data)
          ? data
          : data.data || data.rows || [];

        const normalizedHolidays = holidaysData.map((holiday) => {
          let previewImage = "";

          // Parse images array from images field
          if (holiday.images) {
            try {
              const imagesArray =
                typeof holiday.images === "string"
                  ? JSON.parse(holiday.images)
                  : holiday.images;

              if (Array.isArray(imagesArray) && imagesArray.length > 0) {
                previewImage = imagesArray[0];
              }
            } catch (err) {
              // If JSON parsing fails, try comma-separated
              if (
                typeof holiday.images === "string" &&
                holiday.images.includes(",")
              ) {
                const images = holiday.images
                  .split(",")
                  .map((img) => img.trim())
                  .filter((img) => img);
                if (images.length > 0) previewImage = images[0];
              } else if (holiday.images) {
                previewImage = holiday.images;
              }
            }
          }

          // Construct proper image URL
          if (
            previewImage &&
            !previewImage.startsWith("http") &&
            !previewImage.startsWith("data:")
          ) {
            previewImage = `${API_BASE}/uploads/holidays/${previewImage}`;
          }

          return {
            id: holiday.id,
            title: holiday.title || "Unnamed Holiday Package",
            destination: holiday.destination || "",
            duration: holiday.duration || "",
            price: holiday.price || 0,
            category: holiday.category || "",
            details: holiday.details || "",
            previewImage: previewImage,
            searchableText: `
              ${holiday.title || ""} 
              ${holiday.destination || ""} 
              ${holiday.category || ""}
              ${holiday.duration || ""}
            `.toLowerCase(),
            ...holiday,
          };
        });

        console.log("Normalized holidays:", normalizedHolidays);
        setHolidays(normalizedHolidays);
      })
      .catch((error) => {
        console.error("Failed to fetch holidays:", error);
        setHolidays([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [API_BASE]);

  // Background rotation logic
  const [apiBackgrounds, setApiBackgrounds] = useState([]);
  const defaultBackgrounds = [
    "./holiday/h1.jpg",
    "./holiday/h2.jpg",
    "./holiday/h3.jpg",
    "./holiday/h4.jpg",
  ];

  useEffect(() => {
    fetch(`${API_BASE}/api/hero/holidays`)
      .then((r) => r.json())
      .then((res) => {
        const imgs = res?.data?.images || [];
        if (imgs.length) setApiBackgrounds(imgs.map((p) => `${API_BASE}${p}`));
      })
      .catch(() => {});
  }, [API_BASE]);

  const rotationList = apiBackgrounds.length
    ? apiBackgrounds
    : defaultBackgrounds;

  const [bgIndex, setBgIndex] = useState(0);
  useEffect(() => {
    if (!rotationList?.length) return;
    const id = setInterval(() => {
      setBgIndex((i) => (i + 1) % rotationList.length);
    }, rotateIntervalMs);
    return () => clearInterval(id);
  }, [rotationList, rotateIntervalMs]);

  // Search functionality
  useEffect(() => {
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      const searchTerm = query.toLowerCase().trim();

      const matches = holidays.filter((holiday) => {
        return holiday.searchableText.includes(searchTerm);
      });

      console.log("Search matches:", matches);
      setSuggestions(matches.slice(0, 8));
    }, 200);

    return () => clearTimeout(debounceRef.current);
  }, [query, holidays]);

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

  const handlePrev = () => {
    setBgIndex((prev) => (prev === 0 ? rotationList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setBgIndex((prev) => (prev + 1) % rotationList.length);
  };

  // Navigate to holiday detail page
  const pickSuggestion = (holiday) => {
    console.log("Selected holiday:", holiday);
    const searchText = holiday.title || "";
    setQuery(searchText);
    setOpen(false);
    setSuggestions([]);
    setHighlighted(-1);
    saveToSearchHistory(searchText);

    if (holiday.id) {
      navigate(`/holidays/${holiday.id}`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      saveToSearchHistory(query.trim());
      navigate(`/holidays?search=${encodeURIComponent(query)}`);
    }
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("holidaySearchHistory");
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
          {rotationList.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`holiday-slide-${i}`}
              className={`absolute w-full h-full object-fill transition-opacity duration-1000 ${
                i === bgIndex ? "opacity-100" : "opacity-0"
              }`}
              draggable={false}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30 pointer-events-none"></div>
        </div>

        {/* Desktop Search */}
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
                  placeholder="Search holiday packages..."
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
                      alt="holiday preview"
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
                    Searching holidays...
                  </div>
                )}

                {/* Search Results */}
                {!loading && suggestions.length > 0 && (
                  <>
                    <div className="p-3 border-b border-gray-100 bg-gray-50">
                      <div className="text-sm font-semibold text-gray-700">
                        Holiday Packages ({suggestions.length})
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {suggestions.map((holiday, index) => (
                        <div
                          key={holiday.id || index}
                          className={`flex items-center gap-3 p-3 cursor-pointer transition-all duration-200 border-b border-gray-100 last:border-b-0 ${
                            highlighted === index
                              ? "bg-blue-50 border-l-4 border-l-blue-500"
                              : "hover:bg-gray-50"
                          }`}
                          onMouseEnter={() => setHighlighted(index)}
                          onClick={() => pickSuggestion(holiday)}
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {holiday.previewImage ? (
                              <img
                                src={holiday.previewImage}
                                alt={holiday.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center hidden">
                              <FaCalendar className="text-gray-400" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 mb-1">
                              <HighlightText
                                text={holiday.title}
                                highlight={query}
                              />
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                              {holiday.destination && (
                                <span className="flex items-center gap-1">
                                  <FaMapMarkerAlt className="w-3 h-3" />
                                  <HighlightText
                                    text={holiday.destination}
                                    highlight={query}
                                  />
                                </span>
                              )}
                              {holiday.duration && (
                                <span className="flex items-center gap-1">
                                  <FaCalendar className="w-3 h-3" />
                                  {holiday.duration}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              {holiday.category && (
                                <span className="flex items-center gap-1">
                                  <FaTag className="w-3 h-3" />
                                  {holiday.category}
                                </span>
                              )}
                              {holiday.price && (
                                <span className="font-medium text-green-600">
                                  ${holiday.price}
                                </span>
                              )}
                            </div>
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
                      No holidays found
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
                      Start typing to search holidays
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

      {/* Mobile Search - Half inside hero, half outside with shadow */}
      <div className="md:hidden relative z-30">
        <div className="relative px-4" style={{ marginTop: "-2rem" }}>
          <div ref={containerRef} className="relative">
            <form onSubmit={handleSearchSubmit}>
              <div className="bg-white rounded-xl shadow-2xl flex items-center px-4 py-3 w-full border border-gray-200">
                <FaMapMarkerAlt className="text-gray-500 mr-3 w-5 h-5 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search holiday packages..."
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
                  ? suggestions.map((holiday, index) => (
                      <div
                        key={holiday.id || index}
                        onClick={() => pickSuggestion(holiday)}
                        className="flex items-center gap-2 p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          {holiday.previewImage ? (
                            <img
                              src={holiday.previewImage}
                              alt={holiday.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <FaCalendar className="text-gray-400 text-xs" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-800 truncate">
                            {holiday.title}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {holiday.destination}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            {holiday.duration && (
                              <span>{holiday.duration}</span>
                            )}
                            {holiday.price && (
                              <span className="font-medium text-green-600">
                                ${holiday.price}
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
