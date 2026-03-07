import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCurrency } from "../contexts/CurrencyContext";

export default function UserVisaApplication() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    setLoading(true);
    fetch(`${API_BASE}/api/visa-applications`)
      .then((res) => res.json())
      .then((payload) => {
        if (!alive) return;
        const rows = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
          ? payload.data
          : [];
        const email = String(user?.email || user?.Email || "").toLowerCase();
        const userDigits = String(user?.phone || user?.Phone || "").replace(
          /\D/g,
          ""
        );
        const mine = rows.filter((r) => {
          const le = String(r.lead_email || "").toLowerCase();
          if (email && le && le === email) return true;
          const rd = String((r.lead_isd || "") + (r.lead_phone || "")).replace(
            /\D/g,
            ""
          );
          return userDigits && rd && rd.endsWith(userDigits);
        });
        setApps(mine);
      })
      .catch((e) => console.error("Failed to load visa applications:", e))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [user, API_BASE]);

  const filtered = useMemo(() => {
    if (!query) return apps;
    const q = query.toLowerCase();
    return apps.filter((a) => {
      return (
        String(a.id).includes(q) ||
        String(a.country || "")
          .toLowerCase()
          .includes(q) ||
        String(a.subject || "")
          .toLowerCase()
          .includes(q) ||
        String(a.lead_email || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [apps, query]);

  const { convertAndFormat } = useCurrency();

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

  const getPaymentStatus = (a) => {
    const raw = String(
      a?.payment_status || a?.status || a?.state || ""
    ).toLowerCase();
    const labelFrom = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "—");
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

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-700">
            Please login to see your visa applications.
          </p>
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
          <h1 className="text-2xl font-bold">My Visa Applications</h1>
          <p className="text-sm text-gray-500">
            All your visa applications with payment status.
          </p>
        </div>
        <div className="text-sm text-gray-500">Total: {apps.length}</div>
      </div>

      <div className="flex items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by country, subject, email, or id..."
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
                <th className="px-3 py-2 whitespace-nowrap">Country</th>
                <th className="px-3 py-2 whitespace-nowrap">Subject</th>
                <th className="px-3 py-2 whitespace-nowrap">Travel Date</th>
                <th className="px-3 py-2 whitespace-nowrap">Passengers</th>
                <th className="px-3 py-2 whitespace-nowrap">Price/Person</th>
                <th className="px-3 py-2 whitespace-nowrap">Total</th>
                <th className="px-3 py-2 whitespace-nowrap">Payment</th>
                <th className="px-3 py-2 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-3 py-6 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-3 py-6 text-center text-gray-500"
                  >
                    No visa applications found.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="border-t hover:bg-orange-50/40">
                    <td className="px-3 py-2">#{a.id}</td>
                    <td className="px-3 py-2">{a.country || "—"}</td>
                    <td className="px-3 py-2">{a.subject || "—"}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {formatISODate(a.travel_date)}
                    </td>
                    <td className="px-3 py-2">
                      {Number(a.total_passengers || a.passengers_count || 1)}
                    </td>
                    <td className="px-3 py-2">
                      {convertAndFormat(a.price_per_person || a.price)}
                    </td>
                    <td className="px-3 py-2">
                      {convertAndFormat(
                        (a.price_per_person || a.price) *
                          (a.total_passengers || a.passengers_count || 1)
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {(() => {
                        const s = getPaymentStatus(a);
                        return <span className={s.cls}>{s.label}</span>;
                      })()}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => {
                          setSelected(a);
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
              No visa applications found.
            </div>
          ) : (
            <ul className="divide-y">
              {filtered.map((a) => (
                <li key={a.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-gray-500">Application</div>
                      <div className="font-semibold">#{a.id}</div>
                    </div>
                    <div>
                      {(() => {
                        const s = getPaymentStatus(a);
                        return <span className={s.cls}>{s.label}</span>;
                      })()}
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Country</span>
                      <span className="font-medium text-right ml-2">
                        {a.country || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subject</span>
                      <span className="text-right ml-2">
                        {a.subject || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Travel Date</span>
                      <span className="text-right ml-2">
                        {formatISODate(a.travel_date)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Passengers</span>
                      <span className="text-right ml-2">
                        {Number(a.total_passengers || a.passengers_count || 1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total</span>
                      <span className="font-semibold text-right ml-2">
                        {convertAndFormat(
                          (a.price_per_person || a.price) *
                            (a.total_passengers || a.passengers_count || 1)
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => {
                        setSelected(a);
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
              <div className="font-semibold">
                Visa Application #{selected.id}
              </div>
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
                <h3 className="font-semibold text-gray-900">
                  Application Info
                </h3>
                <div className="bg-gray-50 rounded p-3 space-y-1">
                  <div className="flex justify-between">
                    <span>Country</span>
                    <span className="font-medium">
                      {selected.country || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subject</span>
                    <span>{selected.subject || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Travel Date</span>
                    <span>{formatISODate(selected.travel_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passengers</span>
                    <span>
                      {Number(
                        selected.total_passengers ||
                          selected.passengers_count ||
                          1
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price/Person</span>
                    <span>
                      {convertAndFormat(
                        selected.price_per_person || selected.price
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span className="font-semibold">
                      {convertAndFormat(
                        (selected.price_per_person || selected.price) *
                          (selected.total_passengers ||
                            selected.passengers_count ||
                            1)
                      )}
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
                {selected.notes && (
                  <div className="space-y-1">
                    <h4 className="font-semibold text-gray-900">Notes</h4>
                    <div className="bg-gray-50 rounded p-3 whitespace-pre-wrap">
                      {selected.notes}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Lead Applicant</h3>
                <div className="bg-gray-50 rounded p-3 space-y-1">
                  <div className="flex justify-between">
                    <span>Name</span>
                    <span className="font-medium">
                      {[
                        selected.lead_title,
                        selected.lead_first_name,
                        selected.lead_last_name,
                      ]
                        .filter(Boolean)
                        .join(" ") || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email</span>
                    <span>{selected.lead_email || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone</span>
                    <span>
                      {[selected.lead_isd || "", selected.lead_phone || "—"]
                        .filter(Boolean)
                        .join(" ")}
                    </span>
                  </div>
                </div>

                {Array.isArray(selected.passengers) &&
                  selected.passengers.length > 0 && (
                    <div className="space-y-1">
                      <h3 className="font-semibold text-gray-900 mt-3">
                        Passengers
                      </h3>
                      <div className="bg-gray-50 rounded p-3 space-y-1">
                        {selected.passengers.map((p, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>Passenger {idx + 1}</span>
                            <span className="font-medium">
                              {[p.title, p.firstName, p.lastName]
                                .filter(Boolean)
                                .join(" ")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
