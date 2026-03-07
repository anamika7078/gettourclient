// import {
//   Calendar,
//   CheckCircle,
//   ChevronLeft,
//   ChevronRight,
//   Clock,
//   DollarSign,
//   FileText,
//   Globe,
//   Info,
//   MapPin,
//   MessageCircle,
//   Navigation,
//   Phone,
//   ShieldCheck,
//   Smartphone,
//   Star,
//   Tag,
//   X,
// } from "lucide-react";
// import { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { useCurrency } from "../../contexts/CurrencyContext";
// import EnquiryNow from "./EnquiryNow";

// const BRAND = "#F17232";

// function SectionCard({ id, title, children, className = "" }) {
//   return (
//     <section
//       id={id}
//       className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 ${className}`}
//     >
//       <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-200">
//         <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
//       </div>
//       <div className="p-6">{children}</div>
//     </section>
//   );
// }

// export default function HolidayDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const API_BASE = import.meta.env.VITE_API_URL;
//   const [pkg, setPkg] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   // Enquiry modal
//   const [showEnquiry, setShowEnquiry] = useState(false);
//   const [showAuthModal, setShowAuthModal] = useState(false);

//   const openEnquiry = (e) => {
//     e?.preventDefault?.();
//     try {
//       const u = localStorage.getItem("user");
//       const t = localStorage.getItem("token");
//       const logged = !!u || !!t;
//       if (!logged) {
//         setShowAuthModal(true);
//         return;
//       }
//     } catch {
//       setShowAuthModal(true);
//       return;
//     }
//     setShowEnquiry(true);
//   };

//   const closeEnquiry = () => setShowEnquiry(false);

//   useEffect(() => {
//     if (!showEnquiry) return;
//     const onKey = (e) => e.key === "Escape" && closeEnquiry();
//     window.addEventListener("keydown", onKey);
//     const prev = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     return () => {
//       window.removeEventListener("keydown", onKey);
//       document.body.style.overflow = prev;
//     };
//   }, [showEnquiry]);

//   // Currency helper for formatting AED-based prices
//   const { convertAndFormat } = useCurrency();

//   // Load holiday by id
//   useEffect(() => {
//     let ignore = false;
//     (async () => {
//       try {
//         setLoading(true);
//         setError("");
//         const res = await fetch(`${API_BASE}/api/holidays/${id}`);
//         const json = await res.json();
//         if (!res.ok || !json?.success)
//           throw new Error(json?.error || "Failed to load");
//         if (!ignore) setPkg(json.data);
//       } catch (e) {
//         if (!ignore) setError(e.message || "Failed to load");
//       } finally {
//         if (!ignore) setLoading(false);
//       }
//     })();
//     return () => {
//       ignore = true;
//     };
//   }, [id, API_BASE]);

//   const images = useMemo(() => {
//     try {
//       const arr =
//         typeof pkg?.images === "string" ? JSON.parse(pkg.images) : pkg?.images;
//       return Array.isArray(arr) ? arr : [];
//     } catch {
//       return [];
//     }
//   }, [pkg]);

//   const allImages = images.map((img) => `${API_BASE}/uploads/holidays/${img}`);

//   const currentImage = allImages[currentImageIndex];

//   const handleNextImage = () => {
//     if (allImages.length === 0) return;
//     setCurrentImageIndex((prev) =>
//       prev === allImages.length - 1 ? 0 : prev + 1
//     );
//   };

//   const handlePrevImage = () => {
//     if (allImages.length === 0) return;
//     setCurrentImageIndex((prev) =>
//       prev === 0 ? allImages.length - 1 : prev - 1
//     );
//   };

//   // Try to parse nights/days from duration string like "5 Nights / 6 Days"
//   const { nights, days } = useMemo(() => {
//     const d = String(pkg?.duration || "");
//     const n = d.match(/(\d+)\s*(?:N|Night|Nights)/i)?.[1];
//     const dy = d.match(/(\d+)\s*(?:D|Day|Days)/i)?.[1];
//     return {
//       nights: n ? Number(n) : undefined,
//       days: dy ? Number(dy) : undefined,
//     };
//   }, [pkg?.duration]);

