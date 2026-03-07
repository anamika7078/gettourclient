

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

/**
 * Reset Password page/component
 * - Same design as login/registration forms with image carousel
 * - Fully responsive with modern styling
 * - Token is automatically taken from URL parameters
 */

export default function ResetPassword({
  themeColor = "#F17232",
  slides,
  rotateIntervalMs = 5000,
}) {

    const API_URL = import.meta.env.VITE_API_URL;
  const [searchParams] = useSearchParams();
  const tokenFromURL = searchParams.get("token");
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

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState({});

  const colorVars = {
    "--primary": themeColor,
    "--primary-600": shade(themeColor, -8),
    "--primary-700": shade(themeColor, -14),
    "--primary-800": shade(themeColor, -20),
  };

  // Validation function
  const validate = () => {
    const newErrors = {};

    // Password validation
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&]).{8,}$/;
    if (!passwordPattern.test(form.password)) {
      newErrors.password =
        "Password must be at least 8 characters, include uppercase, lowercase, number & special character";
    }

    // Confirm password
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setMessage("");

    if (!tokenFromURL) {
      setErrorMsg(
        "Invalid or missing reset token. Please request a new reset link."
      );
      return;
    }

    if (!validate()) {
      setErrorMsg("Please fix the errors below");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/api/admin/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: tokenFromURL,
            password: form.password,
            confirmPassword: form.confirmPassword,
          }),
        }
      );

      const data = await res.json();

      if (res.ok && data?.message) {
        setMessage(data.message);
        // Redirect to login page after success
        setTimeout(() => {
          navigate("/admin/login");
        }, 3000);
      } else {
        setErrorMsg(data?.message || "Error resetting password");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
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
                Reset Password
              </h1>
              <p className="mt-2 text-neutral-500">
                Create your new secure password
              </p>

              {!tokenFromURL && (
                <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-4">
                  <div className="flex items-center gap-2 text-red-800">
                    <ErrorIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm font-medium">
                      Invalid reset link
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-red-700">
                    This reset link appears to be invalid or expired. Please
                    request a new password reset link.
                  </p>
                </div>
              )}

              <div className="mt-6 rounded-2xl bg-white shadow-[0_8px_28px_rgba(0,0,0,0.08)] ring-1 ring-black/5 p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Success Message */}
                  {message && (
                    <div className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <SuccessIcon className="h-4 w-4 flex-shrink-0" />
                        {message}
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {errorMsg && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <ErrorIcon className="h-4 w-4 flex-shrink-0" />
                        {errorMsg}
                      </div>
                    </div>
                  )}

                  {/* Password Field */}
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-1.5 block text-sm font-medium text-neutral-800"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                        <AiOutlineLock className="h-5 w-5" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        value={form.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        required
                        className={`w-full rounded-xl border-2 pl-11 pr-11 py-3 outline-none transition ${
                          errors.password
                            ? "border-red-500 focus:border-red-500"
                            : "border-neutral-700/90 focus:border-[var(--primary)]"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-grid place-items-center h-8 w-8 rounded-md text-neutral-500 hover:text-neutral-700"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-1.5 block text-sm font-medium text-neutral-800"
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                        <AiOutlineLock className="h-5 w-5" />
                      </div>
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        value={form.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        required
                        className={`w-full rounded-xl border-2 pl-11 pr-11 py-3 outline-none transition ${
                          errors.confirmPassword
                            ? "border-red-500 focus:border-red-500"
                            : "border-neutral-700/90 focus:border-[var(--primary)]"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-grid place-items-center h-8 w-8 rounded-md text-neutral-500 hover:text-neutral-700"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOffIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !tokenFromURL}
                    className="w-full rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-600)] active:bg-[var(--primary-700)] text-white font-medium py-3.5 transition shadow-[0_6px_20px_rgba(241,114,50,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Resetting Password...
                      </div>
                    ) : (
                      "Reset Password"
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => navigate("/admin/login")}
                      className="text-sm text-[var(--primary)] hover:text-[var(--primary-700)] font-medium"
                    >
                      ← Back to Login
                    </button>
                  </div>
                </form>
              </div>

              {/* Password Requirements */}
              <div className="mt-6 rounded-xl bg-blue-50 border border-blue-200 p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                  Password Requirements:
                </h3>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li className="flex items-center">
                    <div
                      className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        /[a-z]/.test(form.password)
                          ? "bg-green-500"
                          : "bg-blue-400"
                      }`}
                    />
                    At least one lowercase letter
                  </li>
                  <li className="flex items-center">
                    <div
                      className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        /[A-Z]/.test(form.password)
                          ? "bg-green-500"
                          : "bg-blue-400"
                      }`}
                    />
                    At least one uppercase letter
                  </li>
                  <li className="flex items-center">
                    <div
                      className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        /\d/.test(form.password)
                          ? "bg-green-500"
                          : "bg-blue-400"
                      }`}
                    />
                    At least one number
                  </li>
                  <li className="flex items-center">
                    <div
                      className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        /[@$!%*?#&]/.test(form.password)
                          ? "bg-green-500"
                          : "bg-blue-400"
                      }`}
                    />
                    At least one special character (@$!%*?#&)
                  </li>
                  <li className="flex items-center">
                    <div
                      className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        form.password.length >= 8
                          ? "bg-green-500"
                          : "bg-blue-400"
                      }`}
                    />
                    Minimum 8 characters long
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------------- Icons ---------------- */
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
        d="M10.6 6.2C11.06 6.07 11.52 6 12 6c6 0 10 6 10 6a17 17 0 0 1-4.12 4.74M6.86 8.12A16.5 16.5 0 0 0 2 12s4 6 10 6c1.1 0 2.14-.2 3.12-.56"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function SuccessIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M20 6L9 17l-5-5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ErrorIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M18 6L6 18M6 6l12 12"
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
