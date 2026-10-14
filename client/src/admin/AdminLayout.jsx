
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "./AdminSidebar";
import "./AdminLayout.css";

const AdminLayout = () => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        <p>Checking admin access...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const pageTitles = {
    "/admin/dashboard": "Dashboard",
    "/admin/events": "Event Management",
    "/admin/users": "User Management",
    "/admin/bookings": "Booking Management",
  };

  const pageTitle =
    pageTitles[location.pathname] || "Admin Panel";

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar onLogout={handleLogout} />

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-breadcrumb">
              Admin / {pageTitle}
            </p>
            <h1>{pageTitle}</h1>
          </div>

          <div className="admin-user-info">
            <div className="admin-avatar">
              {user.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div>
              <strong>{user.name || "Admin"}</strong>
              <span>Administrator</span>
            </div>
          </div>
        </header>

        <section className="admin-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
