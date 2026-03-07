// import { useEffect, useState } from "react";

// export default function Bookings() {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selected, setSelected] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [confirmId, setConfirmId] = useState(null);
//   const [deleting, setDeleting] = useState(false);

//   useEffect(() => {
//     let alive = true;
//     setLoading(true);
//     fetch("http://localhost:5000/api/room-bookings")
//       .then((res) => res.json())
//       .then((rows) => {
//         if (!alive) return;
//         setBookings(Array.isArray(rows) ? rows : []);
//       })
//       .catch((err) => console.error("Failed to load bookings:", err))
//       .finally(() => alive && setLoading(false));
//     return () => {
//       alive = false;
//     };
//   }, []);

//   // Filter bookings based on search and status
//   const filteredBookings = bookings.filter((app) => {
//     const matchesSearch =
//       app.lead_first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       app.lead_last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       app.lead_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       app.hotel_name?.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesStatus =
//       statusFilter === "all" || app.payment_status === statusFilter;

//     return matchesSearch && matchesStatus;
//   });

//   const viewBookingDetails = (booking) => {
//     setSelected(booking);
//     setShowModal(true);
//   };

//   const deleteBooking = async (id) => {
//     if (!id) return;
//     setDeleting(true);
//     try {
//       const res = await fetch(`http://localhost:5000/api/room-bookings/${id}`, {
//         method: "DELETE",
//       });
//       const j = await res.json().catch(() => ({}));
//       if (!res.ok || j?.success === false)
//         throw new Error(j?.error || "Delete failed");
//       // remove locally
//       setBookings((prev) => prev.filter((b) => b.id !== id));
//       if (selected?.id === id) setShowModal(false);
//       setConfirmId(null);
//     } catch (e) {
//       alert(e.message || "Failed to delete");
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statusConfig = {
//       paid: {
//         color: "bg-emerald-100 text-emerald-800 border-emerald-200",
//         label: "Paid",
//       },
//       pending: {
//         color: "bg-amber-100 text-amber-800 border-amber-200",
//         label: "Pending",
//       },
//       unpaid: {
//         color: "bg-rose-100 text-rose-800 border-rose-200",
//         label: "Unpaid",
//       },
//       processing: {
//         color: "bg-blue-100 text-blue-800 border-blue-200",
//         label: "Processing",
//       },
//       completed: {
//         color: "bg-violet-100 text-violet-800 border-violet-200",
//         label: "Completed",
//       },
//       cancelled: {
//         color: "bg-gray-100 text-gray-800 border-gray-200",
//         label: "Cancelled",
//       },
//     };

//     const config = statusConfig[status] || {
//       color: "bg-gray-100 text-gray-800 border-gray-200",
//       label: "Unknown",
//     };

//     return (
//       <span
//         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}
//       >
//         <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
//         {config.label}
//       </span>
//     );
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     try {
//       return new Date(dateString).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });
//     } catch {
//       return "Invalid Date";
//     }
//   };

//   const formatCurrency = (amount) => {
//     return `AED ${Number(amount || 0).toLocaleString("en-IN", {
//       maximumFractionDigits: 2,
//     })}`;
//   };

//   const parseGuests = (val) => {
//     if (!val) return [];
//     if (Array.isArray(val)) return val;
//     if (typeof val === "string") {
//       try {
//         const parsed = JSON.parse(val);
//         return Array.isArray(parsed) ? parsed : [];
//       } catch {
//         return [];
//       }
//     }
//     return [];
//   };

//   const getAdditionalGuestsCount = (booking) => {
//     const additionalGuests = parseGuests(booking.additional_guests);
//     return additionalGuests.length;
//   };

//   const getTotalGuestsCount = (booking) => {
//     return booking.total_guests || 1;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-3 text-gray-600">Loading bookings...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//             <div className="mb-4 sm:mb-0">
//               <h1 className="text-3xl font-bold text-gray-900">
//                 Room Bookings
//               </h1>
//               <p className="text-gray-600 mt-2">
//                 Manage and track all hotel room bookings
//               </p>
//             </div>
//             <div className="flex items-center space-x-3">
//               <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
//                 {filteredBookings.length} bookings
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="flex-1">
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <svg
//                     className="h-5 w-5 text-gray-400"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search by name, email, or hotel..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>
//             <div className="sm:w-48">
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="all">All Status</option>
//                 <option value="paid">Paid</option>
//                 <option value="pending">Pending</option>
//                 <option value="unpaid">Unpaid</option>
//                 <option value="processing">Processing</option>
//                 <option value="completed">Completed</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Bookings Table */}
//         <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Booking
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Hotel & Room
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Guests
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Stay Dates
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Amount
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Created
//                   </th>
//                   <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredBookings.length === 0 ? (
//                   <tr>
//                     <td colSpan="8" className="px-6 py-12 text-center">
//                       <div className="text-gray-500">
//                         <svg
//                           className="mx-auto h-12 w-12 text-gray-400"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={1}
//                             d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                           />
//                         </svg>
//                         <p className="mt-2 text-sm font-medium">
//                           No bookings found
//                         </p>
//                         <p className="text-xs">
//                           Try adjusting your search or filter
//                         </p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredBookings.map((booking) => {
//                     const totalGuests = getTotalGuestsCount(booking);
//                     const additionalGuestsCount =
//                       getAdditionalGuestsCount(booking);

//                     return (
//                       <tr
//                         key={booking.id}
//                         className="hover:bg-gray-50 transition-colors"
//                       >
//                         <td className="px-6 py-4">
//                           <div className="flex items-center">
//                             <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
//                               <span className="text-white font-semibold text-sm">
//                                 {booking.hotel_name?.charAt(0) || "H"}
//                               </span>
//                             </div>
//                             <div className="ml-4">
//                               <div className="text-sm font-medium text-gray-900">
//                                 {booking.lead_first_name}{" "}
//                                 {booking.lead_last_name}
//                               </div>
//                               <div className="text-sm text-gray-500">
//                                 {booking.lead_email}
//                               </div>
//                               <div className="text-xs text-gray-400">
//                                 #{booking.id}
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="text-sm text-gray-900">
//                             <div className="font-medium">
//                               {booking.hotel_name}
//                             </div>
//                             <div className="text-gray-500 text-xs">
//                               {booking.room_type}
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="text-sm text-gray-900">
//                             <span className="font-semibold">{totalGuests}</span>{" "}
//                             guest{totalGuests !== 1 ? "s" : ""}
//                           </div>
//                           {additionalGuestsCount > 0 && (
//                             <div className="text-xs text-emerald-600 font-medium">
//                               +{additionalGuestsCount} additional
//                             </div>
//                           )}
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="text-sm text-gray-900">
//                             {formatDate(booking.check_in)} →{" "}
//                             {formatDate(booking.check_out)}
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             {booking.nights || 0} night
//                             {booking.nights !== 1 ? "s" : ""}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="text-sm font-semibold text-gray-900">
//                             {formatCurrency(booking.total_price)}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           {getStatusBadge(booking.payment_status)}
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="text-sm text-gray-500">
//                             {formatDate(booking.created_at)}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 text-right">
//                           <div className="flex justify-end gap-2">
//                             <button
//                               onClick={() => viewBookingDetails(booking)}
//                               className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//                             >
//                               <svg
//                                 className="w-4 h-4 mr-1.5"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                                 />
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                                 />
//                               </svg>
//                               View
//                             </button>
//                             <button
//                               onClick={() => setConfirmId(booking.id)}
//                               className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
//                             >
//                               <svg
//                                 className="w-4 h-4 mr-1.5"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 011-1h8a1 1 0 011 1m-10 0H5"
//                                 />
//                               </svg>
//                               Delete
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Delete Confirmation Modal */}
//         {confirmId && (
//           <div
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//             onClick={() => (!deleting ? setConfirmId(null) : null)}
//           >
//             <div
//               className="bg-white rounded-2xl w-full max-w-md shadow-xl"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="p-6">
//                 <div className="flex items-center gap-3 mb-3">
//                   <div className="h-10 w-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
//                     <svg
//                       className="w-5 h-5"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 9v4m0 4h.01M5 13l4 4L19 7"
//                       />
//                     </svg>
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     Delete booking?
//                   </h3>
//                 </div>
//                 <p className="text-sm text-gray-600">
//                   This action cannot be undone. The booking record will be
//                   permanently removed.
//                 </p>
//                 <div className="mt-6 flex justify-end gap-3">
//                   <button
//                     onClick={() => setConfirmId(null)}
//                     disabled={deleting}
//                     className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={() => deleteBooking(confirmId)}
//                     disabled={deleting}
//                     className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
//                   >
//                     {deleting ? "Deleting..." : "Delete"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Booking Details Modal */}
//         {showModal && selected && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
//               {/* Modal Header */}
//               <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h2 className="text-xl font-bold text-gray-900">
//                       Booking #{selected.id}
//                     </h2>
//                     <p className="text-gray-600 text-sm mt-1">
//                       {selected.hotel_name} • {formatDate(selected.created_at)}
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => setShowModal(false)}
//                     className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-lg"
//                   >
//                     <svg
//                       className="w-6 h-6"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M6 18L18 6M6 6l12 12"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//               </div>

