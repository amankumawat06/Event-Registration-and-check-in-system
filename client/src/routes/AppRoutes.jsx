// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "../context/AuthContext";

// import Events from "../pages/Home/Events";
// import EventDetail from "../pages/Home/EventDetail";
// import Login from "../pages/Authentication/Login";
// import Signup from "../pages/Authentication/Signup";
// import MyEvents from "../pages/profile/MyEvents";
// import Profile from "../pages/profile/Profile";

// import Sidebar from "../components/layout/Sidebar";
// import Navbar from "../components/layout/Navbar";
// import "./AppRoutes.css";

// import AdminLayout from "../admin/AdminLayout";
// import AdminDashboard from "../admin/dashboard/AdminDashboard";
// import AdminEvents from "../admin/Events/Events";
// import AdminUsers from "../admin/Users/Users";
// import AdminBookings from "../admin/bookings/Bookings";
// import { useLocation } from "react-router-dom";

// function AppRoutes() {
//   const location = useLocation()
//   const isAdminRoute = location.pathname.startsWith("/admin")
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <div className="app-layout">
//           <Sidebar />
//           <main className="main-content">
//             {!isAdminRoute && <Navbar />}
//             <section className="page-content">
//               <Routes>
//                 <Route path="/" element={<Events />} />
//                 <Route path="/events/:id" element={<EventDetail />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/signup" element={<Signup />} />
//                 <Route path="/my-events" element={<MyEvents />} />
//                 <Route path="/profile" element={<Profile />} />

//                 <Route path="/admin" element={<AdminLayout />}>
//                   <Route index element={<AdminDashboard />} />
//                   <Route path="dashboard" element={<AdminDashboard />} />
//                   <Route path="events" element={<AdminEvents />} />
//                   <Route path="users" element={<AdminUsers />} />
//                   <Route path="bookings" element={<AdminBookings />} />
//                 </Route>
//               </Routes>
//             </section>
//           </main>
//         </div>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

// export default AppRoutes;

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";

import Events from "../pages/Home/Events";
import EventDetail from "../pages/Home/EventDetail";
import Login from "../pages/Authentication/Login";
import Signup from "../pages/Authentication/Signup";
import MyEvents from "../pages/profile/MyEvents";
import Profile from "../pages/profile/Profile";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import "./AppRoutes.css";

import AdminLayout from "../admin/AdminLayout";
import AdminDashboard from "../admin/dashboard/AdminDashboard";
import AdminEvents from "../admin/Events/Events";
import CreateEvent from "../admin/Events/CreateEvent";
import EditEvent from "../admin/Events/UpdateEvent";
import AdminUsers from "../admin/Users/Users";
import AdminBookings from "../admin/bookings/Bookings";

function RouteContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className={isAdminRoute ? "app-layout admin-route" : "app-layout"}>
      {!isAdminRoute && <Sidebar />}

      <main
        className={
          isAdminRoute ? "main-content admin-route-content" : "main-content"
        }
      >
        {!isAdminRoute && <Navbar />}

        <section
          className={
            isAdminRoute ? "page-content admin-route-page" : "page-content"
          }
        >
          <Routes>
            <Route path="/" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
               <Route path="events" element={<AdminEvents />} />
              <Route path="events/create" element={<CreateEvent />} />
              <Route path="events/:id/edit" element={<EditEvent />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="bookings" element={<AdminBookings />} />
            </Route>
          </Routes>
        </section>
      </main>
    </div>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RouteContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;
