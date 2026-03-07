import {
  Building2,
  ChevronDown,
  ChevronRight,
  DollarSign,
  FileText,
  Globe,
  Home,
  Hotel,
  Info,
  Languages,
  MapPin,
  Mountain,
  Phone,
  PhoneCall,
  Shield,
  Ship,
  Umbrella,
  User,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCurrency } from "../../contexts/CurrencyContext";

const currencySymbols = {
  AED: "د.إ",
  USD: "$",
  INR: "₹",
  EUR: "€",
  GBP: "£",
  SAR: "﷼",
  SGD: "S$",
  MYR: "RM",
  ZAR: "R",
  THB: "฿",
  OMR: "ر.ع",
  AUD: "A$",
  GEL: "₾",
  AMD: "֏",
  HKD: "HK$",
  MOP: "MOP",
  JPY: "¥",
  KZT: "₸",
  UZS: "лв",
  AZN: "₼",
  MUR: "MUR",
  TRY: "TRY",
  DKK: "KR",
  VND: "₫",
  IDR: "Rp",
};

export default function CompleteNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { currency, setCurrency, supportedCurrencies } = useCurrency();
  const API_BASE = import.meta.env.VITE_API_URL;

  const [activeModal, setActiveModal] = useState(null); // profile / services / cities / card types
  const [activeProfileCard, setActiveProfileCard] = useState(null); // currency / helpline inside profile
  const [activeNav, setActiveNav] = useState("home");
  const [activeDesktopNav, setActiveDesktopNav] = useState("Activities");
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  // City packages (existing) and standalone cities from City model
  const [cityPackages, setCityPackages] = useState([]);
  const [rawCities, setRawCities] = useState([]);

  useEffect(() => {
    const fetchCityPackages = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/city-packages`);
        if (res.ok) {
          const response = await res.json();
          const data = response.data || response || [];
          setCityPackages(Array.isArray(data) ? data : []);
        } else {
          console.error("Failed to fetch city packages:", res.status);
          setCityPackages([]);
        }
      } catch (err) {
        console.error("Error fetching city packages:", err);
        setCityPackages([]);
      }
    };
    const fetchCities = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cities`);
        if (res.ok) {
          const response = await res.json();
          const data = response.data || response || [];
          setRawCities(Array.isArray(data) ? data : []);
        } else {
          console.error("Failed to fetch cities:", res.status);
          setRawCities([]);
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
        setRawCities([]);
      }
    };
    fetchCityPackages();
    fetchCities();
  }, [API_BASE]);

  // Merge cities from packages and standalone City model entries
  const cities = useMemo(() => {
    const byName = new Map();

    // First add raw City model entries
    rawCities.forEach((c) => {
      const key = (c.name || "").trim().toLowerCase();
      if (!key) return;
      if (!byName.has(key)) {
        byName.set(key, {
          id: c.id,
          name: c.name || "",
          image: c.image ? `${API_BASE}/uploads/cities/${c.image}` : "",
          // Fallback link if no package exists (city-only view like TopActivity)
          link: `/city-tour-list/${encodeURIComponent(c.name || "")}`,
          source: "cityModel",
        });
      }
    });

    // Then overlay with package data (provides link + potentially better image)
    cityPackages.forEach((pkg) => {
      const key = (pkg.cityName || "").trim().toLowerCase();
      if (!key) return;
      const existing = byName.get(key);
      const imageFromPackage = pkg.cityImage
        ? `${API_BASE}/uploads/city-packages/${pkg.cityImage}`
        : existing?.image || "";
      byName.set(key, {
        id: existing?.id ?? pkg.id,
        name: pkg.cityName || existing?.name || "",
        image: imageFromPackage,
        // Prefer package detail link; keep fallback list link if no id
        link: pkg.id ? `/city-tour/${pkg.id}` : existing?.link,
        source: existing ? `${existing.source}+package` : "packageOnly",
      });
    });

    return Array.from(byName.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [rawCities, cityPackages, API_BASE]);

  const closeModal = () => {
    setActiveModal(null);
    setActiveProfileCard(null);
  };

  const handleLogout = async () => {
    try {
      if (logout) await logout();
    } catch (err) {
      console.error("Logout error:", err);
    }
    closeModal();
    setActiveNav("home");
    navigate("/");
  };

  // Desktop Nav
  const desktopNavItems = [
    { icon: Mountain, label: "Activities", link: "/" },
    { icon: Hotel, label: "Hotels", link: "/hotels" },
    { icon: Umbrella, label: "Holidays", link: "/tours" },
    { icon: FileText, label: "Visa", link: "/visas" },
    { icon: Ship, label: "Cruise", link: "/cruises" },
  ];

  // Mobile Bottom Nav
  const mobileNavItems = [
    { id: "home", icon: Home, label: "Home", link: "/" },
    { id: "services", icon: Building2, label: "Services", link: null },
    { id: "cities", icon: MapPin, label: "Cities", link: null },
    { id: "profile", icon: User, label: "Profile", link: null },
  ];

  const services = [
    { icon: Mountain, label: "Activities", color: "bg-orange-50", link: "/" },
    { icon: Hotel, label: "Hotels", color: "bg-orange-50", link: "/hotels" },
    {
      icon: Umbrella,
      label: "Holidays",
      color: "bg-orange-50",
      link: "/tours",
    },
    { icon: FileText, label: "Visa", color: "bg-orange-50", link: "/visas" },
    { icon: Ship, label: "Cruise", color: "bg-orange-50", link: "/cruises" },
  ];

  const helplines = [
    { country: "Dubai", number: "+971 543939218" },
    { country: "Dubai", number: "055-2883105" },
  ];

  const profileMenu = [
    { icon: DollarSign, label: "Currency", type: "currency" },
    { icon: Phone, label: "Helpline", type: "helpline" },
    { icon: Info, label: "About Us", link: "/about" },
    { icon: PhoneCall, label: "Contact Us", link: "/contact" },
    { icon: Shield, label: "Privacy Policy", link: "/privacy" },
    { icon: Languages, label: "Language", link: "/language" },
  ];

  const userLinks = [
    { label: "Bookings", link: "/dashboard/bookings", icon: FileText },
    {
      label: "Activity Bookings",
      link: "/dashboard/activity-bookings",
      icon: Mountain,
    },
    {
      label: "Cruise Enquiries",
      link: "/dashboard/cruise-enquiries",
      icon: Ship,
    },
    {
      label: "Holiday Enquiries",
      link: "/dashboard/holiday-enquiries",
      icon: Umbrella,
    },
    {
      label: "Visa Applications",
      link: "/dashboard/visa-applications",
      icon: Globe,
    },
  ];

  const handleMobileNavClick = (id) => {
    setActiveNav(id);
    if (id === "services" || id === "cities" || id === "profile") {
      setActiveModal(id);
    } else {
      navigate(mobileNavItems.find((item) => item.id === id)?.link);
      closeModal();
    }
  };

  const handleProfileCardClick = (type) => {
    setActiveProfileCard(type);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" aria-label="Home">
              <img src="/logo.png" alt="Logo" className="h-16 w-auto md:h-20" />
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              {/* Helpline */}
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 text-sm">
                  <Phone className="w-4 h-4" /> <span>Helpline</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-50">
                  {helplines.map((line, idx) => (
                    <a
                      key={idx}
                      href={`tel:${line.number}`}
                      className="flex justify-between px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 rounded-t-xl"
                    >
                      <span>{line.country}</span>
                      <span>{line.number}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Currency */}
              <div className="relative group flex items-center space-x-2 text-gray-700 text-sm cursor-pointer">
                <span className="text-orange-500 font-semibold">
                  {currencySymbols[currency] || "$"}
                </span>
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3" />
                <div className="absolute top-full right-0 mt-2  bg-white shadow-lg rounded-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-50 w-[30vw] p-4 grid grid-cols-4 gap-2">
                  {supportedCurrencies.map((cur) => (
                    <button
                      key={cur}
                      onClick={() => setCurrency(cur)}
                      className={`border rounded-lg p-2 text-sm w-full text-left ${
                        currency === cur
                          ? "bg-orange-50 border-orange-400 text-orange-600"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between">
                        <span>{cur}</span>
                        <span>{currencySymbols[cur] || "$"}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-orange-500 text-sm font-medium"
                  >
                    {user.name || "Dashboard"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-orange-500 text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-orange-500 text-sm font-medium"
                >
                  Log In
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:block border-t border-gray-100 py-2">
            <div className="flex justify-center">
              <div className="flex items-center space-x-1 bg-gray-50 rounded-2xl p-1">
                {desktopNavItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.link}
                    onClick={() => setActiveDesktopNav(item.label)}
                    className={`flex items-center space-x-2 px-5 py-2 rounded-xl transition-all ${
                      activeDesktopNav === item.label
                        ? "bg-orange-500 text-white shadow-md"
                        : "text-gray-600 hover:bg-white hover:shadow-md"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 shadow-2xl">
        <div className="flex items-center px-5 py-2 space-x-5 overflow-x-auto">
          {mobileNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMobileNavClick(item.id)}
              className={`inline-flex flex-col items-center p-2 rounded-lg transition-all min-w-[70px] ${
                activeNav === item.id
                  ? "text-orange-500 bg-orange-50"
                  : "text-gray-500 hover:text-orange-500"
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overlay */}
      {activeModal && (
        <div
          onClick={closeModal}
          className="md:hidden fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
        />
      )}

      {/* Services Modal */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 shadow-2xl transition-transform duration-300 ease-out ${
          activeModal === "services" ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "80vh" }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Services</h2>
            <button
              onClick={closeModal}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {services.map((service, idx) => (
              <Link
                key={idx}
                to={service.link}
                onClick={closeModal}
                className="flex flex-col items-center"
              >
                <div className={`${service.color} p-4 rounded-2xl mb-2`}>
                  <service.icon className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-xs text-gray-700">{service.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Cities Modal */}
      {/* <div
        className={`md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 transition-transform duration-300 ease-out overflow-y-auto ${
          activeModal === "cities" ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "80vh" }}
      >
        <div className="p-6 pb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Cities</h2>
            <button
              onClick={closeModal}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {cities.map((city, idx) => (
              <Link
                key={idx}
                to={city.link}
                onClick={closeModal}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-20 rounded-xl overflow-hidden shadow-md mb-2">
                  <img
                    src={city.image || "./Activity/a1.png"}
                    alt={city.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "./Activity/a1.png";
                    }}
                  />
                </div>
                <h3 className="text-xs font-medium text-gray-800">
                  {city.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div> */}

      {/* Cities Modal */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 transition-transform duration-300 ease-out overflow-y-auto ${
          activeModal === "cities" ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "80vh" }}
      >
        <div className="p-6 pb-8">
          <div className="flex  justify-between items-center mb-6">
            <h2 className="text-base md:text-lg font-bold text-gray-900">
              Cities
            </h2>
            <button
              onClick={closeModal}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Cities Grid - Exact layout matching the image */}
          <div className="grid grid-cols-3 gap-4">
            {cities.length > 0 ? (
              cities.map((city, idx) => (
                <Link
                  key={idx}
                  to={city.link}
                  onClick={closeModal}
                  className="flex flex-col items-center"
                >
                  <div className="w-24 h-20 rounded-xl overflow-hidden shadow-md mb-2">
                    <img
                      src={city.image || "./Activity/a1.png"}
                      alt={city.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "./Activity/a1.png";
                      }}
                    />
                  </div>
                  <h3 className="text-xs font-medium text-gray-800 text-center">
                    {city.name}
                  </h3>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-gray-500">
                No cities available
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Profile Modal */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 transition-transform duration-300 ${
          activeModal === "profile" ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "93vh" }}
      >
        <div className="p-6 pb-24 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user ? `Hello, ${user.name || "User"}` : "Hello"}
              </h2>
              <p className="text-sm text-gray-500">
                Discover and book unique experiences
              </p>
            </div>
            <button
              onClick={closeModal}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {user && (
            <div className="my-4">
              <button
                onClick={() => setIsDashboardOpen(!isDashboardOpen)}
                className="w-full flex items-center justify-between bg-gray-50 p-4 rounded-xl text-gray-700 font-semibold hover:bg-orange-50"
              >
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-600" />
                  <span>Dashboard</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    isDashboardOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isDashboardOpen && (
                <div className="mt-2 space-y-2 pl-6">
                  {userLinks.map((link, idx) => (
                    <Link
                      key={idx}
                      to={link.link}
                      onClick={closeModal}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center space-x-3">
                        <link.icon className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700 text-sm">
                          {link.label}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Menu */}
          <div className="space-y-1 my-6">
            {profileMenu.map((item, idx) => (
              <button
                key={idx}
                onClick={() =>
                  item.type
                    ? handleProfileCardClick(item.type)
                    : navigate(item.link)
                }
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700 font-medium">
                    {item.label}
                  </span>
                </div>
                {item.type && (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>
            ))}
          </div>

          {user ? (
            <button
              onClick={handleLogout}
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 shadow-md"
            >
              Logout
            </button>
          ) : (
            <div className="flex gap-3 mt-6">
              <Link
                to="/login"
                onClick={closeModal}
                className="flex-1 bg-orange-500 text-white py-3 rounded-xl text-center font-semibold hover:bg-orange-600"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={closeModal}
                className="flex-1 bg-orange-500 text-white py-3 rounded-xl text-center font-semibold hover:bg-orange-600"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Profile Cards inside Profile Modal */}
      {/* Currency Card */}
      {activeProfileCard === "currency" && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 transition-transform duration-300">
          <div className="p-6 pb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Select Currency
              </h2>
              <button
                onClick={() => setActiveProfileCard(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {supportedCurrencies.map((cur) => (
                <button
                  key={cur}
                  onClick={() => {
                    setCurrency(cur);
                    setActiveProfileCard(null);
                  }}
                  className={`border rounded-lg p-2 text-sm w-full text-left ${
                    currency === cur
                      ? "bg-orange-50 border-orange-400 text-orange-600"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between">
                    <span>{cur}</span>
                    <span>{currencySymbols[cur] || "$"}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Helpline Card */}
      {activeProfileCard === "helpline" && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 transition-transform duration-300">
          <div className="p-6 pb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Helpline</h2>
              <button
                onClick={() => setActiveProfileCard(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-2">
              {helplines.map((line, idx) => (
                <a
                  key={idx}
                  href={`tel:${line.number}`}
                  className="flex justify-between px-4 py-2 text-sm text-gray-700 border rounded-lg hover:bg-gray-50"
                >
                  <span>{line.country}</span>
                  <span>{line.number}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
