import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * Admin Login page/component
 * - Same design as registration form with image carousel
 * - Fully responsive with modern styling
 */

export default function AdminLogin({
  themeColor = "#F17232",
  slides,
  rotateIntervalMs = 5000,
}) {
  const API_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

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

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const colorVars = {
    "--primary": themeColor,
    "--primary-600": shade(themeColor, -8),
    "--primary-700": shade(themeColor, -14),
    "--primary-800": shade(themeColor, -20),
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok && data?.token) {
        // Store token and redirect
        localStorage.setItem("adminToken", data.token);
        setErrorMsg("");

        // Redirect to admin dashboard
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1000);
      } else {
        setErrorMsg(data?.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errorMsg) {
      setErrorMsg("");
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50" style={colorVars}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left carousel */}
          <div className="lg:col-span-5">
            <div className="relative h-[340px] sm:h-[420px] lg:h-[550px] rounded-[28px] overflow-hidden bg-black/5 ring-1 ring-black/10">
              {images.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt="Slide"
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                    idx === active ? "opacity-100" : "opacity-0"
                  }`}
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              ))}
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
                Admin Login
              </h1>
              <p className="mt-2 text-neutral-500">
                Access your admin dashboard
              </p>

              <div className="mt-6 rounded-2xl bg-white shadow-[0_8px_28px_rgba(0,0,0,0.08)] ring-1 ring-black/5 p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                      {errorMsg}
                    </div>
                  )}

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-medium text-neutral-800"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                        <AiOutlineMail className="h-5 w-5" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        placeholder="Enter your admin email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                        className="w-full rounded-xl border-2 border-neutral-700/90 focus:border-[var(--primary)] pl-11 pr-3 py-3 outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-1.5 block text-sm font-medium text-neutral-800"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                        <AiOutlineLock className="h-5 w-5" />
                      </div>
                      <input
                        id="password"
                        type={showPw ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        required
                        className="w-full rounded-xl border-2 border-neutral-700/90 focus:border-[var(--primary)] pl-11 pr-11 py-3 outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((v) => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-grid place-items-center h-8 w-8 rounded-md text-neutral-500 hover:text-neutral-700"
                        aria-label={showPw ? "Hide password" : "Show password"}
                      >
                        {showPw ? (
                          <EyeOffIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <div className="mt-2 text-right">
                      <Link
                        to="/admin/forgot-password"
                        className="text-sm text-[var(--primary)] hover:text-[var(--primary-700)]"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-600)] active:bg-[var(--primary-700)] text-white font-medium py-3.5 transition shadow-[0_6px_20px_rgba(241,114,50,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Signing In...
                      </div>
                    ) : (
                      "Sign In to Dashboard"
                    )}
                  </button>

                  {/* <p className="text-center text-sm text-neutral-600">
                    Don't have an admin account?{" "}
                    <Link
                      to="/admin/register"
                      className="font-medium text-[var(--primary)] hover:text-[var(--primary-700)]"
                    >
                      Register here
                    </Link>
                  </p> */}
                </form>
              </div>

              {/* Security Notice */}
              <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 text-amber-600 mt-0.5">
                    <ShieldIcon />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-amber-900 mb-1">
                      Secure Admin Access
                    </h3>
                    <p className="text-xs text-amber-800">
                      This area is restricted to authorized administrators only.
                      Unauthorized access attempts may be logged and monitored.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------------- Icons ---------------- */
function AiOutlineMail(props) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 1024 1024"
      {...props}
    >
      <path d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 110.8V792H136V270.8l-27.6-21.5 39.3-50.5 42.8 33.3h643.1l42.8-33.3 39.3 50.5-27.7 21.5zM833.6 232L512 482 190.4 232l-42.8-33.3-39.3 50.5 27.6 21.5 341.6 265.6a55.99 55.99 0 0 0 68.7 0L888 270.8l27.6-21.5-39.3-50.5-42.7 33.2z"></path>
    </svg>
  );
}

function AiOutlineLock(props) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 1024 1024"
      {...props}
    >
      <path d="M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM332 240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224H332V240zm460 600H232V536h560v304zM484 701v53c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-53a48.01 48.01 0 1 0-56 0z"></path>
    </svg>
  );
}

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
        d="M10.6 6.2C11.06 6.07 11.52 6 12 6c6 0 10 6 10 6a17 17 0 1 1-4.12 4.74M6.86 8.12A16.5 16.5 0 0 0 2 12s4 6 10 6c1.1 0 2.14-.2 3.12-.56"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ShieldIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