//   // Static reviews data
//   const staticReviews = {
//     avg: 4.8,
//     total: 142,
//     counts: { 5: 120, 4: 18, 3: 3, 2: 1, 1: 0 },
//     items: [
//       {
//         avatar:
//           "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
//         name: "Sarah M.",
//         date: "March 2024",
//         title: "Amazing Holiday Experience",
//         comment:
//           "This holiday package exceeded all our expectations. The accommodations were luxurious and the itinerary was perfectly planned. Will definitely book again!",
//         rating: 5,
//       },
//       {
//         avatar:
//           "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
//         name: "James K.",
//         date: "February 2024",
//         title: "Perfect Getaway",
//         comment:
//           "Everything from start to finish was seamless. The destinations were breathtaking and the service was exceptional. Highly recommended for couples.",
//         rating: 5,
//       },
//     ],
//   };

//   if (loading) {
//     return (
//       <main className="min-h-screen bg-gray-50">
//         <div className="max-w-6xl mx-auto px-4 py-8">
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
//             <p className="text-gray-600">Loading holiday package...</p>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   if (error || !pkg) {
//     return (
//       <main className="min-h-screen bg-gray-50">
//         <div className="max-w-6xl mx-auto px-4 py-8">
//           <div className="text-center py-20">
//             <div className="text-4xl mb-4">⚠️</div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">
//               Unable to Load Package
//             </h2>
//             <p className="text-gray-600 mb-6">
//               {error || "The requested holiday package was not found."}
//             </p>
//             <div className="flex gap-3 justify-center flex-wrap">
//               <button
//                 onClick={() => navigate(-1)}
//                 className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 Go Back
//               </button>
//               <button
//                 onClick={() => navigate("/tours")}
//                 className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
//               >
//                 Browse Tours
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   const PRICE = Number(pkg.price || 0);
//   const priceStr = convertAndFormat(PRICE);
//   const TITLE = pkg.title;

//   return (
//     <main className="min-h-screen bg-gray-50" style={{ "--brand": BRAND }}>
//       <div className="max-w-6xl mx-auto px-4 py-6">
//         {/* Breadcrumb */}
//         <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
//           <a href="/" className="hover:text-orange-500 transition-colors">
//             Home
//           </a>
//           <span>/</span>
//           <a href="/tours" className="hover:text-orange-500 transition-colors">
//             Tours
//           </a>
//           <span>/</span>
//           <span className="text-gray-900 font-medium line-clamp-1">
//             {TITLE}
//           </span>
//         </nav>

//         {/* Hero Section */}
//         <section className="mb-6">
//           <div className="relative rounded-2xl overflow-hidden shadow-lg h-72 md:h-96 lg:h-[500px]">
//             {currentImage ? (
//               <img
//                 src={currentImage}
//                 alt={TITLE}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
//                 <div className="text-center text-gray-500">
//                   <Tag className="w-16 h-16 mx-auto mb-2 opacity-50" />
//                   <p>No image available</p>
//                 </div>
//               </div>
//             )}

//             <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />

//             {/* Duration Ribbon */}
//             {(nights || days || pkg.duration) && (
//               <div className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-lg">
//                 <Calendar className="w-4 h-4" />
//                 <span>
//                   {nights != null && days != null ? (
//                     <>
//                       {nights}N / {days}D
//                     </>
//                   ) : (
//                     pkg.duration
//                   )}
//                 </span>
//               </div>
//             )}

//             {allImages.length > 1 && (
//               <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-xs font-medium">
//                 📷 {currentImageIndex + 1}/{allImages.length}
//               </div>
//             )}

