// import axios from "axios";
// import {
//   Calendar,
//   CheckCircle,
//   ChevronLeft,
//   ChevronRight,
//   Clock,
//   DollarSign,
//   ExternalLink,
//   FileText,
//   Globe,
//   Info,
//   MapPin,
//   Navigation,
//   Phone,
//   Play,
//   ShieldCheck,
//   Smartphone,
//   Star,
//   Tag,
//   X,
// } from "lucide-react";
// import { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { useCurrency } from "../../contexts/CurrencyContext";

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

// export default function ActivityDetail() {
//   const API_BASE = import.meta.env.VITE_API_URL;
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [activity, setActivity] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

//   const { convertAndFormat } = useCurrency();

//   useEffect(() => {
//     let mounted = true;
//     setLoading(true);
//     axios
//       .get(`${API_BASE}/api/activities/${id}`)
//       .then((res) => {
//         if (!mounted) return;
//         setActivity(res.data || null);
//       })
//       .catch((err) => {
//         if (!mounted) return;
//         setError(
//           err?.response?.data?.error ||
//             err?.message ||
//             "Failed to load activity"
//         );
//       })
//       .finally(() => mounted && setLoading(false));
//     return () => {
//       mounted = false;
//     };
//   }, [API_BASE, id]);

//   const videoLinks = useMemo(() => {
//     if (!activity?.video_links) return [];
//     try {
//       const parsed =
//         typeof activity.video_links === "string"
//           ? JSON.parse(activity.video_links)
//           : activity.video_links;
//       return Array.isArray(parsed)
//         ? parsed.filter((link) => link && link.trim())
//         : [];
//     } catch {
//       return [];
//     }
//   }, [activity]);

//   const images = useMemo(() => {
//     if (!activity) return [];
//     let imageArray = [];
//     if (activity.images) {
//       try {
//         const parsed =
//           typeof activity.images === "string"
//             ? JSON.parse(activity.images)
//             : activity.images;
//         if (Array.isArray(parsed)) {
//           imageArray = parsed.filter((img) => img);
//         }
//       } catch (e) {
//         console.log("Failed to parse images field:", e);
//       }
//     }
//     if (imageArray.length === 0 && activity.image) {
//       imageArray = [activity.image];
//     }
//     return imageArray;
//   }, [activity]);

//   function getVideoEmbed(link) {
//     if (!link || typeof link !== "string") return null;
//     const url = link.trim();
//     if (url.includes("youtube.com") || url.includes("youtu.be")) {
//       let vid = "";
//       try {
//         if (url.includes("youtu.be/")) {
//           vid = url.split("youtu.be/")[1].split(/[?&#]/)[0];
//         } else if (url.includes("watch?v=")) {
//           const u = new URL(url);
//           vid = u.searchParams.get("v") || "";
//         } else if (url.includes("/shorts/")) {
//           vid = url.split("/shorts/")[1].split(/[?&#]/)[0];
//         }
//       } catch (e) {
//         void e;
//       }
//       if (vid) {
//         return {
//           type: "youtube",
//           src: `https://www.youtube.com/embed/${vid}?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1`,
//         };
//       }
//     }
//     if (url.includes("vimeo.com")) {
//       let vid = "";
//       try {
//         const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
//         if (m && m[1]) vid = m[1];
//       } catch (e) {
//         void e;
//       }
//       if (vid) {
//         return {
//           type: "vimeo",
//           src: `https://player.vimeo.com/video/${vid}?autoplay=1&muted=1&playsinline=1`,
//         };
//       }
//     }
//     if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
//       return { type: "direct", src: url };
//     }
//     return null;
//   }

//   function resolveImageUrl(img) {
//     if (!img) return null;
//     try {
//       if (typeof img === "string" && img.startsWith("http")) return img;
//       if (typeof img === "string" && img.startsWith("/"))
//         return `${API_BASE}${img}`;
//       if (typeof img === "string" && img.includes("uploads/activities")) {
//         return img.startsWith("http")
//           ? img
//           : `${API_BASE}/${img.replace(/^\/+/, "")}`;
//       }
//       return `${API_BASE}/uploads/activities/${img}`;
//     } catch (err) {
//       console.error("Error resolving image URL:", err);
//       return null;
//     }
//   }

//   const getGoogleMapsEmbedUrl = (url) => {
//     if (!url) return null;
//     try {
//       if (url.includes("/embed?")) return url;
//       if (url.includes("google.com/maps/place/")) {
//         const placeIdMatch = url.match(/place\/([^/]+)\/([^/?]+)/);
//         if (placeIdMatch) {
//           const placeId = placeIdMatch[2];
//           return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=place_id:${placeId}`;
//         }
//       }
//       if (url.includes("google.com/maps?q=")) {
//         const urlObj = new URL(url);
//         const query = urlObj.searchParams.get("q");
//         if (query) {
//           return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
//             query
//           )}`;
//         }
//       }
//       if (url.includes("goo.gl/maps/") || url.includes("maps.app.goo.gl/")) {
//         return `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=25.276987,55.296249&zoom=15`;
//       }
//       const coordMatch = url.match(/@([-\d.]+),([-\d.]+)/);
//       if (coordMatch) {
//         const lat = coordMatch[1];
//         const lng = coordMatch[2];
//         return `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${lat},${lng}&zoom=15`;
//       }
//       return `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=25.276987,55.296249&zoom=15`;
//     } catch (error) {
//       console.error("Error parsing Google Maps URL:", error);
//       return `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=25.276987,55.296249&zoom=15`;
//     }
//   };

//   const isGoogleMapsEmbeddable = (url) => {
//     if (!url) return false;
//     return (
//       url.includes("google.com/maps") ||
//       url.includes("goo.gl/maps") ||
//       url.includes("maps.app.goo.gl")
//     );
//   };

//   const allMedia = useMemo(() => {
//     const media = [];
//     images.forEach((img, index) => {
//       const url = resolveImageUrl(img);
//       if (url) {
//         media.push({
//           type: "image",
//           url,
//           index,
//           id: `img-${index}`,
//         });
//       }
//     });
//     videoLinks.forEach((videoLink, index) => {
//       const embed = getVideoEmbed(videoLink);
//       if (embed) {
//         media.push({
//           type: "video",
//           embed,
//           index,
//           id: `vid-${index}`,
//         });
//       }
//     });
//     return media;
//   }, [images, videoLinks, API_BASE]);

