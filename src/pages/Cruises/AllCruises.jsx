// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCurrency } from "../../contexts/CurrencyContext"; // ✅ Import context

// function CruiseRow({ title, cruises, API_BASE }) {
//   const navigate = useNavigate();
//   const containerRef = useRef(null);
//   const [autoId, setAutoId] = useState(null);

//   const { formatCurrency, convertPrice } = useCurrency(); // ✅ Access context functions

//   const computeStep = () => {
//     const el = containerRef.current;
//     if (!el) return 320;
//     const firstCard = el.querySelector("[data-cruise-card]");
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

//   const handleMouseEnter = () => autoId && clearInterval(autoId);
//   const handleMouseLeave = () =>
//     setAutoId(setInterval(() => scrollItems("right"), 4000));

//   const handleCardClick = (cruise) => navigate(`/cruises/${cruise.id}`);

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
//         {cruises.map((cruise, idx) => {
//           const image = cruise.image
//             ? `${API_BASE}/uploads/cruises/${cruise.image}`
//             : "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop";
//           const converted = convertPrice(cruise.price); // ✅ Convert dynamically
//           return (
//             <div
//               key={`${cruise.title}-${idx}`}
//               data-cruise-card
//               onClick={() => handleCardClick(cruise)}
//               className="cursor-pointer snap-center bg-white rounded-2xl shadow-md overflow-hidden min-w-[200px] sm:min-w-[280px] md:min-w-[320px] relative hover:shadow-lg transition-transform hover:scale-[1.02]"
//             >
//               {/* Mobile */}
//               <div className="block sm:hidden">
//                 <img
//                   src={image}
//                   alt={cruise.title}
//                   className="w-full h-[160px] object-cover rounded-t-2xl"
//                 />
//                 <div className="p-3">
//                   <h3 className="text-sm font-semibold text-gray-900">
//                     {cruise.title}
//                   </h3>
//                   <div className="flex items-center text-[#F36911] text-xs mt-1">
//                     {"★".repeat(5)}
//                     {cruise.reviews && (
//                       <span className="ml-1 text-gray-500 text-xs">
//                         ({cruise.reviews})
//                       </span>
//                     )}
//                   </div>
//                   <p className="text-xs text-gray-500 mt-1">Per Person from</p>
//                   <p className="text-[15px] font-semibold text-[#000000]">
//                     {formatCurrency(converted)} {/* ✅ formatted */}
//                   </p>
//                 </div>
//               </div>

//               {/* Desktop */}
//               <div className="hidden sm:block">
//                 <div className="h-[200px] md:h-[170px]">
//                   <img
//                     src={image}
//                     alt={cruise.title}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="p-4">
//                   <h3 className="text-gray-900 font-semibold text-lg mb-2">
//                     {cruise.title}
//                   </h3>
//                   <div className="flex justify-between items-center mt-3">
//                     <div className="flex items-center text-[#F36911] text-sm">
//                       {"★".repeat(5)}
//                       {cruise.reviews && (
//                         <span className="ml-1 text-gray-500 text-xs">
//                           ({cruise.reviews})
//                         </span>
//                       )}
//                     </div>
//                     <div className="text-right">
//                       <p className="text-gray-500 text-sm">Per Person from</p>
//                       <p className="text-gray-800 font-semibold text-sm">
//                         {formatCurrency(converted)} {/* ✅ formatted */}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default function CruiseCards() {
//   const API_BASE = import.meta.env.VITE_API_URL;
//   const [sections, setSections] = useState([]);

//   useEffect(() => {
//     let mounted = true;
//     fetch(`${API_BASE}/api/cruises`)
//       .then((res) => res.json())
//       .then((json) => {
//         if (!mounted) return;
//         const rows = Array.isArray(json?.data) ? json.data : [];
//         const map = new Map();
//         rows.forEach((r) => {
//           const cat = r.category || "Top Cruises";
//           const arr = map.get(cat) || [];
//           arr.push({
//             id: r.id,
//             title: r.title || "Untitled Cruise",
//             image: r.image || null,
//             price: r.price || 0,
//             reviews: r.reviews || 0,
//           });
//           map.set(cat, arr);
//         });
//         const secs = Array.from(map.entries()).map(([title, cruises]) => ({
//           title,
//           cruises,
//         }));
//         setSections(secs);
//       })
//       .catch(console.error);

//     return () => {
//       mounted = false;
//     };
//   }, [API_BASE]);

//   return (
//     <section className="py-1 px-4 md:px-8 lg:px-12 pb-24 sm:pb-8">
//       <style>{`
//         .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
//         .scrollbar-hide::-webkit-scrollbar { display: none; }
//       `}</style>
//       <div className="max-w-7xl mx-auto">
//         {sections.length === 0 && (
//           <div className="text-center text-gray-500 py-12">
//             No cruises found.
//           </div>
//         )}
//         {sections.map((sec, idx) => (
//           <CruiseRow
//             key={idx}
//             title={sec.title}
//             cruises={sec.cruises}
//             API_BASE={API_BASE}
//           />
//         ))}
//       </div>
//     </section>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../../contexts/CurrencyContext"; // ✅ Import context

