import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Ticket,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import "./AdminLayout.css";

const navigation = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Events",
    path: "/admin/events",
    icon: CalendarDays,
  },
  {
    title: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    title: "Bookings",
    path: "/admin/bookings",
    icon: Ticket,
  },
];

const AdminSidebar = ({ onLogout }) => {
  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <div className="admin-brand-icon">E</div>
        <div>
          <h2>Evently</h2>
          <p>Admin Panel</p>
        </div>
      </div>

      <div className="admin-nav-label">MAIN MENU</div>

      <nav className="admin-navigation">
        {navigation.map(({ title, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? "active" : ""}`
            }
          >
            <Icon size={19} />
            <span>{title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-bottom">
        <NavLink to="/" className="admin-back-link">
          <ArrowLeft size={18} />
          <span>Back to Website</span>
        </NavLink>

        <button
          type="button"
          className="admin-logout-button"
          onClick={onLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
