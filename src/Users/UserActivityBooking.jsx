// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";

// export default function UserActivityBooking() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [query, setQuery] = useState("");
//   const [open, setOpen] = useState(false);
//   const [selected, setSelected] = useState(null);

//   useEffect(() => {
//     if (!user) return;

//     let alive = true;
//     setLoading(true);
//     setError(null);

//     fetch("http://localhost:5000/api/activity-bookings")
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
//         }
//         return res.json();
//       })
//       .then((payload) => {
//         if (!alive) return;

//         const rows = Array.isArray(payload)
//           ? payload
//           : Array.isArray(payload?.data)
//           ? payload.data
//           : [];

//         const email = (user?.email || user?.Email || "").toLowerCase();
//         const phone = String(user?.phone || user?.Phone || "").trim();

//         const mine = rows.filter((b) => {
//           const be = String(b.email || "").toLowerCase();
//           const bp = String(b.phone || "").trim();
//           return (email && be === email) || (phone && bp === phone);
//         });

//         setBookings(mine);
//       })
//       .catch((err) => {
//         console.error("Failed to load activity bookings:", err);
//         if (alive) {
//           setError(err.message);
//         }
//       })
//       .finally(() => {
//         if (alive) {
//           setLoading(false);
//         }
//       });

//     return () => {
//       alive = false;
//     };
//   }, [user]);

//   const filtered = useMemo(() => {
//     if (!query) return bookings;
//     const q = query.toLowerCase();
//     return bookings.filter((b) => {
//       return (
//         String(b.id).includes(q) ||
//         String(b.activity_title || "")
//           .toLowerCase()
//           .includes(q) ||
//         String(b.full_name || "")
//           .toLowerCase()
//           .includes(q)
//       );
//     });
//   }, [bookings, query]);

//   const formatCurrency = (v) =>
//     `AED ${Number(v || 0).toLocaleString("en-IN", {
//       maximumFractionDigits: 2,
//     })}`;

//   const MONTHS = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];

//   const formatISODate = (iso) => {
//     if (!iso) return "—";
//     const s = String(iso);
//     const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
//     if (m) {
//       const y = m[1];
//       const mm = Number(m[2]);
//       const dd = Number(m[3]);
//       const mon = MONTHS[Math.max(0, Math.min(11, mm - 1))] || "";
//       return `${dd} ${mon} ${y}`;
//     }
//     try {
//       const d = new Date(iso);
//       if (isNaN(d)) return "—";
//       return d.toLocaleDateString("en-GB", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       });
//     } catch {
//       return "—";
//     }
//   };

//   const getPaymentStatus = (b) => {
//     const raw = String(
//       b?.payment_status || b?.status || b?.state || ""
//     ).toLowerCase();
//     const labelFrom = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "—");

//     if (!raw || raw === "pending" || raw.includes("await")) {
//       return {
//         label: "Pending",
//         cls: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border bg-amber-50 text-amber-700 border-amber-200",
//       };
//     }
//     if (
//       raw.includes("paid") ||
//       raw.includes("success") ||
//       raw.includes("confirm") ||
//       raw.includes("complete")
//     ) {
//       return {
//         label: "Paid",
//         cls: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border bg-emerald-50 text-emerald-700 border-emerald-200",
//       };
//     }
//     if (
//       raw.includes("fail") ||
//       raw.includes("cancel") ||
//       raw.includes("reject")
//     ) {
//       return {
//         label: "Failed",
//         cls: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border bg-rose-50 text-rose-700 border-rose-200",
//       };
//     }
//     return {
//       label: labelFrom(raw),
//       cls: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border bg-slate-50 text-slate-700 border-slate-200",
//     };
//   };

//   // Retry function for fetch errors
//   const retryFetch = () => {
//     setError(null);
//     setLoading(true);
//     fetch("http://localhost:5000/api/activity-bookings")
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
//         }
//         return res.json();
//       })
//       .then((payload) => {
//         const rows = Array.isArray(payload)
//           ? payload
//           : Array.isArray(payload?.data)
//           ? payload.data
//           : [];

