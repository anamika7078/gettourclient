// import axios from "axios";
// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCurrency } from "../../contexts/CurrencyContext";

// function TourRow({ title, tours }) {
//   const navigate = useNavigate();
//   const { convertAndFormat } = useCurrency();
//   const containerRef = useRef(null);
//   const [autoId, setAutoId] = useState(null);

//   const computeStep = () => {
//     const el = containerRef.current;
//     if (!el) return 344;
//     const firstCard = el.querySelector("[data-tour-card]");
//     const gapRaw =
//       getComputedStyle(el).columnGap || getComputedStyle(el).gap || "0px";
//     const gap = parseFloat(gapRaw) || 0;
//     const w = firstCard ? firstCard.getBoundingClientRect().width : 320;
//     return Math.round(w + gap);
//   };

//   const halfScrollWidth = () => {
//     const el = containerRef.current;
//     if (!el) return 0;
//     return (el.scrollWidth || 0) / 2;
//   };

//   const scrollItems = (dir) => {
//     const el = containerRef.current;
//     if (!el) return;
//     const step = computeStep();
//     const max = halfScrollWidth();
//     el.scrollBy({ left: dir === "right" ? step : -step, behavior: "smooth" });
//     setTimeout(() => {
//       if (el.scrollLeft >= max - step) el.scrollLeft = 0;
//       else if (el.scrollLeft <= 0) el.scrollLeft = max;
//     }, 450);
//   };

//   useEffect(() => {
//     const id = setInterval(() => scrollItems("right"), 4000);
//     setAutoId(id);
//     return () => clearInterval(id);
//   }, []);

//   const handleMouseEnter = () => {
//     if (autoId) clearInterval(autoId);
//   };
//   const handleMouseLeave = () => {
//     const id = setInterval(() => scrollItems("right"), 4000);
//     setAutoId(id);
//   };

//   const handleCardClick = (tour) => {
//     navigate(`/holidays/${tour.id}`);
//   };

//   return (
//     <div className="my-3 pb-8">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
//           {title}
//         </h2>
//         <div className="hidden sm:flex space-x-2">
//           <button
//             onClick={() => scrollItems("left")}
//             className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="currentColor"
//               viewBox="0 0 24 24"
//               className="w-4 h-4 text-gray-600"
//             >
//               <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
//             </svg>
//           </button>
//           <button
//             onClick={() => scrollItems("right")}
//             className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="currentColor"
//               viewBox="0 0 24 24"
//               className="w-4 h-4 text-gray-600"
//             >
//               <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
//             </svg>
//           </button>
//         </div>
//       </div>

//       <div
//         ref={containerRef}
//         className="scrollbar-hide flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory"
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//       >
//         {tours.map((tour, idx) => (
//           <div
//             key={`${tour.title}-${idx}`}
//             data-tour-card
//             onClick={() => handleCardClick(tour)}
//             className="cursor-pointer snap-center bg-white rounded-2xl shadow-md overflow-hidden min-w-[200px] sm:min-w-[280px] md:min-w-[320px] relative hover:shadow-lg transition-transform hover:scale-[1.02]"
//           >
//             {/* Mobile View */}
//             <div className="block sm:hidden">
//               <img
//                 src={tour.image}
//                 alt={tour.title}
//                 className="w-full h-[160px] object-cover rounded-t-2xl"
//               />
//               <div className="p-3">
//                 <h3 className="text-sm font-semibold text-gray-900">
//                   {tour.title}
//                 </h3>
//                 <div className="flex items-center text-[#F36911] text-xs mt-1">
//                   {"★".repeat(5)}
//                   {tour.reviews && (
//                     <span className="ml-1 text-gray-500 text-xs">
//                       ({tour.reviews})
//                     </span>
//                   )}
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">Per Person from</p>
//                 <p className="text-[15px] font-semibold text-[#000000]">
//                   {convertAndFormat(tour.price)}
//                 </p>
//               </div>
//             </div>

