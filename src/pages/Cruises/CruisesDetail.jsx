// import { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { useCurrency } from "../../contexts/CurrencyContext"; // ✅ Import context
// import EnquiryCruises from "./EnquiryCruises";

// const BRAND = "#F17232";

// function SectionCard({ id, title, children, className = "" }) {
//   return (
//     <section
//       id={id}
//       className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 ${className}`}
//     >
//       <div className="border-b border-gray-100 pb-4 mb-4">
//         <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
//       </div>
//       <div className="text-gray-700">{children}</div>
//     </section>
//   );
// }

// export default function CruisesDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const API_BASE = import.meta.env.VITE_API_URL;
//   const [pkg, setPkg] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const { convertAndFormat } = useCurrency();

//   // Enquiry modal
//   const [showEnquiry, setShowEnquiry] = useState(false);
//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const isLoggedIn = () => {
//     try {
//       const u = localStorage.getItem("user");
//       const t = localStorage.getItem("token");
//       return !!u || !!t;
//     } catch {
//       return false;
//     }
//   };

//   const openEnquiry = (e) => {
//     e?.preventDefault?.();
//     if (!isLoggedIn()) {
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

//   // Load cruise by id
//   useEffect(() => {
//     let ignore = false;
//     (async () => {
//       try {
//         setLoading(true);
//         setError("");
//         const res = await fetch(`${API_BASE}/api/cruises/${id}`);
//         const json = await res.json();
//         if (!res.ok || !json?.success)
//           throw new Error(json?.message || "Failed to load");
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

//   const hero = useMemo(
//     () => (pkg?.image ? `${API_BASE}/uploads/cruises/${pkg.image}` : undefined),
//     [pkg?.image, API_BASE]
//   );

//   const departureDates = useMemo(() => {
//     try {
//       const d =
//         typeof pkg?.departure_dates === "string"
//           ? JSON.parse(pkg.departure_dates)
//           : pkg?.departure_dates;
//       return Array.isArray(d) ? d : [];
//     } catch {
//       return [];
//     }
//   }, [pkg?.departure_dates]);

//   // Parse duration for nights/days
//   const { nights, days } = useMemo(() => {
//     const d = String(pkg?.duration || "");
//     const n = d.match(/(\d+)\s*(?:N|Night|Nights)/i)?.[1];
//     const dy = d.match(/(\d+)\s*(?:D|Day|Days)/i)?.[1];
//     return {
//       nights: n ? Number(n) : undefined,
//       days: dy ? Number(dy) : undefined,
//     };
//   }, [pkg?.duration]);

//   if (loading) {
//     return (
//       <main className="min-h-screen bg-gray-50">
//         <div className="max-w-4xl mx-auto px-4 py-8">
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
//             <p className="text-gray-600">Loading cruise details...</p>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   if (error || !pkg) {
//     return (
//       <main className="min-h-screen bg-gray-50">
//         <div className="max-w-4xl mx-auto px-4 py-8">
//           <div className="text-center py-20">
//             <div className="text-4xl mb-4">⚠️</div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">
//               Unable to Load Cruise
//             </h2>
//             <p className="text-gray-600 mb-6">
//               {error || "The requested cruise package was not found."}
//             </p>
//             <div className="flex gap-3 justify-center flex-wrap">
//               <button
//                 onClick={() => navigate(-1)}
//                 className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 Go Back
//               </button>
//               <button
//                 onClick={() => navigate("/cruises")}
//                 className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
//               >
//                 Browse Cruises
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   const PRICE = Number(pkg.price || 0);
//   // use convertAndFormat directly where needed
//   const TITLE = pkg.title;

//   return (
//     <main className="min-h-screen bg-gray-50" style={{ "--brand": BRAND }}>
//       <div className="max-w-4xl mx-auto px-4 py-6">
//         {/* Breadcrumb */}
//         <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
//           <a href="/" className="hover:text-orange-500 transition-colors">
//             Home
//           </a>
//           <span>/</span>
//           <a
//             href="/cruises"
//             className="hover:text-orange-500 transition-colors"
//           >
//             Cruises
//           </a>
//           <span>/</span>
//           <span className="text-gray-900 font-medium">{TITLE}</span>
//         </nav>

//         {/* Hero Section */}
//         <section className="mb-8">
//           <div className="relative rounded-2xl overflow-hidden shadow-lg h-80 md:h-96">
//             {hero ? (
//               <img
//                 src={hero}
//                 alt={TITLE}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center text-gray-500">
//                 <IcoShip className="w-12 h-12 mb-2" />
//                 <span>No image available</span>
//               </div>
//             )}

//             {/* Gradient Overlay */}
//             <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />

//             {/* Duration Ribbon */}
//             {(nights || days || pkg.duration) && (
//               <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
//                 <IcoCalendarRange className="w-4 h-4" />
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

//             {/* Departure Port Ribbon */}
//             {pkg.departure_port && (
//               <div className="absolute top-16 left-4 bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
//                 <IcoAnchor className="w-4 h-4" />
//                 <span>{pkg.departure_port}</span>
//               </div>
//             )}

//             {/* Floating price/CTA - Desktop */}
//             <aside className="hidden lg:block absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 w-64 border border-white/20">
//               <div className="text-center mb-4">
//                 <span className="text-xs text-gray-500 uppercase tracking-wide">
//                   Starting from
//                 </span>
//                 <div className="text-2xl font-bold text-gray-900 mt-1">
//                   {convertAndFormat(PRICE)}
//                 </div>
//                 <div className="text-xs text-gray-500 mt-1">Per Person</div>
//               </div>

//               <div className="mb-4">
//                 <button
//                   onClick={openEnquiry}
//                   className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
//                 >
//                   <IcoChat className="w-5 h-5" />
//                   <span>Enquiry Now</span>
//                 </button>
//               </div>

//               <div className="space-y-3 text-xs text-gray-600">
//                 <div className="flex items-center gap-2">
//                   <IcoShieldCheck className="w-4 h-4 text-green-500" />
//                   <span>Secure Booking</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <IcoClock className="w-4 h-4 text-blue-500" />
//                   <span>Best Deals</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <IcoSupport className="w-4 h-4 text-blue-500" />
//                   <span>24/7 Support</span>
//                 </div>
//               </div>
//             </aside>
//           </div>

//           {/* Mobile CTA */}
//           <div className="lg:hidden bg-white rounded-xl shadow-sm p-4 mt-4 border border-gray-100">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <span className="text-xs text-gray-500 block">From</span>
//                 <strong className="text-xl font-bold text-gray-900">
//                   {convertAndFormat(PRICE)}
//                 </strong>
//                 <span className="text-xs text-gray-500 block">per person</span>
//               </div>
//               <button
//                 onClick={openEnquiry}
//                 className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
//               >
//                 <IcoChat className="w-5 h-5" />
//                 <span>Enquiry Now</span>
//               </button>
//             </div>

