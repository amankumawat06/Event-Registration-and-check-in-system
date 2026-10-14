import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Ticket,
  LogIn,
  UserPlus,
  UserRound,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

function Sidebar() {
  const { user, authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    {
      name: "All Events",
      path: "/",
      icon: CalendarDays,
      end: true,
    },

    ...(user?.role === "admin"
      ? [
          {
            name: "Dashboard",
            path: "/admin/dashboard",
            icon: LayoutDashboard,
          },
        ]
      : []),

    ...(user && user.role !== "admin"
      ? [
          {
            name: "My Bookings",
            path: "/my-events",
            icon: Ticket,
          },
          {
            name: "My Profile",
            path: "/profile",
            icon: UserRound,
          },
        ]
      : []),
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <LayoutDashboard size={25} />
        <span>EventHub</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}

        {!authLoading && !user && (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <LogIn size={19} />
              <span>Login</span>
            </NavLink>

            <NavLink
              to="/signup"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <UserPlus size={19} />
              <span>Signup</span>
            </NavLink>
          </>
        )}
      </nav>

      {!authLoading && user && (
        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="sidebar-user-info">
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-link sidebar-logout"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
