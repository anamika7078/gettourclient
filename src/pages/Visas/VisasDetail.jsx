// import { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";

// const BRAND = "#F17232";

// function SectionCard({ id, title, children, className = "" }) {
//   return (
//     <section id={id} className={`section-card ${className}`}>
//       <div className="section-card__head">
//         <h2 className="section-title">{title}</h2>
//       </div>
//       <div className="section-content">{children}</div>
//     </section>
//   );
// }

// export default function VisasDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const API_BASE = import.meta.env.VITE_API_URL;
//   const [visa, setVisa] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
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
//     // Navigate to Visa Apply page and pass current visa via state
//     navigate(`/visas/${id}/apply`, { state: { visa } });
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

//   // Load visa by id
//   useEffect(() => {
//     let ignore = false;
//     (async () => {
//       try {
//         setLoading(true);
//         setError("");
//         const res = await fetch(`${API_BASE}/api/visas/${id}`);
//         const json = await res.json();
//         if (!res.ok || !json?.success)
//           throw new Error(json?.error || "Failed to load visa");
//         if (!ignore) setVisa(json.data);
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
//     if (!visa) return [];
//     // if images array exists, use it
//     if (Array.isArray(visa.images) && visa.images.length) return visa.images;
//     // fallback: use single image string
//     if (visa.image) return [visa.image];
//     return [];
//   }, [visa]);

//   const hero = images[0]
//     ? `${API_BASE}/uploads/visas/${images[0]}`
//     : "https://via.placeholder.com/1600x900?text=Visa+Image";
//   const gallery = images
//     .slice(1, 4)
//     .map((n) => `${API_BASE}/uploads/visas/${n}`);

//   if (loading) {
//     return (
//       <main className="r1c1-root" style={{ "--brand": BRAND }}>
//         <div className="container">
//           <p style={{ padding: 24 }}>Loading Visa Details...</p>
//         </div>
//       </main>
//     );
//   }

//   if (error || !visa) {
//     return (
//       <main className="r1c1-root" style={{ "--brand": BRAND }}>
//         <div className="container">
//           <p style={{ padding: 24, color: "#b91c1c" }}>
//             {error || "Visa not found"}
//           </p>
//         </div>
//       </main>
//     );
//   }

//   const PRICE = Number(visa.price || 0);
//   const TITLE = `${visa.country} Visa`;

//   return (
//     <main className="r1c1-root" style={{ "--brand": BRAND }}>
//       <div className="container">
//         {/* Breadcrumb */}
//         <nav className="crumbs" aria-label="Breadcrumb">
//           <a href="/" className="crumb">
//             Home
//           </a>
//           <span className="sep">/</span>
//           <a href="/visas" className="crumb">
//             Visas
//           </a>
//           <span className="sep">/</span>
//           <span className="crumb current">{TITLE}</span>
//         </nav>

//         {/* Hero */}
//         <section className="hero-wrap">
//           <div className="hero">
//             {hero ? (
//               <img src={hero} alt={TITLE} />
//             ) : (
//               <div style={{ height: 320, background: "#eee" }} />
//             )}
//             <div className="hero-gradient" aria-hidden="true" />

//             {/* Floating price/CTA - Desktop */}
//             <aside className="floating-panel">
//               <div className="fp-head">
//                 <span className="fp-label">Starting from</span>
//                 <div className="fp-price">USD {PRICE.toFixed(2)}</div>
//                 <div className="fp-sub">Per Visa</div>
//               </div>
//               <div className="fp-actions">
//                 <button
//                   onClick={openEnquiry}
//                   className="btn primary"
//                   type="button"
//                   style={{
//                     minWidth: 220,
//                     paddingInline: 22,
//                     fontWeight: 700,
//                     borderRadius: 10,
//                   }}
//                 >
//                   <IcoChat /> Apply Now
//                 </button>
//               </div>
//             </aside>

//             {/* Mini gallery */}
//             {gallery.length > 0 && (
//               <div className="hero-gallery">
//                 {gallery.map((g, i) => (
//                   <img key={i} src={g} alt={`Visa image ${i + 1}`} />
//                 ))}
//               </div>
//             )}
//           </div>
//         </section>

//         {/* Mobile CTA - Fixed at bottom for mobile */}
//         <div className="mobile-cta-fixed">
//           <div className="mobile-cta-content">
//             <div className="mc-price">
//               <span className="mc-label">From</span>
//               <strong>USD {PRICE.toFixed(2)}</strong>
//             </div>
//             <button onClick={openEnquiry} className="btn primary" type="button">
//               <IcoChat /> Apply Now
//             </button>
//           </div>
//         </div>

//         {/* Title + meta */}
//         <header className="title-meta">
//           <h1 className="title">{TITLE}</h1>
//           <div className="meta">
//             <span className="dot">•</span>
//             <span className="duration">
//               <IcoCalendar /> {visa.country}
//             </span>
//             {visa.subject && (
//               <>
//                 <span className="dot">•</span>
//                 <span className="duration">
//                   <IcoCheck /> {visa.subject}
//                 </span>
//               </>
//             )}
//           </div>
//         </header>

//         {/* Overview */}
//         <SectionCard id="overview" title="Overview">
//           {visa.overview ? (
//             <div
//               className="prose prose-slate max-w-none"
//               dangerouslySetInnerHTML={{ __html: visa.overview }}
//             />
//           ) : (
//             <p className="lead">No details provided for this visa.</p>
//           )}
//         </SectionCard>

//         {/* Enquiry Modal */}
//         {showEnquiry && (
//           <div className="enq-backdrop" onClick={closeEnquiry}>
//             <div className="enq-modal" onClick={(e) => e.stopPropagation()}>
//               <button className="enq-close" onClick={closeEnquiry}>
//                 ×
//               </button>
//               {/* <EnquiryNow pkg={visa} /> */}
//               <div style={{ padding: "20px" }}>
//                 Enquiry Form Component Would Go Here
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Auth Modal */}
//         <AuthModal
//           open={showAuthModal}
//           onClose={() => setShowAuthModal(false)}
//           onLogin={() =>
//             navigate(`/login`, { state: { from: location.pathname } })
//           }
//         />
//       </div>
//     </main>
//   );
// }