//   const currentMedia = allMedia[currentMediaIndex];

//   const handleNextMedia = () => {
//     if (allMedia.length === 0) return;
//     setCurrentMediaIndex((prev) =>
//       prev === allMedia.length - 1 ? 0 : prev + 1
//     );
//   };

//   const handlePrevMedia = () => {
//     if (allMedia.length === 0) return;
//     setCurrentMediaIndex((prev) =>
//       prev === 0 ? allMedia.length - 1 : prev - 1
//     );
//   };

//   const renderHeroMedia = () => {
//     if (allMedia.length === 0) {
//       return (
//         <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
//           <div className="text-center text-gray-500">
//             <Tag className="w-16 h-16 mx-auto mb-2 opacity-50" />
//             <p>No media available</p>
//           </div>
//         </div>
//       );
//     }

//     if (!currentMedia) {
//       const firstImage = allMedia.find((media) => media.type === "image");
//       if (firstImage) {
//         return (
//           <img
//             src={firstImage.url}
//             alt="Activity"
//             className="w-full h-full object-cover"
//           />
//         );
//       }
//       return null;
//     }

//     if (currentMedia.type === "image") {
//       return (
//         <img
//           src={currentMedia.url}
//           alt="Activity"
//           className="w-full h-full object-cover"
//         />
//       );
//     }

//     if (currentMedia.type === "video") {
//       return (
//         <iframe
//           src={currentMedia.embed.src}
//           className="w-full h-full"
//           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//           allowFullScreen
//           title="Activity video"
//         />
//       );
//     }

//     return null;
//   };

//   const title = activity?.title || "Activity";
//   const PRICE = Number(activity?.price || 0);
//   const priceStr = convertAndFormat(PRICE);

