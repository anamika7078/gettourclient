
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../hooks/useToast";

/**
 * Sign up
 * - Left: rounded image carousel + dots
 * - Right: Title, validated form (no logo), social buttons
 * - Phone field: custom country code dropdown (matches screenshot), fully responsive
 *
 * TailwindCSS required.
 *
 * Props:
 * - themeColor?: string                       // default "#F17232"
 * - slides?: string[]                         // 4+ image URLs for the left carousel
 * - rotateIntervalMs?: number                 // default 5000
 * - onSignup?: (payload) => Promise<void> | void
 */
export default function Signup({
  themeColor = "#F17232",
  slides,
  rotateIntervalMs = 5000,
  onSignup,
}) {
  const API_URL = import.meta.env.VITE_API_URL;

  const { showToast } = useToast();
  // Default slides (aviation/travel vibe)
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

  // Carousel
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (!images.length) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % images.length),
      rotateIntervalMs
    );
    return () => clearInterval(id);
  }, [images.length, rotateIntervalMs]);

  // Country calling codes
  const [codes, setCodes] = useState(() => FALLBACK_CODES);
  const [loadingCodes, setLoadingCodes] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoadingCodes(true);
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2,idd"
        );
        if (!res.ok) throw new Error("Failed loading country codes");
        const data = await res.json();

        const list = data
          .map((c) => {
            const root = c?.idd?.root || "";
            const dial = root || "";
            return {
              name: c?.name?.common || "",
              code: (c?.cca2 || "").toUpperCase(),
              dial,
            };
          })
          .filter((x) => x.name && x.code && x.dial.startsWith("+"));

        const map = new Map();
        for (const x of list) if (!map.has(x.code)) map.set(x.code, x);
        const finalList = Array.from(map.values()).sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        if (mounted && finalList.length) setCodes(finalList);
      } catch {
        // keep fallback
      } finally {
        mounted && setLoadingCodes(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Preselect country from browser locale if possible
  const defaultIso = getBrowserRegionISO2() || "US";
  const defaultDial = useMemo(() => {
    const found = codes.find((c) => c.code === defaultIso);
    if (found?.dial) return found.dial;
    return "+1";
  }, [codes, defaultIso]);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState(defaultIso);
  const [dialCode, setDialCode] = useState(defaultDial);
  const [phone, setPhone] = useState(""); // digits only, optional
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [accept, setAccept] = useState(false);
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Theme (orange)
  const colorVars = {
    "--primary": themeColor,
    "--primary-600": shade(themeColor, -8),
    "--primary-700": shade(themeColor, -14),
    "--primary-800": shade(themeColor, -20),
  };

  // Validation
  const errors = useMemo(() => {
    const e = {};
    if (!firstName.trim()) e.firstName = "First name is required.";
    else if (!/^[A-Za-z .'-]{2,}$/.test(firstName.trim()))
      e.firstName = "Use at least 2 letters; allowed: letters, space, .' -";

    if (!lastName.trim()) e.lastName = "Last name is required.";
    else if (!/^[A-Za-z .'-]{2,}$/.test(lastName.trim()))
      e.lastName = "Use at least 2 letters; allowed: letters, space, .' -";

    if (!email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email.trim()))
      e.email = "Enter a valid email address.";

    if (phone.trim()) {
      const digits = phone.replace(/\D/g, "");
      if (digits.length < 4 || digits.length > 15)
        e.phone = "Enter 4–15 digits.";
    }

    if (!password) e.password = "Password is required.";
    else {
      if (password.length < 8) e.password = "Use at least 8 characters.";
      if (!/[a-z]/.test(password)) e.password = "Include a lowercase letter.";
      if (!/[A-Z]/.test(password)) e.password = "Include an uppercase letter.";
      if (!/[0-9]/.test(password)) e.password = "Include a number.";
      if (!/[^A-Za-z0-9]/.test(password))
        e.password = "Include a special character.";
    }

    if (!confirmPassword) e.confirmPassword = "Please confirm password.";
    else if (confirmPassword !== password)
      e.confirmPassword = "Passwords do not match.";

    if (!accept) e.accept = "You must accept the Terms and Privacy Policy.";
    return e;
  }, [firstName, lastName, email, phone, password, confirmPassword, accept]);

  const isValid = Object.keys(errors).length === 0;

  const setFieldTouched = (name) => setTouched((t) => ({ ...t, [name]: true }));

  const onCountryChange = (iso) => {
    setCountryCode(iso);
    const found = codes.find((c) => c.code === iso);
    if (found?.dial) setDialCode(found.dial);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      accept: true,
    });

    if (!isValid) return;

    const phoneDigits = phone.replace(/\D/g, "");
    const phoneE164 =
      phoneDigits && dialCode ? `${dialCode}${phoneDigits}` : null;

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone: phoneE164,
      countryCode: countryCode || null,
      acceptedTos: accept,
    };

    try {
      setSubmitting(true);
      if (onSignup) {
        await onSignup(payload);
      } else {
        // Call backend API (set VITE_API_URL for dev, or leave empty if frontend and backend share origin in production)
        const res = await fetch(`${API_URL}/api/users/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg = data?.message || "Failed to create account";
          showToast({ type: "error", message: msg, duration: 3000 });
          return;
        }

        // Success
        showToast({
          type: "success",
          message: "Account created successfully. Please log in.",
          duration: 1600,
        });
        // Redirect to login after brief pause
        setTimeout(() => {
          window.location.href = "/login";
        }, 1600);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen  pb-10 bg-neutral-50" style={colorVars}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Image carousel */}
          <div className="lg:col-span-5">
            <div className="relative h-[340px] sm:h-[420px] lg:h-[770px] rounded-[28px] overflow-hidden bg-black/5 ring-1 ring-black/10">
              {images.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt="Travel scene"
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                    idx === active ? "opacity-100" : "opacity-0"
                  }`}
                  loading={idx === 0 ? "eager" : "lazy"}
                  fetchPriority={idx === 0 ? "high" : undefined}
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

          {/* Right: Form card */}
          <div className="lg:col-span-7">
            <div className="mx-auto max-w-xl">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                Sign up
              </h1>
              <p className="mt-2 text-neutral-500">
                Let's get you all set up so you can access your personal
                account.
              </p>

              <div className="mt-6 rounded-2xl bg-white shadow-[0_8px_28px_rgba(0,0,0,0.08)] ring-1 ring-black/5 p-4 sm:p-6">
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Name row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field
                      id="firstName"
                      label="First Name"
                      required
                      value={firstName}
                      onChange={setFirstName}
                      onBlur={() => setFieldTouched("firstName")}
                      error={touched.firstName ? errors.firstName : ""}
                      placeholder="Enter your first name"
                    />
                    <Field
                      id="lastName"
                      label="Last Name"
                      required
                      value={lastName}
                      onChange={setLastName}
                      onBlur={() => setFieldTouched("lastName")}
                      error={touched.lastName ? errors.lastName : ""}
                      placeholder="Enter your last name"
                    />
                  </div>

                  {/* Email + Phone row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field
                      id="email"
                      type="email"
                      inputMode="email"
                      label="Email"
                      required
                      value={email}
                      onChange={setEmail}
                      onBlur={() => setFieldTouched("email")}
                      error={touched.email ? errors.email : ""}
                      placeholder="Enter your email address"
                    />

                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-1.5 block text-sm font-medium text-neutral-800"
                      >
                        Phone{" "}
                        <span className="text-neutral-400">(optional)</span>
                      </label>
                      <div className="flex items-stretch">
                        {/* Country dial picker (compact) */}
                        <CompactCountryDialPicker
                          codes={codes}
                          value={countryCode}
                          onChange={onCountryChange}
                          loading={loadingCodes}
                        />

                        {/* Phone input */}
                        <input
                          id="phone"
                          type="tel"
                          inputMode="tel"
                          className="min-w-0 flex-1 rounded-r-xl border-2 border-l-0 border-neutral-700/90 focus:border-[var(--primary)] px-3 py-3 h-[50px] sm:h-[52px] outline-none transition"
                          placeholder="Phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          onBlur={() => setFieldTouched("phone")}
                          aria-invalid={!!(touched.phone && errors.phone)}
                          aria-describedby={
                            touched.phone && errors.phone
                              ? "phone-error"
                              : undefined
                          }
                        />
                      </div>
                      {touched.phone && errors.phone ? (
                        <p
                          id="phone-error"
                          className="mt-1 text-xs text-red-600"
                        >
                          {errors.phone}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-1.5 block text-sm font-medium text-neutral-800"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPw ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => setFieldTouched("password")}
                        required
                        className={`w-full rounded-xl border-2 border-neutral-700/90 focus:border-[var(--primary)] px-3 py-3 pr-11 outline-none transition ${
                          touched.password && errors.password
                            ? "border-red-500"
                            : ""
                        }`}
                        aria-invalid={!!(touched.password && errors.password)}
                        aria-describedby={
                          touched.password && errors.password
                            ? "password-error"
                            : undefined
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((v) => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-grid place-items-center h-8 w-8 rounded-md text-neutral-500 hover:text-neutral-700"
                        aria-label={showPw ? "Hide password" : "Show password"}
                        title={showPw ? "Hide password" : "Show password"}
                      >
                        {showPw ? (
                          <EyeOffIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {touched.password && errors.password ? (
                      <p
                        id="password-error"
                        className="mt-1 text-xs text-red-600"
                      >
                        {errors.password}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-neutral-500">
                        Must contain 8+ chars, uppercase, lowercase, number, and
                        special.
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-1.5 block text-sm font-medium text-neutral-800"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showPw2 ? "text" : "password"}
                        placeholder="Enter same password again"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={() => setFieldTouched("confirmPassword")}
                        required
                        className={`w-full rounded-xl border-2 border-neutral-700/90 focus:border-[var(--primary)] px-3 py-3 pr-11 outline-none transition ${
                          touched.confirmPassword && errors.confirmPassword
                            ? "border-red-500"
                            : ""
                        }`}
                        aria-invalid={
                          !!(touched.confirmPassword && errors.confirmPassword)
                        }
                        aria-describedby={
                          touched.confirmPassword && errors.confirmPassword
                            ? "confirmPassword-error"
                            : undefined
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw2((v) => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-grid place-items-center h-8 w-8 rounded-md text-neutral-500 hover:text-neutral-700"
                        aria-label={showPw2 ? "Hide password" : "Show password"}
                        title={showPw2 ? "Hide password" : "Show password"}
                      >
                        {showPw2 ? (
                          <EyeOffIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {touched.confirmPassword && errors.confirmPassword ? (
                      <p
                        id="confirmPassword-error"
                        className="mt-1 text-xs text-red-600"
                      >
                        {errors.confirmPassword}
                      </p>
                    ) : null}
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-3">
                    <input
                      id="accept"
                      type="checkbox"
                      checked={accept}
                      onChange={(e) => setAccept(e.target.checked)}
                      onBlur={() => setFieldTouched("accept")}
                      className="mt-1 h-4 w-4 rounded border-neutral-400 text-[var(--primary)] focus:ring-[var(--primary-700)]"
                    />
                    <label
                      htmlFor="accept"
                      className="text-sm text-neutral-700"
                    >
                      I agree to all the{" "}
                      <Link
                        to="/terms"
                        className="text-[var(--primary)] hover:text-[var(--primary-700)]"
                      >
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-[var(--primary)] hover:text-[var(--primary-700)]"
                      >
                        Privacy Policy
                      </Link>
                      .
                      {touched.accept && errors.accept ? (
                        <span className="block text-xs text-red-600 mt-1">
                          {errors.accept}
                        </span>
                      ) : null}
                    </label>
                  </div>

                  {/* Submit (orange theme) */}
                  <button
                    type="submit"
                    disabled={!isValid || submitting}
                    className="w-full rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-600)] active:bg-[var(--primary-700)] text-white font-medium py-3.5 transition shadow-[0_6px_20px_rgba(241,114,50,0.35)] disabled:opacity-60 disabled:cursor-not-allowed"
                    aria-disabled={!isValid || submitting}
                  >
                    {submitting ? "Creating..." : "Create Account"}
                  </button>

                  {/* Login link */}
                  <p className="text-center text-sm text-neutral-600">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-medium text-[var(--primary)] hover:text-[var(--primary-700)]"
                    >
                      Login
                    </Link>
                  </p>

                  {/* Divider */}
                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-neutral-200" />
                    </div>
                  </div>
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

/* ---------- CompactCountryDialPicker (smaller width) ---------- */
function CompactCountryDialPicker({ codes, value, onChange, loading }) {
  const btnRef = useRef(null);
  const panelRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const selected = useMemo(
    () => codes.find((c) => c.code === value) || null,
    [codes, value]
  );

  const filtered = useMemo(() => {
    if (!q.trim()) return codes;
    const s = q.trim().toLowerCase();
    return codes.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        c.code.toLowerCase().includes(s) ||
        c.dial.includes(s.replace(/^(\+)?/, "+"))
    );
  }, [codes, q]);

  // Close on click outside or Escape
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      const t = e.target;
      if (!btnRef.current?.contains(t) && !panelRef.current?.contains(t)) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative shrink-0" ref={btnRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-[50px] sm:h-[52px] w-20 sm:w-24 pl-3 pr-6 rounded-l-xl border-2 border-neutral-700/90 bg-white text-left outline-none transition focus:border-[var(--primary)]"
        aria-haspopup="listbox"
        aria-expanded={open}
        title={
          selected ? `${selected.name} (${selected.dial})` : "Select country"
        }
      >
        <span className="inline-flex items-center gap-1">
          <span className="font-medium text-neutral-800 text-sm">
            {selected?.dial || "+XX"}
          </span>
        </span>
        <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">
          ▾
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          ref={panelRef}
          className="absolute z-50 mt-2 w-[calc(100vw-2rem)] sm:w-80 md:w-96 max-h-[70vh] overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/10"
        >
          <div className="p-3 border-b border-neutral-100">
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search country or code"
              className="w-full rounded-lg border border-neutral-300 focus:border-[var(--primary)] outline-none px-3 py-2 text-sm"
            />
          </div>
          <div className="overflow-auto max-h-[60vh] p-3 space-y-2">
            {loading ? (
              <div className="text-sm text-neutral-500 px-1 py-2">Loading…</div>
            ) : filtered.length ? (
              filtered.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    onChange(c.code);
                    setOpen(false);
                    setQ("");
                  }}
                  className={`w-full text-left rounded-xl border border-transparent hover:border-[var(--primary)]/20 hover:bg-[var(--primary)]/[0.06] transition p-3 flex items-center gap-3`}
                  title={`${c.name} (${c.dial})`}
                  role="option"
                  aria-selected={c.code === value}
                >
                  <span className="h-8 w-8 shrink-0 grid place-items-center rounded-md bg-neutral-200 text-neutral-800 font-semibold text-xs">
                    {c.code.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block truncate text-sm text-neutral-900">
                      {c.name}
                    </span>
                    <span className="block text-xs text-neutral-500">
                      {c.dial}
                    </span>
                  </span>
                </button>
              ))
            ) : (
              <div className="text-sm text-neutral-500 px-1 py-2">
                No results
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Reusable Field component ---------- */
function Field({
  id,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  type = "text",
  inputMode,
  required = false,
  error,
}) {
  const invalid = !!error;
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-neutral-800"
      >
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        required={required}
        className={`w-full rounded-xl border-2 border-neutral-700/90 focus:border-[var(--primary)] px-3 py-3 outline-none transition ${
          invalid ? "border-red-500" : ""
        }`}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${id}-error` : undefined}
      />
      {invalid ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/* ---------------- Icons (inline SVG) ---------------- */
function EyeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
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
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
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
function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07C2 17.1 5.66 21.24 10.44 22v-7.02H7.9v-2.91h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22C18.34 21.24 22 17.1 22 12.07Z"
      />
    </svg>
  );
}
function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="#EA4335"
        d="M12 10.2v3.6h5.1c-.22 1.38-1.55 4.05-5.1 4.05-3.07 0-5.58-2.54-5.58-5.65S8.93 6.55 12 6.55c1.75 0 2.94.74 3.61 1.38l2.46-2.37C16.8 3.98 14.63 3 12 3 6.98 3 3 6.98 3 12s3.98 9 9 9c5.2 0 8.62-3.66 8.62-8.82 0-.59-.06-1.05-.14-1.49H12Z"
      />
      <path
        fill="#34A853"
        d="M4.74 7.19l2.96 2.17C8.63 7.2 10.2 6.55 12 6.55c1.75 0 2.94.74 3.61 1.38l2.46-2.37C16.8 3.98 14.63 3 12 3c-2.91 0-5.41 1.11-7.26 4.19Z"
      />
      <path
        fill="#FBBC05"
        d="M12 21c2.62 0 4.82-.86 6.39-2.36l-2.78-2.28c-.76.53-1.78.89-3.61.89-2.33 0-4.31-1.57-5.01-3.69l-2.95 2.27C5.9 18.95 8.67 21 12 21Z"
      />
      <path
        fill="#4285F4"
        d="M20.62 12.18c0-.59-.06-1.05-.14-1.49H12v3.6h5.1c-.22 1.38-1.55 4.05-5.1 4.05-3.07 0-5.58-2.54-5.58-5.65 0-.71.13-1.39.35-2.02l-2.96-2.17A8.88 8.88 0 0 0 3 12c0 5.02 3.98 9 9 9 5.2 0 8.62-3.66 8.62-8.82Z"
      />
    </svg>
  );
}
function AppleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M16.49 2c.13 1.01-.3 2.01-.95 2.72-.66.7-1.74 1.25-2.76 1.17-.15-1 .35-2.02 1-2.7.7-.73 1.86-1.25 2.71-1.19Zm3.48 15.27c-.32.74-.7 1.43-1.15 2.07-.61.87-1.11 1.47-1.47 1.8-.58.57-1.2 1.17-1.98 1.19-.76.02-.95-.38-1.98-.38s-1.23.37-1.99.39c-.79.02-1.4-.61-1.98-1.18-.35-.33-.82-.9-1.42-1.76-.6-.87-1.1-1.9-1.51-3.08-.43-1.26-.65-2.47-.66-3.62-.01-1.12.24-2.07.75-2.85.51-.78 1.19-1.17 2.03-1.18.8-.02 1.56.37 2.27 1.14.52.57 1.06.86 1.61.86.53 0 1.03-.29 1.59-.87.33-.35.69-.62 1.09-.81.42-.2.85-.3 1.3-.3.97.02 1.77.45 2.4 1.3-.94.59-1.41 1.44-1.4 2.54.02 1.1.52 1.93 1.49 2.49.44.26.89.38 1.34.36-.04.35-.12.73-.26 1.14Z"
      />
    </svg>
  );
}

/* ---------------- Utils (plain JS) ---------------- */
function shade(hex, percent = -10) {
  const col = (hex || "").replace("#", "");
  if (col.length !== 6) return hex || "#000000";
  const r = parseInt(col.substring(0, 2), 16);
  const g = parseInt(col.substring(2, 4), 16);
  const b = parseInt(col.substring(4, 6), 16);
  const amt = Math.round(2.55 * percent);
  const R = clamp(r + amt, 0, 255);
  const G = clamp(g + amt, 0, 255);
  const B = clamp(b + amt, 0, 255);
  return (
    "#" +
    [R, G, B]
      .map((v) => v.toString(16))
      .map((s) => s.padStart(2, "0"))
      .join("")
  );
}
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
function getBrowserRegionISO2() {
  try {
    if (typeof navigator === "undefined") return null;
    const lang = navigator.language || "";
    const parts = lang.split(/[-_]/);
    const region = (parts[1] || "").toUpperCase();
    if (region && /^[A-Z]{2}$/.test(region)) return region;
    return null;
  } catch {
    return null;
  }
}

/* Fallback codes (if API fails). API fetch will replace with the full list. */
const FALLBACK_CODES = [
  { name: "United States", code: "US", dial: "+1" },
  { name: "Canada", code: "CA", dial: "+1" },
  { name: "India", code: "IN", dial: "+91" },
  { name: "United Kingdom", code: "GB", dial: "+44" },
  { name: "Australia", code: "AU", dial: "+61" },
  { name: "Germany", code: "DE", dial: "+49" },
  { name: "France", code: "FR", dial: "+33" },
  { name: "Italy", code: "IT", dial: "+39" },
  { name: "Spain", code: "ES", dial: "+34" },
  { name: "Brazil", code: "BR", dial: "+55" },
  { name: "Mexico", code: "MX", dial: "+52" },
  { name: "Japan", code: "JP", dial: "+81" },
  { name: "South Korea", code: "KR", dial: "+82" },
  { name: "China", code: "CN", dial: "+86" },
  { name: "Singapore", code: "SG", dial: "+65" },
  { name: "United Arab Emirates", code: "AE", dial: "+971" },
  { name: "Saudi Arabia", code: "SA", dial: "+966" },
  { name: "South Africa", code: "ZA", dial: "+27" },
  { name: "Nigeria", code: "NG", dial: "+234" },
  { name: "Kenya", code: "KE", dial: "+254" },
  { name: "Indonesia", code: "ID", dial: "+62" },
  { name: "Philippines", code: "PH", dial: "+63" },
  { name: "Malaysia", code: "MY", dial: "+60" },
  { name: "Thailand", code: "TH", dial: "+66" },
  { name: "Bangladesh", code: "BD", dial: "+880" },
  { name: "Pakistan", code: "PK", dial: "+92" },
  { name: "Sri Lanka", code: "LK", dial: "+94" },
  { name: "Nepal", code: "NP", dial: "+977" },
  { name: "Vietnam", code: "VN", dial: "+84" },
  { name: "Turkey", code: "TR", dial: "+90" },
];