// // Auth Required Modal
// function AuthModal({ open, onClose, onLogin }) {
//   if (!open) return null;
//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
//       onClick={onClose}
//     >
//       <div
//         className="bg-white w-full max-w-md rounded-2xl shadow-xl border overflow-hidden"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="p-6">
//           <h3 className="text-lg font-semibold text-gray-900">
//             Login required
//           </h3>
//           <p className="mt-1 text-sm text-gray-600">
//             Please login to apply for a visa.
//           </p>
//         </div>
//         <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
//           <button
//             className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-white"
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//           <button
//             className="px-4 py-2 rounded-lg bg-[var(--brand,#F17232)] text-white hover:brightness-95"
//             onClick={onLogin}
//           >
//             Login now
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Reuse icons
// function IcoChat() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="18"
//       height="18"
//       fill="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path d="M20 2H4a2 2 0 0 0-2 2v16l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
//     </svg>
//   );
// }
// function IcoCalendar() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="16"
//       height="16"
//       fill="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path d="M3 4h18v18H3z" opacity=".2"></path>
//       <path d="M7 2h2v4H7zM15 2h2v4h-2zM3 8h18v2H3z"></path>
//     </svg>
//   );
// }
// function IcoCheck() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="18"
//       height="18"
//       fill="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path d="M20.285 2l-11.99 11.99-4.58-4.58L2 11.125l6.295 6.295L22 3.715z"></path>
//     </svg>
//   );
// // }

// import { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";

// const BRAND = "#F17232";

// function SectionCard({ id, title, children, className = "" }) {
//   return (
//     <section id={id} className={`section-card ${className}`}>
//       <div className="section-card__head">
//         <h2 className="section-title">{title}</h2>
//       </div>
//       <div className="section-content">{children}</div>
//     </section>
//   );
// }

// export default function VisasDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const API_BASE = import.meta.env.VITE_API_URL;
//   const [visa, setVisa] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
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
//     // Navigate to Visa Apply page and pass current visa via state
//     navigate(`/visas/${id}/apply`, { state: { visa } });
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

//   // Load visa by id
//   useEffect(() => {
//     let ignore = false;
//     (async () => {
//       try {
//         setLoading(true);
//         setError("");
//         const res = await fetch(`${API_BASE}/api/visas/${id}`);
//         const json = await res.json();
//         if (!res.ok || !json?.success)
//           throw new Error(json?.error || "Failed to load visa");
//         if (!ignore) setVisa(json.data);
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
//     if (!visa) return [];
//     // if images array exists, use it
//     if (Array.isArray(visa.images) && visa.images.length) return visa.images;
//     // fallback: use single image string
//     if (visa.image) return [visa.image];
//     return [];
//   }, [visa]);

//   const hero = images[0]
//     ? `${API_BASE}/uploads/visas/${images[0]}`
//     : "https://via.placeholder.com/1600x900?text=Visa+Image";
//   const gallery = images
//     .slice(1, 4)
//     .map((n) => `${API_BASE}/uploads/visas/${n}`);

//   if (loading) {
//     return (
//       <main className="r1c1-root" style={{ "--brand": BRAND }}>
//         <div className="container">
//           <div className="loading-container">
//             <div className="loading-spinner"></div>
//             <p>Loading visa details...</p>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   if (error || !visa) {
//     return (
//       <main className="r1c1-root" style={{ "--brand": BRAND }}>
//         <div className="container">
//           <div className="error-container">
//             <div className="error-icon">⚠️</div>
//             <h2>Unable to Load Visa</h2>
//             <p>{error || "The requested visa was not found."}</p>
//             <div className="error-actions">
//               <button
//                 onClick={() => navigate(-1)}
//                 className="btn ghost"
//                 type="button"
//               >
//                 Go Back
//               </button>
//               <button
//                 onClick={() => navigate("/visas")}
//                 className="btn primary"
//                 type="button"
//               >
//                 Browse Visas
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   const PRICE = Number(visa.price || 0);
//   const TITLE = `${visa.country} Visa`;

//   return (
//     <main className="r1c1-root visa-detail-page" style={{ "--brand": BRAND }}>
//       <div className="container compact-layout">
//         {/* Breadcrumb */}
//         <nav className="crumbs" aria-label="Breadcrumb">
//           <a href="/" className="crumb">
//             Home
//           </a>
//           <span className="sep">/</span>
//           <a href="/visas" className="crumb">
//             Visas
//           </a>
//           <span className="sep">/</span>
//           <span className="crumb current">{TITLE}</span>
//         </nav>

//         {/* Hero Section - Compact Design */}
//         <section className="hero-wrap compact-hero">
//           <div className="hero compact-hero-inner">
//             {hero ? (
//               <img src={hero} alt={TITLE} className="hero-image" />
//             ) : (
//               <div className="hero-placeholder">
//                 <IcoImage />
//                 <span>No image available</span>
//               </div>
//             )}
//             <div className="hero-gradient" aria-hidden="true" />

//             {/* Country Ribbon */}
//             {visa.country && (
//               <div className="ribbon compact-ribbon">
//                 <IcoFlag />
//                 <span>{visa.country}</span>
//               </div>
//             )}

//             {/* Floating price/CTA - Desktop */}
//             <aside className="floating-panel compact-floating">
//               <div className="fp-head">
//                 <span className="fp-label">Starting from</span>
//                 <div className="fp-price">USD {PRICE.toFixed(2)}</div>
//                 <div className="fp-sub">Per Visa</div>
//               </div>

//               <div className="fp-actions">
//                 <button
//                   onClick={openEnquiry}
//                   className="btn primary fp-btn"
//                   type="button"
//                 >
//                   <IcoCheck className="btn-icon" />
//                   <span>Apply Now</span>
//                 </button>
//               </div>

//               <div className="fp-features compact-features">
//                 <div className="fp-feature">
//                   <IcoShieldCheck className="feature-icon" />
//                   <span>Secure Processing</span>
//                 </div>
//                 <div className="fp-feature">
//                   <IcoClock className="feature-icon" />
//                   <span>Fast Approval</span>
//                 </div>
//                 <div className="fp-feature">
//                   <IcoSupport className="feature-icon" />
//                   <span>Expert Support</span>
//                 </div>
//               </div>
//             </aside>

//             {/* Mini gallery */}
//             {gallery.length > 0 && (
//               <div className="hero-gallery compact-gallery">
//                 {gallery.map((g, i) => (
//                   <img key={i} src={g} alt={`Visa image ${i + 1}`} />
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Mobile CTA under hero */}
//           <div className="mobile-cta compact-mobile-cta">
//             <div className="mc-content">
//               <div className="mc-price">
//                 <span className="mc-label">From</span>
//                 <strong>USD {PRICE.toFixed(2)}</strong>
//                 <span className="mc-sub">per visa</span>
//               </div>
//               <div className="mc-actions">
//                 <button
//                   onClick={openEnquiry}
//                   className="btn primary"
//                   type="button"
//                 >
//                   <IcoCheck className="btn-icon" />
//                   <span>Apply Now</span>
//                 </button>
//               </div>
//             </div>

