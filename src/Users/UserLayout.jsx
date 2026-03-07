// // import { useMemo, useState } from "react";
// // import { Link, useLocation, useNavigate } from "react-router-dom";
// // import { useAuth } from "../contexts/AuthContext";

// // export default function UserLayout({ children, themeColor = "#F17232" }) {
// //   const { user, logout } = useAuth();
// //   const [open, setOpen] = useState(false);
// //   const loc = useLocation();
// //   const navigate = useNavigate();

// //   const nav = useMemo(
// //     () => [
// //       { to: "/dashboard", label: "Dashboard", icon: HomeIcon },
// //       { to: "/dashboard/bookings", label: "Hotel Bookings", icon: BedIcon },
// //       {
// //         to: "/dashboard/activity-bookings",
// //         label: "Activity Bookings",
// //         icon: TicketIcon,
// //       },
// //       {
// //         to: "/dashboard/visa-applications",
// //         label: "Visa Applications",
// //         icon: PassportIcon,
// //       },
// //       {
// //         to: "/dashboard/cruise-enquiries",
// //         label: "Cruise Enquiries",
// //         icon: ShipIcon,
// //       },
// //       {
// //         to: "/dashboard/holiday-enquiries",
// //         label: "Holiday Enquiries",
// //         icon: CalendarIcon,
// //       },
// //     ],
// //     []
// //   );

// //   const isActive = (to) => loc.pathname === to;

// //   return (
// //     <div
// //       className="min-h-screen bg-neutral-50"
// //       style={{ ["--primary"]: themeColor }}
// //     >
// //       {/* Mobile top bar */}
// //       <div className="sticky top-0 z-30 lg:hidden bg-white/95 backdrop-blur border-b">
// //         <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
// //           <button
// //             aria-label="Open menu"
// //             className="inline-grid place-items-center h-10 w-10 rounded-md text-neutral-700 hover:bg-neutral-100"
// //             onClick={() => setOpen(true)}
// //           >
// //             <MenuIcon className="h-5 w-5" />
// //           </button>
// //           <Link to="/" className="font-semibold text-neutral-800">
// //             HotelBookWorld
// //           </Link>
// //           <Link to="/" className="text-sm text-[var(--primary)]">
// //             Home
// //           </Link>
// //         </div>
// //       </div>

// //       {/* Layout grid */}
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
// //         {/* Sidebar (desktop) */}
// //         <aside className="hidden lg:block lg:col-span-3 xl:col-span-2">
// //           <div className="sticky top-20 space-y-4">
// //             <BrandCard />
// //             <NavCard nav={nav} isActive={isActive} />
// //             <AccountCard
// //               user={user}
// //               onLogout={() => {
// //                 logout?.();
// //                 navigate("/");
// //               }}
// //             />
// //           </div>
// //         </aside>

// //         {/* Content */}
// //         <main className="lg:col-span-9 xl:col-span-10 min-w-0">
// //           <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-4 sm:p-6">
// //             <div className="overflow-x-auto">{children}</div>
// //           </div>
// //         </main>
// //       </div>

