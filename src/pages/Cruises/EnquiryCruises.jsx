import { Mail, MapPin, Phone, Ship, User } from "lucide-react";
import { useMemo, useState } from "react";

export default function EnquiryCruises({ cruise }) {
  const title = cruise?.title || "Cruise Package";
  const departurePort = cruise?.departure_port || "";

  const departureDates = useMemo(() => {
    try {
      const d =
        typeof cruise?.departure_dates === "string"
          ? JSON.parse(cruise.departure_dates)
          : cruise?.departure_dates;
      return Array.isArray(d) ? d : [];
    } catch {
      return [];
    }
  }, [cruise?.departure_dates]);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("+971");
  const [phone, setPhone] = useState("");
  const [adultCount, setAdultCount] = useState(2);
  const [teenCount, setTeenCount] = useState(0);
  const [kidCount, setKidCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [remarks, setRemarks] = useState("");
  const [depDate, setDepDate] = useState("");
  const [cabinName, setCabinName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setOk(false);
    if (!name.trim() || !email.trim()) {
      setError("Please enter your name and email.");
      return;
    }
    try {
      setSubmitting(true);
      // compute totals for compatibility fields
      const totalAdults = Math.max(0, Number(adultCount) + Number(teenCount));
      const totalChildren = Math.max(0, Number(kidCount) + Number(infantCount));

      const payload = {
        cruise_id: cruise?.id,
        cruise_title: title,
        departure_port: departurePort,
        departure_date: depDate || null,
        price: cruise?.price,
        name,
        email,
        phone: `${code} ${phone}`,
        travel_date: null,
        adults: totalAdults,
        children: totalChildren,
        adult_count: Number(adultCount) || 0,
        teen_count: Number(teenCount) || 0,
        kid_count: Number(kidCount) || 0,
        infant_count: Number(infantCount) || 0,
        cabin_name: cabinName || null,
        remarks,
      };
      const res = await fetch(`${API_BASE}/api/cruise-enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.message || "Failed to submit enquiry");
      }
      setOk(true);
      setName("");
      setEmail("");
      setPhone("");
      setAdultCount(2);
      setTeenCount(0);
      setKidCount(0);
      setInfantCount(0);
      setDepDate("");
      setCabinName("");
      setRemarks("");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-6 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-5">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-white mb-0.5">{title}</h1>
              <p className="text-orange-100 text-xs font-medium">
                Plan your perfect cruise
              </p>
            </div>
            {departurePort && (
              <div className="bg-white/20 px-4 py-2 rounded-xl border border-white/30 flex items-center gap-2">
                <Ship className="text-white w-4 h-4" />
                <div className="text-white font-semibold text-sm">
                  {departurePort}
                </div>
              </div>
            )}
          </div>

          {/* Info strip */}
          <div className="px-6 py-4 grid md:grid-cols-2 gap-4 bg-white">
            <div>
              <h3 className="text-xs font-bold text-gray-600 uppercase mb-2">
                Departure Dates
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {departureDates?.length ? (
                  departureDates.map((d, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-orange-200"
                    >
                      {String(d)}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-500">
                    Dates will be confirmed
                  </span>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-600 uppercase mb-2">
                Port
              </h3>
              <div className="bg-blue-50 text-blue-800 px-2.5 py-1 rounded-full text-xs font-semibold border border-blue-200 inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> {departurePort || "TBA"}
              </div>
            </div>
          </div>
        </div>

        {/* Enquiry Form */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-800 mb-1">
              Send Your Enquiry
            </h2>
            <p className="text-gray-500 text-sm">
              Fill in the details below and we'll get back to you shortly
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {ok && (
              <div className="text-green-600 text-sm">
                Thanks! We'll contact you shortly.
              </div>
            )}

            {/* Full Name & Email */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full h-[42px] pl-10 pr-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full h-[42px] pl-10 pr-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1 max-w-[120px]">
                  <input
                    type="text"
                    placeholder="+971"
                    className="w-full h-[42px] px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    placeholder="Enter your mobile number"
                    className="w-full h-[42px] pl-10 pr-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Departure Date (input with suggestions) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Departure Date
              </label>
              <input
                list="departure-dates"
                type="text"
                placeholder="Select Departure Date"
                className="w-full h-[42px] px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
                value={depDate}
                onChange={(e) => setDepDate(e.target.value)}
              />
              <datalist id="departure-dates">
                {departureDates.map((d, i) => (
                  <option key={i} value={String(d)} />
                ))}
              </datalist>
            </div>

            {/* Travelers detailed counts */}
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adult
                </label>
                <input
                  type="number"
                  min={0}
                  className="w-full h-[42px] px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
                  value={adultCount}
                  onChange={(e) => setAdultCount(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teen
                </label>
                <input
                  type="number"
                  min={0}
                  className="w-full h-[42px] px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
                  value={teenCount}
                  onChange={(e) => setTeenCount(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kid
                </label>
                <input
                  type="number"
                  min={0}
                  className="w-full h-[42px] px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
                  value={kidCount}
                  onChange={(e) => setKidCount(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Infant
                </label>
                <input
                  type="number"
                  min={0}
                  className="w-full h-[42px] px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
                  value={infantCount}
                  onChange={(e) => setInfantCount(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Cabin Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cabin Name
              </label>
              <select
                className="w-full h-[42px] border border-gray-200 rounded-lg bg-gray-50 px-3 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                value={cabinName}
                onChange={(e) => setCabinName(e.target.value)}
              >
                <option value="">Select Cabin</option>
                {[
                  "Inside Cabin",
                  "Oceanview Cabin",
                  "Balcony Cabin",
                  "Mini-Suite",
                  "Suite",
                  "Family Suite",
                  "Deluxe Suite",
                ].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Remarks
              </label>
              <textarea
                rows={3}
                placeholder="Any special requirements or questions..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none resize-none"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm py-3 rounded-lg transition-all disabled:opacity-70 shadow-md hover:shadow-lg"
            >
              {submitting ? "Submitting..." : "Submit Enquiry"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