//             <div className="mc-features">
//               <div className="mc-feature">
//                 <IcoShieldCheck className="feature-icon" />
//                 <span>Secure</span>
//               </div>
//               <div className="mc-feature">
//                 <IcoClock className="feature-icon" />
//                 <span>Fast</span>
//               </div>
//               <div className="mc-feature">
//                 <IcoSupport className="feature-icon" />
//                 <span>Support</span>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Title + meta - Compact Design */}
//         <header className="title-meta compact-title">
//           <h1 className="title">{TITLE}</h1>
//           <div className="meta">
//             {visa.country && (
//               <>
//                 <span className="dot" aria-hidden="true">
//                   •
//                 </span>
//                 <span className="destination">
//                   <IcoMapPin /> {visa.country}
//                 </span>
//               </>
//             )}
//             {visa.subject && (
//               <>
//                 <span className="dot" aria-hidden="true">
//                   •
//                 </span>
//                 <span className="category">{visa.subject}</span>
//               </>
//             )}
//             {visa.visa_type && (
//               <>
//                 <span className="dot" aria-hidden="true">
//                   •
//                 </span>
//                 <span className="type">{visa.visa_type}</span>
//               </>
//             )}
//           </div>
//           <div className="quick-tags compact-tags">
//             {visa.country && (
//               <span className="qt">
//                 <IcoFlag /> {visa.country}
//               </span>
//             )}
//             {visa.subject && (
//               <span className="qt">
//                 <IcoCheck /> {visa.subject}
//               </span>
//             )}
//             {visa.visa_type && (
//               <span className="qt">
//                 <IcoDocument /> {visa.visa_type}
//               </span>
//             )}
//             {visa.processing_time && (
//               <span className="qt">
//                 <IcoClock /> {visa.processing_time}
//               </span>
//             )}
//           </div>
//         </header>

//         {/* Visa Details - Above Overview */}
//         <SectionCard
//           id="details"
//           title="Visa Details"
//           className="visa-details-card"
//         >
//           <div className="features-grid compact-grid">
//             {visa.country && (
//               <div className="feature-item compact-item">
//                 <IcoFlag />
//                 <div>
//                   <div className="feature-label">Country</div>
//                   <div className="feature-value">{visa.country}</div>
//                 </div>
//               </div>
//             )}
//             {visa.visa_type && (
//               <div className="feature-item compact-item">
//                 <IcoDocument />
//                 <div>
//                   <div className="feature-label">Visa Type</div>
//                   <div className="feature-value">{visa.visa_type}</div>
//                 </div>
//               </div>
//             )}
//             {visa.processing_time && (
//               <div className="feature-item compact-item">
//                 <IcoClock />
//                 <div>
//                   <div className="feature-label">Processing Time</div>
//                   <div className="feature-value">{visa.processing_time}</div>
//                 </div>
//               </div>
//             )}
//             {visa.validity && (
//               <div className="feature-item compact-item">
//                 <IcoCalendarRange />
//                 <div>
//                   <div className="feature-label">Validity</div>
//                   <div className="feature-value">{visa.validity}</div>
//                 </div>
//               </div>
//             )}
//             {visa.entry_type && (
//               <div className="feature-item compact-item">
//                 <IcoEntry />
//                 <div>
//                   <div className="feature-label">Entry Type</div>
//                   <div className="feature-value">{visa.entry_type}</div>
//                 </div>
//               </div>
//             )}
//             {PRICE > 0 && (
//               <div className="feature-item compact-item">
//                 <IcoPrice />
//                 <div>
//                   <div className="feature-label">Price</div>
//                   <div className="feature-value">USD {PRICE.toFixed(2)}</div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </SectionCard>

//         {/* Overview */}
//         <SectionCard id="overview" title="Overview">
//           {visa.overview ? (
//             <div
//               className="prose prose-slate max-w-none compact-prose"
//               dangerouslySetInnerHTML={{ __html: visa.overview }}
//             />
//           ) : (
//             <div className="no-content">
//               <IcoInfo />
//               <p>No additional details were provided for this visa.</p>
//             </div>
//           )}
//         </SectionCard>

//         {/* Requirements Section */}
//         {visa.requirements && (
//           <SectionCard id="requirements" title="Requirements">
//             <div
//               className="prose prose-slate max-w-none compact-prose"
//               dangerouslySetInnerHTML={{ __html: visa.requirements }}
//             />
//           </SectionCard>
//         )}

//         {/* Enquiry Modal */}
//         {showEnquiry && (
//           <div className="enq-backdrop" onClick={closeEnquiry}>
//             <div className="enq-modal" onClick={(e) => e.stopPropagation()}>
//               <button
//                 className="enq-close"
//                 onClick={closeEnquiry}
//                 aria-label="Close"
//               >
//                 ×
//               </button>
//               <div style={{ padding: "20px" }}>
//                 Enquiry Form Component Would Go Here
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Auth Required Modal */}
//         {showAuthModal && (
//           <div
//             className="auth-modal-backdrop"
//             onClick={() => setShowAuthModal(false)}
//           >
//             <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
//               <div className="auth-modal-header">
//                 <IcoShieldCheck />
//                 <h3>Login Required</h3>
//               </div>
//               <div className="auth-modal-body">
//                 <p>
//                   Please login to apply for a visa and access our secure
//                   application process.
//                 </p>
//               </div>
//               <div className="auth-modal-actions">
//                 <button
//                   className="btn ghost"
//                   onClick={() => setShowAuthModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="btn primary"
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

//       <style jsx>{`
//         /* Visa Detail Page Specific Styles */
//         .visa-detail-page {
//           max-width: 1200px;
//           margin: 0 auto;
//           padding: 0 16px;
//         }

//         .compact-layout {
//           max-width: 1000px;
//           margin: 0 auto;
//         }

//         /* Compact Hero Section */
//         .compact-hero {
//           margin-bottom: 24px;
//         }

//         .compact-hero-inner {
//           height: 400px;
//           border-radius: 16px;
//           overflow: hidden;
//           position: relative;
//         }

//         .compact-ribbon {
//           top: 16px;
//           left: 16px;
//           padding: 8px 12px;
//           font-size: 14px;
//           background: #e66024;
//           backdrop-filter: blur(10px);
//           border: 1px solid rgba(255, 255, 255, 0.2);
//         }

//         .compact-floating {
//           top: 16px;
//           right: 16px;
//           padding: 20px;
//           max-width: 280px;
//           background: rgba(255, 255, 255, 0.95);
//           backdrop-filter: blur(10px);
//           border: 1px solid rgba(255, 255, 255, 0.2);
//         }

//         .compact-features {
//           gap: 12px;
//         }

//         .compact-gallery {
//           bottom: 16px;
//           right: 16px;
//           gap: 8px;
//         }

