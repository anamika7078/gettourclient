// import { useEffect, useMemo, useState } from "react";
// import { Link, useNavigate, useSearchParams } from "react-router-dom";

// /**
//  * Reset page (calls backend /api/users/reset-password)
//  * Expects token and id in query params: /reset?token=...&id=...
//  */
// export default function Reset({
//   themeColor = "#F17232",
//   slides,
//   rotateIntervalMs = 5000,
// }) {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const token = searchParams.get("token") || "";
//   const id = searchParams.get("id") || "";

//   const defaultSlides = useMemo(
//     () => [
//       "https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1600&auto=format&fit=crop",
//       "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1600&auto=format&fit=crop",
//       "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1600&auto=format&fit=crop",
//       "https://images.unsplash.com/photo-1484494789010-20fc1a011197?q=80&w=1600&auto=format&fit=crop",
//     ],
//     []
//   );
//   const images = slides?.length ? slides.slice(0, 8) : defaultSlides;

//   const [active, setActive] = useState(0);
//   useEffect(() => {
//     if (!images.length) return;
//     const idInt = setInterval(
//       () => setActive((i) => (i + 1) % images.length),
//       rotateIntervalMs
//     );
//     return () => clearInterval(idInt);
//   }, [images.length, rotateIntervalMs]);

//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [showPw1, setShowPw1] = useState(false);
//   const [showPw2, setShowPw2] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");
//   const [error, setError] = useState("");

//   const colorVars = {
//     "--primary": themeColor,
//     "--primary-600": shade(themeColor, -8),
//     "--primary-700": shade(themeColor, -14),
//     "--primary-800": shade(themeColor, -20),
//   };

//   useEffect(() => {
//     if (!token || !id) {
//       setError("Invalid reset link. Missing token or id.");
//     }
//   }, [token, id]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMsg("");
//     if (!password || password.length < 6) {
//       setError("Password must be at least 6 characters.");
//       return;
//     }
//     if (password !== confirm) {
//       setError("Passwords do not match.");
//       return;
//     }
//     if (!token || !id) {
//       setError("Missing token or id.");
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await fetch(
//         "http://localhost:5000/api/users/reset-password",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ token, id, password }),
//         }
//       );
//       const data = await res.json();
//       if (res.ok) {
//         setMsg(data?.message || "Password reset successful");
//         // optionally redirect to login after a short delay
//         setTimeout(() => navigate("/login"), 1500);
//       } else {
//         setError(data?.message || "Unable to reset password");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-neutral-50" style={colorVars}>
//       <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
//           {/* Left carousel */}
//           <div className="lg:col-span-5">
//             <div className="relative h-[340px] sm:h-[420px] lg:h-[610px] rounded-[28px] overflow-hidden bg-black/5 ring-1 ring-black/10">
//               {images.map((src, idx) => (
//                 <img
//                   key={idx}
//                   src={src}
//                   alt="Travel scene"
//                   className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
//                     idx === active ? "opacity-100" : "opacity-0"
//                   }`}
//                   loading={idx === 0 ? "eager" : "lazy"}
//                 />
//               ))}
//               <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
//               <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2">
//                 {images.map((_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setActive(i)}
//                     aria-label={`Go to slide ${i + 1}`}
//                     className={`h-2 rounded-full transition-all ${
//                       i === active
//                         ? "w-6 bg-[var(--primary)]"
//                         : "w-2 bg-white/70 hover:bg-white"
//                     }`}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Right form */}
//           <div className="lg:col-span-7">
//             <div className="mx-auto max-w-xl">
//               <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
//                 Reset Password
//               </h1>
//               <p className="mt-2 text-neutral-500">
//                 Create a new password for your account.
//               </p>

//               <div className="mt-6 rounded-2xl bg-white shadow-[0_8px_28px_rgba(0,0,0,0.08)] ring-1 ring-black/5 p-4 sm:p-6">
//                 {error && <p className="text-sm text-red-600">{error}</p>}
//                 {msg && <p className="text-sm text-green-600">{msg}</p>}
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div>
//                     <label
//                       htmlFor="password"
//                       className="mb-1.5 block text-sm font-medium text-neutral-800"
//                     >
//                       New Password
//                     </label>
//                     <div className="relative">
//                       <input
//                         id="password"
//                         type={showPw1 ? "text" : "password"}
//                         placeholder="Enter new password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                         className="w-full rounded-xl border-2 border-neutral-700/90 focus:border-[var(--primary)] px-3 py-3 pr-11 outline-none transition"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPw1((v) => !v)}
//                         className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-grid place-items-center h-8 w-8 rounded-md text-neutral-500 hover:text-neutral-700"
//                         aria-label={showPw1 ? "Hide password" : "Show password"}
//                       >
//                         {showPw1 ? (
//                           <EyeOffIcon className="h-5 w-5" />
//                         ) : (
//                           <EyeIcon className="h-5 w-5" />
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="confirm"
//                       className="mb-1.5 block text-sm font-medium text-neutral-800"
//                     >
//                       Confirm Password
//                     </label>
//                     <div className="relative">
//                       <input
//                         id="confirm"
//                         type={showPw2 ? "text" : "password"}
//                         placeholder="Re-enter new password"
//                         value={confirm}
//                         onChange={(e) => setConfirm(e.target.value)}
//                         required
//                         className="w-full rounded-xl border-2 border-neutral-700/90 focus:border-[var(--primary)] px-3 py-3 pr-11 outline-none transition"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPw2((v) => !v)}
//                         className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-grid place-items-center h-8 w-8 rounded-md text-neutral-500 hover:text-neutral-700"
//                         aria-label={showPw2 ? "Hide password" : "Show password"}
//                       >
//                         {showPw2 ? (
//                           <EyeOffIcon className="h-5 w-5" />
//                         ) : (
//                           <EyeIcon className="h-5 w-5" />
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-600)] active:bg-[var(--primary-700)] text-white font-medium py-3.5 transition shadow-[0_6px_20px_rgba(241,114,50,0.35)]"
//                   >
//                     {loading ? "Resetting..." : "Reset Password"}
//                   </button>