//               {/* Modal Content */}
//               <div className="flex-1 overflow-y-auto p-6">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   {/* Hotel & Booking Information */}
//                   <div className="space-y-6">
//                     {/* Hotel Information Card */}
//                     <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
//                       <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                         <svg
//                           className="w-5 h-5 text-blue-600 mr-2"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
//                           />
//                         </svg>
//                         Hotel Information
//                       </h3>
//                       <div className="space-y-3">
//                         <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                           <span className="text-gray-600">Hotel Name</span>
//                           <span className="font-medium text-gray-900">
//                             {selected.hotel_name}
//                           </span>
//                         </div>
//                         <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                           <span className="text-gray-600">Hotel ID</span>
//                           <span className="font-medium text-gray-900">
//                             {selected.hotel_id || "—"}
//                           </span>
//                         </div>
//                         <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                           <span className="text-gray-600">Room Type</span>
//                           <span className="font-medium text-gray-900">
//                             {selected.room_type}
//                           </span>
//                         </div>
//                         <div className="flex justify-between items-center py-2">
//                           <span className="text-gray-600">Price per Night</span>
//                           <span className="font-medium text-gray-900">
//                             {formatCurrency(selected.price_per_night)}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Stay Information Card */}
//                     <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
//                       <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                         <svg
//                           className="w-5 h-5 text-green-600 mr-2"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                           />
//                         </svg>
//                         Stay Information
//                       </h3>
//                       <div className="space-y-3">
//                         <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                           <span className="text-gray-600">Check-in</span>
//                           <span className="font-medium text-gray-900">
//                             {formatDate(selected.check_in)}
//                           </span>
//                         </div>
//                         <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                           <span className="text-gray-600">Check-out</span>
//                           <span className="font-medium text-gray-900">
//                             {formatDate(selected.check_out)}
//                           </span>
//                         </div>
//                         <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                           <span className="text-gray-600">Nights</span>
//                           <span className="font-medium text-gray-900">
//                             {selected.nights || 0}
//                           </span>
//                         </div>
//                         <div className="flex justify-between items-center py-2">
//                           <span className="text-gray-600">Total Guests</span>
//                           <span className="font-medium text-gray-900">
//                             {selected.total_guests || 1}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Payment & Guest Information */}
//                   <div className="space-y-6">
//                     {/* Payment Information Card */}
//                     <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
//                       <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                         <svg
//                           className="w-5 h-5 text-purple-600 mr-2"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
//                           />
//                         </svg>
//                         Payment Information
//                       </h3>
//                       <div className="space-y-3">
//                         <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                           <span className="text-gray-600">Status</span>
//                           <div>{getStatusBadge(selected.payment_status)}</div>
//                         </div>
//                         <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                           <span className="text-gray-600">Total Amount</span>
//                           <span className="font-semibold text-gray-900">
//                             {formatCurrency(selected.total_price)}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Lead Guest Card */}
//                     <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
//                       <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                         <svg
//                           className="w-5 h-5 text-amber-600 mr-2"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                           />
//                         </svg>
//                         Lead Guest
//                       </h3>
//                       <div className="space-y-3">
//                         <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                           <span className="text-gray-600">Name</span>
//                           <span className="font-medium text-gray-900">
//                             {selected.lead_title} {selected.lead_first_name}{" "}
//                             {selected.lead_last_name}
//                           </span>
//                         </div>
//                         <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                           <span className="text-gray-600">Email</span>
//                           <span className="font-medium text-gray-900">
//                             {selected.lead_email}
//                           </span>
//                         </div>
//                         <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                           <span className="text-gray-600">Phone</span>
//                           <span className="font-medium text-gray-900">
//                             {selected.lead_country_code} {selected.lead_phone}
//                           </span>
//                         </div>
//                         <div className="flex justify-between items-center py-2">
//                           <span className="text-gray-600">Nationality</span>
//                           <span className="font-medium text-gray-900">
//                             {selected.lead_nationality || "—"}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Additional Guests Section */}
//                 <div className="mt-6">
//                   {(() => {
//                     const additionalGuests = parseGuests(
//                       selected.additional_guests
//                     );

