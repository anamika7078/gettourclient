// import {
//   Route,
//   BrowserRouter as Router,
//   Routes,
//   useLocation,
// } from "react-router-dom";

// // Layouts
// import AdminLayout from "./admin/AdminLayout";
// import Layout from "./pages/Common/Layout";
// import UserLayout from "./Users/UserLayout";

// // Navbar
// import Navbar from "./pages/Common/Navbar";

// // Admin pages (your imports...)
// import ActivityManageForm from "./admin/Activity/ActivityManageForm";
// import ActivityTable from "./admin/Activity/ActivityTable";
// import ManageActivityBooking from "./admin/Activity/ManageActivityBooking";
// import AdminDashboard from "./admin/AdminDashboard";
// import AdminLogin from "./admin/AdminLogin";
// import AdminRegister from "./admin/AdminRegister";
// import Bookings from "./admin/Bookings/Bookings";
// import ContactMessage from "./admin/ContactMessage";
// import AddCruisePackage from "./admin/Cruise/AddCruisePackage";
// import CruiseEnquiries from "./admin/Cruise/CruiseEnquiries";
// import ManageCruise from "./admin/Cruise/ManageCruise";
// import ForgotPassword from "./admin/ForgotPassword";
// import AddHolidayPakage from "./admin/Holiday/AddHolidayPakage";
// import HolidayEnquriy from "./admin/Holiday/HolidayEnquriy";
// import ManageHoliday from "./admin/Holiday/ManageHoliday";
// import AddRoom from "./admin/Hotel/AddRoom";
// import ManageRooms from "./admin/Hotel/ManageHotel";
// import ManageHero from "./admin/ManageHero";
// import ResetPassword from "./admin/ResetPassword";
// import UsersDetails from "./admin/UsersDetails";
// import CountryVisaAdd from "./admin/Visas/CountryVisaAdd";
// import CountryVisaManage from "./admin/Visas/CountryVisaManage";
// import ManageVisas from "./admin/Visas/ManageVisas";

// // Public/User pages
// import AcitivtyBooking from "./pages/Activitys/AcitivtyBooking";
// import ActivityDetail from "./pages/Activitys/ActivityDetail";
// import About from "./pages/Common/About";
// import Contact from "./pages/Common/Contact";
// import PrivacyPolicy from "./pages/Common/PrivacyPolicy";
// import TermsConditions from "./pages/Common/TermsConditions";
// import Cruises from "./pages/Cruises";
// import CruisesDetail from "./pages/Cruises/CruisesDetail";
// import Home from "./pages/Home";
// import Hotels from "./pages/Hotels";
// import HotelRoomBooking from "./pages/Hotels/HotelRoomBooking";
// import HotelsilPage from "./pages/Hotels/HotelsDetail";
// import Tours from "./pages/Tours";
// import HolidayDetial from "./pages/Tours/HolidayDetial";
// import Visas from "./pages/Visas";
// import VisasApply from "./pages/Visas/VisasApply";
// import VisasDetail from "./pages/Visas/VisasDetail";

// // User pages
// import Forget from "./Users/Forget";
// import Login from "./Users/Login";
// import Reset from "./Users/Reset";
// import Signup from "./Users/Signup";
// import UserActivityBooking from "./Users/UserActivityBooking";
// import UserBookings from "./Users/UserBookings";
// import UserCruiseEnquiries from "./Users/UserCruiseEnquiries";
// import UserDashboard from "./Users/UserDashboard";
// import UserHolidaysEnquiries from "./Users/UserHolidaysEnquiries";
// import UserVisaApplication from "./Users/UserVisaApplication";

// // AppWrapper to handle conditional Navbar and Layout
// function AppWrapper() {
//   const location = useLocation();
//   const isAdminRoute = location.pathname.startsWith("/admin");

//   return (
//     <>
//       <Routes>
//         {/* Admin routes (no Navbar, only AdminLayout) */}
//         <Route path="/admin/register/*" element={<AdminRegister />} />
//         <Route path="/admin/login/*" element={<AdminLogin />} />
//         <Route path="/admin/forgot-password/*" element={<ForgotPassword />} />
//         <Route path="/admin/reset-password/*" element={<ResetPassword />} />