// //       {/* Mobile drawer */}
// //       {open && (
// //         <div className="fixed inset-0 z-40">
// //           <div
// //             className="absolute inset-0 bg-black/40"
// //             onClick={() => setOpen(false)}
// //           />
// //           <div className="absolute top-0 left-0 h-full w-[86%] max-w-xs bg-white shadow-xl p-4">
// //             <div className="flex items-center justify-between mb-2">
// //               <span className="font-semibold text-neutral-800">My Account</span>
// //               <button
// //                 aria-label="Close menu"
// //                 className="inline-grid place-items-center h-9 w-9 rounded-md text-neutral-600 hover:bg-neutral-100"
// //                 onClick={() => setOpen(false)}
// //               >
// //                 <CloseIcon className="h-5 w-5" />
// //               </button>
// //             </div>
// //             <div className="mb-3">
// //               <BrandCard compact />
// //             </div>
// //             <NavList
// //               nav={nav}
// //               isActive={isActive}
// //               onNavigate={() => setOpen(false)}
// //             />
// //             <div className="mt-4 pt-4 border-t">
// //               <MobileAccount
// //                 user={user}
// //                 onLogout={() => {
// //                   setOpen(false);
// //                   logout?.();
// //                   navigate("/");
// //                 }}
// //               />
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // function BrandCard({ compact = false }) {
// //   return (
// //     <div
// //       className={`rounded-2xl ring-1 ring-black/5 ${
// //         compact ? "p-3" : "p-4"
// //       } bg-gradient-to-br from-orange-500 to-orange-600 text-white`}
// //     >
// //       <div className="flex items-center gap-3">
// //         <div className="h-10 w-10 rounded-lg bg-white/15 grid place-items-center">
// //           <LogoIcon className="h-5 w-5 text-white" />
// //         </div>
// //         <div>
// //           <div className="font-semibold">User Dashboard</div>
// //           <div className="text-white/85 text-xs">Welcome back</div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function NavCard({ nav, isActive }) {
// //   return (
// //     <div className="rounded-2xl ring-1 ring-black/5 bg-white p-2">
// //       <NavList nav={nav} isActive={isActive} />
// //     </div>
// //   );
// // }

// // function NavList({ nav, isActive, onNavigate }) {
// //   return (
// //     <nav className="flex flex-col">
// //       {nav.map((item) => {
// //         const ActiveIcon = item.icon;
// //         const active = isActive(item.to);
// //         return (
// //           <Link
// //             key={item.to}
// //             to={item.to}
// //             onClick={onNavigate}
// //             className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition ${
// //               active
// //                 ? "bg-orange-50 text-orange-700 ring-1 ring-orange-500/20"
// //                 : "text-neutral-700 hover:bg-neutral-100"
// //             }`}
// //           >
// //             <span
// //               className={`inline-grid h-8 w-8 place-items-center rounded-lg ${
// //                 active
// //                   ? "bg-orange-100 text-orange-700"
// //                   : "bg-neutral-100 text-neutral-600"
// //               }`}
// //             >
// //               <ActiveIcon className="h-4.5 w-4.5" />
// //             </span>
// //             <span className="truncate">{item.label}</span>
// //           </Link>
// //         );
// //       })}
// //     </nav>
// //   );
// // }

// // function AccountCard({ user, onLogout }) {
// //   return (
// //     <div className="rounded-2xl ring-1 ring-black/5 bg-white p-4">
// //       <div className="flex items-center gap-3">
// //         <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-700 grid place-items-center font-semibold">
// //           {(user?.firstName?.[0] || "U").toUpperCase()}
// //         </div>
// //         <div className="min-w-0">
// //           <div className="font-medium text-neutral-900 truncate">
// //             {user?.firstName} {user?.lastName}
// //           </div>
// //           <div className="text-xs text-neutral-500 truncate">{user?.email}</div>
// //         </div>
// //       </div>
// //       <div className="mt-3 flex gap-2">
// //         <Link to="/" className="text-sm text-[var(--primary)] hover:underline">
// //           Home
// //         </Link>
// //         <button
// //           onClick={onLogout}
// //           className="ml-auto text-sm px-3 py-1.5 rounded-md bg-neutral-100 hover:bg-neutral-200"
// //         >
// //           Logout
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // function MobileAccount({ user, onLogout }) {
// //   return (
// //     <div className="flex items-center gap-3">
// //       <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-700 grid place-items-center font-semibold">
// //         {(user?.firstName?.[0] || "U").toUpperCase()}
// //       </div>
// //       <div className="min-w-0">
// //         <div className="font-medium text-neutral-900 truncate">
// //           {user?.firstName} {user?.lastName}
// //         </div>
// //         <div className="text-xs text-neutral-500 truncate">{user?.email}</div>
// //       </div>
// //       <button
// //         onClick={onLogout}
// //         className="ml-auto text-sm px-3 py-1.5 rounded-md bg-neutral-100 hover:bg-neutral-200"
// //       >
// //         Logout
// //       </button>
// //     </div>
// //   );
// // }