//                     if (additionalGuests.length > 0) {
//                       return (
//                         <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
//                           <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                             <svg
//                               className="w-5 h-5 text-emerald-600 mr-2"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
//                               />
//                             </svg>
//                             Additional Guests ({additionalGuests.length})
//                           </h3>
//                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                             {additionalGuests.map((guest, index) => (
//                               <div
//                                 key={index}
//                                 className="border border-gray-200 rounded-lg p-4 bg-gray-50"
//                               >
//                                 <div className="flex items-start justify-between mb-3">
//                                   <div className="flex items-center">
//                                     <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium bg-blue-500">
//                                       {index + 1}
//                                     </div>
//                                     <span className="ml-2 text-sm font-medium text-gray-700">
//                                       Guest {index + 2}
//                                     </span>
//                                   </div>
//                                 </div>
//                                 <div className="space-y-2 text-sm">
//                                   <div>
//                                     <span className="text-gray-500">Name:</span>
//                                     <span className="font-medium ml-1 text-gray-900">
//                                       {guest.title} {guest.firstName}{" "}
//                                       {guest.lastName}
//                                     </span>
//                                   </div>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       );
//                     }
//                     return (
//                       <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
//                         <svg
//                           className="w-12 h-12 text-gray-400 mx-auto mb-3"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={1}
//                             d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
//                           />
//                         </svg>
//                         <p className="text-gray-500">No additional guests</p>
//                       </div>
//                     );
//                   })()}
//                 </div>

