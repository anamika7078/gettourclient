import { useEffect, useState } from "react";
import {
  FaChartLine,
  FaCheckCircle,
  FaClipboardList,
  FaEnvelope,
  FaHotel,
  FaMoneyBillWave,
  FaPassport,
  FaShip,
  FaTicketAlt,
  FaUsers,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    // Hotels/Rooms
    totalHotels: 0,
    totalRooms: 0,
    availableRooms: 0,
    bookedRooms: 0,
    hotelsWithAvailability: 0,
    hotelsFullyBooked: 0,
    // Core messages/users/bookings
    totalMessages: 0,
    totalUsers: 0,
    totalBookings: 0,
    todayBookings: 0,
    totalRevenue: 0,
    // Holidays
    totalHolidays: 0,
    activeHolidays: 0,
    holidayCategories: [],
    averageHolidayPrice: 0,
    // Activities / Visas / Cruises / Enquiries (counts)
    totalActivities: 0,
    totalActivityBookings: 0,
    totalCityTourBookings: 0,
    totalVisas: 0,
    totalVisaApplications: 0,
    totalCruises: 0,
    totalCruiseEnquiries: 0,
    totalHolidayEnquiries: 0,
    // Derived breakdowns for "same-to-same" cards
    activityConfirmed: 0,
    activityRevenue: 0,
    todayActivityBookings: 0,
    cityTourConfirmed: 0,
    cityTourRevenue: 0,
    todayCityTourBookings: 0,
    visaApproved: 0,
    visaCollected: 0,
    todayVisaApplications: 0,
    approvedRoomBookings: 0,
    holidayConverted: 0,
    holidayPending: 0,
    holidayClosed: 0,
    cruiseConverted: 0,
    cruisePending: 0,
    cruiseClosed: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    // header removed; no admin label needed

    // ✅ Fetch core stats together (robust)
    Promise.all([
      fetch(`${API_BASE}/api/hotels`).then((res) => res.json()),
      fetch(`${API_BASE}/api/contact/stats`).then((res) => res.json()),
      fetch(`${API_BASE}/api/users/count`).then((res) => res.json()),
      fetch(`${API_BASE}/api/room-bookings/stats`).then((res) => res.json()),
      fetch(`${API_BASE}/api/holidays`).then((res) => res.json()),
    ])
      .then(([hotels, contactStats, userStats, bookingStats, holidaysData]) => {
        let totalRooms = 0;
        let availableRooms = 0;
        let bookedRooms = 0;
        let hotelsWithAvailability = 0;
        let hotelsFullyBooked = 0;

        hotels.forEach((hotel) => {
          let rooms = [];
          try {
            rooms =
              typeof hotel.rooms === "string"
                ? JSON.parse(hotel.rooms)
                : Array.isArray(hotel.rooms)
                ? hotel.rooms
                : [];
          } catch {
            rooms = [];
          }

          totalRooms += rooms.length;
          let hotelBooked = 0;
          let hotelAvailable = 0;

          rooms.forEach((r) => {
            if (r.availability?.toLowerCase() === "booked") {
              bookedRooms++;
              hotelBooked++;
            } else {
              availableRooms++;
              hotelAvailable++;
            }
          });

          if (rooms.length > 0 && hotelBooked === rooms.length)
            hotelsFullyBooked++;
          else if (hotelAvailable > 0) hotelsWithAvailability++;
        });

        // ✅ Calculate holiday statistics
        const holidays = holidaysData?.data || holidaysData || [];
        const totalHolidays = holidays.length;

        // Count active holidays (you can define your own logic for "active")
        const activeHolidays = totalHolidays; // For now, consider all as active

        // Get unique categories
        const categories = [
          ...new Set(holidays.map((h) => h.category).filter(Boolean)),
        ];

        // Calculate average price
        const totalPrice = holidays.reduce(
          (sum, holiday) => sum + (Number(holiday.price) || 0),
          0
        );
        const averageHolidayPrice =
          totalHolidays > 0 ? totalPrice / totalHolidays : 0;

        setStats({
          totalHotels: hotels.length,
          totalRooms,
          availableRooms,
          bookedRooms,
          hotelsWithAvailability,
          hotelsFullyBooked,
          totalMessages: contactStats?.totalMessages || 0,
          totalUsers: userStats?.totalUsers || 0,
          totalBookings: bookingStats?.totalBookings || 0,
          todayBookings: bookingStats?.todayBookings || 0,
          totalRevenue: bookingStats?.totalRevenue || 0,
          // ✅ New holiday stats
          totalHolidays,
          activeHolidays,
          holidayCategories: categories,
          averageHolidayPrice,
        });

        // ✅ Fetch optional/extended stats separately (won't break core)
        return Promise.allSettled([
          fetch(`${API_BASE}/api/room-bookings`).then((r) => r.json()),
          fetch(`${API_BASE}/api/activities`).then((r) => r.json()),
          fetch(`${API_BASE}/api/activity-bookings`).then((r) => r.json()),
          fetch(`${API_BASE}/api/city-tour-bookings`).then((r) => r.json()),
          fetch(`${API_BASE}/api/visas`).then((r) => r.json()),
          fetch(`${API_BASE}/api/visa-applications`).then((r) => r.json()),
          fetch(`${API_BASE}/api/cruises`).then((r) => r.json()),
          fetch(`${API_BASE}/api/cruise-enquiries`).then((r) => r.json()),
          fetch(`${API_BASE}/api/holiday-enquiries`).then((r) => r.json()),
        ]);
      })
      .then((results) => {
        if (!results) return;
        const [
          roomBookingsRes,
          activitiesRes,
          activityBookingsRes,
          cityTourBookingsRes,
          visasRes,
          visaAppsRes,
          cruisesRes,
          cruiseEnquiriesRes,
          holidayEnquiriesRes,
        ] = results;

        const safeVal = (res) =>
          res?.status === "fulfilled"
            ? res.value?.data || res.value?.rows || res.value || []
            : [];

        const roomBookings = safeVal(roomBookingsRes);
        const activities = safeVal(activitiesRes);
        const activityBookings = safeVal(activityBookingsRes);
        const cityTourBookings = safeVal(cityTourBookingsRes);
        const visas = safeVal(visasRes);
        const visaApps = safeVal(visaAppsRes);
        const cruises = safeVal(cruisesRes);
        const cruiseEnquiries = safeVal(cruiseEnquiriesRes);
        const holidayEnquiries = safeVal(holidayEnquiriesRes);

        // Try to compute richer stats if the dataset carries statuses/amounts
        const truthy = (v) =>
          v === true || v === 1 || v === "1" || v === "true";
        const statusOf = (obj) =>
          (
            obj?.payment_status ||
            obj?.paymentStatus ||
            obj?.status ||
            obj?.booking_status ||
            obj?.bookingStatus ||
            obj?.approval_status ||
            obj?.approvalStatus ||
            ""
          )
            .toString()
            .toLowerCase();

        const isApprovedLike = (obj) => {
          const s = statusOf(obj);
          if (
            [
              "paid",
              "approve",
              "approved",
              "confirm",
              "confirmed",
              "complete",
              "completed",
              "success",
            ].some((tok) => s.includes(tok))
          )
            return true;
          return truthy(obj?.approved) || truthy(obj?.isApproved);
        };

        const activityConfirmed = Array.isArray(activityBookings)
          ? activityBookings.filter((b) => isApprovedLike(b)).length
          : 0;

        const numberish = (val) => {
          const n = Number(val);
          return Number.isFinite(n) ? n : 0;
        };

        const pickAmount = (obj) =>
          numberish(
            obj?.totalAmount ??
              obj?.total_amount ??
              obj?.amount ??
              obj?.price ??
              obj?.totalPrice ??
              obj?.paymentAmount ??
              obj?.paidAmount ??
              0
          );

        let activityRevenue = 0;
        let todayActivityBookings = 0;
        if (Array.isArray(activityBookings)) {
          const todayStr = new Date().toISOString().slice(0, 10);
          activityRevenue = activityBookings.reduce(
            (sum, b) => sum + pickAmount(b),
            0
          );
          activityBookings.forEach((b) => {
            const created = b?.created_at || b?.createdAt;
            if (created) {
              try {
                const d = new Date(created);
                const dStr = `${d.getFullYear()}-${String(
                  d.getMonth() + 1
                ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                if (dStr === todayStr) todayActivityBookings += 1;
              } catch {
                /* ignore parse errors */
              }
            }
          });
        }

        // City Tour Bookings stats
        const cityTourConfirmed = Array.isArray(cityTourBookings)
          ? cityTourBookings.filter((b) => isApprovedLike(b)).length
          : 0;

        let cityTourRevenue = 0;
        let todayCityTourBookings = 0;
        if (Array.isArray(cityTourBookings)) {
          const todayStr = new Date().toISOString().slice(0, 10);
          cityTourRevenue = cityTourBookings.reduce(
            (sum, b) => sum + pickAmount(b),
            0
          );
          cityTourBookings.forEach((b) => {
            const created = b?.created_at || b?.createdAt;
            if (created) {
              try {
                const d = new Date(created);
                const dStr = `${d.getFullYear()}-${String(
                  d.getMonth() + 1
                ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                if (dStr === todayStr) todayCityTourBookings += 1;
              } catch {
                /* ignore parse errors */
              }
            }
          });
        }

        const visaApproved = Array.isArray(visaApps)
          ? visaApps.filter((v) => {
              const s = (v?.payment_status || v?.status || "")
                .toString()
                .toLowerCase();
              return s === "approved" || s === "paid";
            }).length
          : 0;

        // Visa revenue: AED price_per_person * total_passengers for paid/approved
        let visaCollected = 0;
        let todayVisaApplications = 0;
        if (Array.isArray(visaApps)) {
          const todayStr = new Date().toISOString().slice(0, 10);
          visaApps.forEach((v) => {
            const price = Number(v?.price_per_person || 0) || 0;
            const pax = Number(v?.total_passengers || 1) || 1;
            if (isApprovedLike(v)) {
              visaCollected += price * pax;
            }
            const created = v?.created_at || v?.createdAt;
            if (created) {
              try {
                const d = new Date(created);
                const dStr = `${d.getFullYear()}-${String(
                  d.getMonth() + 1
                ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                if (dStr === todayStr) todayVisaApplications += 1;
              } catch {
                /* ignore parse errors */
              }
            }
          });
        }

        const countByStatus = (arr = [], key = "status") => {
          const out = { converted: 0, pending: 0, closed: 0 };
          arr.forEach((it) => {
            const s = (it?.[key] || it?.status || "").toString().toLowerCase();
            if (s.includes("convert")) out.converted += 1;
            else if (s.includes("close")) out.closed += 1;
            else out.pending += 1;
          });
          return out;
        };

        const hStatus = countByStatus(holidayEnquiries, "enquiryStatus");
        const cStatus = countByStatus(cruiseEnquiries, "enquiryStatus");

        const approvedRoomBookings = Array.isArray(roomBookings)
          ? roomBookings.filter((b) => isApprovedLike(b)).length
          : 0;

        setStats((prev) => ({
          ...prev,
          totalActivities: Array.isArray(activities) ? activities.length : 0,
          totalActivityBookings: Array.isArray(activityBookings)
            ? activityBookings.length
            : 0,
          totalCityTourBookings: Array.isArray(cityTourBookings)
            ? cityTourBookings.length
            : 0,
          totalVisas: Array.isArray(visas) ? visas.length : 0,
          totalVisaApplications: Array.isArray(visaApps) ? visaApps.length : 0,
          totalCruises: Array.isArray(cruises) ? cruises.length : 0,
          totalCruiseEnquiries: Array.isArray(cruiseEnquiries)
            ? cruiseEnquiries.length
            : 0,
          totalHolidayEnquiries: Array.isArray(holidayEnquiries)
            ? holidayEnquiries.length
            : 0,
          approvedRoomBookings,
          activityConfirmed,
          activityRevenue,
          todayActivityBookings,
          cityTourConfirmed,
          cityTourRevenue,
          todayCityTourBookings,
          visaApproved,
          visaCollected,
          todayVisaApplications,
          holidayConverted: hStatus.converted,
          holidayPending: hStatus.pending,
          holidayClosed: hStatus.closed,
          cruiseConverted: cStatus.converted,
          cruisePending: cStatus.pending,
          cruiseClosed: cStatus.closed,
        }));
      })
      .catch((err) => console.error("Dashboard data fetch error:", err))
      .finally(() => setLoading(false));
  }, [navigate, API_BASE]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading dashboard...
      </div>
    );

  return (
    <div className="flex-1 bg-[#fff8f3] min-h-screen">
      <main className="p-6 max-w-[1400px] mx-auto">
        {/* Header removed per request for a clean, distraction-free top area */}

        {/* ROOMS / HOTELS (Single Row card) */}
        <section className="grid grid-cols-1 gap-6 mb-6">
          <div
            className="bg-white border border-orange-100 p-6 rounded-xl shadow-sm hover:shadow-md transition"
            style={{ minHeight: 220 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                  <FaHotel />
                </span>
                <h3 className="text-lg font-semibold text-slate-800">
                  Rooms / Hotels
                </h3>
              </div>
              <span className="text-orange-600 text-sm font-medium">Live</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Total hotels and rooms overview
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 rounded-lg border border-orange-50 bg-orange-50/50">
                <p className="text-xs text-slate-500">Hotels</p>
                <h4 className="text-2xl font-bold mt-1 text-slate-800">
                  {stats.totalHotels}
                </h4>
              </div>
              <div className="p-4 rounded-lg border border-orange-50 bg-orange-50/50">
                <p className="text-xs text-slate-500">Rooms</p>
                <h4 className="text-2xl font-bold mt-1 text-slate-800">
                  {stats.totalRooms}
                </h4>
              </div>
              <div className="p-4 rounded-lg border border-orange-50 bg-orange-50/50">
                <p className="text-xs text-slate-500">Availability</p>
                <div className="text-sm mt-1 text-emerald-700">
                  Available: {stats.availableRooms}
                </div>
                <div className="text-sm text-rose-700">
                  Booked: {stats.bookedRooms}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OTHER MAIN CARDS (3 per row) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-6">
          {/* Hotel Bookings */}
          <div className="bg-white border border-orange-100 p-7 rounded-xl shadow-sm hover:shadow-md transition xl:col-span-2 2xl:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <FaClipboardList />
              </span>
              <h3 className="text-lg font-semibold text-slate-800">
                Hotel Bookings
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Room & hotel booking overview
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-700">
              <p>
                Total:{" "}
                <span className="font-bold text-slate-900 text-2xl">
                  {stats.totalBookings}
                </span>
              </p>
              <p className="flex items-center gap-1">
                <FaCheckCircle className="text-emerald-600" />
                Approved:{" "}
                <span className="font-bold text-slate-900 text-2xl">
                  {stats.approvedRoomBookings}
                </span>
              </p>
              <p className="flex items-center gap-1">
                <FaChartLine className="text-orange-500" />
                Today:{" "}
                <span className="font-bold text-emerald-700 text-xl">
                  {stats.todayBookings}
                </span>
              </p>
              <p className="col-span-2 flex items-center gap-1">
                <FaMoneyBillWave className="text-orange-500" />
                Revenue:{" "}
                <span className="font-bold text-slate-900 text-xl">
                  AED {Number(stats.totalRevenue).toLocaleString()}
                </span>
              </p>
            </div>
          </div>

          {/* Visa Applications */}
          <div className="bg-white border border-orange-100 p-7 rounded-xl shadow-sm hover:shadow-md transition xl:col-span-2 2xl:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <FaPassport />
              </span>
              <h3 className="text-lg font-semibold text-slate-800">
                Visa Applications
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Processed applications & payments
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-700">
              <p>
                Total:{" "}
                <span className="font-bold text-slate-900 text-2xl">
                  {stats.totalVisaApplications}
                </span>
              </p>
              <p className="flex items-center gap-1">
                <FaCheckCircle className="text-emerald-600" />
                Approved:{" "}
                <span className="font-bold text-slate-900 text-2xl">
                  {stats.visaApproved}
                </span>
              </p>
              <p className="flex items-center gap-1">
                <FaChartLine className="text-orange-500" />
                Today:{" "}
                <span className="font-bold text-emerald-700 text-xl">
                  {stats.todayVisaApplications}
                </span>
              </p>
              <p className="col-span-2 flex items-center gap-1">
                <FaMoneyBillWave className="text-orange-500" />
                Collected:{" "}
                <span className="font-bold text-slate-900 text-xl">
                  AED {Number(stats.visaCollected).toLocaleString()}
                </span>
              </p>
            </div>
          </div>

          {/* Activity Bookings */}
          <div className="bg-white border border-orange-100 p-7 rounded-xl shadow-sm hover:shadow-md transition xl:col-span-2 2xl:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <FaTicketAlt />
              </span>
              <h3 className="text-lg font-semibold text-slate-800">
                Activity Bookings
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Adventure & package statistics
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-700">
              <p>
                Total:{" "}
                <span className="font-bold text-slate-900 text-2xl">
                  {stats.totalActivityBookings}
                </span>
              </p>
              <p className="flex items-center gap-1">
                <FaCheckCircle className="text-emerald-600" />
                Approved:{" "}
                <span className="font-bold text-slate-900 text-2xl">
                  {stats.activityConfirmed}
                </span>
              </p>
              <p className="flex items-center gap-1">
                <FaChartLine className="text-orange-500" />
                Today:{" "}
                <span className="font-bold text-emerald-700 text-xl">
                  {stats.todayActivityBookings}
                </span>
              </p>
              <p className="col-span-2 flex items-center gap-1">
                <FaMoneyBillWave className="text-orange-500" />
                Revenue:{" "}
                <span className="font-bold text-slate-900 text-xl">
                  AED {Number(stats.activityRevenue).toLocaleString()}
                </span>
              </p>
            </div>
          </div>

          {/* City Tour Bookings */}
          <div className="bg-white border border-orange-100 p-7 rounded-xl shadow-sm hover:shadow-md transition xl:col-span-2 2xl:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <FaTicketAlt />
              </span>
              <h3 className="text-lg font-semibold text-slate-800">
                City Tour Bookings
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              City tour package statistics
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-700">
              <p>
                Total:{" "}
                <span className="font-bold text-slate-900 text-2xl">
                  {stats.totalCityTourBookings}
                </span>
              </p>
              <p className="flex items-center gap-1">
                <FaCheckCircle className="text-emerald-600" />
                Approved:{" "}
                <span className="font-bold text-slate-900 text-2xl">
                  {stats.cityTourConfirmed}
                </span>
              </p>
              <p className="flex items-center gap-1">
                <FaChartLine className="text-orange-500" />
                Today:{" "}
                <span className="font-bold text-emerald-700 text-xl">
                  {stats.todayCityTourBookings}
                </span>
              </p>
              <p className="col-span-2 flex items-center gap-1">
                <FaMoneyBillWave className="text-orange-500" />
                Revenue:{" "}
                <span className="font-bold text-slate-900 text-xl">
                  AED {Number(stats.cityTourRevenue).toLocaleString()}
                </span>
              </p>
            </div>
          </div>

          {/* Activities */}
          <div className="bg-white border border-orange-100 p-6 rounded-xl shadow-sm hover:shadow-md transition order-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <FaTicketAlt />
              </span>
              <div>
                <p className="text-xs text-slate-500">Activities</p>
                <h3 className="text-2xl font-bold mt-1 text-slate-800">
                  {stats.totalActivities}
                </h3>
              </div>
            </div>
          </div>

          {/* Cruises */}
          <div className="bg-white border border-orange-100 p-7 rounded-xl shadow-sm hover:shadow-md transition order-2 flex flex-col">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <FaShip />
              </span>
              <div>
                <p className="text-xs text-slate-500">Cruises</p>
                <h3 className="text-2xl font-bold mt-1 text-slate-800">
                  {stats.totalCruises}
                </h3>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => navigate("/admin/cruises")}
                className="px-3 py-1.5 text-sm rounded-md bg-orange-500 hover:bg-orange-600 text-white shadow"
              >
                Manage
              </button>
            </div>
          </div>

          {/* Visas */}
          <div className="bg-white border border-orange-100 p-7 rounded-xl shadow-sm hover:shadow-md transition order-2 flex flex-col">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <FaPassport />
              </span>
              <div>
                <p className="text-xs text-slate-500">Visas</p>
                <h3 className="text-2xl font-bold mt-1 text-slate-800">
                  {stats.totalVisas}
                </h3>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => navigate("/admin/visas")}
                className="px-3 py-1.5 text-sm rounded-md bg-orange-500 hover:bg-orange-600 text-white shadow"
              >
                Manage
              </button>
            </div>
          </div>

          {/* Users */}
          <div className="bg-white border border-orange-100 p-7 rounded-xl shadow-sm hover:shadow-md transition order-2 flex flex-col">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <FaUsers />
              </span>
              <div>
                <p className="text-xs text-slate-500">Users</p>
                <h3 className="text-2xl font-bold mt-1 text-slate-800">
                  {stats.totalUsers}
                </h3>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => navigate("/admin/users")}
                className="px-3 py-1.5 text-sm rounded-md bg-orange-500 hover:bg-orange-600 text-white shadow"
              >
                View Users
              </button>
            </div>
          </div>

          {/* Contact Messages */}
          <div className="bg-white border border-orange-100 p-7 rounded-xl shadow-sm hover:shadow-md transition order-2 flex flex-col">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <FaEnvelope />
              </span>
              <div>
                <p className="text-xs text-slate-500">Contact Messages</p>
                <h3 className="text-2xl font-bold mt-1 text-slate-800">
                  {stats.totalMessages}
                </h3>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => navigate("/admin/contact-messages")}
                className="px-3 py-1.5 text-sm rounded-md bg-orange-500 hover:bg-orange-600 text-white shadow"
              >
                View Messages
              </button>
            </div>
          </div>

          {/* Holiday Enquiries (totals only, moved above via order) */}
          <div className="bg-white border border-orange-100 p-7 rounded-xl shadow-sm hover:shadow-md transition order-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <FaEnvelope />
              </span>
              <h3 className="text-base font-semibold text-slate-800">
                Holiday Enquiries
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Total number of enquiries
            </p>
            <div className="text-3xl font-bold text-slate-800">
              {stats.totalHolidayEnquiries}
            </div>
          </div>

          {/* Cruise Enquiries (totals only, moved above via order) */}
          <div className="bg-white border border-orange-100 p-7 rounded-xl shadow-sm hover:shadow-md transition order-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <FaShip />
              </span>
              <h3 className="text-base font-semibold text-slate-800">
                Cruise Enquiries
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Total number of enquiries
            </p>
            <div className="text-3xl font-bold text-slate-800">
              {stats.totalCruiseEnquiries}
            </div>
          </div>
        </section>

        <footer className="mt-10 text-center text-xs text-slate-400">
          © 2025 Travel & Tours Dashboard
        </footer>
      </main>
    </div>
  );
}