// // /* Icons */
// // function LogoIcon(props) {
// //   return (
// //     <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
// //       <path
// //         d="M3 11c3-5 15-5 18 0-3 5-15 5-18 0Z"
// //         stroke="currentColor"
// //         strokeWidth="1.5"
// //       />
// //       <path
// //         d="M7 13c1.5 2 8.5 2 10 0"
// //         stroke="currentColor"
// //         strokeWidth="1.5"
// //       />
// //     </svg>
// //   );
// // }
// // function HomeIcon(props) {
// //   return (
// //     <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
// //       <path
// //         d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5Z"
// //         stroke="currentColor"
// //         strokeWidth="1.5"
// //       />
// //     </svg>
// //   );
// // }
// // function BedIcon(props) {
// //   return (
// //     <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
// //       <path
// //         d="M4 12h16a2 2 0 0 1 2 2v6h-2v-3H4v3H2v-9a2 2 0 0 1 2-2Z"
// //         stroke="currentColor"
// //         strokeWidth="1.5"
// //       />
// //       <path
// //         d="M7 12V8a2 2 0 0 1 2-2h2v6H7Z"
// //         stroke="currentColor"
// //         strokeWidth="1.5"
// //       />
// //     </svg>
// //   );
// // }
// // function TicketIcon(props) {
// //   return (
// //     <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
// //       <path
// //         d="M3 9a2 2 0 0 1 2-2h14l2 3-2 3H5a2 2 0 0 1-2-2V9Z"
// //         stroke="currentColor"
// //         strokeWidth="1.5"
// //       />
// //       <path d="M14 7v10" stroke="currentColor" strokeWidth="1.5" />
// //     </svg>
// //   );
// // }
// // function PassportIcon(props) {
// //   return (
// //     <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
// //       <rect
// //         x="5"
// //         y="3"
// //         width="14"
// //         height="18"
// //         rx="2"
// //         stroke="currentColor"
// //         strokeWidth="1.5"
// //       />
// //       <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
// //       <path d="M8 16h8" stroke="currentColor" strokeWidth="1.5" />
// //     </svg>
// //   );
// // }
// // function ShipIcon(props) {
// //   return (
// //     <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
// //       <path
// //         d="M3 18c4 3 14 3 18 0l-2-7H5l-2 7Z"
// //         stroke="currentColor"
// //         strokeWidth="1.5"
// //       />
// //       <path d="M7 11l1-4h8l1 4" stroke="currentColor" strokeWidth="1.5" />
// //     </svg>
// //   );
// // }
// // function CalendarIcon(props) {
// //   return (
// //     <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
// //       <rect
// //         x="3"
// //         y="4"
// //         width="18"
// //         height="17"
// //         rx="2"
// //         stroke="currentColor"
// //         strokeWidth="1.5"
// //       />
// //       <path d="M8 2v4M16 2v4M3 9h18" stroke="currentColor" strokeWidth="1.5" />
// //     </svg>
// //   );
// // }
// // function MenuIcon(props) {
// //   return (
// //     <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
// //       <path
// //         d="M3 6h18M3 12h18M3 18h18"
// //         stroke="currentColor"
// //         strokeWidth="1.8"
// //         strokeLinecap="round"
// //       />
// //     </svg>
// //   );
// // }
// // function CloseIcon(props) {
// //   return (
// //     <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
// //       <path
// //         d="M6 6l12 12M18 6 6 18"
// //         stroke="currentColor"
// //         strokeWidth="1.8"
// //         strokeLinecap="round"
// //       />
// //     </svg>
// //   );
// // }

// import { useMemo, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";