//         .compact-gallery img {
//           width: 60px;
//           height: 60px;
//           border-radius: 8px;
//           border: 2px solid white;
//         }

//         /* Compact Title Section */
//         .compact-title {
//           margin: 24px 0;
//           padding: 0;
//         }

//         .compact-title .title {
//           font-size: 24px;
//           margin-bottom: 8px;
//           color: #1e293b;
//         }

//         .compact-tags {
//           margin-top: 12px;
//           gap: 8px;
//         }

//         .compact-tags .qt {
//           padding: 6px 12px;
//           font-size: 13px;
//           background: #f8fafc;
//           border: 1px solid #e2e8f0;
//           border-radius: 20px;
//         }

//         /* Visa Details Card */
//         .visa-details-card {
//           margin-bottom: 24px;
//         }

//         .compact-grid {
//           grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//           gap: 16px;
//         }

//         .compact-item {
//           padding: 16px;
//           border-radius: 12px;
//           background: #f8fafc;
//           border: 1px solid #e2e8f0;
//           transition: all 0.2s ease;
//         }

//         .compact-item:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//         }

//         .compact-prose {
//           font-size: 14px;
//           line-height: 1.6;
//         }

//         /* Enhanced Section Cards */
//         .section-card {
//           background: white;
//           border-radius: 16px;
//           padding: 24px;
//           margin-bottom: 24px;
//           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
//           border: 1px solid #f1f5f9;
//         }

//         .section-card__head {
//           margin-bottom: 16px;
//           padding-bottom: 12px;
//           border-bottom: 2px solid #f1f5f9;
//         }

//         .section-title {
//           font-size: 20px;
//           font-weight: 600;
//           color: #1e293b;
//           margin: 0;
//         }

//         /* Feature Items */
//         .feature-item {
//           display: flex;
//           align-items: flex-start;
//           gap: 12px;
//         }

//         .feature-label {
//           font-size: 12px;
//           color: #64748b;
//           font-weight: 500;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//           margin-bottom: 4px;
//         }

//         .feature-value {
//           font-size: 14px;
//           color: #1e293b;
//           font-weight: 600;
//         }

//         /* Loading States */
//         .loading-container {
//           text-align: center;
//           padding: 60px 20px;
//         }

//         .loading-spinner {
//           width: 40px;
//           height: 40px;
//           border: 3px solid #f1f5f9;
//           border-top: 3px solid var(--brand);
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//           margin: 0 auto 16px;
//         }

//         @keyframes spin {
//           0% {
//             transform: rotate(0deg);
//           }
//           100% {
//             transform: rotate(360deg);
//           }
//         }

//         /* Error States */
//         .error-container {
//           text-align: center;
//           padding: 60px 20px;
//         }

//         .error-icon {
//           font-size: 48px;
//           margin-bottom: 16px;
//         }

//         .error-actions {
//           display: flex;
//           gap: 12px;
//           justify-content: center;
//           margin-top: 20px;
//           flex-wrap: wrap;
//         }

//         /* Button Enhancements */
//         .btn {
//           padding: 10px 20px;
//           border-radius: 8px;
//           font-weight: 500;
//           transition: all 0.2s ease;
//           border: none;
//           cursor: pointer;
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           font-size: 14px;
//         }

//         .btn.primary {
//           background: var(--brand);
//           color: white;
//         }

//         .btn.primary:hover {
//           background: #e55a1c;
//           transform: translateY(-1px);
//         }

//         .btn.ghost {
//           background: transparent;
//           color: #64748b;
//           border: 1px solid #e2e8f0;
//         }

//         .btn.ghost:hover {
//           background: #f8fafc;
//           color: #475569;
//         }

//         /* Mobile Responsive */
//         @media (max-width: 768px) {
//           .visa-detail-page {
//             padding: 0 12px;
//           }

//           .compact-hero-inner {
//             height: 300px;
//             border-radius: 12px;
//           }

//           .compact-floating {
//             display: none;
//           }

//           .compact-mobile-cta {
//             margin-top: 16px;
//             border-radius: 12px;
//             padding: 16px;
//             background: white;
//             box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//           }

//           .compact-title .title {
//             font-size: 20px;
//           }

//           .compact-grid {
//             grid-template-columns: 1fr;
//             gap: 12px;
//           }

//           .compact-item {
//             padding: 12px;
//           }

//           .crumbs {
//             font-size: 13px;
//             margin-bottom: 16px;
//           }
//         }

//         @media (max-width: 480px) {
//           .compact-hero-inner {
//             height: 250px;
//           }

//           .compact-title .title {
//             font-size: 18px;
//           }

//           .compact-tags {
//             flex-wrap: wrap;
//           }

//           .compact-tags .qt {
//             font-size: 12px;
//             padding: 4px 10px;
//           }

//           .section-card {
//             padding: 16px;
//             border-radius: 12px;
//           }

//           .section-title {
//             font-size: 18px;
//           }
//         }
//       `}</style>
//     </main>
//   );
// }

// // Enhanced Icons for Visa Page
// function IcoFlag() {
//   return (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M3 3h4l1.5 4.5L7 9l-1.5-1.5L3 7V3zm0 16v-4h4l1.5 1.5L7 15l1.5-1.5L12 15h9v4H3z" />
//     </svg>
//   );
// }

// function IcoDocument() {
//   return (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 16h-2v-2h2v2zm0-4h-2v-4h2v4zm-1-9V3.5L18.5 9H13z" />
//     </svg>
//   );
// }

// function IcoEntry() {
//   return (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
//     </svg>
//   );
// }

// function IcoSupport() {
//   return (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="#3B82F6">
//       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16h2v-2h-2v2zm2.07-7.75l-.9.92C11.45 11.9 11 12.5 11 14h2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
//     </svg>
//   );
// }

// function IcoCalendarRange() {
//   return (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M7 2a1 1 0 1 1 2 0v1h6V2a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v3H2V6a3 3 0 0 1 3-3h1V2a1 1 0 1 1 2 0v1z"></path>
//       <path d="M2 10h20v8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z"></path>
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
//       fill="#10B981"
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
//       fill="#3B82F6"
//     >
//       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
//     </svg>
//   );
// }

// function IcoPrice() {
//   return (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.32c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.35-1.79-2.96-3.66-3.42z"></path>
//     </svg>
//   );
// }

// function IcoImage() {
//   return (
//     <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"></path>
//     </svg>
//   );
// }

// function IcoInfo() {
//   return (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
//     </svg>
//   );
// }

// function IcoMapPin() {
//   return (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"></path>
//     </svg>
//   );
// }