//         <Route
//           path="/admin/dashboard/*"
//           element={
//             <AdminLayout>
//               <AdminDashboard />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/manage-hotels/*"
//           element={
//             <AdminLayout>
//               <ManageRooms />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/add-room/*"
//           element={
//             <AdminLayout>
//               <AddRoom />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/rooms/edit/:roomId/*"
//           element={
//             <AdminLayout>
//               <AddRoom />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/contact-messages/*"
//           element={
//             <AdminLayout>
//               <ContactMessage />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/bookings/*"
//           element={
//             <AdminLayout>
//               <Bookings />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/activity-bookings/*"
//           element={
//             <AdminLayout>
//               <ManageActivityBooking />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/users/*"
//           element={
//             <AdminLayout>
//               <UsersDetails />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/holidays/*"
//           element={
//             <AdminLayout>
//               <ManageHoliday />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/holidays/new/*"
//           element={
//             <AdminLayout>
//               <AddHolidayPakage />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/holidays/:id/edit/*"
//           element={
//             <AdminLayout>
//               <AddHolidayPakage />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/holiday-enquiries/*"
//           element={
//             <AdminLayout>
//               <HolidayEnquriy />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/hero/*"
//           element={
//             <AdminLayout>
//               <ManageHero />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/activities/*"
//           element={
//             <AdminLayout>
//               <ActivityTable />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/activities/new/*"
//           element={
//             <AdminLayout>
//               <ActivityManageForm />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/activities/:id/edit/*"
//           element={
//             <AdminLayout>
//               <ActivityManageForm />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/cruises/*"
//           element={
//             <AdminLayout>
//               <ManageCruise />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/cruises/new/*"
//           element={
//             <AdminLayout>
//               <AddCruisePackage />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/cruises/:id/edit/*"
//           element={
//             <AdminLayout>
//               <AddCruisePackage />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/cruise-enquiries/*"
//           element={
//             <AdminLayout>
//               <CruiseEnquiries />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/visas/*"
//           element={
//             <AdminLayout>
//               <CountryVisaManage />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/visas/new/*"
//           element={
//             <AdminLayout>
//               <CountryVisaAdd />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/visas/:id/edit/*"
//           element={
//             <AdminLayout>
//               <CountryVisaAdd />
//             </AdminLayout>
//           }
//         />
//         <Route
//           path="/admin/visa-applications/*"
//           element={
//             <AdminLayout>
//               <ManageVisas />
//             </AdminLayout>
//           }
//         />

//         {/* Public/User routes wrapped with Layout (WhatsApp) */}
//         {!isAdminRoute && (
//           <Route
//             path="/*"
//             element={
//               <Layout>
//                 <Navbar />
//                 <Routes>
//                   {/* ✅ USE WILDCARD ROUTES - Works with and without trailing slashes */}
//                   <Route path="/*" element={<Home />} />
//                   <Route path="/hotels/*" element={<Hotels />} />
//                   <Route path="/hotels/:id/*" element={<HotelsilPage />} />
//                   <Route path="/booking/:id/*" element={<HotelRoomBooking />} />
//                   <Route path="/tours/*" element={<Tours />} />
//                   <Route
//                     path="/activities/:id/*"
//                     element={<ActivityDetail />}
//                   />
//                   <Route
//                     path="/activities/:id/book/*"
//                     element={<AcitivtyBooking />}
//                   />
//                   <Route path="/visas/*" element={<Visas />} />
//                   <Route path="/visas/:id/*" element={<VisasDetail />} />
//                   <Route path="/visas/:id/apply/*" element={<VisasApply />} />
//                   <Route path="/cruises/*" element={<Cruises />} />
//                   <Route path="/cruises/:id/*" element={<CruisesDetail />} />
//                   <Route path="/holidays/:id/*" element={<HolidayDetial />} />
//                   <Route path="/privacy/*" element={<PrivacyPolicy />} />
//                   <Route path="/terms/*" element={<TermsConditions />} />
//                   <Route path="/contact/*" element={<Contact />} />
//                   <Route path="/about/*" element={<About />} />

//                   <Route path="/login/*" element={<Login />} />
//                   <Route path="/signup/*" element={<Signup />} />
//                   <Route path="/forget/*" element={<Forget />} />
//                   <Route path="/reset/*" element={<Reset />} />

//                   <Route
//                     path="/dashboard/*"
//                     element={
//                       <UserLayout>
//                         <UserDashboard />
//                       </UserLayout>
//                     }
//                   />
//                   <Route
//                     path="/dashboard/bookings/*"
//                     element={
//                       <UserLayout>
//                         <UserBookings />
//                       </UserLayout>
//                     }
//                   />
//                   <Route
//                     path="/dashboard/activity-bookings/*"
//                     element={
//                       <UserLayout>
//                         <UserActivityBooking />
//                       </UserLayout>
//                     }
//                   />
//                   <Route
//                     path="/dashboard/cruise-enquiries/*"
//                     element={
//                       <UserLayout>
//                         <UserCruiseEnquiries />
//                       </UserLayout>
//                     }
//                   />
//                   <Route
//                     path="/dashboard/holiday-enquiries/*"
//                     element={
//                       <UserLayout>
//                         <UserHolidaysEnquiries />
//                       </UserLayout>
//                     }
//                   />
//                   <Route
//                     path="/dashboard/visa-applications/*"
//                     element={
//                       <UserLayout>
//                         <UserVisaApplication />
//                       </UserLayout>
//                     }
//                   />
//                 </Routes>
//               </Layout>
//             }
//           />
//         )}
//       </Routes>
//     </>
//   );
// }

