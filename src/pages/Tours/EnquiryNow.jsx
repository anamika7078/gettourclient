import {
  Calendar,
  Home,
  Mail,
  Phone,
  Target,
  Ticket,
  Truck,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";

const ORANGE = "#F17232";

export default function EnquiryNow({ pkg }) {
  const title = pkg?.title || "Bali Paradise Package";
  const destination = pkg?.destination || "Bali";

  const { nights, days } = useMemo(() => {
    const d = String(pkg?.duration || "5N/6D");
    const n = d.match(/(\d+)\s*(?:N|Night|Nights)/i)?.[1];
    const dy = d.match(/(\d+)\s*(?:D|Day|Days)/i)?.[1];
    return {
      nights: n ? Number(n) : 5,
      days: dy ? Number(dy) : 6,
    };
  }, [pkg?.duration]);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("+971");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [adult, setAdult] = useState(2);
  const [child, setChild] = useState(0);
  const [flightBooked, setFlightBooked] = useState("no");
  const [remarks, setRemarks] = useState("");
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
      // Compose subject/message if needed for email mirroring (not used here)

      // Send to holiday enquiries endpoint
      const payload = {
        name,
        email,
        phone: `${code} ${phone}`,
        travel_date: date,
        adults: adult,
        children: child,
        flight_booked: flightBooked,
        remarks,
        package_id: pkg?.id,
        package_title: title,
        destination,
        duration: pkg?.duration,
        price: pkg?.price,
      };

      const res = await fetch(`${API_BASE}/api/holiday-enquiries`, {
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
      setDate("");
      setAdult(2);
      setChild(0);
      setFlightBooked("no");
      setRemarks("");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const tourChips = useMemo(() => {
    const chips = [];
    chips.push(destination ? `Arrival in ${destination}` : "Arrival");
    const d = days || 3;
    if (d >= 3) chips.push("City Tour");
    if (d >= 4) chips.push("Activities");
    chips.push("Departure");
    return chips;
  }, [destination, days]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-6 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-5">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-white mb-0.5">{title}</h1>
              <p className="text-orange-100 text-xs font-medium">
                Plan your perfect getaway
              </p>
            </div>
            {(nights != null || days != null) && (
              <div className="bg-white/20 px-4 py-2 rounded-xl border border-white/30">
                <div className="text-white font-semibold text-sm">
                  {nights}N / {days}D
                </div>
              </div>
            )}
          </div>

          {/* Inclusions */}
          <div className="px-6 py-4 bg-gradient-to-b from-orange-50 to-white">
            <h3 className="text-xs font-bold text-gray-600 uppercase mb-2">
              Package Inclusions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                {
                  icon: <Home className="w-4 h-4 text-orange-500" />,
                  label: "Hotels",
                },
                {
                  icon: <Ticket className="w-4 h-4 text-orange-500" />,
                  label: "Tickets",
                },
                {
                  icon: <Target className="w-4 h-4 text-orange-500" />,
                  label: "Activities",
                },
                {
                  icon: <Truck className="w-4 h-4 text-orange-500" />,
                  label: "Transfers",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-orange-100 hover:border-orange-300 transition-all"
                >
                  {item.icon}
                  <span className="text-gray-700 text-xs font-medium">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tour & Hotel Info */}
          <div className="px-6 py-4 grid md:grid-cols-2 gap-4 bg-white">
            <div>
              <h3 className="text-xs font-bold text-gray-600 uppercase mb-2">
                Tour Itinerary
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {tourChips.map((c, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-orange-200"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-600 uppercase mb-2">
                Accommodation
              </h3>
              <div className="bg-blue-50 text-blue-800 px-2.5 py-1 rounded-full text-xs font-semibold border border-blue-200 inline-block">
                Hotel as per selection
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

            {/* Travel Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Travel Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500 w-4 h-4 pointer-events-none" />
                <input
                  type="date"
                  className="w-full h-[42px] pl-10 pr-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none cursor-pointer"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            {/* Travelers & Flight */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adults
                </label>
                <select
                  className="w-full h-[42px] border border-gray-200 rounded-lg bg-gray-50 px-3 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                  value={adult}
                  onChange={(e) => setAdult(Number(e.target.value))}
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1} {i === 0 ? "Adult" : "Adults"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Children
                </label>
                <select
                  className="w-full h-[42px] border border-gray-200 rounded-lg bg-gray-50 px-3 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                  value={child}
                  onChange={(e) => setChild(Number(e.target.value))}
                >
                  {Array.from({ length: 11 }, (_, i) => (
                    <option key={i} value={i}>
                      {i} {i === 1 ? "Child" : "Children"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Flight Booked
                </label>
                <div className="flex items-center gap-4 h-[42px]">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="flight"
                      className="accent-orange-500 w-4 h-4"
                      value="yes"
                      checked={flightBooked === "yes"}
                      onChange={() => setFlightBooked("yes")}
                    />
                    <span className="text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="flight"
                      className="accent-orange-500 w-4 h-4"
                      value="no"
                      checked={flightBooked === "no"}
                      onChange={() => setFlightBooked("no")}
                    />
                    <span className="text-gray-700">No</span>
                  </label>
                </div>
              </div>
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
