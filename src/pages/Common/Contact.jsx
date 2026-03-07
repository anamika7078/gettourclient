
import { useState } from "react";

/**
 * Contact section with improved form design and backend connection.
 * Orange theme, fully responsive, and your rocket image positioned exactly:
 * right: 9.5rem; top: 3rem; width: 255px
 *
 * Backend Endpoint: POST ${API_URL}/api/contact
 */
export default function Contact({ rocketSrc = "./roket.webp" }) {
  const API_URL = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    message: "",
    error: false,
  });

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: "", error: false });

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          loading: false,
          message: "Message sent successfully!",
          error: false,
        });
        setForm({ name: "", email: "", subject: "", phone: "", message: "" });
      } else {
        setStatus({
          loading: false,
          message: data.error || "Something went wrong!",
          error: true,
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({
        loading: false,
        message: "Server not responding. Try again later.",
        error: true,
      });
    }
  };

  return (
    <section className="relative bg-white">
      {/* Header */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-widest text-gray-500 uppercase">
            Leave A Message
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Need Assistance?
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-gray-600">
            We are here to help you with any inquiries you may have about our
            products and services. Please feel free to call or email us, or use
            our contact form to get in touch. We look forward to hearing from
            you!
          </p>
        </div>

        {/* Mobile rocket */}
        <div className="mt-6 flex justify-center sm:hidden" aria-hidden="true">
          <img
            src={rocketSrc}
            alt="Rocket"
            className="w-24 drop-shadow-xl animate-float select-none"
            draggable="false"
            loading="eager"
          />
        </div>

        {/* Desktop rocket */}
        <div
          className="pointer-events-none absolute right-[9.5rem] top-[3rem] hidden sm:block"
          aria-hidden="true"
        >
          <img
            src={rocketSrc}
            alt="Rocket"
            className="w-[255px] max-w-none drop-shadow-[0_12px_30px_rgba(249,115,22,0.35)] animate-float select-none"
            draggable="false"
            loading="eager"
          />
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-10 max-w-4xl rounded-3xl bg-white/90 p-6 sm:p-8 shadow-[0_20px_60px_-20px_rgba(249,115,22,0.35)] ring-1 ring-orange-100 backdrop-blur"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                placeholder="056-345654322"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                className="mt-2 w-full resize-y rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                placeholder="Write your message here..."
                required
              />
            </div>
          </div>

          {/* Submit button */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={status.loading}
              className={`group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-orange-300/40 transition ${
                status.loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:from-orange-600 hover:to-orange-700"
              }`}
            >
              {status.loading ? "SENDING..." : "SUBMIT"}
              {!status.loading && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>

          {/* Success / Error Message */}
          {status.message && (
            <p
              className={`mt-6 text-center font-medium ${
                status.error ? "text-red-600" : "text-orange-600"
              }`}
            >
              {status.message}
            </p>
          )}
        </form>

        {/* Contact info cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-dashed border-gray-300 p-6 transition hover:border-orange-300/60">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-orange-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3.1 5.18 2 2 0 0 1 5.06 3h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.64 2.6a2 2 0 0 1-.45 2.11L9.1 10.9a16 16 0 0 0 4 4l1.47-1.15a2 2 0 0 1 2.11-.45c.83.31 1.7.52 2.6.64A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <p className="mt-4 text-center text-sm text-gray-500">Mobile</p>
            <p className="mt-1 text-center font-medium text-gray-900">
              055-2883105
            </p>
          </div>

          <div className="rounded-2xl border border-dashed border-gray-300 p-6 transition hover:border-orange-300/60">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-orange-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 4h16v16H4z" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
            </div>
            <p className="mt-4 text-center text-sm text-gray-500">Email</p>
            <p className="mt-1 text-center font-medium text-gray-900 break-all">
              gettourguide26@gmail.com
            </p>
          </div>

          <div className="rounded-2xl border border-dashed border-gray-300 p-6 transition hover:border-orange-300/60">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-orange-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 1 1 18 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <p className="mt-4 text-center text-sm font-semibold text-gray-900">
              ADDRESS
            </p>
            <p className="mt-1 text-center text-gray-700">
              Reef Tower, 203, Cluster O, JLT, Dubai, UAE.
            </p>
          </div>
        </div>
      </div>

      {/* Floating rocket animation */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-6px) rotate(1deg); }
          100% { transform: translateY(0px) rotate(-2deg); }
        }
        .animate-float {
          animation: float 3.2s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>
    </section>
  );
}
