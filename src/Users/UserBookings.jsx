import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCurrency } from "../contexts/CurrencyContext";

export default function UserBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const { convertAndFormat } = useCurrency();

  useEffect(() => {
    if (!user) return;
    let alive = true;
    setLoading(true);
    fetch(`${API_BASE}/api/room-bookings`)
      .then((res) => res.json())
      .then((rows) => {
        if (!alive) return;
        const arr = Array.isArray(rows) ? rows : [];
        const email = (user?.email || user?.Email || "").toLowerCase();
        const phone = String(user?.phone || user?.Phone || "").trim();
        const mine = arr.filter((b) => {
          const be = (b.lead_email || "").toLowerCase();
          const bp = String(b.lead_phone || "").trim();
          return (email && be === email) || (phone && bp === phone);
        });
        setBookings(mine);
      })
      .catch((err) => console.error("Failed to load bookings:", err))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [user, API_BASE]);

  const filtered = useMemo(() => {
    if (!query) return bookings;
    const q = query.toLowerCase();
    return bookings.filter((b) => {
      return (
        String(b.id).includes(q) ||
        (b.hotel_name || "").toLowerCase().includes(q) ||
        (b.room_type || "").toLowerCase().includes(q)
      );
    });
  }, [bookings, query]);

  // price formatting via CurrencyContext

  // Normalize and style payment status
  const getPaymentStatus = (b) => {
    const raw = String(
      b?.payment_status || b?.status || b?.state || ""
    ).toLowerCase();
    const labelFrom = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    if (!raw || raw === "pending" || raw.includes("await")) {
      return {
        label: "Pending",
        cls: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border bg-amber-50 text-amber-700 border-amber-200",
      };
    }
    if (
      raw.includes("paid") ||
      raw.includes("success") ||
      raw.includes("confirm") ||
      raw.includes("complete")
    ) {
      return {
        label: "Paid",
        cls: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    }
    if (
      raw.includes("fail") ||
      raw.includes("cancel") ||
      raw.includes("reject")
    ) {
      return {
        label: "Failed",
        cls: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border bg-rose-50 text-rose-700 border-rose-200",
      };
    }
    return {
      label: labelFrom(raw),
      cls: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border bg-slate-50 text-slate-700 border-slate-200",
    };
  };

  // Readable date helpers (avoids TZ issues by parsing YYYY-MM-DD when possible)
  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const formatISODate = (iso) => {
    if (!iso) return "—";
    const s = String(iso);
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
      const y = m[1];
      const mm = Number(m[2]);
      const dd = Number(m[3]);
      const mon = MONTHS[Math.max(0, Math.min(11, mm - 1))] || "";
      return `${dd} ${mon} ${y}`;
    }
    try {
      const d = new Date(iso);
      if (isNaN(d)) return "—";
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };
  const formatDateRange = (start, end) =>
    `${formatISODate(start)} → ${formatISODate(end)}`;

  const parseGuests = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === "string") {
      try {
        const p = JSON.parse(val);
        return Array.isArray(p) ? p : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-700">Please login to see your bookings.</p>
          <button
            className="mt-3 px-4 py-2 rounded text-white"
            style={{ backgroundColor: "#F17232" }}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <p className="text-sm text-gray-500">
            Room bookings associated with your account.
          </p>
        </div>
        <div className="text-sm text-gray-500">Total: {bookings.length}</div>
      </div>

      <div className="flex items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by hotel, room, or id..."
          className="border border-gray-300 rounded px-3 py-2 w-80 focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
        />
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden border">
        {/* Desktop/tablet table */}
        <div className="overflow-x-auto hidden md:block">
          <table className="min-w-full text-sm">
            <thead className="bg-orange-50 sticky top-0 z-10">
              <tr className="text-left text-gray-700">
                <th className="px-3 py-2 whitespace-nowrap">ID</th>
                <th className="px-3 py-2 whitespace-nowrap">Hotel</th>
                <th className="px-3 py-2 whitespace-nowrap">Room</th>
                <th className="px-3 py-2 whitespace-nowrap">Dates</th>
                <th className="px-3 py-2 whitespace-nowrap">Guests</th>
                <th className="px-3 py-2 whitespace-nowrap">Total</th>
                <th className="px-3 py-2 whitespace-nowrap">Payment</th>
                <th className="px-3 py-2 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-3 py-6 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-3 py-6 text-center text-gray-500"
                  >
                    No bookings found.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="border-t hover:bg-orange-50/40">
                    <td className="px-3 py-2">#{b.id}</td>
                    <td className="px-3 py-2">
                      <div className="font-medium">{b.hotel_name || "—"}</div>
                    </td>
                    <td className="px-3 py-2">{b.room_type || "—"}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {formatDateRange(b.check_in, b.check_out)}
                    </td>
                    <td className="px-3 py-2">{b.total_guests || 1}</td>
                    <td className="px-3 py-2">
                      {convertAndFormat(b.total_price)}
                    </td>
                    <td className="px-3 py-2">
                      {(() => {
                        const s = getPaymentStatus(b);
                        return <span className={s.cls}>{s.label}</span>;
                      })()}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => {
                          setSelected(b);
                          setOpen(true);
                        }}
                        className="px-3 py-1.5 rounded text-white text-xs"
                        style={{ backgroundColor: "#F17232" }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="md:hidden">
          {loading ? (
            <div className="px-3 py-6 text-center text-gray-500">
              Loading...
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-3 py-6 text-center text-gray-500">
              No bookings found.
            </div>
          ) : (
            <ul className="divide-y">
              {filtered.map((b) => (
                <li key={b.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-gray-500">Booking</div>
                      <div className="font-semibold">#{b.id}</div>
                    </div>
                    <div>
                      {(() => {
                        const s = getPaymentStatus(b);
                        return <span className={s.cls}>{s.label}</span>;
                      })()}
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Hotel</span>
                      <span className="font-medium text-right ml-2">
                        {b.hotel_name || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Room</span>
                      <span className="text-right ml-2">
                        {b.room_type || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Dates</span>
                      <span className="text-right ml-2">
                        {formatDateRange(b.check_in, b.check_out)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Guests</span>
                      <span className="text-right ml-2">
                        {b.total_guests || 1}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total</span>
                      <span className="font-semibold text-right ml-2">
                        {convertAndFormat(b.total_price)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => {
                        setSelected(b);
                        setOpen(true);
                      }}
                      className="px-3 py-1.5 rounded text-white text-xs"
                      style={{ backgroundColor: "#F17232" }}
                    >
                      View Details
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {open && selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full overflow-hidden">
            <div
              className="px-5 py-4 text-white flex items-center justify-between"
              style={{ backgroundColor: "#F17232" }}
            >
              <div className="font-semibold">Booking #{selected.id}</div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/90 hover:text-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-gray-800 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Booking Info</h3>
                <div className="bg-gray-50 rounded p-3 space-y-1">
                  <div className="flex justify-between">
                    <span>Hotel</span>
                    <span className="font-medium">
                      {selected.hotel_name || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Room</span>
                    <span>{selected.room_type || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price/Night</span>
                    <span>{convertAndFormat(selected.price_per_night)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dates</span>
                    <span>
                      {formatDateRange(selected.check_in, selected.check_out)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nights</span>
                    <span>{selected.nights || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests</span>
                    <span>{selected.total_guests || 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span className="font-semibold">
                      {convertAndFormat(selected.total_price)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment</span>
                    <span>
                      {(() => {
                        const s = getPaymentStatus(selected);
                        return <span className={s.cls}>{s.label}</span>;
                      })()}
                    </span>
                  </div>
                  {selected.created_at && (
                    <div className="flex justify-between">
                      <span>Created</span>
                      <span>
                        {new Date(selected.created_at).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
                {selected.special_request && (
                  <div className="space-y-1">
                    <h4 className="font-semibold text-gray-900">
                      Special Request
                    </h4>
                    <div className="bg-gray-50 rounded p-3 whitespace-pre-wrap">
                      {selected.special_request}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Lead Passenger</h3>
                <div className="bg-gray-50 rounded p-3 space-y-1">
                  <div className="flex justify-between">
                    <span>Name</span>
                    <span className="font-medium">
                      {selected.lead_title ? `${selected.lead_title} ` : ""}
                      {selected.lead_first_name || ""}{" "}
                      {selected.lead_last_name || ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email</span>
                    <span>{selected.lead_email || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone</span>
                    <span>
                      {selected.lead_country_code || ""}{" "}
                      {selected.lead_phone || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nationality</span>
                    <span>{selected.lead_nationality || "—"}</span>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mt-3">
                  Additional Guests
                </h3>
                <div className="bg-gray-50 rounded p-3 space-y-1">
                  {parseGuests(selected.additional_guests).length === 0 ? (
                    <div className="text-gray-500">None</div>
                  ) : (
                    parseGuests(selected.additional_guests).map((g, i) => (
                      <div key={i} className="flex justify-between">
                        <span>Guest {i + 2}</span>
                        <span className="font-medium">
                          {g.title ? `${g.title} ` : ""}
                          {g.firstName || ""} {g.lastName || ""}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="px-5 py-3 flex items-center justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded border border-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
