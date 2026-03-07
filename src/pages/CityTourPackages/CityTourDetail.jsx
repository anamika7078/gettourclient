// import { useEffect, useState } from "react";
// import { FaArrowLeft, FaClock, FaMapMarkerAlt, FaStar } from "react-icons/fa";
// import { useNavigate, useParams } from "react-router-dom";

// export default function CityTourDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const API_BASE = import.meta.env.VITE_API_URL;

//   const [tourPackage, setTourPackage] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [category, setCategory] = useState(null);

//   // Fetch tour package details
//   useEffect(() => {
//     const fetchTourDetails = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`${API_BASE}/api/city-packages/${id}`);
//         const data = await response.json();

//         if (data.success) {
//           setTourPackage(data.data);
//           // Set first image as selected
//           if (data.data.images && data.data.images.length > 0) {
//             setSelectedImage(data.data.images[0]);
//           } else if (data.data.cityImage) {
//             setSelectedImage(data.data.cityImage);
//           }

//           // Fetch category details if categoryId exists
//           if (data.data.categoryId) {
//             fetchCategory(data.data.categoryId);
//           }
//         } else {
//           setError("Failed to load tour details");
//         }
//       } catch (err) {
//         console.error("Error fetching tour details:", err);
//         setError("Failed to load tour details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchCategory = async (categoryId) => {
//       try {
//         const response = await fetch(
//           `${API_BASE}/api/city-tour-categories/${categoryId}`
//         );
//         const data = await response.json();
//         if (data) {
//           setCategory(data);
//         }
//       } catch (err) {
//         console.error("Error fetching category:", err);
//       }
//     };

//     fetchTourDetails();
//   }, [id, API_BASE]);

//   const getImageUrl = (imageName) => {
//     if (!imageName) return "./Activity/a1.png";
//     return `${API_BASE}/uploads/city-packages/${imageName}`;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
//       </div>
//     );
//   }

//   if (error || !tourPackage) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center px-4">
//         <div className="text-red-500 text-xl mb-4">
//           {error || "Tour package not found"}
//         </div>
//         <button
//           onClick={() => navigate(-1)}
//           className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header with Back Button */}
//       <div className="bg-white shadow-sm sticky top-0 z-40">
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition"
//           >
//             <FaArrowLeft className="text-lg" />
//             <span className="font-medium">Back to Tours</span>
//           </button>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column - Images and Details */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Main Image */}
//             <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
//               <div className="h-[300px] md:h-[450px] overflow-hidden">
//                 <img
//                   src={getImageUrl(selectedImage)}
//                   alt={tourPackage.title}
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     e.target.src = "./Activity/a1.png";
//                   }}
//                 />
//               </div>

//               {/* Image Gallery */}
//               {tourPackage.images && tourPackage.images.length > 0 && (
//                 <div className="p-4">
//                   <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
//                     {tourPackage.cityImage && (
//                       <div
//                         onClick={() => setSelectedImage(tourPackage.cityImage)}
//                         className={`cursor-pointer rounded-lg overflow-hidden border-2 transition ${
//                           selectedImage === tourPackage.cityImage
//                             ? "border-orange-500"
//                             : "border-gray-200 hover:border-orange-300"
//                         }`}
//                       >
//                         <img
//                           src={getImageUrl(tourPackage.cityImage)}
//                           alt="City"
//                           className="w-full h-16 md:h-20 object-cover"
//                           onError={(e) => {
//                             e.target.src = "./Activity/a1.png";
//                           }}
//                         />
//                       </div>
//                     )}
//                     {tourPackage.images.map((img, idx) => (
//                       <div
//                         key={idx}
//                         onClick={() => setSelectedImage(img)}
//                         className={`cursor-pointer rounded-lg overflow-hidden border-2 transition ${
//                           selectedImage === img
//                             ? "border-orange-500"
//                             : "border-gray-200 hover:border-orange-300"
//                         }`}
//                       >
//                         <img
//                           src={getImageUrl(img)}
//                           alt={`Gallery ${idx + 1}`}
//                           className="w-full h-16 md:h-20 object-cover"
//                           onError={(e) => {
//                             e.target.src = "./Activity/a1.png";
//                           }}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Tour Details */}
//             <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
//               <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
//                 {tourPackage.title}
//               </h1>