//             {allImages.length > 1 && (
//               <>
//                 <button
//                   aria-label="previous"
//                   className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all hover:scale-110"
//                   onClick={handlePrevImage}
//                 >
//                   <ChevronLeft className="w-5 h-5 text-gray-700" />
//                 </button>
//                 <button
//                   aria-label="next"
//                   className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all hover:scale-110"
//                   onClick={handleNextImage}
//                 >
//                   <ChevronRight className="w-5 h-5 text-gray-700" />
//                 </button>
//               </>
//             )}
//           </div>

//           {allImages.length > 1 && (
//             <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
//               {allImages.map((image, index) => (
//                 <button
//                   key={index}
//                   className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
//                     index === currentImageIndex
//                       ? "border-orange-500 ring-2 ring-orange-200 scale-105"
//                       : "border-gray-200 hover:border-gray-300"
//                   }`}
//                   onClick={() => setCurrentImageIndex(index)}
//                 >
//                   <img
//                     src={image}
//                     alt={`Thumbnail ${index + 1}`}
//                     className="w-full h-full object-cover"
//                   />
//                 </button>
//               ))}
//             </div>
//           )}
//         </section>

//         {/* Title & Quick Info Bar */}
//         <header className="mb-6">
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
//             {TITLE}
//           </h1>

//           {/* Icon Features Bar */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
//               <div className="flex items-center gap-2 text-sm">
//                 <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//                   <Clock className="w-4 h-4 text-blue-600" />
//                 </div>
//                 <span className="text-gray-700 text-xs">Flexible Dates</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm">
//                 <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//                   <CheckCircle className="w-4 h-4 text-blue-600" />
//                 </div>
//                 <span className="text-gray-700 text-xs">
//                   Instant Confirmation
//                 </span>
//               </div>
//               <div className="flex items-center gap-2 text-sm">
//                 <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//                   <Smartphone className="w-4 h-4 text-blue-600" />
//                 </div>
//                 <span className="text-gray-700 text-xs">Mobile Voucher</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm">
//                 <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
//                   <FileText className="w-4 h-4 text-red-600" />
//                 </div>
//                 <span className="text-gray-700 text-xs">Free Cancellation</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm">
//                 <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//                   <Globe className="w-4 h-4 text-blue-600" />
//                 </div>
//                 <span className="text-gray-700 text-xs">Multi-language</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm">
//                 <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//                   <Navigation className="w-4 h-4 text-blue-600" />
//                 </div>
//                 <span className="text-gray-700 text-xs">All Transfers</span>
//               </div>
//             </div>
//           </div>

//           {/* Rating & Price Section */}
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
//                 <div className="flex items-center gap-1">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       className="w-4 h-4 fill-current text-green-600"
//                       fill="currentColor"
//                     />
//                   ))}
//                 </div>
//                 <span className="text-green-700 font-semibold">
//                   {staticReviews.avg.toFixed(1)}
//                 </span>
//               </div>
//               <div className="text-sm text-gray-600">
//                 <span className="font-medium">{staticReviews.total}</span>{" "}
//                 Reviews
//               </div>
//             </div>

//             <div className="flex items-center gap-4">
//               <div className="text-right">
//                 <div className="text-xs text-gray-500">Starting from</div>
//                 <div className="text-2xl font-bold text-orange-600">
//                   {priceStr}
//                 </div>
//                 <div className="text-xs text-gray-500">per person</div>
//               </div>
//               <button
//                 onClick={openEnquiry}
//                 className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
//               >
//                 <MessageCircle className="w-5 h-5" />
//                 <span>Enquire Now</span>
//               </button>
//             </div>
//           </div>
//         </header>