//   const staticReviews = {
//     avg: 5.0,
//     total: 277,
//     counts: { 5: 255, 4: 6, 3: 0, 2: 0, 1: 0 },
//     items: [
//       {
//         avatar:
//           "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
//         name: "Russ D",
//         date: "October 2023",
//         title: "Ideal For Adventure Seekers",
//         comment:
//           "This water park is ideal for adventure seekers. The Poseidon's Revenge is adrenaline-pumping, and Aquaconda, Zoomerango and Slitherine are loads of fun. You can also explore the Lost Chambers Aquarium and swim with sharks.",
//         rating: 5,
//       },
//       {
//         avatar:
//           "https://images.unsplash.com/photo-1531123414780-f0b7f7a1b3f9?q=80&w=200&auto=format&fit=crop",
//         name: "Ralph Wilhelm",
//         date: "October 2023",
//         title: "Mind-Blowing Rides & Attractions",
//         comment:
//           "Atlantis Aquaventure Waterpark offers a variety of mind-blowing rides and attractions. It was thrilling to engage in the heart-racing water coasters. The relaxing lazy river was fun.",
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
//             <p className="text-gray-600">Loading activity details...</p>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   if (error || !activity) {
//     return (
//       <main className="min-h-screen bg-gray-50">
//         <div className="max-w-6xl mx-auto px-4 py-8">
//           <div className="text-center py-20">
//             <div className="text-4xl mb-4">⚠️</div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">
//               Unable to Load Activity
//             </h2>
//             <p className="text-gray-600 mb-6">
//               {error || "The requested activity was not found."}
//             </p>
//             <div className="flex gap-3 justify-center flex-wrap">
//               <button
//                 onClick={() => navigate(-1)}
//                 className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 Go Back
//               </button>
//               <button
//                 onClick={() => navigate("/activities")}
//                 className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
//               >
//                 Browse Activities
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   return (
//     // <main className="min-h-screen bg-gray-50" style={{ "--brand": BRAND }}>
//     //   <div className="max-w-6xl mx-auto px-4 py-6">
//     //     {/* Breadcrumb */}
//     //     <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
//     //       <a href="/" className="hover:text-orange-500 transition-colors">
//     //         Home
//     //       </a>
//     //       <span>/</span>
//     //       <a
//     //         href="/activities"
//     //         className="hover:text-orange-500 transition-colors"
//     //       >
//     //         Activities
//     //       </a>
//     //       <span>/</span>
//     //       <span className="text-gray-900 font-medium line-clamp-1">
//     //         {title}
//     //       </span>
//     //     </nav>

//     //     {/* Hero Section */}
//     //     <section className="mb-6">
//     //       <div className="relative rounded-2xl overflow-hidden shadow-lg h-72 md:h-96 lg:h-[500px]">
//     //         {renderHeroMedia()}
//     //         <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />

//     //         {activity.category && (
//     //           <div className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-lg">
//     //             <Tag className="w-4 h-4" />
//     //             <span>{activity.category}</span>
//     //           </div>
//     //         )}

//     //         {currentMedia && allMedia.length > 1 && (
//     //           <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-xs font-medium">
//     //             {currentMedia.type === "image" ? "📷" : "🎥"}{" "}
//     //             {currentMediaIndex + 1}/{allMedia.length}
//     //           </div>
//     //         )}

//     //         {allMedia.length > 1 && (
//     //           <>
//     //             <button
//     //               aria-label="previous"
//     //               className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all hover:scale-110"
//     //               onClick={handlePrevMedia}
//     //             >
//     //               <ChevronLeft className="w-5 h-5 text-gray-700" />
//     //             </button>
//     //             <button
//     //               aria-label="next"
//     //               className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all hover:scale-110"
//     //               onClick={handleNextMedia}
//     //             >
//     //               <ChevronRight className="w-5 h-5 text-gray-700" />
//     //             </button>
//     //           </>
//     //         )}
//     //       </div>

//     //       {allMedia.length > 1 && (
//     //         <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
//     //           {allMedia.map((media, index) => (
//     //             <button
//     //               key={media.id}
//     //               className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
//     //                 index === currentMediaIndex
//     //                   ? "border-orange-500 ring-2 ring-orange-200 scale-105"
//     //                   : "border-gray-200 hover:border-gray-300"
//     //               }`}
//     //               onClick={() => setCurrentMediaIndex(index)}
//     //             >
//     //               {media.type === "image" ? (
//     //                 <img
//     //                   src={media.url}
//     //                   alt={`Thumbnail ${index + 1}`}
//     //                   className="w-full h-full object-cover"
//     //                 />
//     //               ) : (
//     //                 <div className="w-full h-full bg-gray-800 flex items-center justify-center">
//     //                   <Play className="w-6 h-6 text-white" />
//     //                 </div>
//     //               )}
//     //             </button>
//     //           ))}
//     //         </div>
//     //       )}
//     //     </section>

//     //     {/* Title & Quick Info Bar */}
//     //     <header className="mb-6">
//     //       <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
//     //         {title}
//     //       </h1>

//     //       {/* Icon Features Bar - Matching Image Style */}
//     //       <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
//     //         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
//     //           <div className="flex items-center gap-2 text-sm">
//     //             <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//     //               <Clock className="w-4 h-4 text-blue-600" />
//     //             </div>
//     //             <span className="text-gray-700 text-xs">Operating Hours</span>
//     //           </div>
//     //           <div className="flex items-center gap-2 text-sm">
//     //             <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//     //               <CheckCircle className="w-4 h-4 text-blue-600" />
//     //             </div>
//     //             <span className="text-gray-700 text-xs">
//     //               Instant Confirmation
//     //             </span>
//     //           </div>
//     //           <div className="flex items-center gap-2 text-sm">
//     //             <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//     //               <Smartphone className="w-4 h-4 text-blue-600" />
//     //             </div>
//     //             <span className="text-gray-700 text-xs">Mobile Voucher</span>
//     //           </div>
//     //           <div className="flex items-center gap-2 text-sm">
//     //             <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
//     //               <FileText className="w-4 h-4 text-red-600" />
//     //             </div>
//     //             <span className="text-gray-700 text-xs">Non Refundable</span>
//     //           </div>
//     //           <div className="flex items-center gap-2 text-sm">
//     //             <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//     //               <Globe className="w-4 h-4 text-blue-600" />
//     //             </div>
//     //             <span className="text-gray-700 text-xs">English / Arabic</span>
//     //           </div>
//     //           <div className="flex items-center gap-2 text-sm">
//     //             <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//     //               <Navigation className="w-4 h-4 text-blue-600" />
//     //             </div>
//     //             <span className="text-gray-700 text-xs">Transfer options</span>
//     //           </div>
//     //         </div>
//     //       </div>

//     //       {/* Rating & Price Section */}
//     //       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
//     //         <div className="flex items-center gap-4">
//     //           <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
//     //             <div className="flex items-center gap-1">
//     //               {[...Array(5)].map((_, i) => (
//     //                 <Star
//     //                   key={i}
//     //                   className="w-4 h-4 fill-current text-green-600"
//     //                   fill="currentColor"
//     //                 />
//     //               ))}
//     //             </div>
//     //             <span className="text-green-700 font-semibold">
//     //               {staticReviews.avg.toFixed(1)}
//     //             </span>
//     //           </div>
//     //           <div className="text-sm text-gray-600">
//     //             <span className="font-medium">{staticReviews.total}</span>{" "}
//     //             Reviews
//     //           </div>
//     //         </div>

//     //         <div className="flex items-center gap-4">
//     //           <div className="text-right">
//     //             <div className="text-xs text-gray-500">Starting from</div>
//     //             <div className="text-2xl font-bold text-orange-600">
//     //               {priceStr}
//     //             </div>
//     //             <div className="text-xs text-gray-500">per person</div>
//     //           </div>
//     //           <button
//     //             onClick={() => {
//     //               let logged = false;
//     //               try {
//     //                 const u = localStorage.getItem("user");
//     //                 const t = localStorage.getItem("token");
//     //                 logged = !!u || !!t;
//     //               } catch {
//     //                 /* ignore */
//     //               }
//     //               if (!logged) {
//     //                 setShowAuthModal(true);
//     //                 return;
//     //               }
//     //               navigate(`/activities/${id}/book`);
//     //             }}
//     //             className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
//     //           >
//     //             <Calendar className="w-5 h-5" />
//     //             <span>Book Now</span>
//     //           </button>
//     //         </div>
//     //       </div>
//     //     </header>

//     //     {/* Overview Section */}
//     //     <SectionCard id="overview" title="Overview">
//     //       {activity.details ? (
//     //         <div
//     //           className="prose prose-gray prose-sm max-w-none text-gray-700 leading-relaxed"
//     //           dangerouslySetInnerHTML={{ __html: activity.details }}
//     //         />
//     //       ) : (
//     //         <div className="flex items-start gap-3 text-gray-500 bg-gray-50 p-4 rounded-lg">
//     //           <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
//     //           <p className="text-sm">
//     //             No additional details were provided for this activity.
//     //           </p>
//     //         </div>
//     //       )}
//     //     </SectionCard>

//     //     {/* Activity Details */}
//     //     <SectionCard id="details" title="Activity Information">
//     //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//     //         {activity.category && (
//     //           <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
//     //             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
//     //               <Tag className="w-5 h-5 text-orange-500" />
//     //             </div>
//     //             <div>
//     //               <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
//     //                 Activity Type
//     //               </div>
//     //               <div className="text-gray-900 font-semibold">
//     //                 {activity.category}
//     //               </div>
//     //             </div>
//     //           </div>
//     //         )}

//     //         {activity.location_name && (
//     //           <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
//     //             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
//     //               <MapPin className="w-5 h-5 text-blue-500" />
//     //             </div>
//     //             <div>
//     //               <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
//     //                 Location
//     //               </div>
//     //               <div className="text-gray-900 font-semibold">
//     //                 {activity.location_name}
//     //               </div>
//     //             </div>
//     //           </div>
//     //         )}

//     //         {activity.duration && (
//     //           <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
//     //             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
//     //               <Clock className="w-5 h-5 text-purple-500" />
//     //             </div>
//     //             <div>
//     //               <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
//     //                 Duration
//     //               </div>
//     //               <div className="text-gray-900 font-semibold">
//     //                 {activity.duration}
//     //               </div>
//     //             </div>
//     //           </div>
//     //         )}

//     //         {PRICE > 0 && (
//     //           <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
//     //             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
//     //               <DollarSign className="w-5 h-5 text-green-500" />
//     //             </div>
//     //             <div>
//     //               <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
//     //                 Starting Price
//     //               </div>
//     //               <div className="text-gray-900 font-semibold">{priceStr}</div>
//     //             </div>
//     //           </div>
//     //         )}
//     //       </div>
//     //     </SectionCard>

//     //     {/* Operating Hours */}
//     //     <SectionCard id="hours" title="Operating Hours">
//     //       <div className="space-y-4">
//     //         <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
//     //           <div className="flex items-center gap-3">
//     //             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
//     //               <Clock className="w-5 h-5 text-blue-500" />
//     //             </div>
//     //             <div>
//     //               <div className="font-semibold text-gray-900">
//     //                 Monday - Sunday
//     //               </div>
//     //               <div className="text-sm text-gray-600">Open 24 hours</div>
//     //             </div>
//     //           </div>
//     //           <div className="text-right">
//     //             <div className="font-semibold text-green-600 flex items-center gap-1">
//     //               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//     //               Open Now
//     //             </div>
//     //             <div className="text-xs text-gray-500">Closes at 11:59 PM</div>
//     //           </div>
//     //         </div>
//     //         <div className="text-sm text-blue-700 bg-blue-50 p-3 rounded-lg flex items-start gap-2 border border-blue-200">
//     //           <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
//     //           <span>Last admission is 1 hour before closing time</span>
//     //         </div>
//     //       </div>
//     //     </SectionCard>

//     //     {/* Location */}
//     //     {activity.location_link && (
//     //       <SectionCard id="location" title="Location & Directions">
//     //         <div className="space-y-4">
//     //           {isGoogleMapsEmbeddable(activity.location_link) ? (
//     //             <div className="w-full h-96 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
//     //               <iframe
//     //                 title="location-map"
//     //                 src={getGoogleMapsEmbedUrl(activity.location_link)}
//     //                 className="w-full h-full"
//     //                 loading="lazy"
//     //                 allowFullScreen
//     //                 referrerPolicy="no-referrer-when-downgrade"
//     //                 style={{ border: 0 }}
//     //               />
//     //             </div>
//     //           ) : (
//     //             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
//     //               <div className="flex items-center gap-3">
//     //                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
//     //                   <MapPin className="w-5 h-5 text-blue-500" />
//     //                 </div>
//     //                 <span className="text-gray-900 font-medium">
//     //                   {activity.location_name || "Activity Location"}
//     //                 </span>
//     //               </div>
//     //               <a
//     //                 href={activity.location_link}
//     //                 target="_blank"
//     //                 rel="noreferrer"
//     //                 className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors w-fit shadow-sm"
//     //               >
//     //                 Open in Maps
//     //                 <ExternalLink className="w-4 h-4" />
//     //               </a>
//     //             </div>
//     //           )}

//     //           {activity.location_name && (
//     //             <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
//     //               <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
//     //                 <MapPin className="w-4 h-4 text-blue-500" />
//     //               </div>
//     //               <div>
//     //                 <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
//     //                   Address
//     //                 </div>
//     //                 <div className="text-gray-900 font-medium">
//     //                   {activity.location_name}
//     //                 </div>
//     //               </div>
//     //             </div>
//     //           )}
//     //         </div>
//     //       </SectionCard>
//     //     )}

//     //     {/* Reviews Section */}
//     //     <SectionCard id="reviews" title="Customer Reviews">
//     //       <div className="space-y-6">
//     //         {/* Rating Summary */}
//     //         <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
//     //           <div className="flex flex-col md:flex-row gap-6 items-center">
//     //             <div className="text-center md:text-left">
//     //               <div className="text-5xl font-bold text-gray-900 mb-2">
//     //                 {staticReviews.avg.toFixed(1)}
//     //               </div>
//     //               <div className="flex items-center gap-1 mb-2 justify-center md:justify-start">
//     //                 {[...Array(5)].map((_, i) => (
//     //                   <Star
//     //                     key={i}
//     //                     className="w-5 h-5 fill-current text-green-600"
//     //                     fill="currentColor"
//     //                   />
//     //                 ))}
//     //               </div>
//     //               <div className="text-sm text-gray-600">
//     //                 Based on {staticReviews.total} reviews
//     //               </div>
//     //             </div>

//     //             <div className="flex-1 w-full space-y-2">
//     //               {[5, 4, 3, 2, 1].map((star) => {
//     //                 const count = staticReviews.counts[star];
//     //                 const percentage = (count / staticReviews.total) * 100;
//     //                 return (
//     //                   <div
//     //                     key={star}
//     //                     className="flex items-center gap-3 text-sm"
//     //                   >
//     //                     <div className="flex items-center gap-1 w-16">
//     //                       <span className="text-gray-700 font-medium">
//     //                         {star}
//     //                       </span>
//     //                       <Star className="w-3 h-3 fill-current text-gray-400" />
//     //                     </div>
//     //                     <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
//     //                       <div
//     //                         className="h-full bg-green-500 rounded-full transition-all"
//     //                         style={{ width: `${percentage}%` }}
//     //                       />
//     //                     </div>
//     //                     <span className="text-gray-600 w-12 text-right">
//     //                       {count}
//     //                     </span>
//     //                   </div>
//     //                 );
//     //               })}
//     //             </div>
//     //           </div>
//     //         </div>

//     //         {/* Individual Reviews */}
//     //         <div className="space-y-4">
//     //           {staticReviews.items.map((review, idx) => (
//     //             <div
//     //               key={idx}
//     //               className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
//     //             >
//     //               <div className="flex items-start gap-4">
//     //                 <img
//     //                   src={review.avatar}
//     //                   alt={review.name}
//     //                   className="w-12 h-12 rounded-full object-cover flex-shrink-0"
//     //                 />
//     //                 <div className="flex-1">
//     //                   <div className="flex items-center justify-between mb-2">
//     //                     <div>
//     //                       <div className="font-semibold text-gray-900">
//     //                         {review.name}
//     //                       </div>
//     //                       <div className="text-xs text-gray-500">
//     //                         {review.date}
//     //                       </div>
//     //                     </div>
//     //                     <div className="flex items-center gap-1">
//     //                       {[...Array(review.rating)].map((_, i) => (
//     //                         <Star
//     //                           key={i}
//     //                           className="w-4 h-4 fill-current text-yellow-500"
//     //                           fill="currentColor"
//     //                         />
//     //                       ))}
//     //                     </div>
//     //                   </div>
//     //                   <h4 className="font-semibold text-gray-900 mb-2">
//     //                     {review.title}
//     //                   </h4>
//     //                   <p className="text-sm text-gray-700 leading-relaxed">
//     //                     {review.comment}
//     //                   </p>
//     //                 </div>
//     //               </div>
//     //             </div>
//     //           ))}
//     //         </div>

//     //         {/* View All Reviews Button */}
//     //         {/* <div className="text-center pt-4">
//     //           <button className="px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-lg font-medium hover:bg-orange-50 transition-colors">
//     //             View All {staticReviews.total} Reviews
//     //           </button>
//     //         </div> */}
//     //       </div>
//     //     </SectionCard>

//     //     {/* Trust Badges */}
//     //     <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 mb-6">
//     //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//     //         <div className="flex items-center gap-4">
//     //           <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
//     //             <ShieldCheck className="w-6 h-6 text-green-500" />
//     //           </div>
//     //           <div>
//     //             <div className="font-semibold text-gray-900">
//     //               Secure Booking
//     //             </div>
//     //             <div className="text-sm text-gray-600">
//     //               SSL encrypted payments
//     //             </div>
//     //           </div>
//     //         </div>
//     //         <div className="flex items-center gap-4">
//     //           <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
//     //             <CheckCircle className="w-6 h-6 text-blue-500" />
//     //           </div>
//     //           <div>
//     //             <div className="font-semibold text-gray-900">
//     //               Instant Confirmation
//     //             </div>
//     //             <div className="text-sm text-gray-600">
//     //               Get tickets instantly
//     //             </div>
//     //           </div>
//     //         </div>
//     //         <div className="flex items-center gap-4">
//     //           <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
//     //             <Phone className="w-6 h-6 text-blue-500" />
//     //           </div>
//     //           <div>
//     //             <div className="font-semibold text-gray-900">24/7 Support</div>
//     //             <div className="text-sm text-gray-600">We're here to help</div>
//     //           </div>
//     //         </div>
//     //       </div>
//     //     </div>

//     //     {/* Sticky Bottom CTA - Mobile */}
//     //     <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg lg:hidden z-40">
//     //       <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto">
//     //         <div>
//     //           <div className="text-xs text-gray-500">From</div>
//     //           <div className="text-xl font-bold text-orange-600">
//     //             {priceStr}
//     //           </div>
//     //         </div>
//     //         <button
//     //           onClick={() => {
//     //             let logged = false;
//     //             try {
//     //               const u = localStorage.getItem("user");
//     //               const t = localStorage.getItem("token");
//     //               logged = !!u || !!t;
//     //             } catch {
//     //               /* ignore */
//     //             }
//     //             if (!logged) {
//     //               setShowAuthModal(true);
//     //               return;
//     //             }
//     //             navigate(`/activities/${id}/book`);
//     //           }}
//     //           className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
//     //         >
//     //           <Calendar className="w-5 h-5" />
//     //           <span>Book Now</span>
//     //         </button>
//     //       </div>
//     //     </div>
//     //   </div>

//     //   {/* Auth Required Modal */}
//     //   {showAuthModal && (
//     //     <div
//     //       className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//     //       onClick={() => setShowAuthModal(false)}
//     //     >
//     //       <div
//     //         className="bg-white rounded-2xl shadow-xl w-full max-w-md"
//     //         onClick={(e) => e.stopPropagation()}
//     //       >
//     //         <div className="p-6">
//     //           <div className="flex items-center justify-between mb-4">
//     //             <div className="flex items-center gap-3">
//     //               <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
//     //                 <ShieldCheck className="w-6 h-6 text-green-500" />
//     //               </div>
//     //               <h3 className="text-lg font-semibold text-gray-900">
//     //                 Login Required
//     //               </h3>
//     //             </div>
//     //             <button
//     //               onClick={() => setShowAuthModal(false)}
//     //               className="text-gray-400 hover:text-gray-600 transition-colors"
//     //             >
//     //               <X className="w-5 h-5" />
//     //             </button>
//     //           </div>
//     //           <p className="text-gray-600 mb-6">
//     //             Please login to book this activity and access exclusive deals.
//     //           </p>
//     //           <div className="flex gap-3">
//     //             <button
//     //               className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
//     //               onClick={() => setShowAuthModal(false)}
//     //             >
//     //               Cancel
//     //             </button>
//     //             <button
//     //               className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
//     //               onClick={() =>
//     //                 navigate("/login", { state: { from: location.pathname } })
//     //               }
//     //             >
//     //               Login Now
//     //             </button>
//     //           </div>
//     //         </div>
//     //       </div>
//     //     </div>
//     //   )}
//     // </main>
//     <main className="min-h-screen bg-gray-50" style={{ "--brand": BRAND }}>
//       <div className="max-w-6xl mx-auto px-4 py-6">
//         {/* Breadcrumb - Hidden on mobile as per image */}
//         <nav className="hidden md:flex items-center gap-2 text-sm text-gray-500 mb-6">
//           <a href="/" className="hover:text-orange-500 transition-colors">
//             Home
//           </a>
//           <span>/</span>
//           <a
//             href="/activities"
//             className="hover:text-orange-500 transition-colors"
//           >
//             Activities
//           </a>
//           <span>/</span>
//           <span className="text-gray-900 font-medium line-clamp-1">
//             {title}
//           </span>
//         </nav>

//         {/* Hero Section - Simplified for mobile */}
//         <section className="mb-6">
//           <div className="relative rounded-2xl overflow-hidden shadow-lg h-64">
//             {renderHeroMedia()}
//           </div>
//         </section>

//         {/* Main Content - Mobile Optimized */}
//         <div className="md:hidden">
//           {/* Title and Price Section */}
//           <div className="mb-6">
//             <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
//             <div className="flex items-center justify-between">
//               <div className="text-2xl font-bold text-orange-600">
//                 {priceStr}
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="flex items-center gap-1">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       className="w-4 h-4 fill-current text-green-600"
//                       fill="currentColor"
//                     />
//                   ))}
//                 </div>
//                 <span className="text-sm text-gray-600">
//                   {staticReviews.total} Reviews
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Book Now Button - Full width */}
//           <button
//             onClick={() => {
//               let logged = false;
//               try {
//                 const u = localStorage.getItem("user");
//                 const t = localStorage.getItem("token");
//                 logged = !!u || !!t;
//               } catch {
//                 /* ignore */
//               }
//               if (!logged) {
//                 setShowAuthModal(true);
//                 return;
//               }
//               navigate(`/activities/${id}/book`);
//             }}
//             className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-lg mb-6 flex items-center justify-center gap-2 transition-colors shadow-lg"
//           >
//             <Calendar className="w-6 h-6" />
//             <span>Book Now</span>
//           </button>