// export default function App() {
//   return (
//     <Router>
//       <AppWrapper />
//     </Router>
//   );
// }

import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";

// Layouts
import AdminLayout from "./admin/AdminLayout";
import Layout from "./pages/Common/Layout";
import UserLayout from "./Users/UserLayout";

// Navbar
import Navbar from "./pages/Common/Navbar";

// Admin pages
import ActivityManageForm from "./admin/Activity/ActivityManageForm";
import ActivityTable from "./admin/Activity/ActivityTable";
import ManageActivityBooking from "./admin/Activity/ManageActivityBooking";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLogin from "./admin/AdminLogin";
import AdminRegister from "./admin/AdminRegister";
import Bookings from "./admin/Bookings/Bookings";
import AddCityPackage from "./admin/CityPackage/AddCityPackage";
import ManageCityPackages from "./admin/CityPackage/ManageCityPackages";
import ManageCityTourBooking from "./admin/CityTour/ManageCityTourBooking";
import ContactMessage from "./admin/ContactMessage";
import AddCruisePackage from "./admin/Cruise/AddCruisePackage";
import CruiseEnquiries from "./admin/Cruise/CruiseEnquiries";
import ManageCruise from "./admin/Cruise/ManageCruise";
import ForgotPassword from "./admin/ForgotPassword";
import AddHolidayPakage from "./admin/Holiday/AddHolidayPakage";
import HolidayEnquriy from "./admin/Holiday/HolidayEnquriy";
import ManageHoliday from "./admin/Holiday/ManageHoliday";
import AddRoom from "./admin/Hotel/AddRoom";
import ManageRooms from "./admin/Hotel/ManageHotel";
import ManageHero from "./admin/ManageHero";
import ResetPassword from "./admin/ResetPassword";
import UsersDetails from "./admin/UsersDetails";
import CountryVisaAdd from "./admin/Visas/CountryVisaAdd";
import CountryVisaManage from "./admin/Visas/CountryVisaManage";
import ManageVisas from "./admin/Visas/ManageVisas";

// Public/User pages
import AcitivtyBooking from "./pages/Activitys/AcitivtyBooking";
import ActivityDetail from "./pages/Activitys/ActivityDetail";
import CityTourDetail from "./pages/CityTourPackages/CityTourDetail";
import CityTourPackageBooking from "./pages/CityTourPackages/CityTourPackageBooking";
import CityTourPackages from "./pages/CityTourPackages/CityTourPackages";
import About from "./pages/Common/About";
import Contact from "./pages/Common/Contact";
import PrivacyPolicy from "./pages/Common/PrivacyPolicy";
import TermsConditions from "./pages/Common/TermsConditions";
import Cruises from "./pages/Cruises";
import CruisesDetail from "./pages/Cruises/CruisesDetail";
import Home from "./pages/Home";
import Hotels from "./pages/Hotels";
import HotelRoomBooking from "./pages/Hotels/HotelRoomBooking";
import HotelsilPage from "./pages/Hotels/HotelsDetail";
import Tours from "./pages/Tours";
import HolidayDetial from "./pages/Tours/HolidayDetial";
import Visas from "./pages/Visas";
import VisasApply from "./pages/Visas/VisasApply";
import VisasDetail from "./pages/Visas/VisasDetail";

// User pages
import Forget from "./Users/Forget";
import Login from "./Users/Login";
import Reset from "./Users/Reset";
import Signup from "./Users/Signup";
import UserActivityBooking from "./Users/UserActivityBooking";
import UserBookings from "./Users/UserBookings";
import UserCityTourBooking from "./Users/UserCityTourBooking";
import UserCruiseEnquiries from "./Users/UserCruiseEnquiries";
import UserDashboard from "./Users/UserDashboard";
import UserHolidaysEnquiries from "./Users/UserHolidaysEnquiries";
import UserVisaApplication from "./Users/UserVisaApplication";

