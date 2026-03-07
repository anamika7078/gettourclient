

// import { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";

// /**
//  * Forget page (calls backend /api/users/forgot-password)
//  */
// export default function Forget({
//   themeColor = "#F17232",
//   slides,
//   rotateIntervalMs = 5000,
// }) {
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
//     const id = setInterval(
//       () => setActive((i) => (i + 1) % images.length),
//       rotateIntervalMs
//     );
//     return () => clearInterval(id);
//   }, [images.length, rotateIntervalMs]);

//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");

//   const colorVars = {
//     "--primary": themeColor,
//     "--primary-600": shade(themeColor, -8),
//     "--primary-700": shade(themeColor, -14),
//     "--primary-800": shade(themeColor, -20),
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const value = email.trim();
//     if (!value) {
//       setMsg("Please enter your email.");
//       return;
//     }
//     setLoading(true);
//     setMsg("");
//     try {
//       const res = await fetch(
//         "http://localhost:5000/api/users/forgot-password",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email: value }),
//         }
//       );
//       const data = await res.json();
//       if (res.ok) {
//         setMsg(
//           data?.message || "If the account exists, a reset link has been sent."
//         );
//       } else {
//         setMsg(data?.message || "Unable to send reset link. Try again later.");
//       }
//     } catch (err) {
//       console.error(err);
//       setMsg("Something went wrong. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-neutral-50" style={colorVars}>
//       <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
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

//           <div className="lg:col-span-7">
//             <div className="mx-auto max-w-xl">
//               <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
//                 Forgot Password
//               </h1>
//               <p className="mt-2 text-neutral-500">
//                 Enter your email and we'll send you a reset link.
//               </p>

//               <div className="mt-6 rounded-2xl bg-white shadow-[0_8px_28px_rgba(0,0,0,0.08)] ring-1 ring-black/5 p-4 sm:p-6">
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   {msg && <p className="text-sm text-neutral-700">{msg}</p>}
//                   <div>
//                     <label
//                       htmlFor="email"
//                       className="mb-1.5 block text-sm font-medium text-neutral-800"
//                     >
//                       Email
//                     </label>
//                     <input
//                       id="email"
//                       type="email"
//                       inputMode="email"
//                       placeholder="Enter your email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       required
//                       className="w-full rounded-xl border-2 border-neutral-700/90 focus:border-[var(--primary)] px-3 py-3 outline-none transition"
//                     />
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-600)] active:bg-[var(--primary-700)] text-white font-medium py-3.5 transition shadow-[0_6px_20px_rgba(241,114,50,0.35)]"
//                   >
//                     {loading ? "Sending..." : "Send Reset Link"}
//                   </button>

//                   <p className="text-center text-sm text-neutral-600">
//                     Remember your password?{" "}
//                     <Link
//                       to="/login"
//                       className="font-medium text-[var(--primary)] hover:text-[var(--primary-700)]"
//                     >
//                       Back to Login
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
import { Link } from "react-router-dom";

/**
 * Forget page (calls backend /api/users/forgot-password)
 */
export default function Forget({
  themeColor = "#F17232",
  slides,
  rotateIntervalMs = 5000,
}) {
  const API_URL = import.meta.env.VITE_API_URL;

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
    const id = setInterval(
      () => setActive((i) => (i + 1) % images.length),
      rotateIntervalMs
    );
    return () => clearInterval(id);
  }, [images.length, rotateIntervalMs]);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const colorVars = {
    "--primary": themeColor,
    "--primary-600": shade(themeColor, -8),
    "--primary-700": shade(themeColor, -14),
    "--primary-800": shade(themeColor, -20),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) {
      setMsg("Please enter your email.");
      return;
    }
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(`${API_URL}/api/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(
          data?.message || "If the account exists, a reset link has been sent."
        );
      } else {
        setMsg(data?.message || "Unable to send reset link. Try again later.");
      }
    } catch (err) {
      console.error(err);
      setMsg("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50" style={colorVars}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
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

          <div className="lg:col-span-7">
            <div className="mx-auto max-w-xl">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                Forgot Password
              </h1>
              <p className="mt-2 text-neutral-500">
                Enter your email and we'll send you a reset link.
              </p>

              <div className="mt-6 rounded-2xl bg-white shadow-[0_8px_28px_rgba(0,0,0,0.08)] ring-1 ring-black/5 p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {msg && <p className="text-sm text-neutral-700">{msg}</p>}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-medium text-neutral-800"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      inputMode="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-xl border-2 border-neutral-700/90 focus:border-[var(--primary)] px-3 py-3 outline-none transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-600)] active:bg-[var(--primary-700)] text-white font-medium py-3.5 transition shadow-[0_6px_20px_rgba(241,114,50,0.35)]"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>

                  <p className="text-center text-sm text-neutral-600">
                    Remember your password?{" "}
                    <Link
                      to="/login"
                      className="font-medium text-[var(--primary)] hover:text-[var(--primary-700)]"
                    >
                      Back to Login
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