//         const email = (user?.email || user?.Email || "").toLowerCase();
//         const phone = String(user?.phone || user?.Phone || "").trim();

//         const mine = rows.filter((b) => {
//           const be = String(b.email || "").toLowerCase();
//           const bp = String(b.phone || "").trim();
//           return (email && be === email) || (phone && bp === phone);
//         });

//         setBookings(mine);
//       })
//       .catch((err) => {
//         console.error("Failed to load activity bookings:", err);
//         setError(err.message);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   if (!user) {
//     return (
//       <div className="max-w-5xl mx-auto p-4">
//         <div className="bg-white rounded-lg shadow p-6 text-center">
//           <p className="text-gray-700">
//             Please login to see your activity bookings.
//           </p>
//           <button
//             className="mt-3 px-4 py-2 rounded text-white"
//             style={{ backgroundColor: "#F17232" }}
//             onClick={() => navigate("/login")}
//           >
//             Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-4 space-y-4">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold">My Activity Bookings</h1>
//           <p className="text-sm text-gray-500">
//             Activity bookings associated with your account.
//           </p>
//         </div>
//         <div className="text-sm text-gray-500">Total: {bookings.length}</div>
//       </div>

//       {/* Error Display */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <svg
//                 className="w-5 h-5 text-red-500"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               <span className="text-red-700 font-medium">
//                 Error loading bookings
//               </span>
//             </div>
//             <button
//               onClick={retryFetch}
//               className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
//             >
//               Retry
//             </button>
//           </div>
//           <p className="text-red-600 text-sm mt-1">{error}</p>
//         </div>
//       )}

//       <div className="flex items-center gap-3">
//         <input
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search by activity, name, or id..."
//           className="border border-gray-300 rounded px-3 py-2 w-80 focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
//         />
//       </div>