//         {/* Package Details */}
//         <SectionCard id="details" title="Package Information">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {pkg.category && (
//               <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
//                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
//                   <Tag className="w-5 h-5 text-orange-500" />
//                 </div>
//                 <div>
//                   <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
//                     Package Type
//                   </div>
//                   <div className="text-gray-900 font-semibold">
//                     {pkg.category}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {pkg.destination && (
//               <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
//                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
//                   <MapPin className="w-5 h-5 text-blue-500" />
//                 </div>
//                 <div>
//                   <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
//                     Destination
//                   </div>
//                   <div className="text-gray-900 font-semibold">
//                     {pkg.destination}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {pkg.duration && (
//               <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
//                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
//                   <Clock className="w-5 h-5 text-purple-500" />
//                 </div>
//                 <div>
//                   <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
//                     Duration
//                   </div>
//                   <div className="text-gray-900 font-semibold">
//                     {pkg.duration}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {PRICE > 0 && (
//               <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
//                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
//                   <DollarSign className="w-5 h-5 text-green-500" />
//                 </div>
//                 <div>
//                   <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
//                     Starting Price
//                   </div>
//                   <div className="text-gray-900 font-semibold">{priceStr}</div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </SectionCard>

//         {/* Overview */}
//         <SectionCard id="overview" title="Overview">
//           {pkg.details ? (
//             <div
//               className="prose prose-gray prose-sm max-w-none text-gray-700 leading-relaxed"
//               dangerouslySetInnerHTML={{ __html: pkg.details }}
//             />
//           ) : (
//             <div className="flex items-start gap-3 text-gray-500 bg-gray-50 p-4 rounded-lg">
//               <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
//               <p className="text-sm">
//                 No additional details were provided for this holiday package.
//               </p>
//             </div>
//           )}
//         </SectionCard>

//         {/* Reviews Section */}
//         <SectionCard id="reviews" title="Customer Reviews">
//           <div className="space-y-6">
//             {/* Rating Summary */}
//             <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
//               <div className="flex flex-col md:flex-row gap-6 items-center">
//                 <div className="text-center md:text-left">
//                   <div className="text-5xl font-bold text-gray-900 mb-2">
//                     {staticReviews.avg.toFixed(1)}
//                   </div>
//                   <div className="flex items-center gap-1 mb-2 justify-center md:justify-start">
//                     {[...Array(5)].map((_, i) => (
//                       <Star
//                         key={i}
//                         className="w-5 h-5 fill-current text-green-600"
//                         fill="currentColor"
//                       />
//                     ))}
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     Based on {staticReviews.total} reviews
//                   </div>
//                 </div>

//                 <div className="flex-1 w-full space-y-2">
//                   {[5, 4, 3, 2, 1].map((star) => {
//                     const count = staticReviews.counts[star] || 0;
//                     const percentage = (count / staticReviews.total) * 100;
//                     return (
//                       <div
//                         key={star}
//                         className="flex items-center gap-3 text-sm"
//                       >
//                         <div className="flex items-center gap-1 w-16">
//                           <span className="text-gray-700 font-medium">
//                             {star}
//                           </span>
//                           <Star className="w-3 h-3 fill-current text-gray-400" />
//                         </div>
//                         <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
//                           <div
//                             className="h-full bg-green-500 rounded-full transition-all"
//                             style={{ width: `${percentage}%` }}
//                           />
//                         </div>
//                         <span className="text-gray-600 w-12 text-right">
//                           {count}
//                         </span>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>