//                   <p className="text-center text-sm text-neutral-600">
//                     Back to{" "}
//                     <Link
//                       to="/login"
//                       className="font-medium text-[var(--primary)] hover:text-[var(--primary-700)]"
//                     >
//                       Login
//                     </Link>
//                   </p>
//                 </form>
//               </div>
//             </div>
//           </div>
//           {/* End right */}
//         </div>
//       </div>
//     </main>
//   );
// }

// /* ---------------- Icons ---------------- */
// function EyeIcon(props) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" {...props}>
//       <path
//         d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"
//         stroke="currentColor"
//         strokeWidth="1.5"
//       />
//       <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
//     </svg>
//   );
// }
// function EyeOffIcon(props) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" {...props}>
//       <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.5" />
//       <path
//         d="M10.6 6.2C11.06 6.07 11.52 6 12 6c6 0 10 6 10 6a17 17 0 0 1-4.12 4.74M6.86 8.12A16.5 16.5 0 0 0 2 12s4 6 10 6c1.1 0 2.14-.2 3.12-.56"
//         stroke="currentColor"
//         strokeWidth="1.5"
//       />
//       <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
//     </svg>
//   );
// }

// /* ---------------- Utils ---------------- */
// function shade(hex, percent = -10) {
//   const col = hex.replace("#", "");
//   const r = parseInt(col.substring(0, 2), 16);
//   const g = parseInt(col.substring(2, 4), 16);
//   const b = parseInt(col.substring(4, 6), 16);
//   const amt = Math.round(2.55 * percent);
//   const R = clamp(r + amt, 0, 255);
//   const G = clamp(g + amt, 0, 255);
//   const B = clamp(b + amt, 0, 255);
//   return "#" + [R, G, B].map((v) => v.toString(16).padStart(2, "0")).join("");
// }
// function clamp(n, min, max) {
//   return Math.max(min, Math.min(max, n));
// }

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

/**
 * Reset page (calls backend /api/users/reset-password)
 * Expects token and id in query params: /reset?token=...&id=...
 */