//           {/* Features List - Simple vertical layout */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
//             <div className="space-y-4">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//                   <Clock className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <div className="font-medium text-gray-900">
//                     Operating Hours
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     Approx 9:15 am To 6 pm
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//                   <CheckCircle className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <div className="font-medium text-gray-900">
//                     Instant Confirmation
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     Instant Tour Confirmation will be Provided
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//                   <Smartphone className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <div className="font-medium text-gray-900">
//                     Mobile Voucher Accepted
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     Use your phone or print your voucher
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
//                   <FileText className="w-5 h-5 text-red-600" />
//                 </div>
//                 <div>
//                   <div className="font-medium text-gray-900">
//                     Non Refundable
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//                   <Globe className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <div className="font-medium text-gray-900">
//                     English / Arabic
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//                   <Navigation className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <div className="font-medium text-gray-900">
//                     Transfer Options Available
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//                   <MapPin className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <div className="font-medium text-gray-900">Google Map</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Overview Section */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
//             <h2 className="text-lg font-bold text-gray-900 mb-3">Overview</h2>
//             {activity.details ? (
//               <div className="text-gray-700 leading-relaxed">
//                 <div
//                   className="prose prose-sm max-w-none"
//                   dangerouslySetInnerHTML={{
//                     __html:
//                       activity.details.length > 150
//                         ? activity.details.substring(0, 150) + "..."
//                         : activity.details,
//                   }}
//                 />
//                 {activity.details.length > 150 && (
//                   <button className="text-orange-500 font-medium mt-2">
//                     Read More
//                   </button>
//                 )}
//               </div>
//             ) : (
//               <div className="flex items-start gap-3 text-gray-500 bg-gray-50 p-3 rounded-lg">
//                 <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
//                 <p className="text-sm">
//                   No additional details were provided for this activity.
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Highlights Section */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
//             <h2 className="text-lg font-bold text-gray-900 mb-3">Highlights</h2>
//             <ul className="space-y-2 text-gray-700">
//               <li className="flex items-start gap-2">
//                 <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
//                 <span>It's one of the region's largest water parks.</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
//                 <span>
//                   It's a part of the impressive ever Atlantis, The Palm Hotel,
//                   located on the crescent of the iconic palm-shaped Palm
//                   Jumeirah island.
//                 </span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
//                 <span>
//                   Apart from Aquaventure Water Park, your ticket covers access
//                   to the Lost Chambers Aquarium and...
//                 </span>
//               </li>
//             </ul>
//             <button className="text-orange-500 font-medium mt-2">
//               Read More
//             </button>
//           </div>

