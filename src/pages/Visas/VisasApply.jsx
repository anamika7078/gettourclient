import { useEffect, useMemo, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useCurrency } from "../../contexts/CurrencyContext";

// Template for all passengers (Section 2)
const EMPTY_PASSENGER = {
  title: "Mr",
  firstName: "",
  lastName: "",
  gender: "Male",
  passport: "",
  nationality: "",
  birthDate: "",
};

export default function VisasApply({ themeColor = "#F17232" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const API_BASE = import.meta.env.VITE_API_URL;

  // Alert state
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const showAlert = (message, type = "error") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 5000);
  };

  const { convertAndFormat } = useCurrency();

  // In VisasApply component, update the useEffect for payment confirmation
  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    const sessionId = searchParams.get("session_id");

    // Only process if we have both success and sessionId
    if (success === "1" && sessionId) {
      confirmPayment(sessionId);
    } else if (canceled === "1") {
      showAlert("Payment was canceled. You can try again.", "warning");

      // Clear any existing success parameters from URL
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("success");
      newSearchParams.delete("session_id");
      newSearchParams.delete("canceled");

      // Replace URL without the parameters
      navigate(`${location.pathname}?${newSearchParams.toString()}`, {
        replace: true,
      });
    }
  }, [searchParams]);

  // Also update the confirmPayment function to clear URL parameters
  const confirmPayment = async (sessionId) => {
    try {
      const response = await fetch(
        `${API_BASE}/api/visa-applications/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        }
      );

      const result = await response.json();

      if (result.success) {
        showAlert(
          "Payment confirmed! Your visa application has been submitted successfully.",
          "success"
        );

        // Clear URL parameters after successful confirmation
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("success");
        newSearchParams.delete("session_id");
        navigate(`${location.pathname}?${newSearchParams.toString()}`, {
          replace: true,
        });

        // Clear form after successful payment
        setTimeout(() => {
          setLead({ ...emptyLead });
          setPassengers([]);
          setPassengerCountInput("1");
          setAgree(false);
        }, 2000);
      } else {
        showAlert(
          "Payment confirmation failed: " + (result.error || "Unknown error"),
          "error"
        );
      }
    } catch (error) {
      console.error("Payment confirmation error:", error);
      showAlert("Failed to confirm payment. Please contact support.", "error");
    }
  };

  // Try to read visa from navigation state for faster UX
  const visaFromState = location?.state?.visa || null;
  const [visa, setVisa] = useState(visaFromState);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch visa if not provided via state
  useEffect(() => {
    if (visa || !id) return;
    setLoading(true);
    fetch(`${API_BASE}/api/visas/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data?.success || !data?.data) throw new Error("Visa not found");
        setVisa(data.data);
      })
      .catch((e) => {
        console.error("Failed to load visa", e);
        showAlert(e.message || "Failed to load visa", "error");
      })
      .finally(() => setLoading(false));
  }, [id, visa, API_BASE]);

  // Lead Passenger (Section 1 - Contact Person)
  const emptyLead = {
    title: "Mr",
    firstName: "",
    lastName: "",
    email: "",
    nationality: "",
    isd: "+971",
    phone: "",
    travelDate: "",
    notes: "",
  };

  const [lead, setLead] = useState({ ...emptyLead });
  const [passengers, setPassengers] = useState([]); // All passengers including first passenger
  const [passengerCountInput, setPassengerCountInput] = useState("1");
  const totalPassengers = useMemo(
    () => Math.max(1, Number(passengerCountInput) || 0),
    [passengerCountInput]
  );
  const [agree, setAgree] = useState(false);

  // Normalize passengers array when total changes - ALWAYS include passenger 1
  useEffect(() => {
    setPassengers((prev) => {
      const countPassengers = Math.max(1, Number(totalPassengers || 1));
      const next = Array.from({ length: countPassengers }).map(
        (_, i) => prev[i] || { ...EMPTY_PASSENGER }
      );
      return next;
    });
  }, [totalPassengers]);

  const countries = useMemo(
    () => [
      "United Arab Emirates",
      "India",
      "Pakistan",
      "Bangladesh",
      "Nepal",
      "Sri Lanka",
      "Saudi Arabia",
      "Qatar",
      "Oman",
      "Bahrain",
      "Kuwait",
      "Egypt",
      "Turkey",
      "United Kingdom",
      "United States",
      "Canada",
      "Australia",
      "Germany",
      "France",
      "Italy",
      "Spain",
      "Other",
    ],
    []
  );

  const updateLead = (k, v) => setLead((p) => ({ ...p, [k]: v }));
  const updatePassenger = (idx, k, v) =>
    setPassengers((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [k]: v };
      return next;
    });

  const validate = () => {
    // Validate lead passenger (contact person)
    if (!lead.firstName || !lead.lastName || !lead.email || !lead.phone) {
      showAlert("Please fill Lead Passenger's name, email and phone.", "error");
      return false;
    }
    if (!lead.travelDate) {
      showAlert("Please select a Travel Date for the Lead Passenger.", "error");
      return false;
    }
    if (!passengerCountInput || Number(passengerCountInput) < 1) {
      showAlert("Please enter number of passengers (at least 1).", "error");
      return false;
    }

    // Validate all passengers in Section 2
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.firstName || !p.lastName || !p.passport || !p.birthDate) {
        showAlert(
          `Please fill required fields for Passenger ${i + 1}.`,
          "error"
        );
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!agree) {
      showAlert("Please agree to the Terms & Conditions.", "error");
      return;
    }

    setSubmitting(true);

    try {
      // DEBUG: Check what's in passengers array
      console.log("=== DEBUG PASSENGERS DATA ===");
      console.log("passengers array:", passengers);
      console.log("passengers length:", passengers.length);
      console.log("passengerCountInput:", passengerCountInput);
      console.log("totalPassengers:", totalPassengers);

      // Prepare application data with ALL passengers
      const applicationData = {
        visaId: id,
        country: visa?.country,
        subject: visa?.subject,
        price: visa?.price,
        totalPassengers: totalPassengers,
        travelDate: lead.travelDate,
        notes: lead.notes,
        lead: {
          title: lead.title,
          firstName: lead.firstName,
          lastName: lead.lastName,
          email: lead.email,
          isd: lead.isd,
          phone: lead.phone,
          nationality: lead.nationality,
        },
        // Make sure we're sending ALL passengers
        passengers: passengers.map((passenger, index) => ({
          passengerNumber: index + 1,
          title: passenger.title,
          firstName: passenger.firstName,
          lastName: passenger.lastName,
          gender: passenger.gender,
          passport: passenger.passport,
          nationality: passenger.nationality,
          birthDate: passenger.birthDate,
        })),
      };

      console.log("Final application data to send:", applicationData);

      // Create Stripe checkout session
      const response = await fetch(
        `${API_BASE}/api/visa-applications/checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(applicationData),
        }
      );

      const result = await response.json();

      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        throw new Error(result.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Submission error:", error);
      showAlert("Failed to proceed to payment: " + error.message, "error");
    } finally {
      setSubmitting(false);
    }
  };
  const imageUrl = visa?.image
    ? `${API_BASE}/uploads/visas/${visa.image}`
    : "https://via.placeholder.com/1600x900?text=Visa";

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2"
          style={{ borderColor: themeColor }}
        ></div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Modern Alert */}
      {alert.show && (
        <div
          className={`fixed top-4 right-4 z-50 max-w-sm w-full ${
            alert.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : alert.type === "warning"
              ? "bg-yellow-50 border-yellow-200 text-yellow-800"
              : "bg-red-50 border-red-200 text-red-800"
          } border rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-in-out`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {alert.type === "success" && (
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {alert.type === "warning" && (
                <svg
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {alert.type === "error" && (
                <svg
                  className="w-5 h-5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium">{alert.message}</p>
            </div>
            <button
              onClick={() => setAlert({ show: false, message: "", type: "" })}
              className="ml-4 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">Visa Application</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-8 bg-white rounded-lg shadow-sm p-4 space-y-6"
        >
          {/* Section 1: Lead Passenger (Contact Person) */}
          <section>
            <h2 className="font-semibold text-lg mb-3">
              Section 1: Contact Person Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <div className="md:col-span-1">
                <label className="block text-xs text-gray-600 mb-1">
                  Title
                </label>
                <select
                  value={lead.title}
                  onChange={(e) => updateLead("title", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                >
                  <option>Mr</option>
                  <option>Mrs</option>
                  <option>Ms</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-600 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={lead.firstName}
                  onChange={(e) => updateLead("firstName", e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                  required
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs text-gray-600 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={lead.lastName}
                  onChange={(e) => updateLead("lastName", e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                  required
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs text-gray-600 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={lead.email}
                  onChange={(e) => updateLead("email", e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                  required
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs text-gray-600 mb-1">
                  Nationality
                </label>
                <select
                  value={lead.nationality}
                  onChange={(e) => updateLead("nationality", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                >
                  <option value="">-- Select --</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs text-gray-600 mb-1">
                  ISD Code
                </label>
                <input
                  type="text"
                  value={lead.isd}
                  onChange={(e) => updateLead("isd", e.target.value)}
                  placeholder="+971"
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                />
              </div>
              <div className="md:col-span-4">
                <label className="block text-xs text-gray-600 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={lead.phone}
                  onChange={(e) => updateLead("phone", e.target.value)}
                  placeholder="e.g. 501234567"
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                  required
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs text-gray-600 mb-1">
                  Travel Date *
                </label>
                <input
                  type="date"
                  value={lead.travelDate}
                  onChange={(e) => updateLead("travelDate", e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                  required
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs text-gray-600 mb-1">
                  Passengers
                </label>
                <input
                  type="number"
                  min={1}
                  value={passengerCountInput}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/[^0-9]/g, "");
                    setPassengerCountInput(digits);
                  }}
                  placeholder="Enter number of passengers"
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs text-gray-600 mb-1">
                Special Request / Notes
              </label>
              <textarea
                value={lead.notes}
                onChange={(e) => updateLead("notes", e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                rows={3}
                placeholder="Any special notes for your visa application"
              />
            </div>
          </section>

          {/* Section 2: All Passengers (Always shows at least Passenger 1) */}
          <section>
            <h2 className="font-semibold text-lg mb-3">
              Section 2: Passenger Details
            </h2>
            <div className="space-y-4">
              {passengers.map((p, idx) => (
                <div key={idx} className="border rounded p-3">
                  <div className="text-sm font-medium mb-2">
                    Passenger {idx + 1}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                    <div className="md:col-span-1">
                      <label className="block text-xs text-gray-600 mb-1">
                        Title
                      </label>
                      <select
                        value={p.title}
                        onChange={(e) =>
                          updatePassenger(idx, "title", e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                      >
                        <option>Mr</option>
                        <option>Mrs</option>
                        <option>Ms</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={p.firstName}
                        onChange={(e) =>
                          updatePassenger(idx, "firstName", e.target.value)
                        }
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                        required
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-xs text-gray-600 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={p.lastName}
                        onChange={(e) =>
                          updatePassenger(idx, "lastName", e.target.value)
                        }
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">
                        Gender
                      </label>
                      <select
                        value={p.gender}
                        onChange={(e) =>
                          updatePassenger(idx, "gender", e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">
                        Passport Number *
                      </label>
                      <input
                        type="text"
                        value={p.passport}
                        onChange={(e) =>
                          updatePassenger(idx, "passport", e.target.value)
                        }
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">
                        Nationality
                      </label>
                      <select
                        value={p.nationality}
                        onChange={(e) =>
                          updatePassenger(idx, "nationality", e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                      >
                        <option value="">-- Select --</option>
                        {countries.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">
                        Birth Date *
                      </label>
                      <input
                        type="date"
                        value={p.birthDate}
                        onChange={(e) =>
                          updatePassenger(idx, "birthDate", e.target.value)
                        }
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Terms & Pay Now */}
          <section className="mt-4">
            <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 h-4 w-4 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-200 text-orange-600"
              />
              <span>
                By clicking <span className="font-semibold">Pay Now</span>, you
                agree you have read and understood our{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-orange-600 hover:text-orange-700"
                >
                  Terms & Conditions
                </a>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={!agree || submitting}
              className={`w-full py-3 rounded text-white font-semibold mt-2 transition-all ${
                !agree || submitting
                  ? "opacity-80 cursor-not-allowed"
                  : "hover:opacity-90 hover:shadow-lg"
              }`}
              style={{ backgroundColor: themeColor }}
            >
              {submitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                "Pay Now"
              )}
            </button>
            <div className="text-[11px] text-gray-500 pt-1">
              Final charges may vary.
            </div>
          </section>
        </form>

        {/* RIGHT: Summary Card */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-4 rounded-lg shadow-sm border overflow-hidden bg-white">
            <div
              className="px-4 py-3"
              style={{ backgroundColor: themeColor, color: "#fff" }}
            >
              <div className="text-sm opacity-90">Your Visa</div>
              <div className="text-lg font-semibold leading-snug">
                {visa?.country || "Visa"}
              </div>
              <div className="text-xs opacity-90">
                {visa?.subject || "General"}
              </div>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <div className="w-full aspect-video rounded-md overflow-hidden bg-gray-100">
                <img
                  src={imageUrl}
                  alt={visa?.country || "Visa"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Travel Date</span>
                <span className="font-medium">{lead.travelDate || "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Passengers</span>
                <span className="font-medium">
                  {passengerCountInput || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Price (per person)</span>
                <span className="font-medium">
                  {convertAndFormat(visa?.price)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t mt-2">
                <span className="font-semibold">Estimated Total</span>
                <span className="font-semibold">
                  {convertAndFormat(
                    (visa?.price || 0) * (Number(passengerCountInput) || 0)
                  )}
                </span>
              </div>
              <div className="text-[11px] text-gray-500 pt-2">
                Final charges may vary.
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );

  // price formatting moved to CurrencyContext
}