// export default function UserLayout({ children, themeColor = "#F17232" }) {
//   const { user, logout } = useAuth();
//   const [open, setOpen] = useState(false);
//   const loc = useLocation();
//   const navigate = useNavigate();

//   const nav = useMemo(
//     () => [
//       { to: "/dashboard", label: "Dashboard", icon: HomeIcon },
//       { to: "/dashboard/bookings", label: "Hotel Bookings", icon: BedIcon },
//       { to: "/dashboard/activity-bookings", label: "Activity Bookings", icon: TicketIcon },
//       { to: "/dashboard/visa-applications", label: "Visa Applications", icon: PassportIcon },
//       { to: "/dashboard/cruise-enquiries", label: "Cruise Enquiries", icon: ShipIcon },
//       { to: "/dashboard/holiday-enquiries", label: "Holiday Enquiries", icon: CalendarIcon },
//     ],
//     []
//   );

//   const isActive = (to) => loc.pathname === to;

//   return (
//     <div
//       className="min-h-screen bg-neutral-50"
//       style={{ ["--primary"]: themeColor }}
//     >
//       {/* Mobile top bar */}
//       <div className="sticky top-0 z-30 lg:hidden bg-white/95 backdrop-blur border-b">
//         <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
//           <button
//             aria-label="Open menu"
//             className="inline-grid place-items-center h-10 w-10 rounded-md text-neutral-700 hover:bg-neutral-100"
//             onClick={() => setOpen(true)}
//           >
//             <MenuIcon className="h-5 w-5" />
//           </button>
//           <Link to="/" className="font-semibold text-neutral-800">
//             HotelBookWorld
//           </Link>
//           <Link to="/" className="text-sm text-[var(--primary)]">
//             Home
//           </Link>
//         </div>
//       </div>

//       {/* Main layout */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
//         {/* Sidebar (desktop only) */}
//         <aside className="hidden lg:block lg:col-span-3 xl:col-span-2">
//           <div className="sticky top-20 space-y-4">
//             <BrandCard />
//             <NavCard nav={nav} isActive={isActive} />
//             <AccountCard
//               user={user}
//               onLogout={() => {
//                 logout?.();
//                 navigate("/");
//               }}
//             />
//           </div>
//         </aside>

//         {/* Content */}
//         <main className="lg:col-span-9 xl:col-span-10 min-w-0">
//           <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-4 sm:p-6">
//             <div className="overflow-x-auto">{children}</div>
//           </div>
//         </main>
//       </div>

//       {/* Mobile drawer */}
//       {open && (
//         <div className="fixed inset-0 z-40 lg:hidden">
//           <div
//             className="absolute inset-0 bg-black/40"
//             onClick={() => setOpen(false)}
//           />
//           <div className="absolute top-0 left-0 h-full w-[86%] max-w-xs bg-white shadow-xl p-4">
//             <div className="flex items-center justify-between mb-2">
//               <span className="font-semibold text-neutral-800">My Account</span>
//               <button
//                 aria-label="Close menu"
//                 className="inline-grid place-items-center h-9 w-9 rounded-md text-neutral-600 hover:bg-neutral-100"
//                 onClick={() => setOpen(false)}
//               >
//                 <CloseIcon className="h-5 w-5" />
//               </button>
//             </div>
//             <div className="mb-3">
//               <BrandCard compact />
//             </div>
//             <NavList
//               nav={nav}
//               isActive={isActive}
//               onNavigate={() => setOpen(false)}
//             />
//             <div className="mt-4 pt-4 border-t">
//               <MobileAccount
//                 user={user}
//                 onLogout={() => {
//                   setOpen(false);
//                   logout?.();
//                   navigate("/");
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ===== Components ===== */

