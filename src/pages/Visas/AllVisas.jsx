import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Visas() {
  const navigate = useNavigate();
  const [visas, setVisas] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_URL;

  // Hardcoded visas data as fallback
  const hardcodedVisas = [
    {
      id: 1,
      country: "United States",
      price: 185.00,
      subject: "Tourist Visa",
      image: "usa-visa.jpg",
      overview: "Apply for a US tourist visa to explore America's iconic landmarks.",
    },
    {
      id: 2,
      country: "United Kingdom",
      price: 120.00,
      subject: "Standard Visitor Visa",
      image: "uk-visa.jpg",
      overview: "Visit the UK for tourism, business, or to see family and friends.",
    },
    {
      id: 3,
      country: "Schengen Area",
      price: 80.00,
      subject: "Schengen Visa",
      image: "schengen-visa.jpg",
      overview: "Travel to 27 European countries with a single Schengen visa.",
    },
    {
      id: 4,
      country: "Australia",
      price: 150.00,
      subject: "Tourist Visa",
      image: "australia-visa.jpg",
      overview: "Explore Australia's stunning landscapes, beaches, and cities.",
    },
    {
      id: 5,
      country: "Japan",
      price: 45.00,
      subject: "Tourist Visa",
      image: "japan-visa.jpg",
      overview: "Discover Japan's unique culture, technology, and natural beauty.",
    },
    {
      id: 6,
      country: "Dubai/UAE",
      price: 100.00,
      subject: "Tourist Visa",
      image: "dubai-visa.jpg",
      overview: "Visit Dubai and the UAE for tourism or business.",
    },
  ];

  // ✅ Fetch backend visas
  useEffect(() => {
    const fetchVisas = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/visas`);
        const data = await res.json();
        const visasData = Array.isArray(data) ? data : (data?.data || []);
        setVisas(visasData.length > 0 ? visasData : hardcodedVisas);
      } catch (err) {
        console.error("Error loading visas:", err);
        setVisas(hardcodedVisas);
      } finally {
        setLoading(false);
      }
    };
    fetchVisas();
  }, [API_BASE]);

  return (
    <div className="bg-gray-50 py-10 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-1">
            Apply Hassle Free E-visas
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Hassle-Free travel with E-Visa: Your international gateway awaits!
          </p>
        </div>

        {/* ---------- Dynamic Backend Visas Section ---------- */}
        {loading ? (
          <p className="text-center text-gray-500 mt-5">Loading visas...</p>
        ) : visas.length === 0 ? (
          <p className="text-center text-gray-500 mt-5">No visas found.</p>
        ) : (
          <div
            className="
              flex snap-x snap-mandatory overflow-x-auto no-scrollbar
              gap-3 py-2 px-2
              lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:px-0 lg:py-0
            "
            aria-label="Visa cards"
          >
            {visas.map((visa) => (
              <div
                key={visa.id}
                onClick={() => navigate(`/visas/${visa.id}`)}
                className="
                  bg-white rounded-xl border border-gray-100 shadow-sm
                  transform transition-all duration-200 hover:shadow-md hover:scale-[1.02]
                  flex-shrink-0 w-44 sm:w-64 md:w-60 lg:w-auto
                  snap-start overflow-hidden flex flex-col h-full cursor-pointer
                "
              >
                {/* Image */}
                <div className="relative w-full h-28 sm:h-40 overflow-hidden bg-gray-200">
                  <img
                    src={
                      visa.image
                        ? `${API_BASE}/uploads/visas/${visa.image}`
                        : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop"
                    }
                    alt={visa.country}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      const img = e.currentTarget;
                      img.style.display = "none";
                      const fallback = img.nextElementSibling;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                  {/* Fallback initials */}
                  <div
                    className="hidden w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center text-white text-xl font-bold"
                    aria-hidden="true"
                  >
                    {visa.country
                      ?.split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col">
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 leading-tight">
                      {visa.country || "Visa"}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      {visa.subject || "General Visa"}
                    </p>
                  </div>

                  {/* Stars + Review Count */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className="w-3.5 h-3.5 text-yellow-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.95c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.84-.197-1.54-1.118l1.287-3.95a1 1 0 00-.364-1.118L2.07 9.377c-.784-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.95z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {visa.reviews ? `${visa.reviews} Reviews` : "New"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hide scrollbar */}
      <style>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