// AppWrapper to handle conditional rendering
function AppWrapper() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  // If it's an admin route, render admin routes only
  if (isAdminRoute) {
    return (
      <Routes>
        {/* Admin auth routes without layout */}
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />

        {/* Admin routes with layout */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/manage-hotels"
          element={
            <AdminLayout>
              <ManageRooms />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/add-room"
          element={
            <AdminLayout>
              <AddRoom />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/rooms/edit/:roomId"
          element={
            <AdminLayout>
              <AddRoom />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/contact-messages"
          element={
            <AdminLayout>
              <ContactMessage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <AdminLayout>
              <Bookings />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/activity-bookings"
          element={
            <AdminLayout>
              <ManageActivityBooking />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/city-tour-bookings"
          element={
            <AdminLayout>
              <ManageCityTourBooking />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminLayout>
              <UsersDetails />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/holidays"
          element={
            <AdminLayout>
              <ManageHoliday />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/holidays/new"
          element={
            <AdminLayout>
              <AddHolidayPakage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/holidays/:id/edit"
          element={
            <AdminLayout>
              <AddHolidayPakage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/holiday-enquiries"
          element={
            <AdminLayout>
              <HolidayEnquriy />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/city-packages"
          element={
            <AdminLayout>
              <ManageCityPackages />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/city-packages/add"
          element={
            <AdminLayout>
              <AddCityPackage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/city-packages/edit/:id"
          element={
            <AdminLayout>
              <AddCityPackage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/hero"
          element={
            <AdminLayout>
              <ManageHero />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/activities"
          element={
            <AdminLayout>
              <ActivityTable />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/activities/new"
          element={
            <AdminLayout>
              <ActivityManageForm />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/activities/:id/edit"
          element={
            <AdminLayout>
              <ActivityManageForm />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/cruises"
          element={
            <AdminLayout>
              <ManageCruise />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/cruises/new"
          element={
            <AdminLayout>
              <AddCruisePackage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/cruises/:id/edit"
          element={
            <AdminLayout>
              <AddCruisePackage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/cruise-enquiries"
          element={
            <AdminLayout>
              <CruiseEnquiries />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/visas"
          element={
            <AdminLayout>
              <CountryVisaManage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/visas/new"
          element={
            <AdminLayout>
              <CountryVisaAdd />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/visas/:id/edit"
          element={
            <AdminLayout>
              <CountryVisaAdd />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/visa-applications"
          element={
            <AdminLayout>
              <ManageVisas />
            </AdminLayout>
          }
        />
      </Routes>
    );
  }

  // Public/User routes with Navbar and Layout
  return (
    <Layout>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotels/:id" element={<HotelsilPage />} />
        <Route path="/booking/:id" element={<HotelRoomBooking />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/activities/:id" element={<ActivityDetail />} />
        <Route path="/activities/:id/book" element={<AcitivtyBooking />} />
        <Route path="/visas" element={<Visas />} />
        <Route path="/visas/:id" element={<VisasDetail />} />
        <Route path="/visas/:id/apply" element={<VisasApply />} />
        <Route path="/cruises" element={<Cruises />} />
        <Route path="/cruises/:id" element={<CruisesDetail />} />
        <Route path="/holidays/:id" element={<HolidayDetial />} />
        <Route path="/city-tour/:id" element={<CityTourPackages />} />
        <Route
          path="/city-tour-list/:cityName"
          element={<CityTourPackages />}
        />
        <Route path="/city-tour/detail/:id" element={<CityTourDetail />} />
        <Route
          path="/city-tours/:id/book"
          element={<CityTourPackageBooking />}
        />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

        {/* User auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget" element={<Forget />} />
        <Route path="/reset" element={<Reset />} />

        {/* User dashboard routes with UserLayout */}
        <Route
          path="/dashboard"
          element={
            <UserLayout>
              <UserDashboard />
            </UserLayout>
          }
        />
        <Route
          path="/dashboard/bookings"
          element={
            <UserLayout>
              <UserBookings />
            </UserLayout>
          }
        />
        <Route
          path="/dashboard/activity-bookings"
          element={
            <UserLayout>
              <UserActivityBooking />
            </UserLayout>
          }
        />
        <Route
          path="/dashboard/city-tour-bookings"
          element={
            <UserLayout>
              <UserCityTourBooking />
            </UserLayout>
          }
        />
        <Route
          path="/dashboard/cruise-enquiries"
          element={
            <UserLayout>
              <UserCruiseEnquiries />
            </UserLayout>
          }
        />
        <Route
          path="/dashboard/holiday-enquiries"
          element={
            <UserLayout>
              <UserHolidaysEnquiries />
            </UserLayout>
          }
        />
        <Route
          path="/dashboard/visa-applications"
          element={
            <UserLayout>
              <UserVisaApplication />
            </UserLayout>
          }
        />

        {/* Catch-all route for 404 pages - IMPORTANT for client-side routing */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  );
}

// Main App component
export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
