// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function CruisesHero({
//   backgroundUrls,
//   rotateIntervalMs = 8000,
// }) {
//   const navigate = useNavigate();
//   const API_BASE = import.meta.env.VITE_API_URL;

//   // Cruise search state
//   const [cruises, setCruises] = useState([]);
//   const [query, setQuery] = useState("");
//   const [open, setOpen] = useState(false);

//   // Fetch cruises from API
//   useEffect(() => {
//     let ignore = false;
//     (async () => {
//       try {
//         const res = await fetch(`${API_BASE}/api/cruises`);
//         const data = await res.json();
//         if (!ignore) setCruises(Array.isArray(data?.data) ? data.data : []);
//       } catch {
//         if (!ignore) setCruises([]);
//       }
//     })();
//     return () => (ignore = true);
//   }, [API_BASE]);

//   const filteredCruises = useMemo(() => {
//     const t = query.trim().toLowerCase();
//     if (!t) return cruises;
//     return cruises.filter((c) =>
//       [c.title, c.category, c.departure_port]
//         .filter(Boolean)
//         .some((v) => String(v).toLowerCase().includes(t))
//     );
//   }, [cruises, query]);

//   // Background rotation
//   const [bgIndex, setBgIndex] = useState(0);
//   const rotationList = useMemo(() => {
//     if (backgroundUrls?.length) return backgroundUrls;
//     // default cruise images
//     return [
//       "./cruises/c1.jpg",
//       "./cruises/c2.jpg",
//       "./cruises/c3.jpg",
//       "./cruises/c4.jpg",
//       "./cruises/c5.jpg",
//     ];
//   }, [backgroundUrls]);

//   useEffect(() => {
//     const id = setInterval(() => {
//       setBgIndex((i) => (i + 1) % rotationList.length);
//     }, rotateIntervalMs);
//     return () => clearInterval(id);
//   }, [rotationList, rotateIntervalMs]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (filteredCruises.length > 0)
//       navigate(`/cruises/${filteredCruises[0].id}`);
//     else navigate(`/cruises`);
//   };

//   return (
//     <section className="relative h-[70vh] w-full">
//       {/* Background images */}
//       {rotationList.map((src, idx) => (
//         <img
//           key={idx}
//           src={src}
//           alt="Cruise background"
//           className={`absolute inset-0 h-full w-full object-fill transition-opacity duration-1000 ${
//             idx === bgIndex ? "opacity-100" : "opacity-0"
//           }`}
//           loading={idx === 0 ? "eager" : "lazy"}
//         />
//       ))}

//       {/* Gradient overlay for readability */}
//       <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />

