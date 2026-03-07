import { useEffect, useState } from "react";
import {
  AiOutlineAppstore,
  AiOutlineBook,
  AiOutlineCaretDown,
  AiOutlineCaretRight,
  AiOutlineClose,
  AiOutlineDashboard,
  AiOutlineLogout,
  AiOutlineMenu,
  AiOutlinePicture, // Add this icon for hero management
} from "react-icons/ai";
import { FaBed, FaHotel, FaUsers } from "react-icons/fa";
import { FaPassport } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";

export default function AdminLayout({ children }) {
  const [adminEmail, setAdminEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    management: true,
    bookings: true,
    enquiries: true,
    other: true,
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin/login");
    else setAdminEmail("Admin");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navItems = {
    management: [
      {
        path: "/admin/activities",
        label: "Manage Activities",
        icon: <AiOutlineAppstore />,
      },
      {
        path: "/admin/holidays",
        label: "Manage Holidays",
        icon: <AiOutlineAppstore />,
      },
      { path: "/admin/cruises", label: "Manage Cruises", icon: <FaHotel /> },
      { path: "/admin/visas", label: "Manage Visas", icon: <FaPassport /> },
      {
        path: "/admin/manage-hotels",
        label: "Manage Rooms / Hotels",
        icon: <FaBed />,
      },
      {
        path: "/admin/city-packages",
        label: "City Packages",
        icon: <AiOutlineAppstore />,
      },
    ],
    bookings: [
      {
        path: "/admin/bookings",
        label: "Room / Hotel Bookings",
        icon: <AiOutlineBook />,
      },
      {
        path: "/admin/activity-bookings",
        label: "Activity Bookings",
        icon: <AiOutlineBook />,
      },
      {
        path: "/admin/city-tour-bookings",
        label: "City Tour Bookings",
        icon: <AiOutlineBook />,
      },
      {
        path: "/admin/visa-applications",
        label: "Visa Applications",
        icon: <AiOutlineBook />,
      },
    ],
    enquiries: [
      {
        path: "/admin/cruise-enquiries",
        label: "Cruise Enquiries",
        icon: <AiOutlineBook />,
      },
      {
        path: "/admin/holiday-enquiries",
        label: "Holiday Enquiries",
        icon: <AiOutlineBook />,
      },
    ],
    other: [
      { path: "/admin/users", label: "Users", icon: <FaUsers /> },
      {
        path: "/admin/contact-messages",
        label: "Contact Messages",
        icon: <AiOutlineBook />,
      },
      {
        path: "/admin/hero",
        label: "Manage Hero Sections",
        icon: <AiOutlinePicture />, // Using picture icon for hero management
      },
    ],
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-80 bg-gradient-to-b from-orange-50 to-orange-100
        border-r border-orange-200
        transform transition-transform duration-300 ease-in-out
        flex flex-col shadow-xl
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-orange-200 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-orange-600 font-bold text-lg">A</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Admin Panel</h2>
                <p className="text-orange-100 text-sm">Dashboard</p>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-white hover:text-orange-200 transition-colors"
            >
              <AiOutlineClose size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 space-y-2">
            {/* Dashboard */}
            <button
              onClick={() => {
                navigate("/admin/dashboard");
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 p-3 rounded-xl transition-all
                ${
                  isActiveRoute("/admin/dashboard")
                    ? "bg-orange-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-orange-200 hover:text-orange-700"
                }
              `}
            >
              <AiOutlineDashboard className="text-lg" />
              <span className="font-medium">Dashboard</span>
            </button>

            {/* Management Section */}
            <div className="mt-6">
              <button
                onClick={() => toggleSection("management")}
                className="w-full flex items-center justify-between p-3 text-gray-700 hover:bg-orange-200 rounded-xl transition-colors"
              >
                <span className="font-semibold text-sm uppercase tracking-wide text-orange-600">
                  Management
                </span>
                {openSections.management ? (
                  <AiOutlineCaretDown />
                ) : (
                  <AiOutlineCaretRight />
                )}
              </button>

              {openSections.management && (
                <div className="ml-4 space-y-1 mt-2">
                  {navItems.management.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 p-2 rounded-lg transition-all text-sm
                        ${
                          isActiveRoute(item.path)
                            ? "bg-orange-500 text-white shadow-sm"
                            : "text-gray-600 hover:bg-orange-100 hover:text-orange-600"
                        }
                      `}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bookings Section */}
            <div className="mt-4">
              <button
                onClick={() => toggleSection("bookings")}
                className="w-full flex items-center justify-between p-3 text-gray-700 hover:bg-orange-200 rounded-xl transition-colors"
              >
                <span className="font-semibold text-sm uppercase tracking-wide text-orange-600">
                  Bookings
                </span>
                {openSections.bookings ? (
                  <AiOutlineCaretDown />
                ) : (
                  <AiOutlineCaretRight />
                )}
              </button>

              {openSections.bookings && (
                <div className="ml-4 space-y-1 mt-2">
                  {navItems.bookings.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 p-2 rounded-lg transition-all text-sm
                        ${
                          isActiveRoute(item.path)
                            ? "bg-orange-500 text-white shadow-sm"
                            : "text-gray-600 hover:bg-orange-100 hover:text-orange-600"
                        }
                      `}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Enquiries Section */}
            <div className="mt-4">
              <button
                onClick={() => toggleSection("enquiries")}
                className="w-full flex items-center justify-between p-3 text-gray-700 hover:bg-orange-200 rounded-xl transition-colors"
              >
                <span className="font-semibold text-sm uppercase tracking-wide text-orange-600">
                  Enquiries
                </span>
                {openSections.enquiries ? (
                  <AiOutlineCaretDown />
                ) : (
                  <AiOutlineCaretRight />
                )}
              </button>

              {openSections.enquiries && (
                <div className="ml-4 space-y-1 mt-2">
                  {navItems.enquiries.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 p-2 rounded-lg transition-all text-sm
                        ${
                          isActiveRoute(item.path)
                            ? "bg-orange-500 text-white shadow-sm"
                            : "text-gray-600 hover:bg-orange-100 hover:text-orange-600"
                        }
                      `}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Other Section */}
            <div className="mt-4">
              <button
                onClick={() => toggleSection("other")}
                className="w-full flex items-center justify-between p-3 text-gray-700 hover:bg-orange-200 rounded-xl transition-colors"
              >
                <span className="font-semibold text-sm uppercase tracking-wide text-orange-600">
                  Other
                </span>
                {openSections.other ? (
                  <AiOutlineCaretDown />
                ) : (
                  <AiOutlineCaretRight />
                )}
              </button>

              {openSections.other && (
                <div className="ml-4 space-y-1 mt-2">
                  {navItems.other.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 p-2 rounded-lg transition-all text-sm
                        ${
                          isActiveRoute(item.path)
                            ? "bg-orange-500 text-white shadow-sm"
                            : "text-gray-600 hover:bg-orange-100 hover:text-orange-600"
                        }
                      `}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-orange-200 bg-white">
          <div className="flex items-center space-x-3 mb-4 p-3 bg-orange-50 rounded-lg">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{adminEmail}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm font-medium"
          >
            <AiOutlineLogout />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <nav className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Left side - Menu button and title */}
              <div className="flex items-center">
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <AiOutlineMenu size={20} />
                </button>
                <div className="ml-4 lg:ml-0">
                  <h1 className="text-xl font-semibold text-gray-900">
                    {navItems.management.find((item) =>
                      isActiveRoute(item.path)
                    )?.label ||
                      navItems.bookings.find((item) => isActiveRoute(item.path))
                        ?.label ||
                      navItems.enquiries.find((item) =>
                        isActiveRoute(item.path)
                      )?.label ||
                      navItems.other.find((item) => isActiveRoute(item.path))
                        ?.label ||
                      "Dashboard"}
                  </h1>
                  <p className="text-sm text-gray-500 hidden sm:block">
                    Welcome back, {adminEmail}
                  </p>
                </div>
              </div>

              {/* Right side - User info and logout */}
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">A</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {adminEmail}
                    </p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium"
                >
                  <AiOutlineLogout />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <section className="flex-1 overflow-auto bg-gray-50">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </section>
      </main>
    </div>
  );
}