// function IcoCheck({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="18"
//       height="18"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M20.285 2l-11.99 11.99-4.58-4.58L2 11.125l6.295 6.295L22 3.715z"></path>
//     </svg>
//   );
// // }

// import { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { useCurrency } from "../../contexts/CurrencyContext"; // ✅ Import context

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

// export default function VisasDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const API_BASE = import.meta.env.VITE_API_URL;
//   const [visa, setVisa] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showEnquiry, setShowEnquiry] = useState(false);
//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const { convertAndFormat } = useCurrency(); // ✅ from context

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
//     // Navigate to Visa Apply page and pass current visa via state
//     navigate(`/visas/${id}/apply`, { state: { visa } });
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

//   // Load visa by id
//   useEffect(() => {
//     let ignore = false;
//     (async () => {
//       try {
//         setLoading(true);
//         setError("");
//         const res = await fetch(`${API_BASE}/api/visas/${id}`);
//         const json = await res.json();
//         if (!res.ok || !json?.success)
//           throw new Error(json?.error || "Failed to load visa");
//         if (!ignore) setVisa(json.data);
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
//     if (!visa) return [];
//     // if images array exists, use it
//     if (Array.isArray(visa.images) && visa.images.length) return visa.images;
//     // fallback: use single image string
//     if (visa.image) return [visa.image];
//     return [];
//   }, [visa]);

//   const hero = images[0]
//     ? `${API_BASE}/uploads/visas/${images[0]}`
//     : "https://via.placeholder.com/1600x900?text=Visa+Image";
//   const gallery = images
//     .slice(1, 4)
//     .map((n) => `${API_BASE}/uploads/visas/${n}`);

//   if (loading) {
//     return (
//       <main className="min-h-screen bg-gray-50">
//         <div className="max-w-4xl mx-auto px-4 py-8">
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
//             <p className="text-gray-600">Loading visa details...</p>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   if (error || !visa) {
//     return (
//       <main className="min-h-screen bg-gray-50">
//         <div className="max-w-4xl mx-auto px-4 py-8">
//           <div className="text-center py-20">
//             <div className="text-4xl mb-4">⚠️</div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">
//               Unable to Load Visa
//             </h2>
//             <p className="text-gray-600 mb-6">
//               {error || "The requested visa was not found."}
//             </p>
//             <div className="flex gap-3 justify-center flex-wrap">
//               <button
//                 onClick={() => navigate(-1)}
//                 className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 Go Back
//               </button>
//               <button
//                 onClick={() => navigate("/visas")}
//                 className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
//               >
//                 Browse Visas
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   const PRICE = Number(visa.price || 0);
//   const TITLE = `${visa.country} Visa`;

//   return (
//     <main className="min-h-screen bg-gray-50" style={{ "--brand": BRAND }}>
//       <div className="max-w-4xl mx-auto px-4 py-6">
//         {/* Breadcrumb */}
//         <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
//           <a href="/" className="hover:text-orange-500 transition-colors">
//             Home
//           </a>
//           <span>/</span>
//           <a href="/visas" className="hover:text-orange-500 transition-colors">
//             Visas
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
//                 <IcoImage className="w-12 h-12 mb-2" />
//                 <span>No image available</span>
//               </div>
//             )}

//             {/* Gradient Overlay */}
//             <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />

//             {/* Country Ribbon */}
//             {visa.country && (
//               <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
//                 <IcoFlag className="w-4 h-4" />
//                 <span>{visa.country}</span>
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
//                 <div className="text-xs text-gray-500 mt-1">per visa</div>
//               </div>

//               <div className="mb-4">
//                 <button
//                   onClick={openEnquiry}
//                   className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
//                 >
//                   <IcoCheck className="w-5 h-5" />
//                   <span>Apply Now</span>
//                 </button>
//               </div>

//               <div className="space-y-3 text-xs text-gray-600">
//                 <div className="flex items-center gap-2">
//                   <IcoShieldCheck className="w-4 h-4 text-green-500" />
//                   <span>Secure Processing</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <IcoClock className="w-4 h-4 text-blue-500" />
//                   <span>Fast Approval</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <IcoSupport className="w-4 h-4 text-blue-500" />
//                   <span>Expert Support</span>
//                 </div>
//               </div>
//             </aside>

//             {/* Mini Gallery */}
//             {gallery.length > 0 && (
//               <div className="absolute bottom-4 right-4 flex gap-2">
//                 {gallery.map((g, i) => (
//                   <img
//                     key={i}
//                     src={g}
//                     alt={`Visa image ${i + 1}`}
//                     className="w-16 h-16 rounded-lg border-2 border-white shadow-md object-cover"
//                   />
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Mobile CTA */}
//           <div className="lg:hidden bg-white rounded-xl shadow-sm p-4 mt-4 border border-gray-100">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <span className="text-xs text-gray-500 block">From</span>
//                 <strong className="text-xl font-bold text-gray-900">
//                   {convertAndFormat(PRICE)}
//                 </strong>
//                 <span className="text-xs text-gray-500 block">per visa</span>
//               </div>
//               <button
//                 onClick={openEnquiry}
//                 className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
//               >
//                 <IcoCheck className="w-5 h-5" />
//                 <span>Apply Now</span>
//               </button>
//             </div>

