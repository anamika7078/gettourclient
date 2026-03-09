import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TopActivity() {
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;

  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hardcoded cities data as fallback
  const hardcodedCities = [
    { id: 1, name: "Dubai", image: "dubai.jpg" },
    { id: 2, name: "Paris", image: "paris.jpg" },
    { id: 3, name: "Tokyo", image: "tokyo.jpg" },
    { id: 4, name: "New York", image: "newyork.jpg" },
    { id: 5, name: "London", image: "london.jpg" },
    { id: 6, name: "Barcelona", image: "barcelona.jpg" },
    { id: 7, name: "Singapore", image: "singapore.jpg" },
    { id: 8, name: "Istanbul", image: "istanbul.jpg" },
  ];

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cities`);
        if (res.ok) {
          const response = await res.json();
          // API returns { success: true, data: [...] }
          const data = response.data || response || [];
          setCities(Array.isArray(data) && data.length > 0 ? data : hardcodedCities);
        } else {
          console.error("Failed to fetch cities:", res.status);
          setCities(hardcodedCities);
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
        setCities(hardcodedCities);
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, [API_BASE]);

  const displayCities = useMemo(() => {
    return cities.map((city) => ({
      id: city.id,
      name: city.name,
      img: city.image
        ? `${API_BASE}/uploads/cities/${city.image}`
        : "./Activity/a1.png",
    }));
  }, [cities, API_BASE]);

  // Don't duplicate cards - use original data
  const containerRef = useRef(null);
  const [autoId, setAutoId] = useState(null);

  const computeStep = () => {
    const el = containerRef.current;
    if (!el) return 344;
    const firstCard = el.querySelector("[data-city-card]");
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

  const scrollCities = (dir) => {
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
    const id = setInterval(() => scrollCities("right"), 4000);
    setAutoId(id);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseEnter = () => {
    if (autoId) clearInterval(autoId);
  };
  const handleMouseLeave = () => {
    const id = setInterval(() => scrollCities("right"), 4000);
    setAutoId(id);
  };

  if (loading) {
    return (
      <section className="py-1 px-4 md:px-8 lg:px-12 sm:pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-base md:text-lg font-bold text-gray-800 mb-3">
              Best Cities to Visit
            </h2>
            <p className="text-gray-500">Loading cities...</p>
          </div>
        </div>
      </section>
    );
  }

  if (cities.length === 0) {
    return null;
  }

  return (
    <section className="py-1 px-4 md:px-8 lg:px-12 sm:pb-8">
      <style>{`
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          {" "}
          {/* Reduced gap between sections - same as ActivityCards */}
          <div className="flex justify-between items-center mb-3">
            {" "}
            {/* Reduced margin bottom - same as ActivityCards */}
            {/* Smaller heading font size - exactly matching ActivityCards */}
            <h2 className="text-base md:text-lg font-bold text-gray-800">
              Best Cities to Visit
            </h2>
            <div className="hidden sm:flex space-x-2">
              <button
                onClick={() => scrollCities("left")}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-gray-600"
                >
                  <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </button>
              <button
                onClick={() => scrollCities("right")}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-gray-600"
                >
                  <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="relative overflow-hidden">
            <div
              ref={containerRef}
              className="scrollbar-hide flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {displayCities.map((c, idx) => (
                <div
                  key={`${c.name}-${idx}`}
                  data-city-card
                  onClick={() => {
                    navigate(`/city-tour-list/${encodeURIComponent(c.name)}`);
                  }}
                  className="cursor-pointer snap-center bg-white rounded-2xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg 
                  flex-none basis-[160px] sm:basis-[200px] md:basis-[280px] lg:basis-[300px]
                  min-w-[160px] max-w-[160px] sm:min-w-[200px] sm:max-w-[200px] md:min-w-[280px] md:max-w-[280px] lg:min-w-[300px] lg:max-w-[300px]"
                >
                  <div className="relative h-[140px] sm:h-[180px] md:h-64 lg:h-72">
                    <img
                      src={c.img}
                      alt={c.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "./Activity/a1.png";
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white font-semibold text-sm sm:text-base md:text-lg p-2 sm:p-3 md:p-4">
                      {c.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