// function BrandCard({ compact = false }) {
//   return (
//     <div
//       className={`rounded-2xl ring-1 ring-black/5 ${compact ? "p-3" : "p-4"} bg-gradient-to-br from-orange-500 to-orange-600 text-white`}
//     >
//       <div className="flex items-center gap-3">
//         <div className="h-10 w-10 rounded-lg bg-white/15 grid place-items-center">
//           <LogoIcon className="h-5 w-5 text-white" />
//         </div>
//         <div>
//           <div className="font-semibold">User Dashboard</div>
//           <div className="text-white/85 text-xs">Welcome back</div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function NavCard({ nav, isActive }) {
//   return (
//     <div className="rounded-2xl ring-1 ring-black/5 bg-white p-2">
//       <NavList nav={nav} isActive={isActive} />
//     </div>
//   );
// }

// function NavList({ nav, isActive, onNavigate }) {
//   return (
//     <nav className="flex flex-col">
//       {nav.map((item) => {
//         const ActiveIcon = item.icon;
//         const active = isActive(item.to);
//         return (
//           <Link
//             key={item.to}
//             to={item.to}
//             onClick={onNavigate}
//             className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition ${
//               active
//                 ? "bg-orange-50 text-orange-700 ring-1 ring-orange-500/20"
//                 : "text-neutral-700 hover:bg-neutral-100"
//             }`}
//           >
//             <span
//               className={`inline-grid h-8 w-8 place-items-center rounded-lg ${
//                 active ? "bg-orange-100 text-orange-700" : "bg-neutral-100 text-neutral-600"
//               }`}
//             >
//               <ActiveIcon className="h-4.5 w-4.5" />
//             </span>
//             <span className="truncate">{item.label}</span>
//           </Link>
//         );
//       })}
//     </nav>
//   );
// }

// function AccountCard({ user, onLogout }) {
//   return (
//     <div className="rounded-2xl ring-1 ring-black/5 bg-white p-4">
//       <div className="flex items-center gap-3">
//         <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-700 grid place-items-center font-semibold">
//           {(user?.firstName?.[0] || "U").toUpperCase()}
//         </div>
//         <div className="min-w-0">
//           <div className="font-medium text-neutral-900 truncate">
//             {user?.firstName} {user?.lastName}
//           </div>
//           <div className="text-xs text-neutral-500 truncate">{user?.email}</div>
//         </div>
//       </div>
//       <div className="mt-3 flex gap-2">
//         <Link to="/" className="text-sm text-[var(--primary)] hover:underline">
//           Home
//         </Link>
//         <button
//           onClick={onLogout}
//           className="ml-auto text-sm px-3 py-1.5 rounded-md bg-neutral-100 hover:bg-neutral-200"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }

// function MobileAccount({ user, onLogout }) {
//   return (
//     <div className="flex items-center gap-3">
//       <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-700 grid place-items-center font-semibold">
//         {(user?.firstName?.[0] || "U").toUpperCase()}
//       </div>
//       <div className="min-w-0">
//         <div className="font-medium text-neutral-900 truncate">
//           {user?.firstName} {user?.lastName}
//         </div>
//         <div className="text-xs text-neutral-500 truncate">{user?.email}</div>
//       </div>
//       <button
//         onClick={onLogout}
//         className="ml-auto text-sm px-3 py-1.5 rounded-md bg-neutral-100 hover:bg-neutral-200"
//       >
//         Logout
//       </button>
//     </div>
//   );
// }

// /* ===== Icons ===== */

