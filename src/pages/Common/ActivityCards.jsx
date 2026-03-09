import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../../contexts/CurrencyContext";

function ActivityRow({ title, activities }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [autoId, setAutoId] = useState(null);
  const { convertAndFormat } = useCurrency();

  const computeStep = () => {
    const el = containerRef.current;
    if (!el) return 344;
    const firstCard = el.querySelector("[data-activity-card]");
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

  const handleCardClick = (activity) => {
    navigate(`/activities/${activity.id}`);
  };

  return (
    <div className="mb-8 ">
      {" "}
      {/* Reduced gap between sections */}
      <div className="flex justify-between items-center mb-3">
        {" "}
        {/* Reduced margin bottom */}
        {/* Smaller heading font size */}
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
        {activities.map((act, idx) => (
          <div
            key={`${act.title}-${idx}`}
            data-activity-card
            onClick={() => handleCardClick(act)}
            className="cursor-pointer snap-center bg-white rounded-2xl shadow-md overflow-hidden min-w-[200px] sm:min-w-[280px] md:min-w-[320px] max-w-[200px] sm:max-w-[280px] md:max-w-[320px] flex-shrink-0 relative hover:shadow-lg transition-transform hover:scale-[1.02]"
          >
            {/* Mobile View */}
            <div className="block sm:hidden">
              <div className="w-full h-[160px] overflow-hidden">
                <img
                  src={act.image}
                  alt={act.title}
                  className="w-full h-full object-cover rounded-t-2xl"
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  {act.title}
                </h3>
                <div className="flex items-center text-[#F36911] text-xs mt-1">
                  {"★".repeat(5)}
                  {act.reviews && (
                    <span className="ml-1 text-gray-500 text-xs">
                      ({act.reviews})
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Per Person from</p>
                <p className="text-[15px] font-semibold text-[#000000]">
                  {convertAndFormat(act.price)}
                </p>
                {act.oldPrice && (
                  <p className="text-xs text-gray-400 line-through">
                    {convertAndFormat(act.oldPrice)}
                  </p>
                )}
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden sm:block">
              <div className="w-full h-[200px] md:h-[170px] overflow-hidden">
                <img
                  src={act.image}
                  alt={act.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-gray-900 font-semibold text-lg mb-2">
                  {act.title}
                </h3>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center text-[#F36911] text-sm">
                    {"★".repeat(5)}
                    {act.reviews && (
                      <span className="ml-1 text-gray-500 text-xs">
                        ({act.reviews})
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-sm">Per Person from</p>
                    <p className="text-gray-800 font-semibold text-sm">
                      {convertAndFormat(act.price)}
                    </p>
                    {act.oldPrice && (
                      <p className="text-gray-400 text-xs line-through">
                        {convertAndFormat(act.oldPrice)}
                      </p>
                    )}
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

export default function ActivityCards() {
  const API_BASE = import.meta.env.VITE_API_URL;
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const titleCase = (text) =>
    (text || "").replace(/[-_]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

  // Hardcoded activities data as fallback
  const hardcodedActivities = [
    {
      id: 1,
      title: "Bungee Jumping Adventure",
      category: "Adventure Sports",
      price: "AED 350",
      image: "./cards/1.jpg",
      reviews: 125,
    },
    {
      id: 2,
      title: "Scuba Diving Experience",
      category: "Water Activities",
      price: "USD 150",
      image: "./cards/1.jpg",
      reviews: 98,
    },
    {
      id: 3,
      title: "Historical City Tour",
      category: "Cultural Tours",
      price: "EUR 45",
      image: "./cards/1.jpg",
      reviews: 203,
    },
    {
      id: 4,
      title: "Safari Wildlife Experience",
      category: "Nature & Wildlife",
      price: "USD 200",
      image: "./cards/1.jpg",
      reviews: 156,
    },
    {
      id: 5,
      title: "Broadway Show Tickets",
      category: "Entertainment",
      price: "USD 120",
      image: "./cards/1.jpg",
      reviews: 89,
    },
  ];

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios
      .get(`${API_BASE}/api/activities`)
      .then((res) => {
        if (!mounted) return;
        const activities = res.data || [];

        // Use hardcoded data if API returns empty
        const dataToUse = (Array.isArray(activities) && activities.length > 0) 
          ? activities 
          : hardcodedActivities;

        // Group by category
        const map = new Map();
        dataToUse.forEach((a) => {
          const cat = a.category || "Top Activities";
          const arr = map.get(cat) || [];
          arr.push({
            id: a.id,
            title: a.title || "Untitled Activity",
            image: a.image
              ? `${API_BASE}/uploads/activities/${a.image}`
              : "./cards/1.jpg",
            price: a.price || 0,
            oldPrice: a.oldPrice || undefined,
            reviews: a.reviews || 0,
          });
          map.set(cat, arr);
        });

        const sectionsData = Array.from(map.entries()).map(([cat, items]) => ({
          title: titleCase(cat),
          activities: items,
        }));
        setSections(sectionsData);
      })
      .catch((err) => {
        console.error("Failed to load activities:", err);
        // Use hardcoded data on error
        const map = new Map();
        hardcodedActivities.forEach((a) => {
          const cat = a.category || "Top Activities";
          const arr = map.get(cat) || [];
          arr.push({
            id: a.id,
            title: a.title,
            image: a.image,
            price: a.price,
            reviews: a.reviews || 0,
          });
          map.set(cat, arr);
        });
        const sectionsData = Array.from(map.entries()).map(([cat, items]) => ({
          title: titleCase(cat),
          activities: items,
        }));
        setSections(sectionsData);
      })
      .finally(() => mounted && setLoading(false));

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
        {loading && (
          <div className="text-center text-gray-500 py-12">
            Loading activities...
          </div>
        )}
        {!loading &&
          sections.map((section, idx) => (
            <ActivityRow
              key={idx}
              title={section.title}
              activities={section.activities}
            />
          ))}
      </div>
    </section>
  );
}