//             <div className="flex justify-around border-t border-gray-100 pt-4">
//               <div className="flex items-center gap-2 text-xs text-gray-600">
//                 <IcoShieldCheck className="w-4 h-4 text-green-500" />
//                 <span>Secure</span>
//               </div>
//               <div className="flex items-center gap-2 text-xs text-gray-600">
//                 <IcoClock className="w-4 h-4 text-blue-500" />
//                 <span>Best Deals</span>
//               </div>
//               <div className="flex items-center gap-2 text-xs text-gray-600">
//                 <IcoSupport className="w-4 h-4 text-blue-500" />
//                 <span>Support</span>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Title + Meta */}
//         <header className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-3">{TITLE}</h1>
//           <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
//             {pkg.category && (
//               <div className="flex items-center gap-1">
//                 <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
//                 <span className="text-sm">{pkg.category}</span>
//               </div>
//             )}
//             {pkg.departure_port && (
//               <div className="flex items-center gap-1">
//                 <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
//                 <IcoMapPin className="w-4 h-4" />
//                 <span className="text-sm">{pkg.departure_port}</span>
//               </div>
//             )}
//             {(nights || days || pkg.duration) && (
//               <div className="flex items-center gap-1">
//                 <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
//                 <IcoCalendarRange className="w-4 h-4" />
//                 <span className="text-sm">{pkg.duration}</span>
//               </div>
//             )}
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {pkg.category && (
//               <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
//                 <IcoTag className="w-4 h-4" />
//                 {pkg.category}
//               </span>
//             )}
//             {pkg.departure_port && (
//               <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
//                 <IcoAnchor className="w-4 h-4" />
//                 {pkg.departure_port}
//               </span>
//             )}
//             {(nights || days || pkg.duration) && (
//               <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
//                 <IcoCalendarRange className="w-4 h-4" />
//                 {pkg.duration}
//               </span>
//             )}
//             {departureDates.length > 0 && (
//               <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
//                 <IcoCalendar className="w-4 h-4" />
//                 {departureDates.length} Departures
//               </span>
//             )}
//           </div>
//         </header>

//         {/* Cruise Details */}
//         <SectionCard
//           id="details"
//           title="Cruise Details"
//           className="cruise-details-card"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {pkg.category && (
//               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
//                 <IcoShip className="w-6 h-6 text-orange-500 mt-1" />
//                 <div>
//                   <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
//                     Cruise Type
//                   </div>
//                   <div className="text-gray-900 font-medium">
//                     {pkg.category}
//                   </div>
//                 </div>
//               </div>
//             )}
//             {pkg.departure_port && (
//               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
//                 <IcoAnchor className="w-6 h-6 text-orange-500 mt-1" />
//                 <div>
//                   <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
//                     Departure Port
//                   </div>
//                   <div className="text-gray-900 font-medium">
//                     {pkg.departure_port}
//                   </div>
//                 </div>
//               </div>
//             )}
//             {(nights || days || pkg.duration) && (
//               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
//                 <IcoCalendarRange className="w-6 h-6 text-orange-500 mt-1" />
//                 <div>
//                   <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
//                     Duration
//                   </div>
//                   <div className="text-gray-900 font-medium">
//                     {pkg.duration}
//                   </div>
//                 </div>
//               </div>
//             )}
//             {departureDates.length > 0 && (
//               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
//                 <IcoCalendar className="w-6 h-6 text-orange-500 mt-1" />
//                 <div>
//                   <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
//                     Departure Dates
//                   </div>
//                   <div className="text-gray-900 font-medium">
//                     {departureDates.length} available
//                   </div>
//                 </div>
//               </div>
//             )}
//             {pkg.cruise_line && (
//               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
//                 <IcoCompany className="w-6 h-6 text-orange-500 mt-1" />
//                 <div>
//                   <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
//                     Cruise Line
//                   </div>
//                   <div className="text-gray-900 font-medium">
//                     {pkg.cruise_line}
//                   </div>
//                 </div>
//               </div>
//             )}
//             {PRICE > 0 && (
//               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
//                 <IcoPrice className="w-6 h-6 text-orange-500 mt-1" />
//                 <div>
//                   <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
//                     Starting Price
//                   </div>
//                   <div className="text-gray-900 font-medium">
//                     {convertAndFormat(PRICE)}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </SectionCard>

//         {/* Departure Dates */}
//         {departureDates.length > 0 && (
//           <SectionCard id="departures" title="Departure Dates">
//             <div className="space-y-3">
//               {departureDates.slice(0, 5).map((date, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
//                 >
//                   <IcoCalendar className="w-5 h-5 text-orange-500" />
//                   <span className="text-gray-900 font-medium">{date}</span>
//                 </div>
//               ))}
//               {departureDates.length > 5 && (
//                 <div className="text-center py-3 text-gray-500 italic bg-gray-100 rounded-lg">
//                   +{departureDates.length - 5} more departure dates available
//                 </div>
//               )}
//             </div>
//           </SectionCard>
//         )}

//         {/* Overview */}
//         <SectionCard id="overview" title="Overview">
//           {pkg.details ? (
//             <div
//               className="prose prose-gray max-w-none"
//               dangerouslySetInnerHTML={{ __html: pkg.details }}
//             />
//           ) : (
//             <div className="flex items-center gap-3 text-gray-500">
//               <IcoInfo className="w-5 h-5" />
//               <p>
//                 No additional details were provided for this cruise package.
//               </p>
//             </div>
//           )}
//         </SectionCard>

//         {/* Enquiry Modal */}
//         {showEnquiry && (
//           <div
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//             onClick={closeEnquiry}
//           >
//             <div
//               className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   Cruise Enquiry
//                 </h3>
//                 <button
//                   className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
//                   onClick={closeEnquiry}
//                   aria-label="Close"
//                 >
//                   ×
//                 </button>
//               </div>
//               <div className="p-6">
//                 <EnquiryCruises cruise={pkg} />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Auth Required Modal */}
//         {showAuthModal && (
//           <div
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//             onClick={() => setShowAuthModal(false)}
//           >
//             <div
//               className="bg-white rounded-2xl shadow-xl w-full max-w-md"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="p-6">
//                 <div className="flex items-center gap-3 mb-4">
//                   <IcoShieldCheck className="w-6 h-6 text-green-500" />
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     Login Required
//                   </h3>
//                 </div>
//                 <p className="text-gray-600">
//                   Please login to submit a cruise enquiry and access exclusive
//                   cruise deals.
//                 </p>
//               </div>
//               <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end rounded-b-2xl">
//                 <button
//                   className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//                   onClick={() => setShowAuthModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
//                   onClick={() =>
//                     navigate("/login", { state: { from: location.pathname } })
//                   }
//                 >
//                   Login Now
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }

// // Cruise-Specific Icons
// function IcoShip({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z" />
//     </svg>
//   );
// }

// function IcoAnchor({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="20"
//       height="20"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M13 9V7.82C14.16 7.4 15 6.3 15 5c0-1.65-1.35-3-3-3S9 3.35 9 5c0 1.3.84 2.4 2 2.82V9H9c-.55 0-1 .45-1 1s.45 1 1 1h2v3.18c-1.16-.41-2-1.51-2-2.82 0-.55-.45-1-1-1s-1 .45-1 1c0 2.28 1.39 4.25 3.37 5.09C8.61 17.67 7 19.85 7 22c0 .55.45 1 1 1s1-.45 1-1c0-1.84 1.16-3.41 2.79-4.03C13.3 18.84 15 16.5 15 14c0-1.31-.84-2.41-2-2.82V11h2c.55 0 1-.45 1-1s-.45-1-1-1h-2z" />
//     </svg>
//   );
// }

// function IcoCompany({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="20"
//       height="20"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
//     </svg>
//   );
// }

// function IcoCalendarRange({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="20"
//       height="20"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M7 2a1 1 0 1 1 2 0v1h6V2a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v3H2V6a3 3 0 0 1 3-3h1V2a1 1 0 1 1 2 0v1z"></path>
//       <path d="M2 10h20v8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z"></path>
//     </svg>
//   );
// }

// function IcoChat({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="18"
//       height="18"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M20 2H4a2 2 0 0 0-2 2v16l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"></path>
//     </svg>
//   );
// }

// function IcoShieldCheck({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="18"
//       height="18"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M12 1l9 4v6c0 5.55-3.84 10.74-9 12-5.16-1.26-9-6.45-9-12V5l9-4zm-1 13.41l-3.71-3.7L7 12l4 4 8-8-1.41-1.42L11 14.41z" />
//     </svg>
//   );
// }

// function IcoClock({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="18"
//       height="18"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
//     </svg>
//   );
// }

// function IcoSupport({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="18"
//       height="18"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16h2v-2h-2v2zm2.07-7.75l-.9.92C11.45 11.9 11 12.5 11 14h2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
//     </svg>
//   );
// }

// function IcoMapPin({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="16"
//       height="16"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"></path>
//     </svg>
//   );
// }

// function IcoTag({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="16"
//       height="16"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"></path>
//     </svg>
//   );
// }

// function IcoCalendar({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="16"
//       height="16"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M3 4h18v18H3z" opacity=".2"></path>
//       <path d="M7 2h2v4H7zM15 2h2v4h-2zM3 8h18v2H3z"></path>
//     </svg>
//   );
// }

// function IcoPrice({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="16"
//       height="16"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.32c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.35-1.79-2.96-3.66-3.42z"></path>
//     </svg>
//   );
// }

// function IcoInfo({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="20"
//       height="20"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
//     </svg>
//   );
// }

// import { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { useCurrency } from "../../contexts/CurrencyContext"; // ✅ Import context
// import EnquiryCruises from "./EnquiryCruises";

// const BRAND = "#F17232";

// function SectionCard({ id, title, children, className = "" }) {
//   return (
//     <section
//       id={id}
//       className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 ${className}`}
//     >
//       <div className="border-b border-gray-100 pb-4 mb-4">
//         <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
//       </div>
//       <div className="text-gray-700">{children}</div>
//     </section>
//   );
// }

// // Helper function to extract YouTube video ID from URL
// const getYouTubeVideoId = (url) => {
//   if (!url) return null;

//   const patterns = [
//     /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/,
//     /(?:youtube\.com\/embed\/)([^&]+)/,
//     /(?:youtube\.com\/v\/)([^&]+)/
//   ];

//   for (const pattern of patterns) {
//     const match = url.match(pattern);
//     if (match) return match[1];
//   }

//   return null;
// };

// export default function CruisesDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const API_BASE = import.meta.env.VITE_API_URL;
//   const [pkg, setPkg] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const { convertAndFormat } = useCurrency();

//   // Enquiry modal
//   const [showEnquiry, setShowEnquiry] = useState(false);
//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const isLoggedIn = () => {
//     try {
//       const u = localStorage.getItem("user");
//       const t = localStorage.getItem("token");
//       return !!u || !!t;
//     } catch {
//       return false;
//     }
//   };

//   const openEnquiry = (e) => {
//     e?.preventDefault?.();
//     if (!isLoggedIn()) {
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

//   // Load cruise by id
//   useEffect(() => {
//     let ignore = false;
//     (async () => {
//       try {
//         setLoading(true);
//         setError("");
//         const res = await fetch(`${API_BASE}/api/cruises/${id}`);
//         const json = await res.json();
//         if (!res.ok || !json?.success)
//           throw new Error(json?.message || "Failed to load");
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

//   const hero = useMemo(
//     () => (pkg?.image ? `${API_BASE}/uploads/cruises/${pkg.image}` : undefined),
//     [pkg?.image, API_BASE]
//   );

//   // Check if we have a YouTube video
//   const youtubeVideoId = useMemo(() => {
//     return pkg?.banner_video_url ? getYouTubeVideoId(pkg.banner_video_url) : null;
//   }, [pkg?.banner_video_url]);

//   const departureDates = useMemo(() => {
//     try {
//       const d =
//         typeof pkg?.departure_dates === "string"
//           ? JSON.parse(pkg.departure_dates)
//           : pkg?.departure_dates;
//       return Array.isArray(d) ? d : [];
//     } catch {
//       return [];
//     }
//   }, [pkg?.departure_dates]);

//   // Parse duration for nights/days
//   const { nights, days } = useMemo(() => {
//     const d = String(pkg?.duration || "");
//     const n = d.match(/(\d+)\s*(?:N|Night|Nights)/i)?.[1];
//     const dy = d.match(/(\d+)\s*(?:D|Day|Days)/i)?.[1];
//     return {
//       nights: n ? Number(n) : undefined,
//       days: dy ? Number(dy) : undefined,
//     };
//   }, [pkg?.duration]);

//   if (loading) {
//     return (
//       <main className="min-h-screen bg-gray-50">
//         <div className="max-w-4xl mx-auto px-4 py-8">
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
//             <p className="text-gray-600">Loading cruise details...</p>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   if (error || !pkg) {
//     return (
//       <main className="min-h-screen bg-gray-50">
//         <div className="max-w-4xl mx-auto px-4 py-8">
//           <div className="text-center py-20">
//             <div className="text-4xl mb-4">⚠️</div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">
//               Unable to Load Cruise
//             </h2>
//             <p className="text-gray-600 mb-6">
//               {error || "The requested cruise package was not found."}
//             </p>
//             <div className="flex gap-3 justify-center flex-wrap">
//               <button
//                 onClick={() => navigate(-1)}
//                 className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 Go Back
//               </button>
//               <button
//                 onClick={() => navigate("/cruises")}
//                 className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
//               >
//                 Browse Cruises
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   const PRICE = Number(pkg.price || 0);
//   const TITLE = pkg.title;

//   return (
//     <main className="min-h-screen bg-gray-50" style={{ "--brand": BRAND }}>
//       <div className="max-w-4xl mx-auto px-4 py-6">
//         {/* Breadcrumb */}
//         <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
//           <a href="/" className="hover:text-orange-500 transition-colors">
//             Home
//           </a>
//           <span>/</span>
//           <a
//             href="/cruises"
//             className="hover:text-orange-500 transition-colors"
//           >
//             Cruises
//           </a>
//           <span>/</span>
//           <span className="text-gray-900 font-medium">{TITLE}</span>
//         </nav>

//         {/* Hero Section */}
//         <section className="mb-8">
//           <div className="relative rounded-2xl overflow-hidden shadow-lg h-80 md:h-96">
//             {/* Show YouTube video if available, otherwise show image */}
//             {youtubeVideoId ? (
//               <div className="w-full h-full">
//                 <iframe
//                   src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=0&rel=0&modestbranding=1`}
//                   title={TITLE}
//                   className="w-full h-full"
//                   frameBorder="0"
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                   allowFullScreen
//                 ></iframe>
//               </div>
//             ) : hero ? (
//               <img
//                 src={hero}
//                 alt={TITLE}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center text-gray-500">
//                 <IcoShip className="w-12 h-12 mb-2" />
//                 <span>No image available</span>
//               </div>
//             )}

//             {/* Gradient Overlay - Only show on image, not on video */}
//             {!youtubeVideoId && (
//               <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
//             )}

//             {/* Duration Ribbon */}
//             {(nights || days || pkg.duration) && (
//               <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
//                 <IcoCalendarRange className="w-4 h-4" />
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

//             {/* Departure Port Ribbon */}
//             {pkg.departure_port && (
//               <div className="absolute top-16 left-4 bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
//                 <IcoAnchor className="w-4 h-4" />
//                 <span>{pkg.departure_port}</span>
//               </div>
//             )}

//             {/* Video Indicator Badge */}
//             {youtubeVideoId && (
//               <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
//                 <IcoPlay className="w-4 h-4" />
//                 <span>Video</span>
//               </div>
//             )}

//             {/* Floating price/CTA - Desktop */}
//             <aside className="hidden lg:block absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 w-64 border border-white/20">
//               <div className="text-center mb-4">
//                 <span className="text-xs text-gray-500 uppercase tracking-wide">
//                   Starting from
//                 </span>
//                 <div className="text-2xl font-bold text-gray-900 mt-1">
//                   {convertAndFormat(PRICE)}
//                 </div>
//                 <div className="text-xs text-gray-500 mt-1">Per Person</div>
//               </div>

//               <div className="mb-4">
//                 <button
//                   onClick={openEnquiry}
//                   className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
//                 >
//                   <IcoChat className="w-5 h-5" />
//                   <span>Enquiry Now</span>
//                 </button>
//               </div>

//               <div className="space-y-3 text-xs text-gray-600">
//                 <div className="flex items-center gap-2">
//                   <IcoShieldCheck className="w-4 h-4 text-green-500" />
//                   <span>Secure Booking</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <IcoClock className="w-4 h-4 text-blue-500" />
//                   <span>Best Deals</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <IcoSupport className="w-4 h-4 text-blue-500" />
//                   <span>24/7 Support</span>
//                 </div>
//               </div>
//             </aside>
//           </div>

//           {/* Mobile CTA */}
//           <div className="lg:hidden bg-white rounded-xl shadow-sm p-4 mt-4 border border-gray-100">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <span className="text-xs text-gray-500 block">From</span>
//                 <strong className="text-xl font-bold text-gray-900">
//                   {convertAndFormat(PRICE)}
//                 </strong>
//                 <span className="text-xs text-gray-500 block">per person</span>
//               </div>
//               <button
//                 onClick={openEnquiry}
//                 className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
//               >
//                 <IcoChat className="w-5 h-5" />
//                 <span>Enquiry Now</span>
//               </button>
//             </div>

//             <div className="flex justify-around border-t border-gray-100 pt-4">
//               <div className="flex items-center gap-2 text-xs text-gray-600">
//                 <IcoShieldCheck className="w-4 h-4 text-green-500" />
//                 <span>Secure</span>
//               </div>
//               <div className="flex items-center gap-2 text-xs text-gray-600">
//                 <IcoClock className="w-4 h-4 text-blue-500" />
//                 <span>Best Deals</span>
//               </div>
//               <div className="flex items-center gap-2 text-xs text-gray-600">
//                 <IcoSupport className="w-4 h-4 text-blue-500" />
//                 <span>Support</span>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Title + Meta */}
//         <header className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-3">{TITLE}</h1>
//           <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
//             {pkg.category && (
//               <div className="flex items-center gap-1">
//                 <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
//                 <span className="text-sm">{pkg.category}</span>
//               </div>
//             )}
//             {pkg.departure_port && (
//               <div className="flex items-center gap-1">
//                 <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
//                 <IcoMapPin className="w-4 h-4" />
//                 <span className="text-sm">{pkg.departure_port}</span>
//               </div>
//             )}
//             {(nights || days || pkg.duration) && (
//               <div className="flex items-center gap-1">
//                 <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
//                 <IcoCalendarRange className="w-4 h-4" />
//                 <span className="text-sm">{pkg.duration}</span>
//               </div>
//             )}
//             {youtubeVideoId && (
//               <div className="flex items-center gap-1">
//                 <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
//                 <IcoPlay className="w-4 h-4" />
//                 <span className="text-sm">Video Available</span>
//               </div>
//             )}
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {pkg.category && (
//               <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
//                 <IcoTag className="w-4 h-4" />
//                 {pkg.category}
//               </span>
//             )}
//             {pkg.departure_port && (
//               <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
//                 <IcoAnchor className="w-4 h-4" />
//                 {pkg.departure_port}
//               </span>
//             )}
//             {(nights || days || pkg.duration) && (
//               <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
//                 <IcoCalendarRange className="w-4 h-4" />
//                 {pkg.duration}
//               </span>
//             )}
//             {departureDates.length > 0 && (
//               <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
//                 <IcoCalendar className="w-4 h-4" />
//                 {departureDates.length} Departures
//               </span>
//             )}
//             {youtubeVideoId && (
//               <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
//                 <IcoPlay className="w-4 h-4" />
//                 Video Tour
//               </span>
//             )}
//           </div>
//         </header>

//         {/* Cruise Details */}
//         <SectionCard
//           id="details"
//           title="Cruise Details"
//           className="cruise-details-card"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {pkg.category && (
//               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
//                 <IcoShip className="w-6 h-6 text-orange-500 mt-1" />
//                 <div>
//                   <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
//                     Cruise Type
//                   </div>
//                   <div className="text-gray-900 font-medium">
//                     {pkg.category}
//                   </div>
//                 </div>
//               </div>
//             )}
//             {pkg.departure_port && (
//               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
//                 <IcoAnchor className="w-6 h-6 text-orange-500 mt-1" />
//                 <div>
//                   <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
//                     Departure Port
//                   </div>
//                   <div className="text-gray-900 font-medium">
//                     {pkg.departure_port}
//                   </div>
//                 </div>
//               </div>
//             )}
//             {(nights || days || pkg.duration) && (
//               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
//                 <IcoCalendarRange className="w-6 h-6 text-orange-500 mt-1" />
//                 <div>
//                   <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
//                     Duration
//                   </div>
//                   <div className="text-gray-900 font-medium">
//                     {pkg.duration}
//                   </div>
//                 </div>
//               </div>
//             )}
//             {departureDates.length > 0 && (
//               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
//                 <IcoCalendar className="w-6 h-6 text-orange-500 mt-1" />
//                 <div>
//                   <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
//                     Departure Dates
//                   </div>
//                   <div className="text-gray-900 font-medium">
//                     {departureDates.length} available
//                   </div>
//                 </div>
//               </div>
//             )}
//             {pkg.cruise_line && (
//               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
//                 <IcoCompany className="w-6 h-6 text-orange-500 mt-1" />
//                 <div>
//                   <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
//                     Cruise Line
//                   </div>
//                   <div className="text-gray-900 font-medium">
//                     {pkg.cruise_line}
//                   </div>
//                 </div>
//               </div>
//             )}
//             {PRICE > 0 && (
//               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
//                 <IcoPrice className="w-6 h-6 text-orange-500 mt-1" />
//                 <div>
//                   <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
//                     Starting Price
//                   </div>
//                   <div className="text-gray-900 font-medium">
//                     {convertAndFormat(PRICE)}
//                   </div>
//                 </div>
//               </div>
//             )}
//             {youtubeVideoId && (
//               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
//                 <IcoPlay className="w-6 h-6 text-orange-500 mt-1" />
//                 <div>
//                   <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
//                     Video Tour
//                   </div>
//                   <div className="text-gray-900 font-medium">
//                     Available
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </SectionCard>

//         {/* Departure Dates */}
//         {departureDates.length > 0 && (
//           <SectionCard id="departures" title="Departure Dates">
//             <div className="space-y-3">
//               {departureDates.slice(0, 5).map((date, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
//                 >
//                   <IcoCalendar className="w-5 h-5 text-orange-500" />
//                   <span className="text-gray-900 font-medium">{date}</span>
//                 </div>
//               ))}
//               {departureDates.length > 5 && (
//                 <div className="text-center py-3 text-gray-500 italic bg-gray-100 rounded-lg">
//                   +{departureDates.length - 5} more departure dates available
//                 </div>
//               )}
//             </div>
//           </SectionCard>
//         )}

//         {/* Overview */}
//         <SectionCard id="overview" title="Overview">
//           {pkg.details ? (
//             <div
//               className="prose prose-gray max-w-none"
//               dangerouslySetInnerHTML={{ __html: pkg.details }}
//             />
//           ) : (
//             <div className="flex items-center gap-3 text-gray-500">
//               <IcoInfo className="w-5 h-5" />
//               <p>
//                 No additional details were provided for this cruise package.
//               </p>
//             </div>
//           )}
//         </SectionCard>

//         {/* Enquiry Modal */}
//         {showEnquiry && (
//           <div
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//             onClick={closeEnquiry}
//           >
//             <div
//               className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   Cruise Enquiry
//                 </h3>
//                 <button
//                   className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
//                   onClick={closeEnquiry}
//                   aria-label="Close"
//                 >
//                   ×
//                 </button>
//               </div>
//               <div className="p-6">
//                 <EnquiryCruises cruise={pkg} />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Auth Required Modal */}
//         {showAuthModal && (
//           <div
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//             onClick={() => setShowAuthModal(false)}
//           >
//             <div
//               className="bg-white rounded-2xl shadow-xl w-full max-w-md"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="p-6">
//                 <div className="flex items-center gap-3 mb-4">
//                   <IcoShieldCheck className="w-6 h-6 text-green-500" />
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     Login Required
//                   </h3>
//                 </div>
//                 <p className="text-gray-600">
//                   Please login to submit a cruise enquiry and access exclusive
//                   cruise deals.
//                 </p>
//               </div>
//               <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end rounded-b-2xl">
//                 <button
//                   className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//                   onClick={() => setShowAuthModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
//                   onClick={() =>
//                     navigate("/login", { state: { from: location.pathname } })
//                   }
//                 >
//                   Login Now
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }

// // Add the Play icon component
// function IcoPlay({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M8 5v14l11-7z" />
//     </svg>
//   );
// }

// // ... keep all your existing icon components (IcoShip, IcoAnchor, IcoCompany, etc.)
// // [All your existing icon components remain the same]
// function IcoShip({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z" />
//     </svg>
//   );
// }

// function IcoAnchor({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="20"
//       height="20"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M13 9V7.82C14.16 7.4 15 6.3 15 5c0-1.65-1.35-3-3-3S9 3.35 9 5c0 1.3.84 2.4 2 2.82V9H9c-.55 0-1 .45-1 1s.45 1 1 1h2v3.18c-1.16-.41-2-1.51-2-2.82 0-.55-.45-1-1-1s-1 .45-1 1c0 2.28 1.39 4.25 3.37 5.09C8.61 17.67 7 19.85 7 22c0 .55.45 1 1 1s1-.45 1-1c0-1.84 1.16-3.41 2.79-4.03C13.3 18.84 15 16.5 15 14c0-1.31-.84-2.41-2-2.82V11h2c.55 0 1-.45 1-1s-.45-1-1-1h-2z" />
//     </svg>
//   );
// }

// function IcoCompany({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="20"
//       height="20"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
//     </svg>
//   );
// }

// function IcoCalendarRange({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="20"
//       height="20"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M7 2a1 1 0 1 1 2 0v1h6V2a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v3H2V6a3 3 0 0 1 3-3h1V2a1 1 0 1 1 2 0v1z"></path>
//       <path d="M2 10h20v8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z"></path>
//     </svg>
//   );
// }

// function IcoChat({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="18"
//       height="18"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M20 2H4a2 2 0 0 0-2 2v16l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"></path>
//     </svg>
//   );
// }

// function IcoShieldCheck({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="18"
//       height="18"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M12 1l9 4v6c0 5.55-3.84 10.74-9 12-5.16-1.26-9-6.45-9-12V5l9-4zm-1 13.41l-3.71-3.7L7 12l4 4 8-8-1.41-1.42L11 14.41z" />
//     </svg>
//   );
// }

// function IcoClock({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="18"
//       height="18"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
//     </svg>
//   );
// }

// function IcoSupport({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="18"
//       height="18"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16h2v-2h-2v2zm2.07-7.75l-.9.92C11.45 11.9 11 12.5 11 14h2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
//     </svg>
//   );
// }

// function IcoMapPin({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="16"
//       height="16"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"></path>
//     </svg>
//   );
// }

// function IcoTag({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="16"
//       height="16"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"></path>
//     </svg>
//   );
// }

// function IcoCalendar({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="16"
//       height="16"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M3 4h18v18H3z" opacity=".2"></path>
//       <path d="M7 2h2v4H7zM15 2h2v4h-2zM3 8h18v2H3z"></path>
//     </svg>
//   );
// }

// function IcoPrice({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="16"
//       height="16"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.32c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.35-1.79-2.96-3.66-3.42z"></path>
//     </svg>
//   );
// }

// function IcoInfo({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="20"
//       height="20"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
//     </svg>
//   );
// }

// import { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { useCurrency } from "../../contexts/CurrencyContext";
// import EnquiryCruises from "./EnquiryCruises";
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
//   ShieldCheck,
//   Star,
//   Tag,
//   X,
//   Ship,
//   Anchor,
//   Users,
//   Play,
// } from "lucide-react";

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

// // Helper function to extract YouTube video ID from URL
// const getYouTubeVideoId = (url) => {
//   if (!url) return null;

//   const patterns = [
//     /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/,
//     /(?:youtube\.com\/embed\/)([^&]+)/,
//     /(?:youtube\.com\/v\/)([^&]+)/
//   ];

//   for (const pattern of patterns) {
//     const match = url.match(pattern);
//     if (match) return match[1];
//   }

//   return null;
// };

// export default function CruisesDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const API_BASE = import.meta.env.VITE_API_URL;
//   const [pkg, setPkg] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const { convertAndFormat } = useCurrency();

//   // Enquiry modal
//   const [showEnquiry, setShowEnquiry] = useState(false);
//   const [showAuthModal, setShowAuthModal] = useState(false);

//   const isLoggedIn = () => {
//     try {
//       const u = localStorage.getItem("user");
//       const t = localStorage.getItem("token");
//       return !!u || !!t;
//     } catch {
//       return false;
//     }
//   };

//   const openEnquiry = (e) => {
//     e?.preventDefault?.();
//     if (!isLoggedIn()) {
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

//   // Load cruise by id
//   useEffect(() => {
//     let ignore = false;
//     (async () => {
//       try {
//         setLoading(true);
//         setError("");
//         const res = await fetch(`${API_BASE}/api/cruises/${id}`);
//         const json = await res.json();
//         if (!res.ok || !json?.success)
//           throw new Error(json?.message || "Failed to load");
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
//     if (!pkg) return [];
//     if (pkg.image) return [pkg.image];
//     return [];
//   }, [pkg]);

//   const allImages = images.map((img) => `${API_BASE}/uploads/cruises/${img}`);
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

//   // Check if we have a YouTube video
//   const youtubeVideoId = useMemo(() => {
//     return pkg?.banner_video_url ? getYouTubeVideoId(pkg.banner_video_url) : null;
//   }, [pkg?.banner_video_url]);

//   const departureDates = useMemo(() => {
//     try {
//       const d =
//         typeof pkg?.departure_dates === "string"
//           ? JSON.parse(pkg.departure_dates)
//           : pkg?.departure_dates;
//       return Array.isArray(d) ? d : [];
//     } catch {
//       return [];
//     }
//   }, [pkg?.departure_dates]);

//   // Parse duration for nights/days
//   const { nights, days } = useMemo(() => {
//     const d = String(pkg?.duration || "");
//     const n = d.match(/(\d+)\s*(?:N|Night|Nights)/i)?.[1];
//     const dy = d.match(/(\d+)\s*(?:D|Day|Days)/i)?.[1];
//     return {
//       nights: n ? Number(n) : undefined,
//       days: dy ? Number(dy) : undefined,
//     };
//   }, [pkg?.duration]);

//   // Static reviews data for cruises
//   const staticReviews = {
//     avg: 4.7,
//     total: 156,
//     counts: { 5: 120, 4: 30, 3: 5, 2: 1, 1: 0 },
//     items: [
//       {
//         avatar:
//           "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
//         name: "Robert & Maria",
//         date: "February 2024",
//         title: "Unforgettable Cruise Experience",
//         comment:
//           "This cruise exceeded all our expectations! The service was impeccable, the food was exquisite, and the destinations were breathtaking. The crew went above and beyond to make our anniversary special.",
//         rating: 5,
//       },
//       {
//         avatar:
//           "https://images.unsplash.com/photo-1531123414780-f0b7f7a1b3f9?q=80&w=200&auto=format&fit=crop",
//         name: "Sophie Williams",
//         date: "January 2024",
//         title: "Perfect Family Vacation",
//         comment:
//           "Our family had the most amazing time on this cruise. The kids loved the activities, and we appreciated the variety of dining options. The shore excursions were well-organized and memorable.",
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
//             <p className="text-gray-600">Loading cruise details...</p>
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
//               Unable to Load Cruise
//             </h2>
//             <p className="text-gray-600 mb-6">
//               {error || "The requested cruise package was not found."}
//             </p>
//             <div className="flex gap-3 justify-center flex-wrap">
//               <button
//                 onClick={() => navigate(-1)}
//                 className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 Go Back
//               </button>
//               <button
//                 onClick={() => navigate("/cruises")}
//                 className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
//               >
//                 Browse Cruises
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
//           <a
//             href="/cruises"
//             className="hover:text-orange-500 transition-colors"
//           >
//             Cruises
//           </a>
//           <span>/</span>
//           <span className="text-gray-900 font-medium line-clamp-1">
//             {TITLE}
//           </span>
//         </nav>

//         {/* Hero Section */}
//         <section className="mb-6">
//           <div className="relative rounded-2xl overflow-hidden shadow-lg h-72 md:h-96 lg:h-[500px]">
//             {/* Show YouTube video if available, otherwise show image */}
//             {youtubeVideoId ? (
//               <div className="w-full h-full">
//                 <iframe
//                   src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=0&rel=0&modestbranding=1`}
//                   title={TITLE}
//                   className="w-full h-full"
//                   frameBorder="0"
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                   allowFullScreen
//                 ></iframe>
//               </div>
//             ) : currentImage ? (
//               <img
//                 src={currentImage}
//                 alt={TITLE}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
//                 <div className="text-center text-gray-500">
//                   <Ship className="w-16 h-16 mx-auto mb-2 opacity-50" />
//                   <p>No image available</p>
//                 </div>
//               </div>
//             )}

//             {/* Gradient Overlay - Only show on image, not on video */}
//             {!youtubeVideoId && (
//               <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
//             )}

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

//             {/* Video Indicator Badge */}
//             {youtubeVideoId && (
//               <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-lg">
//                 <Play className="w-4 h-4" />
//                 <span>Video Tour</span>
//               </div>
//             )}

//             {/* Navigation arrows for images */}
//             {!youtubeVideoId && allImages.length > 1 && (
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

//             {!youtubeVideoId && allImages.length > 1 && (
//               <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-xs font-medium">
//                 📷 {currentImageIndex + 1}/{allImages.length}
//               </div>
//             )}
//           </div>

//           {/* Image thumbnails */}
//           {!youtubeVideoId && allImages.length > 1 && (
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
//                   <Ship className="w-4 h-4 text-blue-600" />
//                 </div>
//                 <span className="text-gray-700 text-xs">Luxury Cruise</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm">
//                 <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//                   <CheckCircle className="w-4 h-4 text-blue-600" />
//                 </div>
//                 <span className="text-gray-700 text-xs">All Inclusive</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm">
//                 <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//                   <Users className="w-4 h-4 text-blue-600" />
//                 </div>
//                 <span className="text-gray-700 text-xs">Family Friendly</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm">
//                 <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
//                   <FileText className="w-4 h-4 text-red-600" />
//                 </div>
//                 <span className="text-gray-700 text-xs">Flexible Booking</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm">
//                 <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//                   <Globe className="w-4 h-4 text-blue-600" />
//                 </div>
//                 <span className="text-gray-700 text-xs">Multiple Ports</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm">
//                 <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//                   <ShieldCheck className="w-4 h-4 text-blue-600" />
//                 </div>
//                 <span className="text-gray-700 text-xs">Secure</span>
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
//                 <Calendar className="w-5 h-5" />
//                 <span>Enquire Now</span>
//               </button>
//             </div>
//           </div>
//         </header>

//         {/* Cruise Details */}
//         <SectionCard id="details" title="Cruise Information">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {pkg.category && (
//               <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
//                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
//                   <Ship className="w-5 h-5 text-orange-500" />
//                 </div>
//                 <div>
//                   <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
//                     Cruise Type
//                   </div>
//                   <div className="text-gray-900 font-semibold">
//                     {pkg.category}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {pkg.departure_port && (
//               <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
//                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
//                   <Anchor className="w-5 h-5 text-blue-500" />
//                 </div>
//                 <div>
//                   <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
//                     Departure Port
//                   </div>
//                   <div className="text-gray-900 font-semibold">
//                     {pkg.departure_port}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {(nights || days || pkg.duration) && (
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

//             {departureDates.length > 0 && (
//               <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
//                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
//                   <Calendar className="w-5 h-5 text-green-500" />
//                 </div>
//                 <div>
//                   <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
//                     Departure Dates
//                   </div>
//                   <div className="text-gray-900 font-semibold">
//                     {departureDates.length} available
//                   </div>
//                 </div>
//               </div>
//             )}

//             {pkg.cruise_line && (
//               <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
//                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
//                   <Users className="w-5 h-5 text-red-500" />
//                 </div>
//                 <div>
//                   <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
//                     Cruise Line
//                   </div>
//                   <div className="text-gray-900 font-semibold">
//                     {pkg.cruise_line}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {PRICE > 0 && (
//               <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200">
//                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
//                   <DollarSign className="w-5 h-5 text-amber-500" />
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

//         {/* Departure Dates */}
//         {departureDates.length > 0 && (
//           <SectionCard id="departures" title="Departure Dates">
//             <div className="space-y-3">
//               {departureDates.slice(0, 5).map((date, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200"
//                 >
//                   <Calendar className="w-5 h-5 text-blue-500" />
//                   <span className="text-gray-900 font-medium">{date}</span>
//                 </div>
//               ))}
//               {departureDates.length > 5 && (
//                 <div className="text-center py-3 text-gray-500 italic bg-gray-100 rounded-lg">
//                   +{departureDates.length - 5} more departure dates available
//                 </div>
//               )}
//             </div>
//           </SectionCard>
//         )}

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
//                 No additional details were provided for this cruise package.
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
//                   Best Price Guarantee
//                 </div>
//                 <div className="text-sm text-gray-600">
//                   Find a lower price? We'll match it
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
//                 <Users className="w-6 h-6 text-blue-500" />
//               </div>
//               <div>
//                 <div className="font-semibold text-gray-900">
//                   24/7 Cruise Support
//                 </div>
//                 <div className="text-sm text-gray-600">
//                   Expert assistance anytime
//                 </div>
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
//               <Calendar className="w-5 h-5" />
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
//                 Cruise Enquiry
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
//               <EnquiryCruises cruise={pkg} />
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
//                 Please login to submit a cruise enquiry and access exclusive
//                 cruise deals.
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
  Anchor,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  Globe,
  Info,
  MessageCircle,
  Play,
  ShieldCheck,
  Ship,
  Star,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCurrency } from "../../contexts/CurrencyContext";
import EnquiryCruises from "./EnquiryCruises";

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

// Helper function to extract YouTube video ID from URL
const getYouTubeVideoId = (url) => {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/,
    /(?:youtube\.com\/embed\/)([^&]+)/,
    /(?:youtube\.com\/v\/)([^&]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
};

export default function CruisesDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE = import.meta.env.VITE_API_URL;
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { convertAndFormat } = useCurrency();

  // Enquiry modal
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isLoggedIn = () => {
    try {
      const u = localStorage.getItem("user");
      const t = localStorage.getItem("token");
      return !!u || !!t;
    } catch {
      return false;
    }
  };

  const openEnquiry = (e) => {
    e?.preventDefault?.();
    if (!isLoggedIn()) {
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

  // Load cruise by id
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE}/api/cruises/${id}`);
        const json = await res.json();
        if (!res.ok || !json?.success)
          throw new Error(json?.message || "Failed to load");
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
    if (!pkg) return [];
    if (pkg.image) return [pkg.image];
    return [];
  }, [pkg]);

  const allImages = images.map((img) => `${API_BASE}/uploads/cruises/${img}`);
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

  // Check if we have a YouTube video
  const youtubeVideoId = useMemo(() => {
    return pkg?.banner_video_url
      ? getYouTubeVideoId(pkg.banner_video_url)
      : null;
  }, [pkg?.banner_video_url]);

  const departureDates = useMemo(() => {
    try {
      const d =
        typeof pkg?.departure_dates === "string"
          ? JSON.parse(pkg.departure_dates)
          : pkg?.departure_dates;
      return Array.isArray(d) ? d : [];
    } catch {
      return [];
    }
  }, [pkg?.departure_dates]);

  // Parse duration for nights/days
  const { nights, days } = useMemo(() => {
    const d = String(pkg?.duration || "");
    const n = d.match(/(\d+)\s*(?:N|Night|Nights)/i)?.[1];
    const dy = d.match(/(\d+)\s*(?:D|Day|Days)/i)?.[1];
    return {
      nights: n ? Number(n) : undefined,
      days: dy ? Number(dy) : undefined,
    };
  }, [pkg?.duration]);

  // Static reviews data for cruises
  const staticReviews = {
    avg: 4.7,
    total: 156,
    counts: { 5: 120, 4: 30, 3: 5, 2: 1, 1: 0 },
    items: [
      {
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
        name: "Robert & Maria",
        date: "February 2024",
        title: "Unforgettable Cruise Experience",
        comment:
          "This cruise exceeded all our expectations! The service was impeccable, the food was exquisite, and the destinations were breathtaking. The crew went above and beyond to make our anniversary special.",
        rating: 5,
      },
      {
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
        name: "Sophie Williams",
        date: "January 2024",
        title: "Perfect Family Vacation",
        comment:
          "Our family had the most amazing time on this cruise. The kids loved the activities, and we appreciated the variety of dining options. The shore excursions were well-organized and memorable.",
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
            <p className="text-gray-600">Loading cruise details...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !pkg) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Unable to Load Cruise
            </h2>
            <p className="text-gray-600 mb-6">
              {error || "The requested cruise package was not found."}
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={() => navigate("/cruises")}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Browse Cruises
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
    <main
      className="min-h-screen bg-gray-50  mb-10"
      style={{ "--brand": BRAND }}
    >
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb - Hidden on mobile as per image */}
        <nav className="hidden md:flex items-center gap-2 text-sm text-gray-500 mb-6">
          <a href="/" className="hover:text-orange-500 transition-colors">
            Home
          </a>
          <span>/</span>
          <a
            href="/cruises"
            className="hover:text-orange-500 transition-colors"
          >
            Cruises
          </a>
          <span>/</span>
          <span className="text-gray-900 font-medium line-clamp-1">
            {TITLE}
          </span>
        </nav>

        {/* Hero Section */}
        <section className="mb-6">
          <div className="relative rounded-2xl overflow-hidden shadow-lg h-64 md:h-96 lg:h-[500px]">
            {/* Show YouTube video if available, otherwise show image */}
            {youtubeVideoId ? (
              <div className="w-full h-full">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=0&rel=0&modestbranding=1`}
                  title={TITLE}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : currentImage ? (
              <img
                src={currentImage}
                alt={TITLE}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Ship className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p>No image available</p>
                </div>
              </div>
            )}

            {/* Gradient Overlay - Only show on image, not on video */}
            {!youtubeVideoId && (
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
            )}
            <button
              onClick={() => navigate(-1)}
              className="md:hidden absolute top-4 left-4 bg-black/50 hover:bg-black/70 text-white px-3 py-2 rounded-lg flex items-center justify-center shadow-lg transition-all z-10"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {/* Duration Ribbon */}
            {(nights || days || pkg.duration) && (
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
            )}

            {/* Video Indicator Badge */}
            {youtubeVideoId && (
              <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-lg">
                <Play className="w-4 h-4" />
                <span>Video Tour</span>
              </div>
            )}

            {/* Navigation arrows for images */}
            {!youtubeVideoId && allImages.length > 1 && (
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

            {!youtubeVideoId && allImages.length > 1 && (
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                📷 {currentImageIndex + 1}/{allImages.length}
              </div>
            )}
          </div>

          {/* Image thumbnails */}
          {!youtubeVideoId && allImages.length > 1 && (
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
                  <Ship className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Luxury Cruise</div>
                  <div className="text-sm text-gray-600">
                    Premium cruise experience
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">All Inclusive</div>
                  <div className="text-sm text-gray-600">
                    All meals and activities included
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Family Friendly
                  </div>
                  <div className="text-sm text-gray-600">
                    Activities for all ages
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Flexible Booking
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Multiple Ports
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Secure Booking
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cruise Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Cruise Information
            </h2>
            <div className="space-y-4">
              {pkg.category && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Ship className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Cruise Type
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {pkg.category}
                    </div>
                  </div>
                </div>
              )}

              {pkg.departure_port && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Anchor className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Departure Port
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {pkg.departure_port}
                    </div>
                  </div>
                </div>
              )}

              {(nights || days || pkg.duration) && (
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

              {pkg.cruise_line && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Cruise Line
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {pkg.cruise_line}
                    </div>
                  </div>
                </div>
              )}

              {departureDates.length > 0 && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Departure Dates
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {departureDates.length} available
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Departure Dates */}
          {departureDates.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Departure Dates
              </h2>
              <div className="space-y-3">
                {departureDates.slice(0, 5).map((date, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200"
                  >
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-900 font-medium">{date}</span>
                  </div>
                ))}
                {departureDates.length > 5 && (
                  <div className="text-center py-3 text-gray-500 italic bg-gray-100 rounded-lg">
                    +{departureDates.length - 5} more departure dates available
                  </div>
                )}
              </div>
            </div>
          )}

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
                  No additional details were provided for this cruise package.
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
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 mb-6">
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
                    Best Price Guarantee
                  </div>
                  <div className="text-sm text-gray-600">
                    Find a lower price? We'll match it
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    24/7 Cruise Support
                  </div>
                  <div className="text-sm text-gray-600">
                    Expert assistance anytime
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
                    <Ship className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 text-xs">Luxury Cruise</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 text-xs">All Inclusive</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 text-xs">Family Friendly</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-gray-700 text-xs">
                    Flexible Booking
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 text-xs">Multiple Ports</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 text-xs">Secure</span>
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

          {/* Cruise Details */}
          <SectionCard id="details" title="Cruise Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pkg.category && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Ship className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Cruise Type
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {pkg.category}
                    </div>
                  </div>
                </div>
              )}

              {pkg.departure_port && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Anchor className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Departure Port
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {pkg.departure_port}
                    </div>
                  </div>
                </div>
              )}

              {(nights || days || pkg.duration) && (
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

              {departureDates.length > 0 && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Departure Dates
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {departureDates.length} available
                    </div>
                  </div>
                </div>
              )}

              {pkg.cruise_line && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Cruise Line
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {pkg.cruise_line}
                    </div>
                  </div>
                </div>
              )}

              {PRICE > 0 && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-amber-500" />
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

          {/* Departure Dates */}
          {departureDates.length > 0 && (
            <SectionCard id="departures" title="Departure Dates">
              <div className="space-y-3">
                {departureDates.slice(0, 5).map((date, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200"
                  >
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-900 font-medium">{date}</span>
                  </div>
                ))}
                {departureDates.length > 5 && (
                  <div className="text-center py-3 text-gray-500 italic bg-gray-100 rounded-lg">
                    +{departureDates.length - 5} more departure dates available
                  </div>
                )}
              </div>
            </SectionCard>
          )}

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
                  No additional details were provided for this cruise package.
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
                    Best Price Guarantee
                  </div>
                  <div className="text-sm text-gray-600">
                    Find a lower price? We'll match it
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    24/7 Cruise Support
                  </div>
                  <div className="text-sm text-gray-600">
                    Expert assistance anytime
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
                Cruise Enquiry
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
              <EnquiryCruises cruise={pkg} />
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
                Please login to submit a cruise enquiry and access exclusive
                cruise deals.
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