//             {/* Desktop View */}
//             <div className="hidden sm:block">
//               <div className="h-[200px] md:h-[170px]">
//                 <img
//                   src={tour.image}
//                   alt={tour.title}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="p-4">
//                 <h3 className="text-gray-900 font-semibold text-lg mb-2">
//                   {tour.title}
//                 </h3>
//                 <div className="flex justify-between items-center mt-3">
//                   <div className="flex items-center text-[#F36911] text-sm">
//                     {"★".repeat(5)}
//                     {tour.reviews && (
//                       <span className="ml-1 text-gray-500 text-xs">
//                         ({tour.reviews})
//                       </span>
//                     )}
//                   </div>
//                   <div className="text-right">
//                     <p className="text-gray-500 text-sm">Per Person from</p>
//                     <p className="text-gray-800 font-semibold text-sm">
//                       {convertAndFormat(tour.price)}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default function ToursAllComp() {
//   const API_BASE = import.meta.env.VITE_API_URL;
//   const [sections, setSections] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const titleCase = (text) =>
//     (text || "").replace(/[-_]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

//   useEffect(() => {
//     let mounted = true;
//     setLoading(true);
//     axios
//       .get(`${API_BASE}/api/holidays`)
//       .then((res) => {
//         if (!mounted) return;
//         const data = res.data?.data || [];

//         // Group by category
//         const map = new Map();
//         data.forEach((t) => {
//           const cat = t.category || "Top Tours";
//           let img = "";
//           try {
//             const imgs =
//               typeof t.images === "string" ? JSON.parse(t.images) : t.images;
//             img = imgs?.[0]
//               ? `${API_BASE}/uploads/holidays/${imgs[0]}`
//               : "./cards/1.jpg";
//           } catch {
//             img = "./cards/1.jpg";
//           }

//           const arr = map.get(cat) || [];
//           arr.push({
//             id: t.id,
//             title: t.title || "Untitled Tour",
//             image: img,
//             price: t.price || 0,
//             reviews: t.reviews || 0,
//           });
//           map.set(cat, arr);
//         });

//         const sectionData = Array.from(map.entries()).map(([cat, items]) => ({
//           title: titleCase(cat),
//           tours: items,
//         }));
//         setSections(sectionData);
//       })
//       .catch((err) => console.error("Failed to load tours:", err))
//       .finally(() => mounted && setLoading(false));

//     return () => {
//       mounted = false;
//     };
//   }, [API_BASE]);

//   return (
//     <section className="py-1 px-4 md:px-8 lg:px-12 pb-24 sm:pb-8 bg-[#FFFFFF]">
//       <style>{`
//         .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
//         .scrollbar-hide::-webkit-scrollbar { display: none; }
//       `}</style>

//       <div className="max-w-7xl mx-auto">
//         {loading && (
//           <div className="text-center text-gray-500 py-12">
//             Loading tours...
//           </div>
//         )}
//         {!loading &&
//           sections.map((section, idx) => (
//             <TourRow key={idx} title={section.title} tours={section.tours} />
//           ))}
//       </div>
//     </section>
//   );
// }

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../../contexts/CurrencyContext";