//             {/* Individual Reviews */}
//             <div className="space-y-4">
//               {staticReviews.items.map((review, idx) => (
//                 <div
//                   key={idx}
//                   className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
//                 >
//                   <div className="flex items-start gap-4">
//                     <img
//                       src={review.avatar}
//                       alt={review.name}
//                       className="w-12 h-12 rounded-full object-cover flex-shrink-0"
//                     />
//                     <div className="flex-1">
//                       <div className="flex items-center justify-between mb-2">
//                         <div>
//                           <div className="font-semibold text-gray-900">
//                             {review.name}
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             {review.date}
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           {[...Array(review.rating)].map((_, i) => (
//                             <Star
//                               key={i}
//                               className="w-4 h-4 fill-current text-yellow-500"
//                               fill="currentColor"
//                             />
//                           ))}
//                         </div>
//                       </div>
//                       <h4 className="font-semibold text-gray-900 mb-2">
//                         {review.title}
//                       </h4>
//                       <p className="text-sm text-gray-700 leading-relaxed">
//                         {review.comment}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* View All Reviews Button */}
//             <div className="text-center pt-4">
//               <button className="px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-lg font-medium hover:bg-orange-50 transition-colors">
//                 View All {staticReviews.total} Reviews
//               </button>
//             </div>
//           </div>
//         </SectionCard>

//         {/* Trust Badges */}
//         <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
//                 <ShieldCheck className="w-6 h-6 text-green-500" />
//               </div>
//               <div>
//                 <div className="font-semibold text-gray-900">
//                   Secure Booking
//                 </div>
//                 <div className="text-sm text-gray-600">
//                   SSL encrypted payments
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
//                 <CheckCircle className="w-6 h-6 text-blue-500" />
//               </div>
//               <div>
//                 <div className="font-semibold text-gray-900">
//                   Instant Confirmation
//                 </div>
//                 <div className="text-sm text-gray-600">
//                   Get confirmation instantly
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
//                 <Phone className="w-6 h-6 text-blue-500" />
//               </div>
//               <div>
//                 <div className="font-semibold text-gray-900">24/7 Support</div>
//                 <div className="text-sm text-gray-600">We're here to help</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Sticky Bottom CTA - Mobile */}
//         <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg lg:hidden z-40">
//           <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto">
//             <div>
//               <div className="text-xs text-gray-500">From</div>
//               <div className="text-xl font-bold text-orange-600">
//                 {priceStr}
//               </div>
//             </div>
//             <button
//               onClick={openEnquiry}
//               className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
//             >
//               <MessageCircle className="w-5 h-5" />
//               <span>Enquire Now</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Enquiry Modal */}
//       {showEnquiry && (
//         <div
//           className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//           onClick={closeEnquiry}
//         >
//           <div
//             className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 Enquiry Form
//               </h3>
//               <button
//                 className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
//                 onClick={closeEnquiry}
//                 aria-label="Close"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="p-6">
//               <EnquiryNow pkg={pkg} />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Auth Required Modal */}
//       {showAuthModal && (
//         <div
//           className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//           onClick={() => setShowAuthModal(false)}
//         >
//           <div
//             className="bg-white rounded-2xl shadow-xl w-full max-w-md"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
//                     <ShieldCheck className="w-6 h-6 text-green-500" />
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     Login Required
//                   </h3>
//                 </div>
//                 <button
//                   onClick={() => setShowAuthModal(false)}
//                   className="text-gray-400 hover:text-gray-600 transition-colors"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//               <p className="text-gray-600 mb-6">
//                 Please login to submit a holiday enquiry and access exclusive
//                 deals.
//               </p>
//               <div className="flex gap-3">
//                 <button
//                   className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
//                   onClick={() => setShowAuthModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
//                   onClick={() =>
//                     navigate("/login", { state: { from: location.pathname } })
//                   }
//                 >
//                   Login Now
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }

import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  Globe,
  Info,
  MapPin,
  MessageCircle,
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
import EnquiryNow from "./EnquiryNow";

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

export default function HolidayDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE = import.meta.env.VITE_API_URL;
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Enquiry modal
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const openEnquiry = (e) => {
    e?.preventDefault?.();
    try {
      const u = localStorage.getItem("user");
      const t = localStorage.getItem("token");
      const logged = !!u || !!t;
      if (!logged) {
        setShowAuthModal(true);
        return;
      }
    } catch {
      setShowAuthModal(true);
      return;
    }
    setShowEnquiry(true);
  };

  const closeEnquiry = () => setShowEnquiry(false);

  useEffect(() => {
    if (!showEnquiry) return;
    const onKey = (e) => e.key === "Escape" && closeEnquiry();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [showEnquiry]);

  // Currency helper for formatting AED-based prices
  const { convertAndFormat } = useCurrency();

  // Load holiday by id
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE}/api/holidays/${id}`);
        const json = await res.json();
        if (!res.ok || !json?.success)
          throw new Error(json?.error || "Failed to load");
        if (!ignore) setPkg(json.data);
      } catch (e) {
        if (!ignore) setError(e.message || "Failed to load");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [id, API_BASE]);

  const images = useMemo(() => {
    try {
      const arr =
        typeof pkg?.images === "string" ? JSON.parse(pkg.images) : pkg?.images;
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }, [pkg]);

  const allImages = images.map((img) => `${API_BASE}/uploads/holidays/${img}`);

  const currentImage = allImages[currentImageIndex];

  const handleNextImage = () => {
    if (allImages.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    if (allImages.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  // Try to parse nights/days from duration string like "5 Nights / 6 Days"
  const { nights, days } = useMemo(() => {
    const d = String(pkg?.duration || "");
    const n = d.match(/(\d+)\s*(?:N|Night|Nights)/i)?.[1];
    const dy = d.match(/(\d+)\s*(?:D|Day|Days)/i)?.[1];
    return {
      nights: n ? Number(n) : undefined,
      days: dy ? Number(dy) : undefined,
    };
  }, [pkg?.duration]);

  // Static reviews data
  const staticReviews = {
    avg: 4.8,
    total: 142,
    counts: { 5: 120, 4: 18, 3: 3, 2: 1, 1: 0 },
    items: [
      {
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        name: "Sarah M.",
        date: "March 2024",
        title: "Amazing Holiday Experience",
        comment:
          "This holiday package exceeded all our expectations. The accommodations were luxurious and the itinerary was perfectly planned. Will definitely book again!",
        rating: 5,
      },
      {
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        name: "James K.",
        date: "February 2024",
        title: "Perfect Getaway",
        comment:
          "Everything from start to finish was seamless. The destinations were breathtaking and the service was exceptional. Highly recommended for couples.",
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
            <p className="text-gray-600">Loading holiday package...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !pkg) {
    return (
      <main className="min-h-screen bg-gray-50  mb-10">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Unable to Load Package
            </h2>
            <p className="text-gray-600 mb-6">
              {error || "The requested holiday package was not found."}
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={() => navigate("/tours")}
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

  const PRICE = Number(pkg.price || 0);
  const priceStr = convertAndFormat(PRICE);
  const TITLE = pkg.title;

  return (
    <main className="min-h-screen bg-gray-50" style={{ "--brand": BRAND }}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb - Hidden on mobile as per image */}
        <nav className="hidden md:flex items-center gap-2 text-sm text-gray-500 mb-6">
          <a href="/" className="hover:text-orange-500 transition-colors">
            Home
          </a>
          <span>/</span>
          <a href="/tours" className="hover:text-orange-500 transition-colors">
            Tours
          </a>
          <span>/</span>
          <span className="text-gray-900 font-medium line-clamp-1">
            {TITLE}
          </span>
        </nav>

        {/* Hero Section */}
        <section className="mb-6">
          <div className="relative rounded-2xl overflow-hidden shadow-lg h-64 md:h-96 lg:h-[500px]">
            {currentImage ? (
              <img
                src={currentImage}
                alt={TITLE}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Tag className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p>No image available</p>
                </div>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
            <button
              onClick={() => navigate(-1)}
              className="md:hidden absolute top-4 left-4 bg-black/50 hover:bg-black/70 text-white px-3 py-2 rounded-lg flex items-center justify-center shadow-lg transition-all z-10"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {/* Duration Ribbon */}
            {/* {(nights || days || pkg.duration) && (
              <div className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-lg">
                <Calendar className="w-4 h-4" />
                <span>
                  {nights != null && days != null ? (
                    <>
                      {nights}N / {days}D
                    </>
                  ) : (
                    pkg.duration
                  )}
                </span>
              </div>
            )} */}

            {allImages.length > 1 && (
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                📷 {currentImageIndex + 1}/{allImages.length}
              </div>
            )}

            {allImages.length > 1 && (
              <>
                <button
                  aria-label="previous"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all hover:scale-110"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  aria-label="next"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all hover:scale-110"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </>
            )}
          </div>

          {allImages.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? "border-orange-500 ring-2 ring-orange-200 scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{TITLE}</h1>
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

          {/* Enquire Now Button - Full width */}
          <button
            onClick={openEnquiry}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-lg mb-6 flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
            <MessageCircle className="w-6 h-6" />
            <span>Enquire Now</span>
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
                    Flexible Dates
                  </div>
                  <div className="text-sm text-gray-600">
                    Choose your preferred travel dates
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
                    Get confirmation instantly
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Mobile Voucher
                  </div>
                  <div className="text-sm text-gray-600">
                    Use your phone or print your voucher
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Free Cancellation
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Multi-language
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Navigation className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">All Transfers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Package Information
            </h2>
            <div className="space-y-4">
              {pkg.category && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Tag className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Package Type
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {pkg.category}
                    </div>
                  </div>
                </div>
              )}

              {pkg.destination && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Destination
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {pkg.destination}
                    </div>
                  </div>
                </div>
              )}

              {pkg.duration && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Duration
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {pkg.duration}
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

          {/* Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Overview</h2>
            {pkg.details ? (
              <div className="text-gray-700 leading-relaxed">
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: pkg.details }}
                />
              </div>
            ) : (
              <div className="flex items-start gap-3 text-gray-500 bg-gray-50 p-3 rounded-lg">
                <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  No additional details were provided for this holiday package.
                </p>
              </div>
            )}
          </div>

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
                      const count = staticReviews.counts[star] || 0;
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
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 mb-6 py-10">
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
                    Get confirmation instantly
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {TITLE}
            </h1>

            {/* Icon Features Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 text-xs">Flexible Dates</span>
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
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-gray-700 text-xs">
                    Free Cancellation
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 text-xs">Multi-language</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Navigation className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 text-xs">All Transfers</span>
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
                  onClick={openEnquiry}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Enquire Now</span>
                </button>
              </div>
            </div>
          </header>

          {/* Package Details */}
          <SectionCard id="details" title="Package Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pkg.category && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Tag className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Package Type
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {pkg.category}
                    </div>
                  </div>
                </div>
              )}

              {pkg.destination && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Destination
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {pkg.destination}
                    </div>
                  </div>
                </div>
              )}

              {pkg.duration && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Duration
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {pkg.duration}
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

          {/* Overview */}
          <SectionCard id="overview" title="Overview">
            {pkg.details ? (
              <div
                className="prose prose-gray prose-sm max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: pkg.details }}
              />
            ) : (
              <div className="flex items-start gap-3 text-gray-500 bg-gray-50 p-4 rounded-lg">
                <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  No additional details were provided for this holiday package.
                </p>
              </div>
            )}
          </SectionCard>

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
                      const count = staticReviews.counts[star] || 0;
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

              {/* View All Reviews Button */}
              <div className="text-center pt-4">
                {/* <button className="px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-lg font-medium hover:bg-orange-50 transition-colors">
                  View All {staticReviews.total} Reviews
                </button> */}
              </div>
            </div>
          </SectionCard>

          {/* Trust Badges */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    Get confirmation instantly
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
              onClick={openEnquiry}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Enquire Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      {showEnquiry && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeEnquiry}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <h3 className="text-lg font-semibold text-gray-900">
                Enquiry Form
              </h3>
              <button
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                onClick={closeEnquiry}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <EnquiryNow pkg={pkg} />
            </div>
          </div>
        </div>
      )}

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
                Please login to submit a holiday enquiry and access exclusive
                deals.
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