function CruiseRow({ title, cruises, API_BASE }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [autoId, setAutoId] = useState(null);

  const { formatCurrency, convertPrice } = useCurrency(); // ✅ Access context functions

  const computeStep = () => {
    const el = containerRef.current;
    if (!el) return 320;
    const firstCard = el.querySelector("[data-cruise-card]");
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

  const handleMouseEnter = () => autoId && clearInterval(autoId);
  const handleMouseLeave = () =>
    setAutoId(setInterval(() => scrollItems("right"), 4000));

  const handleCardClick = (cruise) => navigate(`/cruises/${cruise.id}`);

  return (
    <div className="pb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base md:text-lg font-bold text-gray-800">
          {title}
        </h2>
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
        {cruises.map((cruise, idx) => {
          const image = cruise.image
            ? `${API_BASE}/uploads/cruises/${cruise.image}`
            : "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop";
          const converted = convertPrice(cruise.price); // ✅ Convert dynamically
          return (
            <div
              key={`${cruise.title}-${idx}`}
              data-cruise-card
              onClick={() => handleCardClick(cruise)}
              className="cursor-pointer snap-center bg-white rounded-2xl shadow-md overflow-hidden min-w-[200px] sm:min-w-[280px] md:min-w-[320px] max-w-[200px] sm:max-w-[280px] md:max-w-[320px] flex-shrink-0 relative hover:shadow-lg transition-transform hover:scale-[1.02]"
            >
              {/* Mobile */}
              <div className="block sm:hidden">
                <div className="w-full h-[160px] overflow-hidden">
                  <img
                    src={image}
                    alt={cruise.title}
                    className="w-full h-full object-cover rounded-t-2xl"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {cruise.title}
                  </h3>
                  <div className="flex items-center text-[#F36911] text-xs mt-1">
                    {"★".repeat(5)}
                    {cruise.reviews && (
                      <span className="ml-1 text-gray-500 text-xs">
                        ({cruise.reviews})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Per Person from</p>
                  <p className="text-[15px] font-semibold text-[#000000]">
                    {formatCurrency(converted)} {/* ✅ formatted */}
                  </p>
                </div>
              </div>

              {/* Desktop */}
              <div className="hidden sm:block">
                <div className="w-full h-[200px] md:h-[170px] overflow-hidden">
                  <img
                    src={image}
                    alt={cruise.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-gray-900 font-semibold text-lg mb-2">
                    {cruise.title}
                  </h3>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center text-[#F36911] text-sm">
                      {"★".repeat(5)}
                      {cruise.reviews && (
                        <span className="ml-1 text-gray-500 text-xs">
                          ({cruise.reviews})
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 text-sm">Per Person from</p>
                      <p className="text-gray-800 font-semibold text-sm">
                        {formatCurrency(converted)} {/* ✅ formatted */}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CruiseCards() {
  const API_BASE = import.meta.env.VITE_API_URL;
  const [sections, setSections] = useState([]);

  // Hardcoded cruises data as fallback
  const hardcodedCruises = [
    {
      id: 1,
      title: "Mediterranean Cruise - 7 Nights",
      category: "Mediterranean",
      price: 1500.00,
      image: "mediterranean-cruise.jpg",
      reviews: 245,
    },
    {
      id: 2,
      title: "Caribbean Paradise Cruise",
      category: "Caribbean",
      price: 1800.00,
      image: "caribbean-cruise.jpg",
      reviews: 189,
    },
    {
      id: 3,
      title: "Alaska Adventure Cruise",
      category: "Adventure",
      price: 2200.00,
      image: "alaska-cruise.jpg",
      reviews: 156,
    },
  ];

  useEffect(() => {
    let mounted = true;
    fetch(`${API_BASE}/api/cruises`)
      .then((res) => res.json())
      .then((json) => {
        if (!mounted) return;
        const rows = Array.isArray(json?.data) ? json.data : (Array.isArray(json) ? json : []);
        const dataToUse = rows.length > 0 ? rows : hardcodedCruises;
        const map = new Map();
        dataToUse.forEach((r) => {
          const cat = r.category || "Top Cruises";
          const arr = map.get(cat) || [];
          arr.push({
            id: r.id,
            title: r.title || "Untitled Cruise",
            image: r.image || "./cards/1.jpg",
            price: r.price || 0,
            reviews: r.reviews || 0,
          });
          map.set(cat, arr);
        });
        const secs = Array.from(map.entries()).map(([title, cruises]) => ({
          title,
          cruises,
        }));
        setSections(secs);
      })
      .catch((err) => {
        console.error("Error fetching cruises:", err);
        // Use hardcoded data on error
        const map = new Map();
        hardcodedCruises.forEach((r) => {
          const cat = r.category || "Top Cruises";
          const arr = map.get(cat) || [];
          arr.push({
            id: r.id,
            title: r.title,
            image: r.image || "./cards/1.jpg",
            price: r.price,
            reviews: r.reviews || 0,
          });
          map.set(cat, arr);
        });
        const secs = Array.from(map.entries()).map(([title, cruises]) => ({
          title,
          cruises,
        }));
        setSections(secs);
      });

    return () => {
      mounted = false;
    };
  }, [API_BASE]);

  return (
    <section className="py-1 px-4 md:px-8 lg:px-12 pb-24 sm:pb-8">
      <style>{`
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
      <div className="max-w-7xl mx-auto">
        {sections.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No cruises found.
          </div>
        )}
        {sections.map((sec, idx) => (
          <CruiseRow
            key={idx}
            title={sec.title}
            cruises={sec.cruises}
            API_BASE={API_BASE}
          />
        ))}
      </div>
    </section>
  );
}