//           {/* Inclusions Section */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
//             <h2 className="text-lg font-bold text-gray-900 mb-3">Inclusions</h2>
//             <ul className="space-y-2 text-gray-700">
//               <li className="flex items-start gap-2">
//                 <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
//                 <span>Transfers (if option selected)</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
//                 <span>Atlantis Aquaventure Day Pass</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
//                 <span>Enjoy unlimited access to Aquaventure Water Park</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
//                 <span>Get unlimited access to Adventure Beach</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
//                 <span>Atlantis Aquaventure Super Pass</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
//                 <span>
//                   Make the most of its mix of heart-racing, milder, and
//                   kid-specific rides with Entry to the Lost Chambers Aquarium
//                 </span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
//                 <span>Lost Chamber Aquarium</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
//                 <span>See over 65000 distinct marine animals</span>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Desktop Layout - Hidden on mobile */}
//         <div className="hidden md:block">
//           {/* Your existing desktop code remains here */}
//           {/* ... rest of your existing desktop code ... */}
//         </div>

//         {/* Sticky Bottom CTA - Mobile */}
//         <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg md:hidden z-40">
//           <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto">
//             <div>
//               <div className="text-xs text-gray-500">From</div>
//               <div className="text-xl font-bold text-orange-600">
//                 {priceStr}
//               </div>
//             </div>
//             <button
//               onClick={() => {
//                 let logged = false;
//                 try {
//                   const u = localStorage.getItem("user");
//                   const t = localStorage.getItem("token");
//                   logged = !!u || !!t;
//                 } catch {
//                   /* ignore */
//                 }
//                 if (!logged) {
//                   setShowAuthModal(true);
//                   return;
//                 }
//                 navigate(`/activities/${id}/book`);
//               }}
//               className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
//             >
//               <Calendar className="w-5 h-5" />
//               <span>Book Now</span>
//             </button>
//           </div>
//         </div>
//       </div>

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
//                 Please login to book this activity and access exclusive deals.
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