// function LogoIcon(props) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
//       <path d="M3 11c3-5 15-5 18 0-3 5-15 5-18 0Z" stroke="currentColor" strokeWidth="1.5" />
//       <path d="M7 13c1.5 2 8.5 2 10 0" stroke="currentColor" strokeWidth="1.5" />
//     </svg>
//   );
// }
// function HomeIcon(props) { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}><path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5Z" stroke="currentColor" strokeWidth="1.5"/></svg>; }
// function BedIcon(props) { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}><path d="M4 12h16a2 2 0 0 1 2 2v6h-2v-3H4v3H2v-9a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.5"/><path d="M7 12V8a2 2 0 0 1 2-2h2v6H7Z" stroke="currentColor" strokeWidth="1.5"/></svg>; }
// function TicketIcon(props) { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}><path d="M3 9a2 2 0 0 1 2-2h14l2 3-2 3H5a2 2 0 0 1-2-2V9Z" stroke="currentColor" strokeWidth="1.5"/><path d="M14 7v10" stroke="currentColor" strokeWidth="1.5"/></svg>; }
// function PassportIcon(props) { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}><rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M8 16h8" stroke="currentColor" strokeWidth="1.5"/></svg>; }
// function ShipIcon(props) { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}><path d="M3 18c4 3 14 3 18 0l-2-7H5l-2 7Z" stroke="currentColor" strokeWidth="1.5"/><path d="M7 11l1-4h8l1 4" stroke="currentColor" strokeWidth="1.5"/></svg>; }
// function CalendarIcon(props) { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}><rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M8 2v4M16 2v4M3 9h18" stroke="currentColor" strokeWidth="1.5"/></svg>; }
// function MenuIcon(props) { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>; }
// function CloseIcon(props) { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>; }

import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/* ====== Custom Hook for Media Query ====== */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);
  return matches;
}