//       <div className="bg-white shadow-sm rounded-lg overflow-hidden border">
//         {/* Desktop/tablet table - Show on medium screens and above */}
//         <div className="overflow-x-auto hidden md:block">
//           <table className="min-w-full text-sm">
//             <thead className="bg-orange-50 sticky top-0 z-10">
//               <tr className="text-left text-gray-700">
//                 <th className="px-3 py-2 whitespace-nowrap">ID</th>
//                 <th className="px-3 py-2 whitespace-nowrap">Activity</th>
//                 <th className="px-3 py-2 whitespace-nowrap">Visit Date</th>
//                 <th className="px-3 py-2 whitespace-nowrap">Guests</th>
//                 <th className="px-3 py-2 whitespace-nowrap">Transfer</th>
//                 <th className="px-3 py-2 whitespace-nowrap">Total</th>
//                 <th className="px-3 py-2 whitespace-nowrap">Payment</th>
//                 <th className="px-3 py-2 whitespace-nowrap">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td
//                     colSpan="8"
//                     className="px-3 py-6 text-center text-gray-500"
//                   >
//                     Loading...
//                   </td>
//                 </tr>
//               ) : filtered.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan="8"
//                     className="px-3 py-6 text-center text-gray-500"
//                   >
//                     {query
//                       ? "No matching bookings found."
//                       : "No activity bookings found."}
//                   </td>
//                 </tr>
//               ) : (
//                 filtered.map((b) => (
//                   <tr key={b.id} className="border-t hover:bg-orange-50/40">
//                     <td className="px-3 py-2">#{b.id}</td>
//                     <td className="px-3 py-2">
//                       <div className="font-medium">
//                         {b.activity_title || "—"}
//                       </div>
//                     </td>
//                     <td className="px-3 py-2 whitespace-nowrap">
//                       {formatISODate(b.visit_date)}
//                     </td>
//                     <td className="px-3 py-2">
//                       {Number(b.adults || 0) + Number(b.children || 0)}
//                     </td>
//                     <td className="px-3 py-2">{b.transfer ? "Yes" : "No"}</td>
//                     <td className="px-3 py-2">
//                       {formatCurrency(b.total_amount)}
//                     </td>
//                     <td className="px-3 py-2">
//                       {(() => {
//                         const s = getPaymentStatus(b);
//                         return <span className={s.cls}>{s.label}</span>;
//                       })()}
//                     </td>
//                     <td className="px-3 py-2">
//                       <button
//                         onClick={() => {
//                           setSelected(b);
//                           setOpen(true);
//                         }}
//                         className="px-3 py-1.5 rounded text-white text-xs hover:opacity-90 transition-opacity"
//                         style={{ backgroundColor: "#F17232" }}
//                       >
//                         View Details
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Mobile card list - Show on small screens */}
//         <div className="block md:hidden">
//           {loading ? (
//             <div className="px-3 py-6 text-center text-gray-500">
//               Loading...
//             </div>
//           ) : filtered.length === 0 ? (
//             <div className="px-3 py-6 text-center text-gray-500">
//               {query
//                 ? "No matching bookings found."
//                 : "No activity bookings found."}
//             </div>
//           ) : (
//             <ul className="divide-y">
//               {filtered.map((b) => (
//                 <li
//                   key={b.id}
//                   className="p-4 hover:bg-orange-50/40 transition-colors"
//                 >
//                   <div className="flex items-start justify-between gap-3">
//                     <div>
//                       <div className="text-xs text-gray-500">Booking</div>
//                       <div className="font-semibold">#{b.id}</div>
//                     </div>
//                     <div>
//                       {(() => {
//                         const s = getPaymentStatus(b);
//                         return <span className={s.cls}>{s.label}</span>;
//                       })()}
//                     </div>
//                   </div>
//                   <div className="mt-3 space-y-1 text-sm">
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Activity</span>
//                       <span className="font-medium text-right ml-2 max-w-[60%] truncate">
//                         {b.activity_title || "—"}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Visit Date</span>
//                       <span className="text-right ml-2">
//                         {formatISODate(b.visit_date)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Guests</span>
//                       <span className="text-right ml-2">
//                         {Number(b.adults || 0) + Number(b.children || 0)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Transfer</span>
//                       <span className="text-right ml-2">
//                         {b.transfer ? "Yes" : "No"}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Total</span>
//                       <span className="font-semibold text-right ml-2">
//                         {formatCurrency(b.total_amount)}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="mt-3 flex justify-end">
//                     <button
//                       onClick={() => {
//                         setSelected(b);
//                         setOpen(true);
//                       }}
//                       className="px-3 py-1.5 rounded text-white text-xs hover:opacity-90 transition-opacity"
//                       style={{ backgroundColor: "#F17232" }}
//                     >
//                       View Details
//                     </button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>

