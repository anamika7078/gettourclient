import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useCurrency } from "../../contexts/CurrencyContext";

export default function CityTourPackages() {
  const { id, cityName } = useParams();
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;
  const { convertAndFormat } = useCurrency();

  const [cityPackage, setCityPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search state
  const [query, setQuery] = useState("");
  const [allCityTours, setAllCityTours] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [hoveredHeroImage, setHoveredHeroImage] = useState(null);
  const [sortBy, setSortBy] = useState("recommended");

  // Category filter state
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Hero carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const fallbackSlides = ["/b1.jpg", "/b2.jpg", "/b3.jpg"];
  const [slides] = useState(fallbackSlides);

  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  // Fetch city package details
  useEffect(() => {
    const fetchCityPackage = async () => {
      try {
        // If cityName parameter exists, create a virtual package object for that city
        if (cityName) {
          setCityPackage({ cityName: decodeURIComponent(cityName) });
          setLoading(false);
          return;
        }

        // Otherwise fetch by ID
        const res = await fetch(`${API_BASE}/api/city-packages/${id}`);
        if (res.ok) {
          const response = await res.json();
          const data = response.data || response;
          setCityPackage(data);
        } else {
          setError("Failed to load city tour details");
        }
      } catch (err) {
        console.error("Error fetching city package:", err);
        setError("Error loading city tour details");
      } finally {
        setLoading(false);
      }
    };

    if (id || cityName) {
      fetchCityPackage();
    }
  }, [id, cityName, API_BASE]);

  // Hardcoded city packages data as fallback
  const hardcodedCityPackages = [
    {
      id: 1,
      title: "Dubai City Highlights Tour",
      cityName: "Dubai",
      cityImage: "dubai-highlights.jpg",
      locationUrl: "https://maps.google.com/?q=Dubai",
      duration: "4 hours",
      price: 89.99,
      images: JSON.stringify(["package1.jpg", "package2.jpg"]),
      details: "Explore the iconic landmarks of Dubai including Burj Khalifa, Dubai Mall, and Palm Jumeirah.",
    },
    {
      id: 2,
      title: "Dubai Food & Culture Walk",
      cityName: "Dubai",
      cityImage: "dubai-food.jpg",
      locationUrl: "https://maps.google.com/?q=Dubai+Food+District",
      duration: "3 hours",
      price: 65.00,
      images: JSON.stringify(["food1.jpg", "food2.jpg"]),
      details: "Taste authentic Emirati cuisine and learn about local food culture.",
    },
    {
      id: 3,
      title: "Paris Historical Walking Tour",
      cityName: "Paris",
      cityImage: "paris-historical.jpg",
      locationUrl: "https://maps.google.com/?q=Paris",
      duration: "5 hours",
      price: 75.00,
      images: JSON.stringify(["paris1.jpg", "paris2.jpg"]),
      details: "Discover the rich history of Paris through its iconic monuments and charming streets.",
    },
    {
      id: 4,
      title: "Tokyo Shopping Experience",
      cityName: "Tokyo",
      cityImage: "tokyo-shopping.jpg",
      locationUrl: "https://maps.google.com/?q=Tokyo+Shopping",
      duration: "6 hours",
      price: 95.00,
      images: JSON.stringify(["tokyo1.jpg", "tokyo2.jpg"]),
      details: "Explore Tokyo's best shopping districts from traditional markets to modern malls.",
    },
  ];

  // Fetch all city packages for search
  useEffect(() => {
    const fetchAllCityTours = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/city-packages`);
        if (res.ok) {
          const response = await res.json();
          const data = response.data || response || [];
          setAllCityTours(Array.isArray(data) && data.length > 0 ? data : hardcodedCityPackages);
        } else {
          setAllCityTours(hardcodedCityPackages);
        }
      } catch (err) {
        console.error("Error fetching city tours:", err);
        setAllCityTours(hardcodedCityPackages);
      }
    };
    fetchAllCityTours();
  }, [API_BASE]);

  // Fetch categories scoped to current city only
  useEffect(() => {
    const currentCity = cityPackage?.cityName;
    if (!currentCity) {
      setCategories([]);
      return;
    }
    let abort = false;
    (async () => {
      try {
        // Encode city name for URL safety
        const urlCity = encodeURIComponent(currentCity);
        const res = await fetch(
          `${API_BASE}/api/city-tour-categories/by-city/${urlCity}`
        );
        if (!res.ok) {
          setCategories([]);
          return;
        }
        const response = await res.json();
        const data = response.data || response || [];
        if (!abort) setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!abort) {
          console.error("Error fetching city-scoped categories:", err);
          setCategories([]);
        }
      }
    })();
    return () => {
      abort = true;
    };
  }, [API_BASE, cityPackage?.cityName]);

  // Auto-slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Debounced search - filter by current city only
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // Filter tours by current city
      const currentCityName = cityPackage?.cityName;
      const cityFilteredTours = currentCityName
        ? allCityTours.filter(
            (tour) =>
              (tour.cityName || "").toLowerCase() ===
              currentCityName.toLowerCase()
          )
        : allCityTours;

      if (!query) {
        setSuggestions(cityFilteredTours.slice(0, 8));
        return;
      }
      const q = query.toLowerCase();
      const matches = cityFilteredTours.filter((tour) =>
        (tour.title || "").toLowerCase().includes(q)
      );
      setSuggestions(matches.slice(0, 8));
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query, allCityTours, cityPackage]);

  // Update hovered image
  useEffect(() => {
    if (highlighted >= 0 && suggestions[highlighted]) {
      const img = suggestions[highlighted].cityImage
        ? `${API_BASE}/uploads/city-packages/${suggestions[highlighted].cityImage}`
        : null;
      setHoveredHeroImage(img);
    } else {
      setHoveredHeroImage(null);
    }
  }, [highlighted, suggestions, API_BASE]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setHighlighted(-1);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % slides.length);

  const pickSuggestion = (item) => {
    setQuery(item.title || "");
    setOpen(false);
    setSuggestions([]);
    setHighlighted(-1);
    if (item && item.id) {
      navigate(`/city-tour/detail/${item.id}`);
    }
  };

  const onKeyDown = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlighted >= 0 && suggestions[highlighted])
        pickSuggestion(suggestions[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setHighlighted(-1);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setOpen(true);
  };

  const handleInputFocus = () => {
    setOpen(true);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  // Categories available for this city (defensive check even though fetch is scoped)
  const getAvailableCategories = () => {
    const currentCity = cityPackage?.cityName?.toLowerCase();
    if (!currentCity) return [];
    return categories.filter(
      (cat) => (cat.cityName || "").toLowerCase() === currentCity
    );
  };

  // Get representative image for a category
  const getCategoryImage = (categoryId) => {
    // First try to get the category's own image
    const category = categories.find(
      (cat) => parseInt(cat.id, 10) === parseInt(categoryId, 10)
    );
    if (category && category.image) {
      return `${API_BASE}/uploads/categories/${category.image}`;
    }

    // Fallback to first tour image in this category
    const catId = parseInt(categoryId, 10);
    const categoryTours = allCityTours.filter((tour) => {
      const tourCatId =
        tour.categoryId !== null &&
        tour.categoryId !== undefined &&
        tour.categoryId !== ""
          ? parseInt(tour.categoryId, 10)
          : null;
      return (
        tourCatId === catId &&
        tour.cityName?.toLowerCase() === cityPackage?.cityName?.toLowerCase()
      );
    });

    if (categoryTours.length > 0) {
      const tour = categoryTours[0];
      if (tour.cityImage) {
        return `${API_BASE}/uploads/city-packages/${tour.cityImage}`;
      } else if (tour.images && tour.images.length > 0) {
        return `${API_BASE}/uploads/city-packages/${tour.images[0]}`;
      }
    }
    return "./Activity/a1.png"; // Fallback image
  };

  // Filter tours by category and city
  const getFilteredTours = () => {
    let filtered = allCityTours.filter(
      (tour) =>
        tour.cityName?.toLowerCase() === cityPackage.cityName?.toLowerCase()
    );

    if (selectedCategory) {
      const selectedCatId = parseInt(selectedCategory, 10);
      filtered = filtered.filter((tour) => {
        const tourCatId =
          tour.categoryId !== null &&
          tour.categoryId !== undefined &&
          tour.categoryId !== ""
            ? parseInt(tour.categoryId, 10)
            : null;
        return tourCatId === selectedCatId;
      });
    }

    return filtered;
  };

  // Sort tours based on selected option
  const getSortedTours = (tours) => {
    const sorted = [...tours];
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-high":
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "rating":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "popular":
        return sorted.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
      case "recommended":
      default:
        return sorted;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading city tour...</p>
        </div>
      </div>
    );
  }

  if (error || !cityPackage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">
            {error || "City tour not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[20vh] md:h-96 lg:h-[350px] select-none">
        {/* Background slides */}
        <div className="absolute inset-0 transition-all duration-1000 overflow-hidden">
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

        {/* Desktop Search */}
        <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 px-4 hidden md:flex w-full max-w-4xl">
          <div
            ref={containerRef}
            className="w-full max-w-[450px] mx-auto relative"
          >
            <div className="bg-white rounded-lg shadow-md flex items-center px-3 py-2 w-full border border-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="text-gray-400 mr-2 w-4 h-4 flex-shrink-0"
              >
                <path d="M12 2C8.686 2 6 4.686 6 8c0 4.418 6 12 6 12s6-7.582 6-12c0-3.314-2.686-6-6-6Zm0 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search city tours..."
                className="w-full outline-none text-gray-700 font-medium bg-transparent placeholder-gray-400 text-sm"
                value={query}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onKeyDown={onKeyDown}
                aria-autocomplete="list"
                aria-expanded={open}
                aria-controls="hero-search-list"
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

            {/* Suggestions dropdown */}
            {open && (
              <div
                id="hero-search-list"
                role="listbox"
                className="absolute mt-2 w-full bg-white rounded-xl shadow-2xl max-h-80 overflow-hidden z-[100] border-2 border-gray-200"
              >
                {/* Preview image above dropdown */}
                {hoveredHeroImage && (
                  <div className="absolute -top-48 left-1/2 transform -translate-x-1/2 w-72 h-40 rounded-lg overflow-hidden shadow-2xl z-[110] border-4 border-white">
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
                {loading && query ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto mb-2"></div>
                    Searching city tours...
                  </div>
                ) : suggestions.length > 0 ? (
                  <>
                    <div className="p-3 border-b border-gray-100 bg-gray-50">
                      <div className="text-sm font-semibold text-gray-700">
                        City Tours ({suggestions.length})
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {suggestions.map((item, idx) => {
                        const thumb = item.cityImage
                          ? `${API_BASE}/uploads/city-packages/${item.cityImage}`
                          : "";
                        return (
                          <div
                            key={item.id || idx}
                            role="option"
                            aria-selected={highlighted === idx}
                            onMouseEnter={() => setHighlighted(idx)}
                            onMouseLeave={() => setHighlighted(-1)}
                            onClick={() => pickSuggestion(item)}
                            className={`flex items-center gap-3 p-3 cursor-pointer transition-all duration-200 border-b border-gray-100 last:border-b-0 ${
                              highlighted === idx
                                ? "bg-orange-50 border-l-4 border-l-orange-500"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              {thumb ? (
                                <img
                                  src={thumb}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    const placeholder =
                                      e.target.nextElementSibling;
                                    if (placeholder)
                                      placeholder.style.display = "flex";
                                  }}
                                />
                              ) : null}
                              <div
                                className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center"
                                style={{ display: thumb ? "none" : "flex" }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  className="text-gray-400 w-5 h-5"
                                >
                                  <path d="M12 2C8.686 2 6 4.686 6 8c0 4.418 6 12 6 12s6-7.582 6-12c0-3.314-2.686-6-6-6Zm0 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
                                </svg>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-gray-900 mb-1">
                                {item.title}
                              </div>
                              <div className="text-xs text-gray-600">
                                {item.cityName}
                              </div>
                            </div>
                            {item.price ? (
                              <div className="text-sm font-medium text-green-600">
                                {convertAndFormat(item.price)}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : query ? (
                  <div className="p-6 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="mx-auto text-gray-300 w-8 h-8 mb-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <div className="text-gray-500 font-medium mb-1">
                      No city tours found
                    </div>
                    <div className="text-xs text-gray-400">
                      Try different keywords
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute bottom-6 right-6 gap-3 z-20 hidden md:flex">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition"
          >
            <FaArrowLeft className="text-gray-800" />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition"
          >
            <FaArrowRight className="text-gray-800" />
          </button>
        </div>
      </div>

      {/* Mobile Search Input */}
      <div className="md:hidden relative -top-8 z-50 px-4">
        <div className="bg-white rounded-full shadow-xl flex items-center px-4 py-4 w-full border border-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="text-gray-500 mr-3 w-5 h-5"
          >
            <path d="M12 2C8.686 2 6 4.686 6 8c0 4.418 6 12 6 12s6-7.582 6-12c0-3.314-2.686-6-6-6Zm0 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
          </svg>
          <input
            type="text"
            placeholder="Select Location"
            className="w-full outline-none text-gray-700 font-medium placeholder-gray-500 text-sm"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </div>

        {/* Mobile suggestions */}
        {open && (
          <div className="mt-2 w-full bg-white rounded-lg shadow-2xl max-h-80 overflow-hidden z-[100] border-2 border-gray-200 relative">
            {loading && query ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto mb-2"></div>
                Searching...
              </div>
            ) : suggestions.length > 0 ? (
              <>
                <div className="p-3 border-b border-gray-100 bg-gray-50">
                  <div className="text-sm font-semibold text-gray-700">
                    City Tours ({suggestions.length})
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {suggestions.map((item, idx) => {
                    const thumb = item.cityImage
                      ? `${API_BASE}/uploads/city-packages/${item.cityImage}`
                      : "";
                    return (
                      <div
                        key={item.id || idx}
                        onClick={() => pickSuggestion(item)}
                        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                const placeholder = e.target.nextElementSibling;
                                if (placeholder)
                                  placeholder.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center"
                            style={{ display: thumb ? "none" : "flex" }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              className="text-gray-400 w-5 h-5"
                            >
                              <path d="M12 2C8.686 2 6 4.686 6 8c0 4.418 6 12 6 12s6-7.582 6-12c0-3.314-2.686-6-6-6Zm0 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-900 mb-1">
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-600">
                            {item.cityName}
                          </div>
                        </div>
                        {item.price ? (
                          <div className="text-sm font-medium text-green-600">
                            {convertAndFormat(item.price)}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : query ? (
              <div className="p-6 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="mx-auto text-gray-300 w-8 h-8 mb-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <div className="text-gray-500 font-medium mb-1">
                  No city tours found
                </div>
                <div className="text-xs text-gray-400">
                  Try different keywords
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Category Filter Section */}
      {getAvailableCategories().length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          {/* Heading */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6 md:mb-8">
            Top {cityPackage.cityName} Tours & Activities
          </h2>

          {/* Circular Category Cards */}
          <div className="relative mb-6 md:mb-8">
            {/* Navigation Arrows - Desktop */}
            <button
              onClick={() => {
                const container = document.getElementById("category-scroll");
                if (container) container.scrollLeft -= 300;
              }}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg items-center justify-center hover:bg-gray-50 transition-all"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div
              id="category-scroll"
              className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto scrollbar-hide pb-4 scroll-smooth px-2"
            >
              {getAvailableCategories().map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="flex-shrink-0 cursor-pointer group"
                >
                  {/* Circular Image with Count Badge */}
                  <div className="relative">
                    <div
                      className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden mx-auto mb-2 transition-all duration-300 ${
                        selectedCategory === category.id
                          ? "ring-4 ring-orange-500 shadow-xl scale-105"
                          : "ring-2 ring-gray-200 group-hover:ring-orange-300 group-hover:shadow-lg group-hover:scale-105"
                      }`}
                    >
                      <img
                        src={getCategoryImage(category.id)}
                        alt={category.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "./Activity/a1.png";
                        }}
                      />
                    </div>
                    {/* Count Badge */}
                    {/* <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                      {getCategoryCount(category.id)}
                    </div> */}
                  </div>
                  {/* Category Name */}
                  <p
                    className={`text-center text-xs sm:text-sm md:text-base font-semibold transition-colors max-w-[90px] sm:max-w-[110px] md:max-w-[130px] mx-auto line-clamp-2 ${
                      selectedCategory === category.id
                        ? "text-orange-600"
                        : "text-gray-700 group-hover:text-orange-600"
                    }`}
                  >
                    {category.name}
                  </p>
                </div>
              ))}
            </div>

            {/* Navigation Arrows - Desktop */}
            <button
              onClick={() => {
                const container = document.getElementById("category-scroll");
                if (container) container.scrollLeft += 300;
              }}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg items-center justify-center hover:bg-gray-50 transition-all"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Text Filter Buttons - Mobile Friendly */}
          {/* <div className="flex items-center gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-2">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === null
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Events
            </button>
            {getAvailableCategories().map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div> */}
        </div>
      )}

      {/* Tours & Activities Section */}
      <div className="max-w-7xl mx-auto px-4 py-1 md:py-8 pb-24 sm:pb-8">
        <style>{`
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          
          /* Smooth scroll for touch devices */
          #category-scroll {
            -webkit-overflow-scrolling: touch;
            scroll-behavior: smooth;
          }
          
          /* Mobile scroll hint */
          @media (max-width: 768px) {
            #category-scroll::after {
              content: '';
              position: absolute;
              right: 0;
              top: 0;
              bottom: 20px;
              width: 40px;
              background: linear-gradient(to left, rgba(255,255,255,0.9), transparent);
              pointer-events: none;
            }
          }
        `}</style>

        {/* Section Heading */}
        <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-5 h-5 text-orange-600 flex-shrink-0"
            >
              <path d="M12 2C8.686 2 6 4.686 6 8c0 4.418 6 12 6 12s6-7.582 6-12c0-3.314-2.686-6-6-6Zm0 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
            </svg>
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-800">
              Things to do in {cityPackage.cityName}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white cursor-pointer flex-1 sm:flex-initial"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* City Tour Cards - Grid 4 per row */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {getFilteredTours().length === 0 ? (
            <div className="w-full text-center py-12">
              <div className="text-gray-400 mb-3">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-lg font-medium">
                No tours found in this category
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Try selecting a different category or browse all events
              </p>
            </div>
          ) : (
            getSortedTours(getFilteredTours()).map((tour, idx) => {
              // Use cityImage first, then first image from images array, then fallback
              let tourImage = "./Activity/a1.png";
              if (tour.cityImage) {
                tourImage = `${API_BASE}/uploads/city-packages/${tour.cityImage}`;
              } else if (tour.images && tour.images.length > 0) {
                tourImage = `${API_BASE}/uploads/city-packages/${tour.images[0]}`;
              }

              return (
                <div
                  key={`${tour.id}-${idx}`}
                  onClick={() => navigate(`/city-tour/detail/${tour.id}`)}
                  className="cursor-pointer bg-white rounded-2xl shadow-md overflow-hidden relative hover:shadow-lg transition-transform hover:scale-[1.02]"
                >
                  {/* Mobile View */}
                  <div className="block sm:hidden">
                    <div className="w-full h-[160px] overflow-hidden">
                      <img
                        src={tourImage}
                        alt={tour.title}
                        className="w-full h-full object-cover rounded-t-2xl"
                        onError={(e) => {
                          e.target.src = "./Activity/a1.png";
                        }}
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {tour.title}
                      </h3>
                      <div className="flex items-center text-[#F36911] text-xs mt-1">
                        {"★".repeat(5)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Per Person from
                      </p>
                      <p className="text-[15px] font-semibold text-[#000000]">
                        {convertAndFormat(tour.price)}
                      </p>
                    </div>
                  </div>

                  {/* Desktop View */}
                  <div className="hidden sm:block">
                    <div className="w-full h-[200px] md:h-[170px] overflow-hidden">
                      <img
                        src={tourImage}
                        alt={tour.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "./Activity/a1.png";
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-gray-900 font-semibold text-lg mb-2">
                        {tour.title}
                      </h3>
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center text-[#F36911] text-sm">
                          {"★".repeat(5)}
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500 text-sm">
                            Per Person from
                          </p>
                          <p className="text-gray-800 font-semibold text-sm">
                            {convertAndFormat(tour.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