export default function Reset({
  themeColor = "#F17232",
  slides,
  rotateIntervalMs = 5000,
}) {
  const API_URL = import.meta.env.VITE_API_URL;

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const id = searchParams.get("id") || "";

  const defaultSlides = useMemo(
    () => [
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484494789010-20fc1a011197?q=80&w=1600&auto=format&fit=crop",
    ],
    []
  );
  const images = slides?.length ? slides.slice(0, 8) : defaultSlides;

  const [active, setActive] = useState(0);
  useEffect(() => {
    if (!images.length) return;
    const idInt = setInterval(
      () => setActive((i) => (i + 1) % images.length),
      rotateIntervalMs
    );
    return () => clearInterval(idInt);
  }, [images.length, rotateIntervalMs]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw1, setShowPw1] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const colorVars = {
    "--primary": themeColor,
    "--primary-600": shade(themeColor, -8),
    "--primary-700": shade(themeColor, -14),
    "--primary-800": shade(themeColor, -20),
  };

  useEffect(() => {
    if (!token || !id) {
      setError("Invalid reset link. Missing token or id.");
    }
  }, [token, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!token || !id) {
      setError("Missing token or id.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, id, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(data?.message || "Password reset successful");
        // optionally redirect to login after a short delay
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(data?.message || "Unable to reset password");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50" style={colorVars}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left carousel */}
          <div className="lg:col-span-5">
            <div className="relative h-[340px] sm:h-[420px] lg:h-[610px] rounded-[28px] overflow-hidden bg-black/5 ring-1 ring-black/10">
              {images.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt="Travel scene"
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                    idx === active ? "opacity-100" : "opacity-0"
                  }`}
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              ))}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      i === active
                        ? "w-6 bg-[var(--primary)]"
                        : "w-2 bg-white/70 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className="lg:col-span-7">
            <div className="mx-auto max-w-xl">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                Reset Password
              </h1>
              <p className="mt-2 text-neutral-500">
                Create a new password for your account.
              </p>

              <div className="mt-6 rounded-2xl bg-white shadow-[0_8px_28px_rgba(0,0,0,0.08)] ring-1 ring-black/5 p-4 sm:p-6">
                {error && <p className="text-sm text-red-600">{error}</p>}
                {msg && <p className="text-sm text-green-600">{msg}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-1.5 block text-sm font-medium text-neutral-800"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPw1 ? "text" : "password"}
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full rounded-xl border-2 border-neutral-700/90 focus:border-[var(--primary)] px-3 py-3 pr-11 outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw1((v) => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-grid place-items-center h-8 w-8 rounded-md text-neutral-500 hover:text-neutral-700"
                        aria-label={showPw1 ? "Hide password" : "Show password"}
                      >
                        {showPw1 ? (
                          <EyeOffIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirm"
                      className="mb-1.5 block text-sm font-medium text-neutral-800"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirm"
                        type={showPw2 ? "text" : "password"}
                        placeholder="Re-enter new password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                        className="w-full rounded-xl border-2 border-neutral-700/90 focus:border-[var(--primary)] px-3 py-3 pr-11 outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw2((v) => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-grid place-items-center h-8 w-8 rounded-md text-neutral-500 hover:text-neutral-700"
                        aria-label={showPw2 ? "Hide password" : "Show password"}
                      >
                        {showPw2 ? (
                          <EyeOffIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-600)] active:bg-[var(--primary-700)] text-white font-medium py-3.5 transition shadow-[0_6px_20px_rgba(241,114,50,0.35)]"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>

                  <p className="text-center text-sm text-neutral-600">
                    Back to{" "}
                    <Link
                      to="/login"
                      className="font-medium text-[var(--primary)] hover:text-[var(--primary-700)]"
                    >
                      Login
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
          {/* End right */}
        </div>
      </div>
    </main>
  );
}

/* ---------------- Icons ---------------- */
function EyeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function EyeOffIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10.6 6.2C11.06 6.07 11.52 6 12 6c6 0 10 6 10 6a17 17 0 0 1-4.12 4.74M6.86 8.12A16.5 16.5 0 0 0 2 12s4 6 10 6c1.1 0 2.14-.2 3.12-.56"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/* ---------------- Utils ---------------- */
function shade(hex, percent = -10) {
  const col = hex.replace("#", "");
  const r = parseInt(col.substring(0, 2), 16);
  const g = parseInt(col.substring(2, 4), 16);
  const b = parseInt(col.substring(4, 6), 16);
  const amt = Math.round(2.55 * percent);
  const R = clamp(r + amt, 0, 255);
  const G = clamp(g + amt, 0, 255);
  const B = clamp(b + amt, 0, 255);
  return "#" + [R, G, B].map((v) => v.toString(16).padStart(2, "0")).join("");
}
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