//                 {/* Special Request Section */}
//                 {selected.special_request && (
//                   <div className="mt-6">
//                     <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
//                       <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                         <svg
//                           className="w-5 h-5 text-amber-600 mr-2"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                           />
//                         </svg>
//                         Special Request
//                       </h3>
//                       <p className="text-gray-700 bg-amber-50 border border-amber-100 rounded-lg p-3">
//                         {selected.special_request}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Modal Footer */}
//               <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
//                 <div className="flex justify-end">
//                   <button
//                     onClick={() => setShowModal(false)}
//                     className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors font-medium"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(`${API_URL}/api/room-bookings`)
      .then((res) => res.json())
      .then((rows) => {
        if (!alive) return;
        setBookings(Array.isArray(rows) ? rows : []);
      })
      .catch((err) => console.error("Failed to load bookings:", err))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [API_URL]);

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter((app) => {
    const matchesSearch =
      app.lead_first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.lead_last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.lead_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.hotel_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || app.payment_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const viewBookingDetails = (booking) => {
    setSelected(booking);
    setShowModal(true);
  };

  const deleteBooking = async (id) => {
    if (!id) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/room-bookings/${id}`, {
        method: "DELETE",
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || j?.success === false)
        throw new Error(j?.error || "Delete failed");
      // remove locally
      setBookings((prev) => prev.filter((b) => b.id !== id));
      if (selected?.id === id) setShowModal(false);
      setConfirmId(null);
    } catch (e) {
      alert(e.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: {
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        label: "Paid",
      },
      pending: {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        label: "Pending",
      },
      unpaid: {
        color: "bg-rose-100 text-rose-800 border-rose-200",
        label: "Unpaid",
      },
      processing: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Processing",
      },
      completed: {
        color: "bg-violet-100 text-violet-800 border-violet-200",
        label: "Completed",
      },
      cancelled: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Cancelled",
      },
    };

    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      label: "Unknown",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount) => {
    return `AED ${Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const parseGuests = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === "string") {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const getAdditionalGuestsCount = (booking) => {
    const additionalGuests = parseGuests(booking.additional_guests);
    return additionalGuests.length;
  };

  const getTotalGuestsCount = (booking) => {
    return booking.total_guests || 1;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">
                Room Bookings
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and track all hotel room bookings
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                {filteredBookings.length} bookings
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email, or hotel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="unpaid">Unpaid</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Booking
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Hotel & Room
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Guests
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Stay Dates
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="mt-2 text-sm font-medium">
                          No bookings found
                        </p>
                        <p className="text-xs">
                          Try adjusting your search or filter
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => {
                    const totalGuests = getTotalGuestsCount(booking);
                    const additionalGuestsCount =
                      getAdditionalGuestsCount(booking);

                    return (
                      <tr
                        key={booking.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {booking.hotel_name?.charAt(0) || "H"}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {booking.lead_first_name}{" "}
                                {booking.lead_last_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {booking.lead_email}
                              </div>
                              <div className="text-xs text-gray-400">
                                #{booking.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <div className="font-medium">
                              {booking.hotel_name}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {booking.room_type}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <span className="font-semibold">{totalGuests}</span>{" "}
                            guest{totalGuests !== 1 ? "s" : ""}
                          </div>
                          {additionalGuestsCount > 0 && (
                            <div className="text-xs text-emerald-600 font-medium">
                              +{additionalGuestsCount} additional
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {formatDate(booking.check_in)} →{" "}
                            {formatDate(booking.check_out)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {booking.nights || 0} night
                            {booking.nights !== 1 ? "s" : ""}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatCurrency(booking.total_price)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(booking.payment_status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">
                            {formatDate(booking.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => viewBookingDetails(booking)}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                              <svg
                                className="w-4 h-4 mr-1.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              View
                            </button>
                            <button
                              onClick={() => setConfirmId(booking.id)}
                              className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                            >
                              <svg
                                className="w-4 h-4 mr-1.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 011-1h8a1 1 0 011 1m-10 0H5"
                                />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {confirmId && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => (!deleting ? setConfirmId(null) : null)}
          >
            <div
              className="bg-white rounded-2xl w-full max-w-md shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v4m0 4h.01M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete booking?
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  This action cannot be undone. The booking record will be
                  permanently removed.
                </p>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setConfirmId(null)}
                    disabled={deleting}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteBooking(confirmId)}
                    disabled={deleting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking Details Modal */}
        {showModal && selected && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Booking #{selected.id}
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      {selected.hotel_name} • {formatDate(selected.created_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-lg"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Hotel & Booking Information */}
                  <div className="space-y-6">
                    {/* Hotel Information Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg
                          className="w-5 h-5 text-blue-600 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        Hotel Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Hotel Name</span>
                          <span className="font-medium text-gray-900">
                            {selected.hotel_name}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Hotel ID</span>
                          <span className="font-medium text-gray-900">
                            {selected.hotel_id || "—"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Room Type</span>
                          <span className="font-medium text-gray-900">
                            {selected.room_type}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600">Price per Night</span>
                          <span className="font-medium text-gray-900">
                            {formatCurrency(selected.price_per_night)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stay Information Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg
                          className="w-5 h-5 text-green-600 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Stay Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Check-in</span>
                          <span className="font-medium text-gray-900">
                            {formatDate(selected.check_in)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Check-out</span>
                          <span className="font-medium text-gray-900">
                            {formatDate(selected.check_out)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Nights</span>
                          <span className="font-medium text-gray-900">
                            {selected.nights || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600">Total Guests</span>
                          <span className="font-medium text-gray-900">
                            {selected.total_guests || 1}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment & Guest Information */}
                  <div className="space-y-6">
                    {/* Payment Information Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg
                          className="w-5 h-5 text-purple-600 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                        Payment Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Status</span>
                          <div>{getStatusBadge(selected.payment_status)}</div>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Total Amount</span>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(selected.total_price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Lead Guest Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg
                          className="w-5 h-5 text-amber-600 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Lead Guest
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Name</span>
                          <span className="font-medium text-gray-900">
                            {selected.lead_title} {selected.lead_first_name}{" "}
                            {selected.lead_last_name}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Email</span>
                          <span className="font-medium text-gray-900">
                            {selected.lead_email}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Phone</span>
                          <span className="font-medium text-gray-900">
                            {selected.lead_country_code} {selected.lead_phone}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600">Nationality</span>
                          <span className="font-medium text-gray-900">
                            {selected.lead_nationality || "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Guests Section */}
                <div className="mt-6">
                  {(() => {
                    const additionalGuests = parseGuests(
                      selected.additional_guests
                    );

                    if (additionalGuests.length > 0) {
                      return (
                        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <svg
                              className="w-5 h-5 text-emerald-600 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            Additional Guests ({additionalGuests.length})
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {additionalGuests.map((guest, index) => (
                              <div
                                key={index}
                                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium bg-blue-500">
                                      {index + 1}
                                    </div>
                                    <span className="ml-2 text-sm font-medium text-gray-700">
                                      Guest {index + 2}
                                    </span>
                                  </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="text-gray-500">Name:</span>
                                    <span className="font-medium ml-1 text-gray-900">
                                      {guest.title} {guest.firstName}{" "}
                                      {guest.lastName}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
                        <svg
                          className="w-12 h-12 text-gray-400 mx-auto mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <p className="text-gray-500">No additional guests</p>
                      </div>
                    );
                  })()}
                </div>

                {/* Special Request Section */}
                {selected.special_request && (
                  <div className="mt-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg
                          className="w-5 h-5 text-amber-600 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Special Request
                      </h3>
                      <p className="text-gray-700 bg-amber-50 border border-amber-100 rounded-lg p-3">
                        {selected.special_request}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}