function TourRow({ title, tours }) {
  const navigate = useNavigate();
  const { convertAndFormat } = useCurrency();
  const containerRef = useRef(null);
  const [autoId, setAutoId] = useState(null);

  const computeStep = () => {
    const el = containerRef.current;
    if (!el) return 344;
    const firstCard = el.querySelector("[data-tour-card]");
    const gapRaw =
      getComputedStyle(el).columnGap || getComputedStyle(el).gap || "0px";
    const gap = parseFloat(gapRaw) || 0;
    const w = firstCard ? firstCard.getBoundingClientRect().width : 320;
    return Math.round(w + gap);
  };

  const halfScrollWidth = () => {
    const el = containerRef.current;
    if (!el) return 0;
    return (el.scrollWidth || 0) / 2;
  };

  const scrollItems = (dir) => {
    const el = containerRef.current;
    if (!el) return;
    const step = computeStep();
    const max = halfScrollWidth();
    el.scrollBy({ left: dir === "right" ? step : -step, behavior: "smooth" });
    setTimeout(() => {
      if (el.scrollLeft >= max - step) el.scrollLeft = 0;
      else if (el.scrollLeft <= 0) el.scrollLeft = max;
    }, 450);
  };

  useEffect(() => {
    const id = setInterval(() => scrollItems("right"), 4000);
    setAutoId(id);
    return () => clearInterval(id);
  }, []);

  const handleMouseEnter = () => {
    if (autoId) clearInterval(autoId);
  };
  const handleMouseLeave = () => {
    const id = setInterval(() => scrollItems("right"), 4000);
    setAutoId(id);
  };

  const handleCardClick = (tour) => {
    navigate(`/holidays/${tour.id}`);
  };

  return (
    <div className=" pb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base md:text-lg font-bold text-gray-800">{title}</h2>
        <div className="hidden sm:flex space-x-2">
          <button
            onClick={() => scrollItems("left")}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-4 h-4 text-gray-600"
            >
              <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <button
            onClick={() => scrollItems("right")}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-4 h-4 text-gray-600"
            >
              <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="scrollbar-hide flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {tours.map((tour, idx) => (
          <div
            key={`${tour.title}-${idx}`}
            data-tour-card
            onClick={() => handleCardClick(tour)}
            className="cursor-pointer snap-center bg-white rounded-2xl shadow-md overflow-hidden min-w-[200px] sm:min-w-[280px] md:min-w-[320px] max-w-[200px] sm:max-w-[280px] md:max-w-[320px] flex-shrink-0 relative hover:shadow-lg transition-transform hover:scale-[1.02]"
          >
            {/* Mobile View */}
            <div className="block sm:hidden">
              <div className="w-full h-[160px] overflow-hidden">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-full object-cover rounded-t-2xl"
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  {tour.title}
                </h3>
                <div className="flex items-center text-[#F36911] text-xs mt-1">
                  {"★".repeat(5)}
                  {tour.reviews && (
                    <span className="ml-1 text-gray-500 text-xs">
                      ({tour.reviews})
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Per Person from</p>
                <p className="text-[15px] font-semibold text-[#000000]">
                  {convertAndFormat(tour.price)}
                </p>
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden sm:block">
              <div className="w-full h-[200px] md:h-[170px] overflow-hidden">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-gray-900 font-semibold text-lg mb-2">
                  {tour.title}
                </h3>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center text-[#F36911] text-sm">
                    {"★".repeat(5)}
                    {tour.reviews && (
                      <span className="ml-1 text-gray-500 text-xs">
                        ({tour.reviews})
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-sm">Per Person from</p>
                    <p className="text-gray-800 font-semibold text-sm">
                      {convertAndFormat(tour.price)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ToursAllComp() {
  const API_BASE = import.meta.env.VITE_API_URL;
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const titleCase = (text) =>
    (text || "").replace(/[-_]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios
      .get(`${API_BASE}/api/holidays`)
      .then((res) => {
        if (!mounted) return;
        const data = res.data?.data || [];

        // Group by category
        const map = new Map();
        data.forEach((t) => {
          const cat = t.category || "Top Tours";
          let img = "";
          try {
            const imgs =
              typeof t.images === "string" ? JSON.parse(t.images) : t.images;
            img = imgs?.[0]
              ? `${API_BASE}/uploads/holidays/${imgs[0]}`
              : "./cards/1.jpg";
          } catch {
            img = "./cards/1.jpg";
          }

          const arr = map.get(cat) || [];
          arr.push({
            id: t.id,
            title: t.title || "Untitled Tour",
            image: img,
            price: t.price || 0,
            reviews: t.reviews || 0,
          });
          map.set(cat, arr);
        });

        const sectionData = Array.from(map.entries()).map(([cat, items]) => ({
          title: titleCase(cat),
          tours: items,
        }));
        setSections(sectionData);
      })
      .catch((err) => console.error("Failed to load tours:", err))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [API_BASE]);

  return (
    <section className="py-1 px-4 md:px-8 lg:px-12 pb-24 sm:pb-8 bg-[#FFFFFF]">
      <style>{`
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {loading && (
          <div className="text-center text-gray-500 py-12">
            Loading tours...
          </div>
        )}
        {!loading &&
          sections.map((section, idx) => (
            <TourRow key={idx} title={section.title} tours={section.tours} />
          ))}
      </div>
    </section>
  );
}