//               {/* Location and Category */}
//               <div className="flex flex-wrap gap-4 mb-6">
//                 <div className="flex items-center gap-2 text-gray-700">
//                   <FaMapMarkerAlt className="text-orange-500" />
//                   <span className="font-medium">{tourPackage.cityName}</span>
//                 </div>
//                 {category && (
//                   <div className="px-4 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
//                     {category.name}
//                   </div>
//                 )}
//                 {tourPackage.duration && (
//                   <div className="flex items-center gap-2 text-gray-700">
//                     <FaClock className="text-orange-500" />
//                     <span>{tourPackage.duration}</span>
//                   </div>
//                 )}
//               </div>

//               {/* Rating */}
//               <div className="flex items-center gap-2 mb-6">
//                 <div className="flex text-orange-500">
//                   {[...Array(5)].map((_, i) => (
//                     <FaStar key={i} className="text-lg" />
//                   ))}
//                 </div>
//                 <span className="text-gray-600 text-sm">(5.0)</span>
//               </div>

//               {/* Description */}
//               {tourPackage.details && (
//                 <div className="prose max-w-none">
//                   <h2 className="text-xl font-bold text-gray-900 mb-3">
//                     About This Tour
//                   </h2>
//                   <div
//                     className="text-gray-700 leading-relaxed whitespace-pre-wrap"
//                     dangerouslySetInnerHTML={{ __html: tourPackage.details }}
//                   />
//                 </div>
//               )}

//               {/* Location URL */}
//               {tourPackage.locationUrl && (
//                 <div className="mt-6 pt-6 border-t">
//                   <h3 className="text-lg font-bold text-gray-900 mb-3">
//                     Location
//                   </h3>
//                   <a
//                     href={tourPackage.locationUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
//                   >
//                     <FaMapMarkerAlt />
//                     <span>View on Map</span>
//                   </a>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right Column - Booking Card */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
//               <div className="mb-6">
//                 <p className="text-gray-600 text-sm mb-1">Price Per Person</p>
//                 <p className="text-4xl font-bold text-gray-900">
//                   ₹{tourPackage.price}
//                 </p>
//               </div>

//               <div className="space-y-4 mb-6">
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-gray-600">City</span>
//                   <span className="font-medium text-gray-900">
//                     {tourPackage.cityName}
//                   </span>
//                 </div>
//                 {tourPackage.duration && (
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-gray-600">Duration</span>
//                     <span className="font-medium text-gray-900">
//                       {tourPackage.duration}
//                     </span>
//                   </div>
//                 )}
//                 {category && (
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-gray-600">Category</span>
//                     <span className="font-medium text-gray-900">
//                       {category.name}
//                     </span>
//                   </div>
//                 )}
//               </div>

//               <button
//                 onClick={() => {
//                   // Navigate to booking or contact page
//                   navigate("/contact");
//                 }}
//                 className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl transition shadow-md hover:shadow-lg"
//               >
//                 Book Now
//               </button>

//               <div className="mt-4 text-center">
//                 <p className="text-xs text-gray-500">
//                   Free cancellation up to 24 hours before
//                 </p>
//               </div>

//               <div className="mt-6 pt-6 border-t space-y-3">
//                 <h4 className="font-semibold text-gray-900 text-sm">
//                   Why Choose This Tour?
//                 </h4>
//                 <ul className="space-y-2 text-sm text-gray-600">
//                   <li className="flex items-start gap-2">
//                     <span className="text-orange-500 mt-1">✓</span>
//                     <span>Expert local guides</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="text-orange-500 mt-1">✓</span>
//                     <span>Best price guarantee</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="text-orange-500 mt-1">✓</span>
//                     <span>24/7 customer support</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="text-orange-500 mt-1">✓</span>
//                     <span>Instant confirmation</span>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  ExternalLink,
  FileText,
  Globe,
  Info,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  Smartphone,
  Star,
  Tag,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCurrency } from "../../contexts/CurrencyContext";