//       {/* Modal */}
//       {open && selected && (
//         <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
//             <div
//               className="px-5 py-4 text-white flex items-center justify-between"
//               style={{ backgroundColor: "#F17232" }}
//             >
//               <div className="font-semibold">
//                 Activity Booking #{selected.id}
//               </div>
//               <button
//                 onClick={() => setOpen(false)}
//                 className="text-white/90 hover:text-white transition-colors"
//               >
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                   <path
//                     d="M6 6l12 12M18 6L6 18"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                   />
//                 </svg>
//               </button>
//             </div>
//             <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-gray-800 overflow-y-auto">
//               <div className="space-y-2">
//                 <h3 className="font-semibold text-gray-900">Booking Info</h3>
//                 <div className="bg-gray-50 rounded p-3 space-y-1">
//                   <div className="flex justify-between">
//                     <span>Activity</span>
//                     <span className="font-medium">
//                       {selected.activity_title || "—"}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Visit Date</span>
//                     <span>{formatISODate(selected.visit_date)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Adults</span>
//                     <span>{selected.adults || 0}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Children</span>
//                     <span>{selected.children || 0}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Transfer</span>
//                     <span>{selected.transfer ? "Yes" : "No"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Total</span>
//                     <span className="font-semibold">
//                       {formatCurrency(selected.total_amount)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Payment</span>
//                     <span>
//                       {(() => {
//                         const s = getPaymentStatus(selected);
//                         return <span className={s.cls}>{s.label}</span>;
//                       })()}
//                     </span>
//                   </div>
//                   {selected.created_at && (
//                     <div className="flex justify-between">
//                       <span>Created</span>
//                       <span>
//                         {new Date(selected.created_at).toLocaleString()}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//                 {selected.notes && (
//                   <div className="space-y-1">
//                     <h4 className="font-semibold text-gray-900">Notes</h4>
//                     <div className="bg-gray-50 rounded p-3 whitespace-pre-wrap">
//                       {selected.notes}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <h3 className="font-semibold text-gray-900">Lead Contact</h3>
//                 <div className="bg-gray-50 rounded p-3 space-y-1">
//                   <div className="flex justify-between">
//                     <span>Name</span>
//                     <span className="font-medium">
//                       {selected.full_name || "—"}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Email</span>
//                     <span>{selected.email || "—"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Phone</span>
//                     <span>{selected.phone || "—"}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="px-5 py-3 flex items-center justify-end gap-2 border-t">
//               <button
//                 onClick={() => setOpen(false)}
//                 className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCurrency } from "../contexts/CurrencyContext";