/* ====== Main Layout Component ====== */
export default function UserLayout({ children, themeColor = "#F17232" }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const navigate = useNavigate();

  const nav = useMemo(
    () => [
      { to: "/dashboard", label: "Dashboard", icon: HomeIcon },
      { to: "/dashboard/bookings", label: "Hotel Bookings", icon: BedIcon },
      {
        to: "/dashboard/activity-bookings",
        label: "Activity Bookings",
        icon: TicketIcon,
      },
      {
        to: "/dashboard/city-tour-bookings",
        label: "City Tour Bookings",
        icon: TicketIcon,
      },
      {
        to: "/dashboard/visa-applications",
        label: "Visa Applications",
        icon: PassportIcon,
      },
      {
        to: "/dashboard/cruise-enquiries",
        label: "Cruise Enquiries",
        icon: ShipIcon,
      },
      {
        to: "/dashboard/holiday-enquiries",
        label: "Holiday Enquiries",
        icon: CalendarIcon,
      },
    ],
    []
  );

  const isActive = (to) => loc.pathname === to;

  // Desktop check
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <div
      className="min-h-screen bg-neutral-50"
      style={{ ["--primary"]: themeColor }}
    >
      {/* Mobile top bar */}
      {!isDesktop && (
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <button
              aria-label="Open menu"
              className="inline-grid place-items-center h-10 w-10 rounded-md text-neutral-700 hover:bg-neutral-100"
              onClick={() => setOpen(true)}
            >
              <MenuIcon className="h-5 w-5" />
            </button>
            <Link to="/" className="font-semibold text-neutral-800">
              HotelBookWorld
            </Link>
            <Link to="/" className="text-sm text-[var(--primary)]">
              Home
            </Link>
          </div>
        </div>
      )}

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar (desktop only) */}
        {isDesktop && (
          <aside className="lg:col-span-3 xl:col-span-2">
            <div className="sticky top-20 space-y-4">
              <BrandCard />
              <NavCard nav={nav} isActive={isActive} />
              <AccountCard
                user={user}
                onLogout={() => {
                  logout?.();
                  navigate("/");
                }}
              />
            </div>
          </aside>
        )}

        {/* Content */}
        <main
          className={
            isDesktop ? "lg:col-span-9 xl:col-span-10 min-w-0" : "col-span-1"
          }
        >
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-4 sm:p-6">
            <div className="overflow-x-auto">{children}</div>
          </div>
        </main>
      </div>

      {/* Mobile drawer */}
      {!isDesktop && open && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-0 left-0 h-full w-[86%] max-w-xs bg-white shadow-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-neutral-800">My Account</span>
              <button
                aria-label="Close menu"
                className="inline-grid place-items-center h-9 w-9 rounded-md text-neutral-600 hover:bg-neutral-100"
                onClick={() => setOpen(false)}
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-3">
              <BrandCard compact />
            </div>
            <NavList
              nav={nav}
              isActive={isActive}
              onNavigate={() => setOpen(false)}
            />
            <div className="mt-4 pt-4 border-t">
              <MobileAccount
                user={user}
                onLogout={() => {
                  setOpen(false);
                  logout?.();
                  navigate("/");
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== Components ===== */
function BrandCard({ compact = false }) {
  return (
    <div
      className={`rounded-2xl ring-1 ring-black/5 ${
        compact ? "p-3" : "p-4"
      } bg-gradient-to-br from-orange-500 to-orange-600 text-white`}
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-white/15 grid place-items-center">
          <LogoIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="font-semibold">User Dashboard</div>
          <div className="text-white/85 text-xs">Welcome back</div>
        </div>
      </div>
    </div>
  );
}

function NavCard({ nav, isActive }) {
  return (
    <div className="rounded-2xl ring-1 ring-black/5 bg-white p-2">
      <NavList nav={nav} isActive={isActive} />
    </div>
  );
}

function NavList({ nav, isActive, onNavigate }) {
  return (
    <nav className="flex flex-col">
      {nav.map((item) => {
        const ActiveIcon = item.icon;
        const active = isActive(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition ${
              active
                ? "bg-orange-50 text-orange-700 ring-1 ring-orange-500/20"
                : "text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            <span
              className={`inline-grid h-8 w-8 place-items-center rounded-lg ${
                active
                  ? "bg-orange-100 text-orange-700"
                  : "bg-neutral-100 text-neutral-600"
              }`}
            >
              <ActiveIcon className="h-4.5 w-4.5" />
            </span>
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function AccountCard({ user, onLogout }) {
  return (
    <div className="rounded-2xl ring-1 ring-black/5 bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-700 grid place-items-center font-semibold">
          {(user?.firstName?.[0] || "U").toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="font-medium text-neutral-900 truncate">
            {user?.firstName} {user?.lastName}
          </div>
          <div className="text-xs text-neutral-500 truncate">{user?.email}</div>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <Link to="/" className="text-sm text-[var(--primary)] hover:underline">
          Home
        </Link>
        <button
          onClick={onLogout}
          className="ml-auto text-sm px-3 py-1.5 rounded-md bg-neutral-100 hover:bg-neutral-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function MobileAccount({ user, onLogout }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-700 grid place-items-center font-semibold">
        {(user?.firstName?.[0] || "U").toUpperCase()}
      </div>
      <div className="min-w-0">
        <div className="font-medium text-neutral-900 truncate">
          {user?.firstName} {user?.lastName}
        </div>
        <div className="text-xs text-neutral-500 truncate">{user?.email}</div>
      </div>
      <button
        onClick={onLogout}
        className="ml-auto text-sm px-3 py-1.5 rounded-md bg-neutral-100 hover:bg-neutral-200"
      >
        Logout
      </button>
    </div>
  );
}

/* ===== Icons ===== */
function LogoIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3 11c3-5 15-5 18 0-3 5-15 5-18 0Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 13c1.5 2 8.5 2 10 0"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function HomeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function BedIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 12h16a2 2 0 0 1 2 2v6h-2v-3H4v3H2v-9a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 12V8a2 2 0 0 1 2-2h2v6H7Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function TicketIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3 9a2 2 0 0 1 2-2h14l2 3-2 3H5a2 2 0 0 1-2-2V9Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M14 7v10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function PassportIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect
        x="5"
        y="3"
        width="14"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 16h8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function ShipIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3 18c4 3 14 3 18 0l-2-7H5l-2 7Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M7 11l1-4h8l1 4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function CalendarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect
        x="3"
        y="4"
        width="18"
        height="17"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M8 2v4M16 2v4M3 9h18" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3 6h18M3 12h18M3 18h18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