const BRAND = "#F17232";

function SectionCard({ id, title, children, className = "" }) {
  return (
    <section
      id={id}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 ${className}`}
    >
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-200">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

export default function CityTourDetail() {
  const API_BASE = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [tourPackage, setTourPackage] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const { convertAndFormat } = useCurrency();

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const fetchTourDetails = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/city-packages/${id}`);
        const data = await response.json();

        if (!mounted) return;

        if (data.success) {
          setTourPackage(data.data);

          // Fetch category details if categoryId exists
          if (data.data.categoryId) {
            fetchCategory(data.data.categoryId);
          }
        } else {
          setError("Failed to load tour details");
        }
      } catch (err) {
        if (!mounted) return;
        console.error("Error fetching tour details:", err);
        setError("Failed to load tour details");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const fetchCategory = async (categoryId) => {
      try {
        const response = await fetch(
          `${API_BASE}/api/city-tour-categories/${categoryId}`
        );
        const data = await response.json();
        if (data && mounted) {
          setCategory(data);
        }
      } catch (err) {
        console.error("Error fetching category:", err);
      }
    };

    fetchTourDetails();
    return () => {
      mounted = false;
    };
  }, [API_BASE, id]);

  const getImageUrl = (imageName) => {
    if (!imageName) return "./Activity/a1.png";
    if (imageName.startsWith("http")) return imageName;
    return `${API_BASE}/uploads/city-packages/${imageName}`;
  };

  const images = useMemo(() => {
    if (!tourPackage) return [];
    const imageArray = [];

    // Add city image if available
    if (tourPackage.cityImage) {
      imageArray.push(tourPackage.cityImage);
    }

    // Add other images if available
    if (tourPackage.images && Array.isArray(tourPackage.images)) {
      imageArray.push(...tourPackage.images);
    }

    return imageArray.filter((img) => img);
  }, [tourPackage]);

  const allMedia = useMemo(() => {
    return images.map((img, index) => ({
      type: "image",
      url: getImageUrl(img),
      index,
      id: `img-${index}`,
    }));
  }, [images]);

  const currentMedia = allMedia[currentMediaIndex];

  const handleNextMedia = () => {
    if (allMedia.length === 0) return;
    setCurrentMediaIndex((prev) =>
      prev === allMedia.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevMedia = () => {
    if (allMedia.length === 0) return;
    setCurrentMediaIndex((prev) =>
      prev === 0 ? allMedia.length - 1 : prev - 1
    );
  };

  const renderHeroMedia = () => {
    if (allMedia.length === 0) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Tag className="w-16 h-16 mx-auto mb-2 opacity-50" />
            <p>No images available</p>
          </div>
        </div>
      );
    }

    if (!currentMedia) {
      const firstImage = allMedia.find((media) => media.type === "image");
      if (firstImage) {
        return (
          <img
            src={firstImage.url}
            alt="Tour"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "./Activity/a1.png";
            }}
          />
        );
      }
      return null;
    }

    if (currentMedia.type === "image") {
      return (
        <img
          src={currentMedia.url}
          alt="Tour"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "./Activity/a1.png";
          }}
        />
      );
    }

    return null;
  };

  const title = tourPackage?.title || "City Tour";
  const PRICE = Number(tourPackage?.price || 0);
  const priceStr = convertAndFormat(PRICE);

  const staticReviews = {
    avg: 5.0,
    total: 189,
    counts: { 5: 175, 4: 8, 3: 3, 2: 2, 1: 1 },
    items: [
      {
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        name: "Michael T.",
        date: "November 2023",
        title: "Amazing City Experience",
        comment:
          "This tour exceeded all expectations! Our guide was knowledgeable and friendly. The itinerary was perfectly paced with just the right mix of historical sites and local culture.",
        rating: 5,
      },
      {
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=200&auto=format&fit=crop",
        name: "Sarah Johnson",
        date: "October 2023",
        title: "Perfect Introduction to the City",
        comment:
          "As a first-time visitor, this tour was the perfect way to get oriented. We covered all the major landmarks and learned so much about the city's history and culture.",
        rating: 5,
      },
    ],
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading tour details...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !tourPackage) {
    return (
      <main className="min-h-screen bg-gray-50 py-6 mb-10">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Unable to Load Tour
            </h2>
            <p className="text-gray-600 mb-6">
              {error || "The requested tour was not found."}
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={() => navigate("/city-tours")}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Browse Tours
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50" style={{ "--brand": BRAND }}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="hidden md:flex items-center gap-2 text-sm text-gray-500 mb-6">
          <a href="/" className="hover:text-orange-500 transition-colors">
            Home
          </a>
          <span>/</span>
          <a
            href="/city-tours"
            className="hover:text-orange-500 transition-colors"
          >
            City Tours
          </a>
          <span>/</span>
          <span className="text-gray-900 font-medium line-clamp-1">
            {title}
          </span>
        </nav>

        {/* Hero Section */}
        <section className="mb-6">
          <div className="relative rounded-2xl overflow-hidden shadow-lg h-64 md:h-96 lg:h-[500px]">
            {renderHeroMedia()}

            <button
              onClick={() => navigate(-1)}
              className="md:hidden absolute top-4 left-4 bg-black/50 hover:bg-black/70 text-white px-3 py-2 rounded-lg flex items-center justify-center shadow-lg transition-all z-10"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />

            {category && (
              <div className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-lg">
                <Tag className="w-4 h-4" />
                <span>{category.name}</span>
              </div>
            )}

            {currentMedia && allMedia.length > 1 && (
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                📷 {currentMediaIndex + 1}/{allMedia.length}
              </div>
            )}

            {allMedia.length > 1 && (
              <>
                <button
                  aria-label="previous"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all hover:scale-110"
                  onClick={handlePrevMedia}
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  aria-label="next"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all hover:scale-110"
                  onClick={handleNextMedia}
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </>
            )}
          </div>

          {allMedia.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
              {allMedia.map((media, index) => (
                <button
                  key={media.id}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentMediaIndex
                      ? "border-orange-500 ring-2 ring-orange-200 scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setCurrentMediaIndex(index)}
                >
                  <img
                    src={media.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "./Activity/a1.png";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* MOBILE LAYOUT */}
        <div className="md:hidden">
          {/* Title and Price Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-orange-600">
                {priceStr}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-current text-green-600"
                      fill="currentColor"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {staticReviews.total} Reviews
                </span>
              </div>
            </div>
          </div>

          {/* Book Now Button - Full width */}
          <button
            onClick={() => {
              let logged = false;
              try {
                const u = localStorage.getItem("user");
                const t = localStorage.getItem("token");
                logged = !!u || !!t;
              } catch {
                /* ignore */
              }
              if (!logged) {
                setShowAuthModal(true);
                return;
              }
              navigate(`/city-tours/${id}/book`);
            }}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-lg mb-6 flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
            <Calendar className="w-6 h-6" />
            <span>Book Now</span>
          </button>

          {/* Features List - Simple vertical layout */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {tourPackage.duration || "Full Day Tour"}
                  </div>
                  <div className="text-sm text-gray-600">
                    Duration may vary based on itinerary
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Instant Confirmation
                  </div>
                  <div className="text-sm text-gray-600">
                    Instant Tour Confirmation will be Provided
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Mobile Voucher Accepted
                  </div>
                  <div className="text-sm text-gray-600">
                    Use your phone or print your voucher
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Free Cancellation
                  </div>
                  <div className="text-sm text-gray-600">
                    Cancel up to 24 hours before
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    English / Arabic
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Navigation className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Hotel Transfers Included
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Google Map</div>
                </div>
              </div>
            </div>
          </div>

          {/* Overview Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Overview</h2>
            {tourPackage.details ? (
              <div className="text-gray-700 leading-relaxed">
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: tourPackage.details }}
                />
              </div>
            ) : (
              <div className="flex items-start gap-3 text-gray-500 bg-gray-50 p-3 rounded-lg">
                <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  No additional details were provided for this tour.
                </p>
              </div>
            )}
          </div>

          {/* Tour Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Tour Information
            </h2>
            <div className="space-y-4">
              {category && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Tag className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Tour Category
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {category.name}
                    </div>
                  </div>
                </div>
              )}

              {tourPackage.cityName && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      City
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {tourPackage.cityName}
                    </div>
                  </div>
                </div>
              )}

              {tourPackage.duration && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Duration
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {tourPackage.duration}
                    </div>
                  </div>
                </div>
              )}

              {PRICE > 0 && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Starting Price
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {priceStr}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          {tourPackage.locationUrl && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Location & Directions
              </h2>
              <div className="space-y-4">
                <div className="w-full h-64 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
                  <iframe
                    title="location-map"
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
                      tourPackage.cityName
                    )}`}
                    className="w-full h-full"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    style={{ border: 0 }}
                  />
                </div>

                <div className="flex flex-col items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="text-gray-900 font-medium">
                      {tourPackage.cityName}
                    </span>
                  </div>
                  <a
                    href={tourPackage.locationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors w-full justify-center shadow-sm"
                  >
                    Open in Maps
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Customer Reviews
            </h2>
            <div className="space-y-6">
              {/* Rating Summary */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="flex flex-col gap-6 items-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900 mb-2">
                      {staticReviews.avg.toFixed(1)}
                    </div>
                    <div className="flex items-center gap-1 mb-2 justify-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-current text-green-600"
                          fill="currentColor"
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">
                      Based on {staticReviews.total} reviews
                    </div>
                  </div>

                  <div className="w-full space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = staticReviews.counts[star];
                      const percentage = (count / staticReviews.total) * 100;
                      return (
                        <div
                          key={star}
                          className="flex items-center gap-3 text-sm"
                        >
                          <div className="flex items-center gap-1 w-16">
                            <span className="text-gray-700 font-medium">
                              {star}
                            </span>
                            <Star className="w-3 h-3 fill-current text-gray-400" />
                          </div>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-gray-600 w-12 text-right">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-4">
                {staticReviews.items.map((review, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {review.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {review.date}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 fill-current text-yellow-500"
                                fill="currentColor"
                              />
                            ))}
                          </div>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {review.title}
                        </h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 mb-12">
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    Secure Booking
                  </div>
                  <div className="text-sm text-gray-600">
                    SSL encrypted payments
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <CheckCircle className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    Instant Confirmation
                  </div>
                  <div className="text-sm text-gray-600">
                    Get tickets instantly
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Phone className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    24/7 Support
                  </div>
                  <div className="text-sm text-gray-600">
                    We're here to help
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP LAYOUT */}
        <div className="hidden md:block">
          {/* Title & Quick Info Bar */}
          <header className="mb-6">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-4">
              {title}
            </h1>

            {/* Icon Features Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 text-xs">
                    {tourPackage.duration || "Full Day"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 text-xs">
                    Instant Confirmation
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 text-xs">Mobile Voucher</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 text-xs">
                    Free Cancellation
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 text-xs">
                    English / Arabic
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Navigation className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 text-xs">Hotel Transfers</span>
                </div>
              </div>
            </div>

            {/* Rating & Price Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-current text-green-600"
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  <span className="text-green-700 font-semibold">
                    {staticReviews.avg.toFixed(1)}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{staticReviews.total}</span>{" "}
                  Reviews
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-gray-500">Starting from</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {priceStr}
                  </div>
                  <div className="text-xs text-gray-500">per person</div>
                </div>
                <button
                  onClick={() => {
                    let logged = false;
                    try {
                      const u = localStorage.getItem("user");
                      const t = localStorage.getItem("token");
                      logged = !!u || !!t;
                    } catch {
                      /* ignore */
                    }
                    if (!logged) {
                      setShowAuthModal(true);
                      return;
                    }
                    navigate(`/city-tours/${id}/book`);
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Now</span>
                </button>
              </div>
            </div>
          </header>

          {/* Overview Section */}
          <SectionCard id="overview" title="Overview">
            {tourPackage.details ? (
              <div
                className="prose prose-gray prose-sm max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: tourPackage.details }}
              />
            ) : (
              <div className="flex items-start gap-3 text-gray-500 bg-gray-50 p-4 rounded-lg">
                <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  No additional details were provided for this tour.
                </p>
              </div>
            )}
          </SectionCard>

          {/* Tour Details */}
          <SectionCard id="details" title="Tour Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Tag className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Tour Category
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {category.name}
                    </div>
                  </div>
                </div>
              )}

              {tourPackage.cityName && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      City
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {tourPackage.cityName}
                    </div>
                  </div>
                </div>
              )}

              {tourPackage.duration && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Duration
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {tourPackage.duration}
                    </div>
                  </div>
                </div>
              )}

              {PRICE > 0 && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Starting Price
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {priceStr}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Location */}
          {tourPackage.locationUrl && (
            <SectionCard id="location" title="Location & Directions">
              <div className="space-y-4">
                <div className="w-full h-96 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
                  <iframe
                    title="location-map"
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
                      tourPackage.cityName
                    )}`}
                    className="w-full h-full"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    style={{ border: 0 }}
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="text-gray-900 font-medium">
                      {tourPackage.cityName}
                    </span>
                  </div>
                  <a
                    href={tourPackage.locationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors w-fit shadow-sm"
                  >
                    Open in Maps
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </SectionCard>
          )}

          {/* Reviews Section */}
          <SectionCard id="reviews" title="Customer Reviews">
            <div className="space-y-6">
              {/* Rating Summary */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="text-center md:text-left">
                    <div className="text-5xl font-bold text-gray-900 mb-2">
                      {staticReviews.avg.toFixed(1)}
                    </div>
                    <div className="flex items-center gap-1 mb-2 justify-center md:justify-start">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-current text-green-600"
                          fill="currentColor"
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">
                      Based on {staticReviews.total} reviews
                    </div>
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = staticReviews.counts[star];
                      const percentage = (count / staticReviews.total) * 100;
                      return (
                        <div
                          key={star}
                          className="flex items-center gap-3 text-sm"
                        >
                          <div className="flex items-center gap-1 w-16">
                            <span className="text-gray-700 font-medium">
                              {star}
                            </span>
                            <Star className="w-3 h-3 fill-current text-gray-400" />
                          </div>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-gray-600 w-12 text-right">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-4">
                {staticReviews.items.map((review, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {review.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {review.date}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 fill-current text-yellow-500"
                                fill="currentColor"
                              />
                            ))}
                          </div>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {review.title}
                        </h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* Trust Badges */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 py-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    Secure Booking
                  </div>
                  <div className="text-sm text-gray-600">
                    SSL encrypted payments
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <CheckCircle className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    Instant Confirmation
                  </div>
                  <div className="text-sm text-gray-600">
                    Get tickets instantly
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Phone className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    24/7 Support
                  </div>
                  <div className="text-sm text-gray-600">
                    We're here to help
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom CTA - Mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg md:hidden z-40">
          <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto">
            <div>
              <div className="text-xs text-gray-500">From</div>
              <div className="text-xl font-bold text-orange-600">
                {priceStr}
              </div>
            </div>
            <button
              onClick={() => {
                let logged = false;
                try {
                  const u = localStorage.getItem("user");
                  const t = localStorage.getItem("token");
                  logged = !!u || !!t;
                } catch {
                  /* ignore */
                }
                if (!logged) {
                  setShowAuthModal(true);
                  return;
                }
                navigate(`/city-tours/${id}/book`);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <Calendar className="w-5 h-5" />
              <span>Book Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Auth Required Modal */}
      {showAuthModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAuthModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Login Required
                  </h3>
                </div>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Please login to book this tour and access exclusive deals.
              </p>
              <div className="flex gap-3">
                <button
                  className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  onClick={() => setShowAuthModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                  onClick={() =>
                    navigate("/login", { state: { from: location.pathname } })
                  }
                >
                  Login Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