import axios from "axios";
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
  Play,
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

export default function ActivityDetail() {
  const API_BASE = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const { convertAndFormat } = useCurrency();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios
      .get(`${API_BASE}/api/activities/${id}`)
      .then((res) => {
        if (!mounted) return;
        setActivity(res.data || null);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(
          err?.response?.data?.error ||
            err?.message ||
            "Failed to load activity"
        );
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [API_BASE, id]);

  const videoLinks = useMemo(() => {
    if (!activity?.video_links) return [];
    try {
      const parsed =
        typeof activity.video_links === "string"
          ? JSON.parse(activity.video_links)
          : activity.video_links;
      return Array.isArray(parsed)
        ? parsed.filter((link) => link && link.trim())
        : [];
    } catch {
      return [];
    }
  }, [activity]);

  const images = useMemo(() => {
    if (!activity) return [];
    let imageArray = [];
    if (activity.images) {
      try {
        const parsed =
          typeof activity.images === "string"
            ? JSON.parse(activity.images)
            : activity.images;
        if (Array.isArray(parsed)) {
          imageArray = parsed.filter((img) => img);
        }
      } catch (e) {
        console.log("Failed to parse images field:", e);
      }
    }
    if (imageArray.length === 0 && activity.image) {
      imageArray = [activity.image];
    }
    return imageArray;
  }, [activity]);

  function getVideoEmbed(link) {
    if (!link || typeof link !== "string") return null;
    const url = link.trim();
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let vid = "";
      try {
        if (url.includes("youtu.be/")) {
          vid = url.split("youtu.be/")[1].split(/[?&#]/)[0];
        } else if (url.includes("watch?v=")) {
          const u = new URL(url);
          vid = u.searchParams.get("v") || "";
        } else if (url.includes("/shorts/")) {
          vid = url.split("/shorts/")[1].split(/[?&#]/)[0];
        }
      } catch (e) {
        void e;
      }
      if (vid) {
        return {
          type: "youtube",
          src: `https://www.youtube.com/embed/${vid}?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1`,
        };
      }
    }
    if (url.includes("vimeo.com")) {
      let vid = "";
      try {
        const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
        if (m && m[1]) vid = m[1];
      } catch (e) {
        void e;
      }
      if (vid) {
        return {
          type: "vimeo",
          src: `https://player.vimeo.com/video/${vid}?autoplay=1&muted=1&playsinline=1`,
        };
      }
    }
    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
      return { type: "direct", src: url };
    }
    return null;
  }

  function resolveImageUrl(img) {
    if (!img) return null;
    try {
      if (typeof img === "string" && img.startsWith("http")) return img;
      if (typeof img === "string" && img.startsWith("/"))
        return `${API_BASE}${img}`;
      if (typeof img === "string" && img.includes("uploads/activities")) {
        return img.startsWith("http")
          ? img
          : `${API_BASE}/${img.replace(/^\/+/, "")}`;
      }
      return `${API_BASE}/uploads/activities/${img}`;
    } catch (err) {
      console.error("Error resolving image URL:", err);
      return null;
    }
  }

  const getGoogleMapsEmbedUrl = (url) => {
    if (!url) return null;
    try {
      if (url.includes("/embed?")) return url;
      if (url.includes("google.com/maps/place/")) {
        const placeIdMatch = url.match(/place\/([^/]+)\/([^/?]+)/);
        if (placeIdMatch) {
          const placeId = placeIdMatch[2];
          return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=place_id:${placeId}`;
        }
      }
      if (url.includes("google.com/maps?q=")) {
        const urlObj = new URL(url);
        const query = urlObj.searchParams.get("q");
        if (query) {
          return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
            query
          )}`;
        }
      }
      if (url.includes("goo.gl/maps/") || url.includes("maps.app.goo.gl/")) {
        return `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=25.276987,55.296249&zoom=15`;
      }
      const coordMatch = url.match(/@([-\d.]+),([-\d.]+)/);
      if (coordMatch) {
        const lat = coordMatch[1];
        const lng = coordMatch[2];
        return `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${lat},${lng}&zoom=15`;
      }
      return `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=25.276987,55.296249&zoom=15`;
    } catch (error) {
      console.error("Error parsing Google Maps URL:", error);
      return `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=25.276987,55.296249&zoom=15`;
    }
  };

  const isGoogleMapsEmbeddable = (url) => {
    if (!url) return false;
    return (
      url.includes("google.com/maps") ||
      url.includes("goo.gl/maps") ||
      url.includes("maps.app.goo.gl")
    );
  };

  const allMedia = useMemo(() => {
    const media = [];
    images.forEach((img, index) => {
      const url = resolveImageUrl(img);
      if (url) {
        media.push({
          type: "image",
          url,
          index,
          id: `img-${index}`,
        });
      }
    });
    videoLinks.forEach((videoLink, index) => {
      const embed = getVideoEmbed(videoLink);
      if (embed) {
        media.push({
          type: "video",
          embed,
          index,
          id: `vid-${index}`,
        });
      }
    });
    return media;
  }, [images, videoLinks, API_BASE]);

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
            <p>No media available</p>
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
            alt="Activity"
            className="w-full h-full object-cover"
          />
        );
      }
      return null;
    }

    if (currentMedia.type === "image") {
      return (
        <img
          src={currentMedia.url}
          alt="Activity"
          className="w-full h-full object-cover"
        />
      );
    }

    if (currentMedia.type === "video") {
      return (
        <iframe
          src={currentMedia.embed.src}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Activity video"
        />
      );
    }

    return null;
  };

  const title = activity?.title || "Activity";
  const PRICE = Number(activity?.price || 0);
  const priceStr = convertAndFormat(PRICE);

  const staticReviews = {
    avg: 5.0,
    total: 277,
    counts: { 5: 255, 4: 6, 3: 0, 2: 0, 1: 0 },
    items: [
      {
        avatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
        name: "Russ D",
        date: "October 2023",
        title: "Ideal For Adventure Seekers",
        comment:
          "This water park is ideal for adventure seekers. The Poseidon's Revenge is adrenaline-pumping, and Aquaconda, Zoomerango and Slitherine are loads of fun. You can also explore the Lost Chambers Aquarium and swim with sharks.",
        rating: 5,
      },
      {
        avatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
        name: "Ralph Wilhelm",
        date: "October 2023",
        title: "Mind-Blowing Rides & Attractions",
        comment:
          "Atlantis Aquaventure Waterpark offers a variety of mind-blowing rides and attractions. It was thrilling to engage in the heart-racing water coasters. The relaxing lazy river was fun.",
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
            <p className="text-gray-600">Loading activity details...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !activity) {
    return (
      <main className="min-h-screen bg-gray-50  py-6 mb-10">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Unable to Load Activity
            </h2>
            <p className="text-gray-600 mb-6">
              {error || "The requested activity was not found."}
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={() => navigate("/activities")}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Browse Activities
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
        {/* Breadcrumb - Hidden on mobile as per image */}
        <nav className="hidden md:flex items-center gap-2 text-sm text-gray-500 mb-6">
          <a href="/" className="hover:text-orange-500 transition-colors">
            Home
          </a>
          <span>/</span>
          <a
            href="/activities"
            className="hover:text-orange-500 transition-colors"
          >
            Activities
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

            {/* {activity.category && (
              <div className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-lg">
                <Tag className="w-4 h-4" />
                <span>{activity.category}</span>
              </div>
            )} */}

            {currentMedia && allMedia.length > 1 && (
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                {currentMedia.type === "image" ? "📷" : "🎥"}{" "}
                {currentMediaIndex + 1}/{allMedia.length}
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
                  {media.type === "image" ? (
                    <img
                      src={media.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  )}
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
              navigate(`/activities/${id}/book`);
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
                    Operating Hours
                  </div>
                  <div className="text-sm text-gray-600">
                    {activity.operating_hours || "Approx 9:15 am To 6 pm"}
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
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Non Refundable
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
                    Transfer Options Available
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
            {activity.details ? (
              <div className="text-gray-700 leading-relaxed">
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: activity.details }}
                />
              </div>
            ) : (
              <div className="flex items-start gap-3 text-gray-500 bg-gray-50 p-3 rounded-lg">
                <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  No additional details were provided for this activity.
                </p>
              </div>
            )}
          </div>

          {/* Activity Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Activity Information
            </h2>
            <div className="space-y-4">
              {activity.category && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Tag className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Activity Type
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {activity.category}
                    </div>
                  </div>
                </div>
              )}

              {activity.location_name && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Location
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {activity.location_name}
                    </div>
                  </div>
                </div>
              )}

              {activity.duration && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Duration
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {activity.duration}
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

          {/* Operating Hours */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Operating Hours
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Monday - Sunday
                    </div>
                    <div className="text-sm text-gray-600">Open 24 hours</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Open Now
                  </div>
                  <div className="text-xs text-gray-500">
                    Closes at 11:59 PM
                  </div>
                </div>
              </div>
              <div className="text-sm text-blue-700 bg-blue-50 p-3 rounded-lg flex items-start gap-2 border border-blue-200">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Last admission is 1 hour before closing time</span>
              </div>
            </div>
          </div>

          {/* Location */}
          {activity.location_link && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Location & Directions
              </h2>
              <div className="space-y-4">
                {isGoogleMapsEmbeddable(activity.location_link) ? (
                  <div className="w-full h-64 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
                    <iframe
                      title="location-map"
                      src={getGoogleMapsEmbedUrl(activity.location_link)}
                      className="w-full h-full"
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      style={{ border: 0 }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-blue-500" />
                      </div>
                      <span className="text-gray-900 font-medium">
                        {activity.location_name || "Activity Location"}
                      </span>
                    </div>
                    <a
                      href={activity.location_link}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors w-full justify-center shadow-sm"
                    >
                      Open in Maps
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}

                {activity.location_name && (
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Address
                      </div>
                      <div className="text-gray-900 font-medium">
                        {activity.location_name}
                      </div>
                    </div>
                  </div>
                )}
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
          {/* Your existing desktop code remains here */}
          {/* Title & Quick Info Bar */}
          <header className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {title}
            </h1>

            {/* Icon Features Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 text-xs">Operating Hours</span>
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
                  <span className="text-gray-700 text-xs">Non Refundable</span>
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
                  <span className="text-gray-700 text-xs">
                    Transfer options
                  </span>
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
                    navigate(`/activities/${id}/book`);
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
            {activity.details ? (
              <div
                className="prose prose-gray prose-sm max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: activity.details }}
              />
            ) : (
              <div className="flex items-start gap-3 text-gray-500 bg-gray-50 p-4 rounded-lg">
                <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  No additional details were provided for this activity.
                </p>
              </div>
            )}
          </SectionCard>

          {/* Activity Details */}
          <SectionCard id="details" title="Activity Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activity.category && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Tag className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Activity Type
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {activity.category}
                    </div>
                  </div>
                </div>
              )}

              {activity.location_name && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Location
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {activity.location_name}
                    </div>
                  </div>
                </div>
              )}

              {activity.duration && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Duration
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {activity.duration}
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

          {/* Operating Hours */}
          <SectionCard id="hours" title="Operating Hours">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Monday - Sunday
                    </div>
                    <div className="text-sm text-gray-600">Open 24 hours</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Open Now
                  </div>
                  <div className="text-xs text-gray-500">
                    Closes at 11:59 PM
                  </div>
                </div>
              </div>
              <div className="text-sm text-blue-700 bg-blue-50 p-3 rounded-lg flex items-start gap-2 border border-blue-200">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Last admission is 1 hour before closing time</span>
              </div>
            </div>
          </SectionCard>

          {/* Location */}
          {activity.location_link && (
            <SectionCard id="location" title="Location & Directions">
              <div className="space-y-4">
                {isGoogleMapsEmbeddable(activity.location_link) ? (
                  <div className="w-full h-96 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
                    <iframe
                      title="location-map"
                      src={getGoogleMapsEmbedUrl(activity.location_link)}
                      className="w-full h-full"
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      style={{ border: 0 }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-blue-500" />
                      </div>
                      <span className="text-gray-900 font-medium">
                        {activity.location_name || "Activity Location"}
                      </span>
                    </div>
                    <a
                      href={activity.location_link}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors w-fit shadow-sm"
                    >
                      Open in Maps
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}

                {activity.location_name && (
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Address
                      </div>
                      <div className="text-gray-900 font-medium">
                        {activity.location_name}
                      </div>
                    </div>
                  </div>
                )}
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
                navigate(`/activities/${id}/book`);
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
                Please login to book this activity and access exclusive deals.
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