export default function UserActivityBooking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const { convertAndFormat } = useCurrency();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!user) return;

    let alive = true;
    setLoading(true);
    setError(null);

    fetch(`${API_URL}/api/activity-bookings`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((payload) => {
        if (!alive) return;

        const rows = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
          ? payload.data
          : [];

        const email = (user?.email || user?.Email || "").toLowerCase();
        const phone = String(user?.phone || user?.Phone || "").trim();

        const mine = rows.filter((b) => {
          const be = String(b.email || "").toLowerCase();
          const bp = String(b.phone || "").trim();
          return (email && be === email) || (phone && bp === phone);
        });

        setBookings(mine);
      })
      .catch((err) => {
        console.error("Failed to load activity bookings:", err);
        if (alive) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (alive) {
          setLoading(false);
        }
      });

    return () => {
      alive = false;
    };
  }, [user, API_URL]);

  const filtered = useMemo(() => {
    if (!query) return bookings;
    const q = query.toLowerCase();
    return bookings.filter((b) => {
      return (
        String(b.id).includes(q) ||
        String(b.activity_title || "")
          .toLowerCase()
          .includes(q) ||
        String(b.full_name || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [bookings, query]);

  const formatCurrency = (v) => convertAndFormat(v);

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

  const getPaymentStatus = (b) => {
    const raw = String(
      b?.payment_status || b?.status || b?.state || ""
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

  // Retry function for fetch errors
  const retryFetch = () => {
    setError(null);
    setLoading(true);
    fetch(`${API_URL}/api/activity-bookings`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((payload) => {
        const rows = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
          ? payload.data
          : [];

        const email = (user?.email || user?.Email || "").toLowerCase();
        const phone = String(user?.phone || user?.Phone || "").trim();

        const mine = rows.filter((b) => {
          const be = String(b.email || "").toLowerCase();
          const bp = String(b.phone || "").trim();
          return (email && be === email) || (phone && bp === phone);
        });

        setBookings(mine);
      })
      .catch((err) => {
        console.error("Failed to load activity bookings:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-700">
            Please login to see your activity bookings.
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
          <h1 className="text-2xl font-bold">My Activity Bookings</h1>
          <p className="text-sm text-gray-500">
            Activity bookings associated with your account.
          </p>
        </div>
        <div className="text-sm text-gray-500">Total: {bookings.length}</div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-700 font-medium">
                Error loading bookings
              </span>
            </div>
            <button
              onClick={retryFetch}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by activity, name, or id..."
          className="border border-gray-300 rounded px-3 py-2 w-80 focus:outline-none hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
        />
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden border">
        {/* Desktop/tablet table - Show on medium screens and above */}
        <div className="overflow-x-auto hidden md:block">
          <table className="min-w-full text-sm">
            <thead className="bg-orange-50 sticky top-0 z-10">
              <tr className="text-left text-gray-700">
                <th className="px-3 py-2 whitespace-nowrap">ID</th>
                <th className="px-3 py-2 whitespace-nowrap">Activity</th>
                <th className="px-3 py-2 whitespace-nowrap">Visit Date</th>
                <th className="px-3 py-2 whitespace-nowrap">Guests</th>
                <th className="px-3 py-2 whitespace-nowrap">Transfer</th>
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
                    {query
                      ? "No matching bookings found."
                      : "No activity bookings found."}
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="border-t hover:bg-orange-50/40">
                    <td className="px-3 py-2">#{b.id}</td>
                    <td className="px-3 py-2">
                      <div className="font-medium">
                        {b.activity_title || "—"}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {formatISODate(b.visit_date)}
                    </td>
                    <td className="px-3 py-2">
                      {Number(b.adults || 0) + Number(b.children || 0)}
                    </td>
                    <td className="px-3 py-2">{b.transfer ? "Yes" : "No"}</td>
                    <td className="px-3 py-2">
                      {convertAndFormat(b.total_amount)}
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
                        className="px-3 py-1.5 rounded text-white text-xs hover:opacity-90 transition-opacity"
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

        {/* Mobile card list - Show on small screens */}
        <div className="block md:hidden">
          {loading ? (
            <div className="px-3 py-6 text-center text-gray-500">
              Loading...
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-3 py-6 text-center text-gray-500">
              {query
                ? "No matching bookings found."
                : "No activity bookings found."}
            </div>
          ) : (
            <ul className="divide-y">
              {filtered.map((b) => (
                <li
                  key={b.id}
                  className="p-4 hover:bg-orange-50/40 transition-colors"
                >
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
                      <span className="text-gray-500">Activity</span>
                      <span className="font-medium text-right ml-2 max-w-[60%] truncate">
                        {b.activity_title || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Visit Date</span>
                      <span className="text-right ml-2">
                        {formatISODate(b.visit_date)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Guests</span>
                      <span className="text-right ml-2">
                        {Number(b.adults || 0) + Number(b.children || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Transfer</span>
                      <span className="text-right ml-2">
                        {b.transfer ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total</span>
                      <span className="font-semibold text-right ml-2">
                        {convertAndFormat(b.total_amount)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => {
                        setSelected(b);
                        setOpen(true);
                      }}
                      className="px-3 py-1.5 rounded text-white text-xs hover:opacity-90 transition-opacity"
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

      {/* Modal */}
      {open && selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div
              className="px-5 py-4 text-white flex items-center justify-between"
              style={{ backgroundColor: "#F17232" }}
            >
              <div className="font-semibold">
                Activity Booking #{selected.id}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/90 hover:text-white transition-colors"
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
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-gray-800 overflow-y-auto">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Booking Info</h3>
                <div className="bg-gray-50 rounded p-3 space-y-1">
                  <div className="flex justify-between">
                    <span>Activity</span>
                    <span className="font-medium">
                      {selected.activity_title || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Visit Date</span>
                    <span>{formatISODate(selected.visit_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Adults</span>
                    <span>{selected.adults || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Children</span>
                    <span>{selected.children || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transfer</span>
                    <span>{selected.transfer ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span className="font-semibold">
                      {convertAndFormat(selected.total_amount)}
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
                <h3 className="font-semibold text-gray-900">Lead Contact</h3>
                <div className="bg-gray-50 rounded p-3 space-y-1">
                  <div className="flex justify-between">
                    <span>Name</span>
                    <span className="font-medium">
                      {selected.full_name || "—"}
                    </span>
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
            <div className="px-5 py-3 flex items-center justify-end gap-2 border-t">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
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
