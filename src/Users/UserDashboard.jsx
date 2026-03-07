// src/Users/UserDashboard.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch {
      // ignore
    }
  }, []);

  // (Stats removed) No bookings fetch needed here

  // Helpers removed with stats

  // Removed stats from UI; keep placeholders if needed in future.

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-700 mb-3">
            Please login to view your dashboard.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded text-white"
            style={{ backgroundColor: "#F17232" }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl overflow-hidden shadow-sm border">
        <div className="px-6 py-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome, {user.firstName}!</h1>
              <p className="text-white/90 mt-1 text-sm">
                Here’s a quick look at your bookings and account.
              </p>
            </div>
            <Link
              to="/dashboard/bookings"
              className="px-4 py-2 rounded text-orange-600 bg-white text-sm font-medium"
            >
              My Bookings
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div
              className="px-5 py-4"
              style={{ backgroundColor: "#F17232", color: "#fff" }}
            >
              <div className="font-semibold">Profile</div>
            </div>
            <div className="p-5 text-sm text-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Name</span>
                <span className="font-medium">
                  {user.firstName} {user.lastName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Phone</span>
                <span className="font-medium">
                  {user.phone || "Not provided"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Country Code</span>
                <span className="font-medium">{user.countryCode || "—"}</span>
              </div>
              <div className="pt-2">
                <Link
                  to="/dashboard/bookings"
                  className="inline-block px-4 py-2 rounded text-white text-sm"
                  style={{ backgroundColor: "#F17232" }}
                >
                  View My Bookings
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Bookings CTA (replaces Recent Bookings table) */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="px-5 py-6" style={{ backgroundColor: "#FFF7F2" }}>
              <div className="font-semibold text-gray-800">
                Activity Bookings
              </div>
              <p className="text-sm text-gray-600 mt-1">
                View your activity bookings and payment status.
              </p>
            </div>
            <div className="p-6 flex items-center justify-center gap-3 flex-wrap">
              <Link
                to="/dashboard/activity-bookings"
                className="px-4 py-2 rounded text-white text-sm"
                style={{ backgroundColor: "#F17232" }}
              >
                View Activity Bookings
              </Link>
              <Link
                to="/dashboard/visa-applications"
                className="px-4 py-2 rounded text-white text-sm"
                style={{ backgroundColor: "#F17232" }}
              >
                View Visa Applications
              </Link>
              <Link
                to="/dashboard/cruise-enquiries"
                className="px-4 py-2 rounded text-white text-sm"
                style={{ backgroundColor: "#F17232" }}
              >
                View Cruise Enquiries
              </Link>
              <Link
                to="/dashboard/holiday-enquiries"
                className="px-4 py-2 rounded text-white text-sm"
                style={{ backgroundColor: "#F17232" }}
              >
                View Holiday Enquiries
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
