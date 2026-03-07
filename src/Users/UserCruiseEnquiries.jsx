import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCurrency } from "../contexts/CurrencyContext";

export default function UserCruiseEnquiries() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    setLoading(true);
    fetch(`${API_BASE}/api/cruise-enquiries`)
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
          const le = String(r.email || "").toLowerCase();
          if (email && le && le === email) return true;
          const rd = String(r.phone || "").replace(/\D/g, "");
          return userDigits && rd && rd.endsWith(userDigits);
        });
        setItems(mine);
      })
      .catch((e) => console.error("Failed to load cruise enquiries:", e))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [user, API_BASE]);

  const filtered = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter((e) => {
      return (
        String(e.id).includes(q) ||
        String(e.cruise_title || "")
          .toLowerCase()
          .includes(q) ||
        String(e.departure_port || "")
          .toLowerCase()
          .includes(q) ||
        String(e.travel_date || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [items, query]);

  const { convertAndFormat } = useCurrency();

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-700">
            Please login to see your cruise enquiries.
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
          <h1 className="text-2xl font-bold">My Cruise Enquiries</h1>
          <p className="text-sm text-gray-500">
            Your submitted cruise enquiry forms.
          </p>
        </div>
        <div className="text-sm text-gray-500">Total: {items.length}</div>
      </div>

      <div className="flex items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by cruise, port, date, or id..."
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
                <th className="px-3 py-2 whitespace-nowrap">Cruise</th>
                <th className="px-3 py-2 whitespace-nowrap">Departure Port</th>
                <th className="px-3 py-2 whitespace-nowrap">Departure Date</th>
                <th className="px-3 py-2 whitespace-nowrap">Travel Date</th>
                <th className="px-3 py-2 whitespace-nowrap">Adults</th>
                <th className="px-3 py-2 whitespace-nowrap">Children</th>
                <th className="px-3 py-2 whitespace-nowrap">Price</th>
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
                    No enquiries found.
                  </td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr key={e.id} className="border-t hover:bg-orange-50/40">
                    <td className="px-3 py-2">#{e.id}</td>
                    <td className="px-3 py-2">{e.cruise_title || "—"}</td>
                    <td className="px-3 py-2">{e.departure_port || "—"}</td>
                    <td className="px-3 py-2">{e.departure_date || "—"}</td>
                    <td className="px-3 py-2">{e.travel_date || "—"}</td>
                    <td className="px-3 py-2">
                      {e.adults ?? e.adult_count ?? 0}
                    </td>
                    <td className="px-3 py-2">
                      {e.children ??
                        Number(e.teen_count || 0) +
                          Number(e.kid_count || 0) +
                          Number(e.infant_count || 0)}
                    </td>
                    <td className="px-3 py-2">
                      {e.price != null ? convertAndFormat(e.price) : "—"}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => {
                          setSelected(e);
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
              No enquiries found.
            </div>
          ) : (
            <ul className="divide-y">
              {filtered.map((e) => (
                <li key={e.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-gray-500">Enquiry</div>
                      <div className="font-semibold">#{e.id}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Cruise</span>
                      <span className="font-medium text-right ml-2">
                        {e.cruise_title || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Departure Port</span>
                      <span className="text-right ml-2">
                        {e.departure_port || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Departure Date</span>
                      <span className="text-right ml-2">
                        {e.departure_date || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Travel Date</span>
                      <span className="text-right ml-2">
                        {e.travel_date || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Adults</span>
                      <span className="text-right ml-2">
                        {e.adults ?? e.adult_count ?? 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Children</span>
                      <span className="text-right ml-2">
                        {e.children ??
                          Number(e.teen_count || 0) +
                            Number(e.kid_count || 0) +
                            Number(e.infant_count || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Price</span>
                      <span className="font-semibold text-right ml-2">
                        {e.price != null ? convertAndFormat(e.price) : "—"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => {
                        setSelected(e);
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
              <div className="font-semibold">Cruise Enquiry #{selected.id}</div>
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
                <h3 className="font-semibold text-gray-900">Enquiry Info</h3>
                <div className="bg-gray-50 rounded p-3 space-y-1">
                  <div className="flex justify-between">
                    <span>Cruise</span>
                    <span className="font-medium">
                      {selected.cruise_title || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Departure Port</span>
                    <span>{selected.departure_port || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Departure Date</span>
                    <span>{selected.departure_date || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Travel Date</span>
                    <span>{selected.travel_date || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Adults</span>
                    <span>{selected.adults ?? selected.adult_count ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Children</span>
                    <span>
                      {selected.children ??
                        Number(selected.teen_count || 0) +
                          Number(selected.kid_count || 0) +
                          Number(selected.infant_count || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cabin</span>
                    <span>{selected.cabin_name || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price</span>
                    <span>
                      {selected.price != null
                        ? convertAndFormat(selected.price)
                        : "—"}
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
                {selected.remarks && (
                  <div className="space-y-1">
                    <h4 className="font-semibold text-gray-900">Remarks</h4>
                    <div className="bg-gray-50 rounded p-3 whitespace-pre-wrap">
                      {selected.remarks}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Contact</h3>
                <div className="bg-gray-50 rounded p-3 space-y-1">
                  <div className="flex justify-between">
                    <span>Name</span>
                    <span className="font-medium">{selected.name || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email</span>
                    <span>{selected.email || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone</span>
                    <span>{selected.phone || "—"}</span>
                  </div>
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