//             <div className="flex justify-around border-t border-gray-100 pt-4">
//               <div className="flex items-center gap-2 text-xs text-gray-600">
//                 <IcoShieldCheck className="w-4 h-4 text-green-500" />
//                 <span>Secure</span>
//               </div>
//               <div className="flex items-center gap-2 text-xs text-gray-600">
//                 <IcoClock className="w-4 h-4 text-blue-500" />
//                 <span>Fast</span>
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
//             {visa.country && (
//               <div className="flex items-center gap-1">
//                 <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
//                 <IcoMapPin className="w-4 h-4" />
//                 <span className="text-sm">{visa.country}</span>
//               </div>
//             )}
//             {visa.subject && (
//               <div className="flex items-center gap-1">
//                 <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
//                 <span className="text-sm">{visa.subject}</span>
//               </div>
//             )}
//             {visa.visa_type && (
//               <div className="flex items-center gap-1">
//                 <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
//                 <span className="text-sm">{visa.visa_type}</span>
//               </div>
//             )}
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {visa.country && (
//               <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
//                 <IcoFlag className="w-4 h-4" />
//                 {visa.country}
//               </span>
//             )}
//             {visa.subject && (
//               <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
//                 <IcoCheck className="w-4 h-4" />
//                 {visa.subject}
//               </span>
//             )}
//             {visa.visa_type && (
//               <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
//                 <IcoDocument className="w-4 h-4" />
//                 {visa.visa_type}
//               </span>
//             )}
//             {visa.processing_time && (
//               <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
//                 <IcoClock className="w-4 h-4" />
//                 {visa.processing_time}
//               </span>
//             )}
//           </div>
//         </header>

//         {/* Visa Details */}
//         <SectionCard
//           id="details"
//           title="Visa Details"
//           className="visa-details-card"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {visa.country && (
//               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
//                 <IcoFlag className="w-6 h-6 text-orange-500 mt-1" />
//                 <div>
//                   <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
//                     Country
//                   </div>
//                   <div className="text-gray-900 font-medium">
//                     {visa.country}
//                   </div>
//                 </div>
//               </div>
//             )}
//             {visa.visa_type && (
//               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
//                 <IcoDocument className="w-6 h-6 text-orange-500 mt-1" />
//                 <div>
//                   <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
//                     Visa Type
//                   </div>
//                   <div className="text-gray-900 font-medium">
//                     {visa.visa_type}
//                   </div>
//                 </div>
//               </div>
//             )}
//             {visa.processing_time && (
//               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
//                 <IcoClock className="w-6 h-6 text-orange-500 mt-1" />
//                 <div>
//                   <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
//                     Processing Time
//                   </div>
//                   <div className="text-gray-900 font-medium">
//                     {visa.processing_time}
//                   </div>
//                 </div>
//               </div>
//             )}
//             {visa.validity && (
//               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
//                 <IcoCalendarRange className="w-6 h-6 text-orange-500 mt-1" />
//                 <div>
//                   <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
//                     Validity
//                   </div>
//                   <div className="text-gray-900 font-medium">
//                     {visa.validity}
//                   </div>
//                 </div>
//               </div>
//             )}
//             {visa.entry_type && (
//               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
//                 <IcoEntry className="w-6 h-6 text-orange-500 mt-1" />
//                 <div>
//                   <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
//                     Entry Type
//                   </div>
//                   <div className="text-gray-900 font-medium">
//                     {visa.entry_type}
//                   </div>
//                 </div>
//               </div>
//             )}
//             {PRICE > 0 && (
//               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
//                 <IcoPrice className="w-6 h-6 text-orange-500 mt-1" />
//                 <div>
//                   <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
//                     Price
//                   </div>
//                   <div className="text-gray-900 font-medium">
//                     {convertAndFormat(PRICE)}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </SectionCard>

//         {/* Overview */}
//         <SectionCard id="overview" title="Overview">
//           {visa.overview ? (
//             <div
//               className="prose prose-gray max-w-none"
//               dangerouslySetInnerHTML={{ __html: visa.overview }}
//             />
//           ) : (
//             <div className="flex items-center gap-3 text-gray-500">
//               <IcoInfo className="w-5 h-5" />
//               <p>No additional details were provided for this visa.</p>
//             </div>
//           )}
//         </SectionCard>

//         {/* Requirements Section */}
//         {visa.requirements && (
//           <SectionCard id="requirements" title="Requirements">
//             <div
//               className="prose prose-gray max-w-none"
//               dangerouslySetInnerHTML={{ __html: visa.requirements }}
//             />
//           </SectionCard>
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
//                   Please login to apply for a visa and access our secure
//                   application process.
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

// // Enhanced Icons for Visa Page
// function IcoFlag({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="20"
//       height="20"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M3 3h4l1.5 4.5L7 9l-1.5-1.5L3 7V3zm0 16v-4h4l1.5 1.5L7 15l1.5-1.5L12 15h9v4H3z" />
//     </svg>
//   );
// }

// function IcoDocument({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="20"
//       height="20"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 16h-2v-2h2v2zm0-4h-2v-4h2v4zm-1-9V3.5L18.5 9H13z" />
//     </svg>
//   );
// }

// function IcoEntry({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="20"
//       height="20"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
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

// function IcoImage({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"></path>
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

// function IcoCheck({ className = "" }) {
//   return (
//     <svg
//       className={className}
//       width="18"
//       height="18"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M20.285 2l-11.99 11.99-4.58-4.58L2 11.125l6.295 6.295L22 3.715z"></path>
//     </svg>
//   );
// }

// import { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { useCurrency } from "../../contexts/CurrencyContext";
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
//   Flag,
//   Users,
//   Zap,
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

// export default function VisasDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const API_BASE = import.meta.env.VITE_API_URL;
//   const [visa, setVisa] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const { convertAndFormat } = useCurrency();

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
//     navigate(`/visas/${id}/apply`, { state: { visa } });
//   };

//   // Load visa by id
//   useEffect(() => {
//     let ignore = false;
//     (async () => {
//       try {
//         setLoading(true);
//         setError("");
//         const res = await fetch(`${API_BASE}/api/visas/${id}`);
//         const json = await res.json();
//         if (!res.ok || !json?.success)
//           throw new Error(json?.error || "Failed to load visa");
//         if (!ignore) setVisa(json.data);
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
//     if (!visa) return [];
//     if (Array.isArray(visa.images) && visa.images.length) return visa.images;
//     if (visa.image) return [visa.image];
//     return [];
//   }, [visa]);

//   const allImages = images.map((img) => `${API_BASE}/uploads/visas/${img}`);

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

//   // Static reviews data for visas
//   const staticReviews = {
//     avg: 4.9,
//     total: 89,
//     counts: { 5: 82, 4: 6, 3: 1, 2: 0, 1: 0 },
//     items: [
//       {
//         avatar:
//           "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=200&auto=format&fit=crop",
//         name: "Priya S.",
//         date: "March 2024",
//         title: "Smooth Visa Process",
//         comment:
//           "The visa application was incredibly smooth and hassle-free. The team guided me through every step and my visa was approved within the promised timeframe. Highly recommended!",
//         rating: 5,
//       },
//       {
//         avatar:
//           "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
//         name: "Ahmed R.",
//         date: "February 2024",
//         title: "Professional Service",
//         comment:
//           "Excellent service from start to finish. The documentation support was thorough and the processing was faster than expected. Will use their services again for future travels.",
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
//             <p className="text-gray-600">Loading visa details...</p>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   if (error || !visa) {
//     return (
//       <main className="min-h-screen bg-gray-50">
//         <div className="max-w-6xl mx-auto px-4 py-8">
//           <div className="text-center py-20">
//             <div className="text-4xl mb-4">⚠️</div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">
//               Unable to Load Visa
//             </h2>
//             <p className="text-gray-600 mb-6">
//               {error || "The requested visa was not found."}
//             </p>
//             <div className="flex gap-3 justify-center flex-wrap">
//               <button
//                 onClick={() => navigate(-1)}
//                 className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 Go Back
//               </button>
//               <button
//                 onClick={() => navigate("/visas")}
//                 className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
//               >
//                 Browse Visas
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   const PRICE = Number(visa.price || 0);
//   const priceStr = convertAndFormat(PRICE);
//   const TITLE = `${visa.country} Visa`;

//   return (
//     <main className="min-h-screen bg-gray-50" style={{ "--brand": BRAND }}>
//       <div className="max-w-6xl mx-auto px-4 py-6">
//         {/* Breadcrumb */}
//         <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
//           <a href="/" className="hover:text-orange-500 transition-colors">
//             Home
//           </a>
//           <span>/</span>
//           <a href="/visas" className="hover:text-orange-500 transition-colors">
//             Visas
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
//                   <Flag className="w-16 h-16 mx-auto mb-2 opacity-50" />
//                   <p>No image available</p>
//                 </div>
//               </div>
//             )}

//             <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />

//             {/* Country Ribbon */}
//             {visa.country && (
//               <div className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-lg">
//                 <Flag className="w-4 h-4" />
//                 <span>{visa.country}</span>
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
//                   <Zap className="w-4 h-4 text-blue-600" />
//                 </div>
//                 <span className="text-gray-700 text-xs">Fast Processing</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm">
//                 <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//                   <CheckCircle className="w-4 h-4 text-blue-600" />
//                 </div>
//                 <span className="text-gray-700 text-xs">
//                   High Success Rate
//                 </span>
//               </div>
//               <div className="flex items-center gap-2 text-sm">
//                 <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//                   <ShieldCheck className="w-4 h-4 text-blue-600" />
//                 </div>
//                 <span className="text-gray-700 text-xs">Secure</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm">
//                 <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
//                   <FileText className="w-4 h-4 text-red-600" />
//                 </div>
//                 <span className="text-gray-700 text-xs">Document Support</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm">
//                 <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//                   <Globe className="w-4 h-4 text-blue-600" />
//                 </div>
//                 <span className="text-gray-700 text-xs">Online Tracking</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm">
//                 <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//                   <Users className="w-4 h-4 text-blue-600" />
//                 </div>
//                 <span className="text-gray-700 text-xs">Expert Support</span>
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
//                 <div className="text-xs text-gray-500">per visa</div>
//               </div>
//               <button
//                 onClick={openEnquiry}
//                 className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
//               >
//                 <CheckCircle className="w-5 h-5" />
//                 <span>Apply Now</span>
//               </button>
//             </div>
//           </div>
//         </header>

//         {/* Visa Details */}
//         <SectionCard id="details" title="Visa Information">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {visa.country && (
//               <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
//                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
//                   <Flag className="w-5 h-5 text-orange-500" />
//                 </div>
//                 <div>
//                   <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
//                     Country
//                   </div>
//                   <div className="text-gray-900 font-semibold">
//                     {visa.country}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {visa.visa_type && (
//               <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
//                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
//                   <FileText className="w-5 h-5 text-blue-500" />
//                 </div>
//                 <div>
//                   <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
//                     Visa Type
//                   </div>
//                   <div className="text-gray-900 font-semibold">
//                     {visa.visa_type}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {visa.processing_time && (
//               <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
//                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
//                   <Clock className="w-5 h-5 text-purple-500" />
//                 </div>
//                 <div>
//                   <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
//                     Processing Time
//                   </div>
//                   <div className="text-gray-900 font-semibold">
//                     {visa.processing_time}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {visa.validity && (
//               <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
//                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
//                   <Calendar className="w-5 h-5 text-green-500" />
//                 </div>
//                 <div>
//                   <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
//                     Validity
//                   </div>
//                   <div className="text-gray-900 font-semibold">
//                     {visa.validity}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {visa.entry_type && (
//               <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
//                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
//                   <MapPin className="w-5 h-5 text-red-500" />
//                 </div>
//                 <div>
//                   <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
//                     Entry Type
//                   </div>
//                   <div className="text-gray-900 font-semibold">
//                     {visa.entry_type}
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
//                     Visa Fee
//                   </div>
//                   <div className="text-gray-900 font-semibold">{priceStr}</div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </SectionCard>

//         {/* Overview */}
//         <SectionCard id="overview" title="Overview">
//           {visa.overview ? (
//             <div
//               className="prose prose-gray prose-sm max-w-none text-gray-700 leading-relaxed"
//               dangerouslySetInnerHTML={{ __html: visa.overview }}
//             />
//           ) : (
//             <div className="flex items-start gap-3 text-gray-500 bg-gray-50 p-4 rounded-lg">
//               <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
//               <p className="text-sm">
//                 No additional details were provided for this visa.
//               </p>
//             </div>
//           )}
//         </SectionCard>

//         {/* Requirements Section */}
//         {visa.requirements && (
//           <SectionCard id="requirements" title="Requirements & Documents">
//             <div
//               className="prose prose-gray prose-sm max-w-none text-gray-700 leading-relaxed"
//               dangerouslySetInnerHTML={{ __html: visa.requirements }}
//             />
//           </SectionCard>
//         )}

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
//                   Secure Processing
//                 </div>
//                 <div className="text-sm text-gray-600">
//                   Your data is protected
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
//                 <CheckCircle className="w-6 h-6 text-blue-500" />
//               </div>
//               <div>
//                 <div className="font-semibold text-gray-900">
//                   98% Success Rate
//                 </div>
//                 <div className="text-sm text-gray-600">
//                   High approval probability
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
//                 <Users className="w-6 h-6 text-blue-500" />
//               </div>
//               <div>
//                 <div className="font-semibold text-gray-900">Expert Support</div>
//                 <div className="text-sm text-gray-600">
//                   Visa specialists available
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
//               <CheckCircle className="w-5 h-5" />
//               <span>Apply Now</span>
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
//                 Please login to apply for a visa and access our secure
//                 application process.
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
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  Flag,
  Globe,
  Info,
  MapPin,
  MessageCircle,
  Play,
  ShieldCheck,
  Star,
  Users,
  X,
  Zap,
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

export default function VisasDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE = import.meta.env.VITE_API_URL;
  const [visa, setVisa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { convertAndFormat } = useCurrency();

  const isLoggedIn = () => {
    try {
      const u = localStorage.getItem("user");
      const t = localStorage.getItem("token");
      return !!u || !!t;
    } catch {
      return false;
    }
  };

  const openApplication = (e) => {
    e?.preventDefault?.();
    if (!isLoggedIn()) {
      setShowAuthModal(true);
      return;
    }
    // Navigate to apply page instead of showing modal
    navigate(`/visas/${id}/apply`);
  };

  // Load visa by id
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE}/api/visas/${id}`);
        const json = await res.json();
        if (!res.ok || !json?.success)
          throw new Error(json?.error || "Failed to load visa");
        if (!ignore) setVisa(json.data);
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
    if (!visa) return [];
    if (Array.isArray(visa.images) && visa.images.length) return visa.images;
    if (visa.image) return [visa.image];
    return [];
  }, [visa]);

  const allImages = images.map((img) => `${API_BASE}/uploads/visas/${img}`);
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
    return visa?.banner_video_url
      ? getYouTubeVideoId(visa.banner_video_url)
      : null;
  }, [visa?.banner_video_url]);

  // Static reviews data for visas
  const staticReviews = {
    avg: 4.9,
    total: 89,
    counts: { 5: 82, 4: 6, 3: 1, 2: 0, 1: 0 },
    items: [
      {
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        name: "Priya S.",
        date: "March 2024",
        title: "Smooth Visa Process",
        comment:
          "The visa application was incredibly smooth and hassle-free. The team guided me through every step and my visa was approved within the promised timeframe. Highly recommended!",
        rating: 5,
      },
      {
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        name: "Ahmed R.",
        date: "February 2024",
        title: "Professional Service",
        comment:
          "Excellent service from start to finish. The documentation support was thorough and the processing was faster than expected. Will use their services again for future travels.",
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
            <p className="text-gray-600">Loading visa details...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !visa) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Unable to Load Visa
            </h2>
            <p className="text-gray-600 mb-6">
              {error || "The requested visa was not found."}
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={() => navigate("/visas")}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Browse Visas
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const PRICE = Number(visa.price || 0);
  const priceStr = convertAndFormat(PRICE);
  const TITLE = `${visa.country} Visa`;

  return (
    <main
      className="min-h-screen bg-gray-50 mb-10"
      style={{ "--brand": BRAND }}
    >
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb - Hidden on mobile as per image */}
        <nav className="hidden md:flex items-center gap-2 text-sm text-gray-500 mb-6">
          <a href="/" className="hover:text-orange-500 transition-colors">
            Home
          </a>
          <span>/</span>
          <a href="/visas" className="hover:text-orange-500 transition-colors">
            Visas
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
                  <Flag className="w-16 h-16 mx-auto mb-2 opacity-50" />
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
            {/* Country Ribbon */}
            {/* {visa.country && (
              <div className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-lg">
                <Flag className="w-4 h-4" />
                <span>{visa.country}</span>
              </div>
            )} */}

            {/* Video Indicator Badge */}
            {youtubeVideoId && (
              <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-lg">
                <Play className="w-4 h-4" />
                <span>Video Guide</span>
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

          {/* Apply Now Button - Full width */}
          <button
            onClick={openApplication}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-lg mb-6 flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
            <MessageCircle className="w-6 h-6" />
            <span>Apply Now</span>
          </button>

          {/* Features List - Simple vertical layout */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Fast Processing
                  </div>
                  <div className="text-sm text-gray-600">
                    Quick visa processing time
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    High Success Rate
                  </div>
                  <div className="text-sm text-gray-600">
                    98% approval probability
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Expert Support
                  </div>
                  <div className="text-sm text-gray-600">
                    Visa specialists available
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Document Support
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Online Tracking
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Secure Processing
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visa Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Visa Information
            </h2>
            <div className="space-y-4">
              {visa.country && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Flag className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Country
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {visa.country}
                    </div>
                  </div>
                </div>
              )}

              {visa.visa_type && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Visa Type
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {visa.visa_type}
                    </div>
                  </div>
                </div>
              )}

              {visa.processing_time && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Processing Time
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {visa.processing_time}
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
                      Visa Fee
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {priceStr}
                    </div>
                  </div>
                </div>
              )}

              {visa.validity && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Validity
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {visa.validity}
                    </div>
                  </div>
                </div>
              )}

              {visa.entry_type && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Entry Type
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {visa.entry_type}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Overview</h2>
            {visa.overview ? (
              <div className="text-gray-700 leading-relaxed">
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: visa.overview }}
                />
              </div>
            ) : (
              <div className="flex items-start gap-3 text-gray-500 bg-gray-50 p-3 rounded-lg">
                <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  No additional details were provided for this visa.
                </p>
              </div>
            )}
          </div>

          {/* Requirements Section */}
          {visa.requirements && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                Requirements & Documents
              </h2>
              <div className="text-gray-700 leading-relaxed">
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: visa.requirements }}
                />
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
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 mb-1 py-4">
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    Secure Processing
                  </div>
                  <div className="text-sm text-gray-600">
                    Your data is protected
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <CheckCircle className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    98% Success Rate
                  </div>
                  <div className="text-sm text-gray-600">
                    High approval probability
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    Expert Support
                  </div>
                  <div className="text-sm text-gray-600">
                    Visa specialists available
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
                    <Zap className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 text-xs">Fast Processing</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 text-xs">
                    High Success Rate
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 text-xs">Expert Support</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-gray-700 text-xs">
                    Document Support
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 text-xs">Online Tracking</span>
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
                  <div className="text-xs text-gray-500">per visa</div>
                </div>
                <button
                  onClick={openApplication}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Apply Now</span>
                </button>
              </div>
            </div>
          </header>

          {/* Visa Details */}
          <SectionCard id="details" title="Visa Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visa.country && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Flag className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Country
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {visa.country}
                    </div>
                  </div>
                </div>
              )}

              {visa.visa_type && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Visa Type
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {visa.visa_type}
                    </div>
                  </div>
                </div>
              )}

              {visa.processing_time && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Processing Time
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {visa.processing_time}
                    </div>
                  </div>
                </div>
              )}

              {visa.validity && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Validity
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {visa.validity}
                    </div>
                  </div>
                </div>
              )}

              {visa.entry_type && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Entry Type
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {visa.entry_type}
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
                      Visa Fee
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
            {visa.overview ? (
              <div
                className="prose prose-gray prose-sm max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: visa.overview }}
              />
            ) : (
              <div className="flex items-start gap-3 text-gray-500 bg-gray-50 p-4 rounded-lg">
                <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  No additional details were provided for this visa.
                </p>
              </div>
            )}
          </SectionCard>

          {/* Requirements Section */}
          {visa.requirements && (
            <SectionCard id="requirements" title="Requirements & Documents">
              <div
                className="prose prose-gray prose-sm max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: visa.requirements }}
              />
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
                    Secure Processing
                  </div>
                  <div className="text-sm text-gray-600">
                    Your data is protected
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <CheckCircle className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    98% Success Rate
                  </div>
                  <div className="text-sm text-gray-600">
                    High approval probability
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    Expert Support
                  </div>
                  <div className="text-sm text-gray-600">
                    Visa specialists available
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
              onClick={openApplication}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Apply Now</span>
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
                Please login to apply for a visa and access our secure
                application process.
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