//       {/* Centered search bar */}
//       <div className="absolute inset-0 flex justify-center items-center px-4">
//         <form onSubmit={handleSubmit} className="w-full max-w-md relative">
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => {
//               setQuery(e.target.value);
//               setOpen(true);
//             }}
//             onFocus={() => setOpen(true)}
//             placeholder="Search cruise packages"
//             className="w-full pl-4 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400"
//           />
//           {open && filteredCruises.length > 0 && (
//             <div className="absolute mt-1 w-full max-h-64 overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg z-20">
//               {filteredCruises.map((c) => (
//                 <button
//                   key={c.id}
//                   type="button"
//                   className="w-full text-left px-3 py-2 hover:bg-gray-50"
//                   onClick={() => navigate(`/cruises/${c.id}`)}
//                 >
//                   <div className="font-medium text-gray-800">{c.title}</div>
//                   <div className="text-xs text-gray-500">
//                     {[c.category, c.departure_port].filter(Boolean).join(" • ")}
//                   </div>
//                 </button>
//               ))}
//             </div>
//           )}
//         </form>
//       </div>
//     </section>
//   );
// // }

// import { useEffect, useMemo, useState } from "react";
// import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// export default function CruisesHero({
//   backgroundUrls,
//   rotateIntervalMs = 8000,
// }) {
//   const navigate = useNavigate();
//   const API_BASE = import.meta.env.VITE_API_URL;

//   // Cruise search state
//   const [cruises, setCruises] = useState([]);
//   const [query, setQuery] = useState("");
//   const [open, setOpen] = useState(false);

//   // Fetch cruises from API
//   useEffect(() => {
//     let ignore = false;
//     (async () => {
//       try {
//         const res = await fetch(`${API_BASE}/api/cruises`);
//         const data = await res.json();
//         if (!ignore) setCruises(Array.isArray(data?.data) ? data.data : []);
//       } catch {
//         if (!ignore) setCruises([]);
//       }
//     })();
//     return () => (ignore = true);
//   }, [API_BASE]);

//   const filteredCruises = useMemo(() => {
//     const t = query.trim().toLowerCase();
//     if (!t) return cruises;
//     return cruises.filter((c) =>
//       [c.title, c.category, c.departure_port]
//         .filter(Boolean)
//         .some((v) => String(v).toLowerCase().includes(t))
//     );
//   }, [cruises, query]);

//   // Background rotation
//   const [bgIndex, setBgIndex] = useState(0);
//   const rotationList = useMemo(() => {
//     if (backgroundUrls?.length) return backgroundUrls;
//     return [
//       "./cruises/c1.jpg",
//       "./cruises/c2.jpg",
//       "./cruises/c3.jpg",
//       "./cruises/c4.jpg",
//       "./cruises/c5.jpg",
//     ];
//   }, [backgroundUrls]);

//   useEffect(() => {
//     const id = setInterval(() => {
//       setBgIndex((i) => (i + 1) % rotationList.length);
//     }, rotateIntervalMs);
//     return () => clearInterval(id);
//   }, [rotationList, rotateIntervalMs]);

//   const handlePrev = () => {
//     setBgIndex((i) => (i === 0 ? rotationList.length - 1 : i - 1));
//   };

//   const handleNext = () => {
//     setBgIndex((i) => (i + 1) % rotationList.length);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (filteredCruises.length > 0)
//       navigate(`/cruises/${filteredCruises[0].id}`);
//     else navigate(`/cruises`);
//   };

//   return (
//     <>
//       {/* HERO SECTION */}
//       <section className="relative h-[35vh] sm:h-[50vh] md:h-[65vh] w-full overflow-hidden select-none flex items-center justify-center">
//         {/* Background Images */}
//         {rotationList.map((src, idx) => (
//           <img
//             key={idx}
//             src={src}
//             alt="Cruise background"
//             className={`absolute inset-0 h-full w-full object-fill transition-opacity duration-1000 ${
//               idx === bgIndex ? "opacity-100" : "opacity-0"
//             }`}
//             loading={idx === 0 ? "eager" : "lazy"}
//           />
//         ))}

//         {/* Gradient Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />

//         {/* Centered Search Bar (Desktop only) */}
//         <div className="absolute inset-0 hidden md:flex items-center justify-center px-4 z-10">
//           <form onSubmit={handleSubmit} className="w-full max-w-md relative">
//             <input
//               type="text"
//               value={query}
//               onChange={(e) => {
//                 setQuery(e.target.value);
//                 setOpen(true);
//               }}
//               onFocus={() => setOpen(true)}
//               placeholder="Search cruise packages"
//               className="w-full pl-5 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400 shadow-lg bg-white/90 backdrop-blur-sm"
//             />
//             {open && filteredCruises.length > 0 && (
//               <div className="absolute mt-1 w-full max-h-64 overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg z-20">
//                 {filteredCruises.map((c) => (
//                   <button
//                     key={c.id}
//                     type="button"
//                     className="w-full text-left px-3 py-2 hover:bg-gray-50"
//                     onClick={() => navigate(`/cruises/${c.id}`)}
//                   >
//                     <div className="font-medium text-gray-800">{c.title}</div>
//                     <div className="text-xs text-gray-500">
//                       {[c.category, c.departure_port]
//                         .filter(Boolean)
//                         .join(" • ")}
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </form>
//         </div>

//         {/* Left-Right Arrows (Desktop only) */}
//         <div className="absolute bottom-6 right-6 flex gap-3 z-20 hidden md:flex">
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

//       {/* Mobile Search Input (same as Hero style) */}
//       <div className="md:hidden relative -top-8 z-20 px-4">
//         <form onSubmit={handleSubmit} className="w-full">
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
//               placeholder="Search cruise packages"
//               className="w-full outline-none text-gray-700 font-medium placeholder-gray-500 text-sm"
//               readOnly
//             />
//           </div>
//         </form>
//       </div>
//     </>
//   );
// // }

// import { useEffect, useMemo, useState } from "react";
// import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// export default function CruisesHero({
//   backgroundUrls,
//   rotateIntervalMs = 8000,
// }) {
//   const navigate = useNavigate();
//   const API_BASE = import.meta.env.VITE_API_URL;

//   // Cruise search state
//   const [cruises, setCruises] = useState([]);
//   const [query, setQuery] = useState("");
//   const [open, setOpen] = useState(false);

//   // Background images state
//   const [bgImages, setBgImages] = useState([]);
//   const [bgIndex, setBgIndex] = useState(0);

//   // Fetch cruises from API
//   useEffect(() => {
//     let ignore = false;
//     (async () => {
//       try {
//         const res = await fetch(`${API_BASE}/api/cruises`);
//         const data = await res.json();
//         if (!ignore) setCruises(Array.isArray(data?.data) ? data.data : []);
//       } catch {
//         if (!ignore) setCruises([]);
//       }
//     })();
//     return () => (ignore = true);
//   }, [API_BASE]);

//   // Fetch hero images from API
//   useEffect(() => {
//     let ignore = false;
//     (async () => {
//       try {
//         const res = await fetch(`${API_BASE}/api/hero/cruises`);
//         const data = await res.json();

//         if (!ignore && data.success) {
//           // Use the images from API if available, otherwise use fallbacks
//           if (data.data.images && data.data.images.length > 0) {
//             const fullUrls = data.data.images.map((img) =>
//               img.startsWith("http") ? img : `${API_BASE}${img}`
//             );
//             setBgImages(fullUrls);
//           } else {
//             // Fallback to default images if no dynamic images
//             setBgImages([
//               "./cruises/c1.jpg",
//               "./cruises/c2.jpg",
//               "./cruises/c3.jpg",
//               "./cruises/c4.jpg",
//               "./cruises/c5.jpg",
//             ]);
//           }
//         }
//       } catch (error) {
//         console.error("Failed to fetch hero images:", error);
//         if (!ignore) {
//           // Fallback on error
//           setBgImages([
//             "./cruises/c1.jpg",
//             "./cruises/c2.jpg",
//             "./cruises/c3.jpg",
//             "./cruises/c4.jpg",
//             "./cruises/c5.jpg",
//           ]);
//         }
//       }
//     })();
//     return () => (ignore = true);
//   }, [API_BASE]);

//   const filteredCruises = useMemo(() => {
//     const t = query.trim().toLowerCase();
//     if (!t) return cruises;
//     return cruises.filter((c) =>
//       [c.title, c.category, c.departure_port]
//         .filter(Boolean)
//         .some((v) => String(v).toLowerCase().includes(t))
//     );
//   }, [cruises, query]);

//   // Background rotation - only if we have images
//   const rotationList = useMemo(() => {
//     // Use prop backgroundUrls if provided, otherwise use fetched bgImages
//     if (backgroundUrls?.length) return backgroundUrls;
//     return bgImages.length > 0
//       ? bgImages
//       : [
//           "./cruises/c1.jpg",
//           "./cruises/c2.jpg",
//           "./cruises/c3.jpg",
//           "./cruises/c4.jpg",
//           "./cruises/c5.jpg",
//         ];
//   }, [backgroundUrls, bgImages]);

//   useEffect(() => {
//     if (rotationList.length === 0) return;

//     const id = setInterval(() => {
//       setBgIndex((i) => (i + 1) % rotationList.length);
//     }, rotateIntervalMs);
//     return () => clearInterval(id);
//   }, [rotationList, rotateIntervalMs]);

//   const handlePrev = () => {
//     if (rotationList.length === 0) return;
//     setBgIndex((i) => (i === 0 ? rotationList.length - 1 : i - 1));
//   };

//   const handleNext = () => {
//     if (rotationList.length === 0) return;
//     setBgIndex((i) => (i + 1) % rotationList.length);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (filteredCruises.length > 0)
//       navigate(`/cruises/${filteredCruises[0].id}`);
//     else navigate(`/cruises`);
//   };

//   // Don't render if no images
//   if (rotationList.length === 0) {
//     return (
//       <div className="h-[35vh] sm:h-[50vh] md:h-[65vh] bg-gray-200 animate-pulse"></div>
//     );
//   }

//   return (
//     <>
//       {/* HERO SECTION */}
//       <section className="relative h-[20vh] sm:h-[50vh] md:h-[350px] w-full overflow-hidden select-none flex items-center justify-center">
//         {/* Background Images */}
//         {rotationList.map((src, idx) => (
//           <img
//             key={idx}
//             src={src}
//             alt="Cruise background"
//             className={`absolute inset-0 h-full w-full object-fill transition-opacity duration-1000 ${
//               idx === bgIndex ? "opacity-100" : "opacity-0"
//             }`}
//             loading={idx === 0 ? "eager" : "lazy"}
//             onError={(e) => {
//               // Fallback if image fails to load
//               console.error(`Failed to load image: ${src}`);
//               e.target.style.display = "none";
//             }}
//           />
//         ))}

//         {/* Gradient Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />

//         {/* Centered Search Bar (Desktop only) */}
//         <div className="absolute inset-0 hidden md:flex items-center justify-center px-4 z-10">
//           <form onSubmit={handleSubmit} className="w-full max-w-md relative">
//             <input
//               type="text"
//               value={query}
//               onChange={(e) => {
//                 setQuery(e.target.value);
//                 setOpen(true);
//               }}
//               onFocus={() => setOpen(true)}
//               placeholder="Search cruise packages"
//               className="w-full pl-5 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400 shadow-lg bg-white/90 backdrop-blur-sm"
//             />
//             {open && filteredCruises.length > 0 && (
//               <div className="absolute mt-1 w-full max-h-64 overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg z-20">
//                 {filteredCruises.map((c) => (
//                   <button
//                     key={c.id}
//                     type="button"
//                     className="w-full text-left px-3 py-2 hover:bg-gray-50"
//                     onClick={() => navigate(`/cruises/${c.id}`)}
//                   >
//                     <div className="font-medium text-gray-800">{c.title}</div>
//                     <div className="text-xs text-gray-500">
//                       {[c.category, c.departure_port]
//                         .filter(Boolean)
//                         .join(" • ")}
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </form>
//         </div>

//         {/* Left-Right Arrows (Desktop only) */}
//         <div className="absolute bottom-6 right-6 flex gap-3 z-20 hidden md:flex">
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

//       {/* Mobile Search Input (same as Hero style) */}
//       <div className="md:hidden relative -top-8 z-20 px-4">
//         <form onSubmit={handleSubmit} className="w-full">
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
//               placeholder="Search cruise packages"
//               className="w-full outline-none text-gray-700 font-medium placeholder-gray-500 text-sm"
//               readOnly
//             />
//           </div>
//         </form>
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
    FaShip,
    FaTag,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function CruisesHero({
  backgroundUrls,
  rotateIntervalMs = 8000,
}) {
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;

  const [cruises, setCruises] = useState([]);
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
    const saved = localStorage.getItem("cruiseSearchHistory");
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
    localStorage.setItem("cruiseSearchHistory", JSON.stringify(updatedHistory));
  };

  // Hardcoded cruises data as fallback
  const hardcodedCruises = [
    {
      id: 1,
      title: "Mediterranean Cruise - 7 Nights",
      departure_port: "Barcelona, Spain",
      departure_dates: JSON.stringify(["2024-06-15", "2024-07-20", "2024-08-10"]),
      price: 1500.00,
      image: "mediterranean-cruise.jpg",
      banner_video_url: "https://youtube.com/watch?v=mediterranean",
      category: "Mediterranean",
      details: "Sail through the beautiful Mediterranean visiting Spain, France, Italy, and Greece.",
    },
    {
      id: 2,
      title: "Caribbean Paradise Cruise",
      departure_port: "Miami, USA",
      departure_dates: JSON.stringify(["2024-05-01", "2024-06-15", "2024-07-30"]),
      price: 1800.00,
      image: "caribbean-cruise.jpg",
      banner_video_url: "https://youtube.com/watch?v=caribbean",
      category: "Caribbean",
      details: "Explore tropical islands, pristine beaches, and vibrant cultures.",
    },
    {
      id: 3,
      title: "Alaska Adventure Cruise",
      departure_port: "Seattle, USA",
      departure_dates: JSON.stringify(["2024-07-01", "2024-08-15"]),
      price: 2200.00,
      image: "alaska-cruise.jpg",
      banner_video_url: "https://youtube.com/watch?v=alaska",
      category: "Adventure",
      details: "Witness glaciers, wildlife, and stunning natural beauty.",
    },
  ];

  // Fetch cruises from your database
  useEffect(() => {
    let alive = true;
    setLoading(true);

    fetch(`${API_BASE}/api/cruises`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch cruises");
        return res.json();
      })
      .then((data) => {
        if (!alive) return;

        console.log("Raw cruises data:", data);

        // Handle different response formats
        const cruisesData = Array.isArray(data)
          ? data
          : data.data || data.rows || [];

        // Use hardcoded data if API returns empty
        const dataToUse = (Array.isArray(cruisesData) && cruisesData.length > 0) 
          ? cruisesData 
          : hardcodedCruises;

        const normalizedCruises = dataToUse.map((cruise) => {
          let previewImage = cruise.image || "";

          // Construct proper image URL
          if (
            previewImage &&
            !previewImage.startsWith("http") &&
            !previewImage.startsWith("data:")
          ) {
            previewImage = `${API_BASE}/uploads/cruises/${previewImage}`;
          }

          // Parse departure dates
          let departureDates = [];
          if (cruise.departure_dates) {
            try {
              departureDates =
                typeof cruise.departure_dates === "string"
                  ? JSON.parse(cruise.departure_dates)
                  : cruise.departure_dates;
            } catch (err) {
              console.error("Error parsing departure dates:", err);
            }
          }

          return {
            id: cruise.id,
            title: cruise.title || "Unnamed Cruise Package",
            departure_port: cruise.departure_port || "",
            departure_dates: departureDates,
            price: cruise.price || 0,
            category: cruise.category || "",
            details: cruise.details || "",
            banner_video_url: cruise.banner_video_url || "",
            previewImage: previewImage,
            searchableText: `
              ${cruise.title || ""} 
              ${cruise.departure_port || ""} 
              ${cruise.category || ""}
              ${cruise.details || ""}
            `.toLowerCase(),
            ...cruise,
          };
        });

        console.log("Normalized cruises:", normalizedCruises);
        setCruises(normalizedCruises);
      })
      .catch((error) => {
        console.error("Failed to fetch cruises:", error);
        // Use hardcoded data on error
        const normalizedCruises = hardcodedCruises.map((cruise) => {
          let previewImage = cruise.image || "";
          let departureDates = [];
          if (cruise.departure_dates) {
            try {
              departureDates = typeof cruise.departure_dates === "string"
                ? JSON.parse(cruise.departure_dates)
                : cruise.departure_dates;
            } catch (err) {
              console.error("Error parsing departure dates:", err);
            }
          }
          return {
            id: cruise.id,
            title: cruise.title,
            departure_port: cruise.departure_port,
            departure_dates: departureDates,
            price: cruise.price,
            category: cruise.category,
            details: cruise.details,
            banner_video_url: cruise.banner_video_url,
            previewImage: previewImage || "./cards/1.jpg",
            searchableText: `${cruise.title} ${cruise.departure_port} ${cruise.category} ${cruise.details}`.toLowerCase(),
            ...cruise,
          };
        });
        setCruises(normalizedCruises);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [API_BASE]);

  // Background images state
  const [bgImages, setBgImages] = useState([]);
  const [bgIndex, setBgIndex] = useState(0);

  // Fetch hero images from API
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/hero/cruises`);
        const data = await res.json();

        if (!ignore && data.success) {
          if (data.data.images && data.data.images.length > 0) {
            const fullUrls = data.data.images.map((img) =>
              img.startsWith("http") ? img : `${API_BASE}${img}`
            );
            setBgImages(fullUrls);
          } else {
            setBgImages([
              "./cruises/c1.jpg",
              "./cruises/c2.jpg",
              "./cruises/c3.jpg",
              "./cruises/c4.jpg",
              "./cruises/c5.jpg",
            ]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch hero images:", error);
        if (!ignore) {
          setBgImages([
            "./cruises/c1.jpg",
            "./cruises/c2.jpg",
            "./cruises/c3.jpg",
            "./cruises/c4.jpg",
            "./cruises/c5.jpg",
          ]);
        }
      }
    })();
    return () => (ignore = true);
  }, [API_BASE]);

  // Search functionality
  useEffect(() => {
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      const searchTerm = query.toLowerCase().trim();

      const matches = cruises.filter((cruise) => {
        return cruise.searchableText.includes(searchTerm);
      });

      console.log("Search matches:", matches);
      setSuggestions(matches.slice(0, 8));
    }, 200);

    return () => clearTimeout(debounceRef.current);
  }, [query, cruises]);

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

  // Background rotation
  const rotationList =
    bgImages.length > 0
      ? bgImages
      : [
          "./cruises/c1.jpg",
          "./cruises/c2.jpg",
          "./cruises/c3.jpg",
          "./cruises/c4.jpg",
          "./cruises/c5.jpg",
        ];

  useEffect(() => {
    if (rotationList.length === 0) return;

    const id = setInterval(() => {
      setBgIndex((i) => (i + 1) % rotationList.length);
    }, rotateIntervalMs);
    return () => clearInterval(id);
  }, [rotationList, rotateIntervalMs]);

  const handlePrev = () => {
    if (rotationList.length === 0) return;
    setBgIndex((i) => (i === 0 ? rotationList.length - 1 : i - 1));
  };

  const handleNext = () => {
    if (rotationList.length === 0) return;
    setBgIndex((i) => (i + 1) % rotationList.length);
  };

  // Navigate to cruise detail page
  const pickSuggestion = (cruise) => {
    console.log("Selected cruise:", cruise);
    const searchText = cruise.title || "";
    setQuery(searchText);
    setOpen(false);
    setSuggestions([]);
    setHighlighted(-1);
    saveToSearchHistory(searchText);

    if (cruise.id) {
      navigate(`/cruises/${cruise.id}`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      saveToSearchHistory(query.trim());
      navigate(`/cruises?search=${encodeURIComponent(query)}`);
    }
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("cruiseSearchHistory");
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

  // Format departure dates
  const formatDepartureDates = (dates) => {
    if (!dates || !Array.isArray(dates) || dates.length === 0) return "";
    if (dates.length === 1) return new Date(dates[0]).toLocaleDateString();
    return `${dates.length} departure dates`;
  };

  if (rotationList.length === 0) {
    return (
      <div className="h-[20vh] md:h-[500px] lg:h-[350px] bg-gray-200 animate-pulse"></div>
    );
  }

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
              alt={`cruise-slide-${i}`}
              className={`absolute w-full h-full object-fill transition-opacity duration-1000 ${
                i === bgIndex ? "opacity-100" : "opacity-0"
              }`}
              draggable={false}
              onError={(e) => {
                console.error(`Failed to load image: ${img}`);
                e.target.style.display = "none";
              }}
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
                  placeholder="Search cruise packages..."
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
                      alt="cruise preview"
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
                    Searching cruises...
                  </div>
                )}

                {/* Search Results */}
                {!loading && suggestions.length > 0 && (
                  <>
                    <div className="p-3 border-b border-gray-100 bg-gray-50">
                      <div className="text-sm font-semibold text-gray-700">
                        Cruise Packages ({suggestions.length})
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {suggestions.map((cruise, index) => (
                        <div
                          key={cruise.id || index}
                          className={`flex items-center gap-3 p-3 cursor-pointer transition-all duration-200 border-b border-gray-100 last:border-b-0 ${
                            highlighted === index
                              ? "bg-blue-50 border-l-4 border-l-blue-500"
                              : "hover:bg-gray-50"
                          }`}
                          onMouseEnter={() => setHighlighted(index)}
                          onClick={() => pickSuggestion(cruise)}
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {cruise.previewImage ? (
                              <img
                                src={cruise.previewImage}
                                alt={cruise.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center hidden">
                              <FaShip className="text-gray-400" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 mb-1">
                              <HighlightText
                                text={cruise.title}
                                highlight={query}
                              />
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                              {cruise.departure_port && (
                                <span className="flex items-center gap-1">
                                  <FaMapMarkerAlt className="w-3 h-3" />
                                  <HighlightText
                                    text={cruise.departure_port}
                                    highlight={query}
                                  />
                                </span>
                              )}
                              {cruise.departure_dates &&
                                cruise.departure_dates.length > 0 && (
                                  <span className="flex items-center gap-1">
                                    <FaCalendar className="w-3 h-3" />
                                    {formatDepartureDates(
                                      cruise.departure_dates
                                    )}
                                  </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              {cruise.category && (
                                <span className="flex items-center gap-1">
                                  <FaTag className="w-3 h-3" />
                                  {cruise.category}
                                </span>
                              )}
                              {cruise.price && (
                                <span className="font-medium text-green-600">
                                  ${cruise.price}
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
                      No cruises found
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
                      Start typing to search cruises
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
                  placeholder="Search cruise packages..."
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
                  ? suggestions.map((cruise, index) => (
                      <div
                        key={cruise.id || index}
                        onClick={() => pickSuggestion(cruise)}
                        className="flex items-center gap-2 p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          {cruise.previewImage ? (
                            <img
                              src={cruise.previewImage}
                              alt={cruise.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <FaShip className="text-gray-400 text-xs" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-800 truncate">
                            {cruise.title}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {cruise.departure_port}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            {cruise.departure_dates &&
                              cruise.departure_dates.length > 0 && (
                                <span>
                                  {formatDepartureDates(cruise.departure_dates)}
                                </span>
                              )}
                            {cruise.price && (
                              <span className="font-medium text-green-600">
                                ${cruise.price}
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
