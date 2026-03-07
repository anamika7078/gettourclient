import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams, useSearchParams } from "react-router-dom";
import { useCurrency } from "../../contexts/CurrencyContext";
import { useToast } from "../../hooks/useToast";

export default function AcitivtyBooking() {
  const { showToast } = useToast();
  const { id } = useParams();
  const API_BASE = import.meta.env.VITE_API_URL;
  const themeColor = "#F17232"; // align with hotel booking theme

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Section 1: ticket details
  const [visitDate, setVisitDate] = useState(null); // Date object for modern picker
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [transfer, setTransfer] = useState(false);

  // Section 2: visitor info
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [agree, setAgree] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [successCard, setSuccessCard] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  // After Stripe redirect: confirm and save booking
  useEffect(() => {
    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id");
    if (success === "1" && sessionId) {
      axios
        .post(`${API_BASE}/api/activity-bookings/confirm`, { sessionId })
        .then((res) => {
          if (res.data?.success) {
            setSuccessCard(
              "Payment successful! Your booking has been confirmed."
            );
          } else {
            setSuccessCard("Payment confirmed, but saving the booking failed.");
          }
        })
        .catch(() =>
          setSuccessCard("Payment confirmed, but saving the booking failed.")
        );
    }
  }, [API_BASE, searchParams]);

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

  const price = useMemo(() => Number(activity?.price || 0), [activity]);
  const totalPersons = adults + children;
  const total = useMemo(() => price * totalPersons, [price, totalPersons]);
  const { convertAndFormat } = useCurrency();

  const title = activity?.title || "Activity";
  const coverUrl = activity?.image
    ? `${API_BASE}/uploads/activities/${activity.image}`
    : "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=1600&auto=format&fit=crop";

  async function handleConfirm(e) {
    e.preventDefault();
    // Minimal validation
    if (!visitDate)
      return showToast({
        type: "warning",
        message: "Please select visit date",
        duration: 2200,
      });
    if (!fullName)
      return showToast({
        type: "warning",
        message: "Please enter full name",
        duration: 2200,
      });
    if (!email)
      return showToast({
        type: "warning",
        message: "Please enter email",
        duration: 2200,
      });
    if (!phone)
      return showToast({
        type: "warning",
        message: "Please enter phone number",
        duration: 2200,
      });
    if (totalPersons <= 0)
      return showToast({
        type: "warning",
        message: "Please select at least 1 ticket",
        duration: 2200,
      });
    if (!agree)
      return showToast({
        type: "warning",
        message: "Please agree to the Terms & Conditions to continue.",
        duration: 2600,
      });

    // Create Stripe Checkout session
    try {
      const payload = {
        activityId: Number(id),
        title,
        unitPrice: price,
        adults,
        children,
        transfer,
        visitDate: visitDate?.toISOString(),
        fullName,
        email,
        phone,
        notes,
        total,
      };
      const res = await axios.post(
        `${API_BASE}/api/activity-bookings/checkout-session`,
        payload
      );
      const url = res.data?.url;
      if (url) {
        window.location.href = url;
      } else {
        showToast({
          type: "error",
          message: "Failed to start payment",
          duration: 3000,
        });
      }
    } catch (err) {
      showToast({
        type: "error",
        message:
          err?.response?.data?.error ||
          err?.message ||
          "Failed to start payment",
        duration: 3200,
      });
    }
  }

  return (
    <>
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Activity Booking</h1>

        {loading && <div className="text-gray-600">Loading activity…</div>}
        {!!error && !loading && <div className="text-red-600">{error}</div>}

        {!loading && activity && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {successCard && (
              <div className="lg:col-span-12">
                <div className="rounded-xl border border-green-200 bg-green-50 p-4 flex items-start gap-3">
                  <div className="mt-0.5 text-green-600">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="text-sm text-green-800 font-medium">
                    {successCard}
                  </div>
                  <button
                    onClick={() => {
                      setSuccessCard("");
                      // clear search params so it doesn't re-confirm on refresh
                      searchParams.delete("success");
                      searchParams.delete("session_id");
                      setSearchParams(searchParams);
                    }}
                    className="ml-auto text-green-700 hover:text-green-900 text-xs underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
            {/* LEFT: Form */}
            <div className="lg:col-span-8 bg-white rounded-lg shadow-sm p-4 space-y-6">
              {/* Activity header */}
              <div className="rounded-lg border p-4 flex gap-4 items-center">
                <img
                  src={coverUrl}
                  alt={title}
                  className="w-24 h-24 object-cover rounded"
                />
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">
                    {title}
                  </h1>
                  <div className="text-sm text-gray-500">
                    Price per person: {convertAndFormat(price)}
                  </div>
                </div>
              </div>

              {/* Ticket Details */}
              <div className="rounded-lg border p-4">
                <h2 className="font-semibold text-gray-800 mb-4">
                  Ticket Details
                </h2>
                <div className="border-t pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="block text-sm text-gray-700 mb-1">
                        Visit Date
                      </span>
                      <DatePicker
                        selected={visitDate}
                        onChange={(d) => setVisitDate(d)}
                        minDate={new Date()}
                        dateFormat="dd MMM, yyyy"
                        placeholderText="Select date"
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                        calendarClassName="gtg-datepicker"
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="block">
                        <span className="block text-sm text-gray-700 mb-1">
                          Adults
                        </span>
                        <select
                          className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                          value={adults}
                          onChange={(e) => setAdults(Number(e.target.value))}
                        >
                          {Array.from({ length: 10 }).map((_, i) => (
                            <option key={i} value={i}>
                              {i}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="block text-sm text-gray-700 mb-1">
                          Children
                        </span>
                        <select
                          className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                          value={children}
                          onChange={(e) => setChildren(Number(e.target.value))}
                        >
                          {Array.from({ length: 10 }).map((_, i) => (
                            <option key={i} value={i}>
                              {i}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-200 text-orange-600"
                      checked={transfer}
                      onChange={(e) => setTransfer(e.target.checked)}
                    />
                    <span className="text-sm text-gray-700">
                      Add Transfer: Yes, I need pickup/drop
                    </span>
                  </label>

                  <div className="border-t pt-4">
                    <div className="text-sm font-semibold text-gray-800 mb-2">
                      Price Summary:
                    </div>
                    <div className="text-sm text-gray-700">
                      {adults > 0 && (
                        <div>
                          Adults ({adults} × {price.toFixed(0)} AED)
                        </div>
                      )}
                      {children > 0 && (
                        <div>
                          Children ({children} × {price.toFixed(0)} AED)
                        </div>
                      )}
                      <div className="mt-2 font-semibold">
                        Total: {convertAndFormat(total)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visitor Information */}
              <div className="rounded-lg border p-4">
                <h2 className="font-semibold text-gray-800 mb-4">
                  Visitor Information
                </h2>
                <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block md:col-span-2">
                    <span className="block text-sm text-gray-700 mb-1">
                      Full Name
                    </span>
                    <input
                      type="text"
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                      placeholder="Your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </label>
                  <label className="block">
                    <span className="block text-sm text-gray-700 mb-1">
                      Email Address
                    </span>
                    <input
                      type="email"
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                  <label className="block">
                    <span className="block text-sm text-gray-700 mb-1">
                      Phone Number
                    </span>
                    <input
                      type="tel"
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                      placeholder="+971 ___ ___________"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="block text-sm text-gray-700 mb-1">
                      Special Requests / Notes
                    </span>
                    <textarea
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                      rows={3}
                      placeholder="Any notes or requests"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </label>
                </div>
              </div>

              {/* Left column ends here; summary moved to right card */}
            </div>

            {/* RIGHT: Summary & Confirmation (Orange card) */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-4 rounded-lg shadow-sm border overflow-hidden">
                <div
                  className="px-4 py-3 text-white"
                  style={{ backgroundColor: themeColor }}
                >
                  <div className="text-sm opacity-90">Your Booking</div>
                  <div className="text-lg font-semibold leading-snug">
                    {title}
                  </div>
                  {activity?.category && (
                    <div className="text-xs opacity-90">
                      {activity.category}
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Price per person</span>
                    <span className="font-medium">
                      {convertAndFormat(price)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Adults</span>
                    <span className="font-medium">{adults}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Children</span>
                    <span className="font-medium">{children}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Transfer</span>
                    <span className="font-medium">
                      {transfer ? "Included" : "No"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">
                      {visitDate ? visitDate.toDateString() : "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t mt-2">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">
                      {convertAndFormat(total)}
                    </span>
                  </div>

                  <div className="text-[11px] text-gray-500 pt-2">
                    Total shows per-person based estimate.
                  </div>

                  {/* Agreement */}
                  <label className="mt-3 flex items-start gap-2 text-xs text-gray-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      className="mt-0.5 h-4 w-4 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-200 text-orange-600"
                    />
                    <span>
                      You confirm you’ve read and agree to our{" "}
                      <button
                        type="button"
                        onClick={() => setTermsOpen(true)}
                        className="underline text-orange-600 hover:text-orange-700"
                      >
                        Terms & Conditions
                      </button>
                    </span>
                  </label>

                  {/* Pay Now */}
                  <button
                    className={`mt-3 w-full inline-flex items-center justify-center text-white font-semibold px-5 py-3 rounded-md ${
                      !agree ? "opacity-80 cursor-not-allowed" : ""
                    }`}
                    onClick={handleConfirm}
                    disabled={!agree}
                    style={{ backgroundColor: themeColor }}
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>

      {/* Terms & Conditions Modal */}
      {termsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full overflow-hidden">
            {/* Header */}
            <div
              className="px-5 py-4 text-white text-lg font-semibold"
              style={{ backgroundColor: themeColor }}
            >
              Terms & Conditions
            </div>

            {/* Scrollable Content */}
            <div className="p-6 text-sm text-gray-800 max-h-[70vh] overflow-y-auto leading-relaxed space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">
                  1. Booking & Payments
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    All bookings are subject to confirmation and availability.
                  </li>
                  <li>
                    Prices are quoted in UAE Dirhams (AED) unless otherwise
                    specified.
                  </li>
                  <li>
                    Payment can be made via bank transfer, credit/debit card, or
                    approved online payment gateway.
                  </li>
                  <li>
                    For group or corporate bookings, specific payment terms may
                    apply and will be communicated separately.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  2. Cancellations Policy
                </h3>
                <p className="font-medium">By the Client:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Cancellation requests must be made in writing.</li>
                  <li>
                    Cancellations made less than 24 hours before the trip are
                    non-refundable.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  3. Health, Safety & Conduct
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Clients must disclose any medical conditions or disabilities
                    that may affect participation in the tour.
                  </li>
                  <li>
                    The company reserves the right to refuse service to any
                    person who poses a safety risk or engages in unlawful or
                    inappropriate behavior.
                  </li>
                  <li>
                    Participants must comply with UAE laws, cultural norms, and
                    the instructions of tour guides at all times.
                  </li>
                  <li>
                    Alcohol consumption, public indecency, and disrespectful
                    behavior toward local customs or religion are strictly
                    prohibited.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">4. Insurance</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    All travelers are strongly advised to have valid travel
                    insurance that covers medical expenses, cancellation, and
                    personal accidents.
                  </li>
                  <li>
                    For tours including adventure activities, participants must
                    ensure that their insurance covers such high-risk
                    activities.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  5. Complaints & Dispute Resolution
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Any complaint during a tour must be immediately reported to
                    the tour guide or company representative to allow prompt
                    resolution.
                  </li>
                  <li>
                    If not resolved, written complaints must be submitted within
                    10 days after the tour ends.
                  </li>
                  <li>
                    These Terms & Conditions are governed by the laws of the
                    United Arab Emirates.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  6. Intellectual Property
                </h3>
                <p>
                  All materials on our website, brochures, and promotional
                  content—including text, photos, logos, and designs—are owned
                  by Get Tour Guide. Reproduction or misuse is strictly
                  prohibited.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  7. Privacy Policy
                </h3>
                <p>
                  Your personal data is collected and processed in accordance
                  with UAE data protection regulations. We will not share your
                  personal information with third parties except as required to
                  complete your booking or as required by law.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  8. Acceptance of Terms
                </h3>
                <p>
                  By booking or participating in any of our tours, you confirm
                  that you have read, understood, and agreed to abide by these
                  Terms & Conditions.
                </p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-5 pb-5 flex items-center justify-end gap-2 border-t">
              <button
                onClick={() => setTermsOpen(false)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setTermsOpen(false);
                  setAgree(true);
                }}
                className="px-4 py-2 rounded text-white shadow-md hover:opacity-90 transition"
                style={{ backgroundColor: themeColor }}
              >
                I Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
