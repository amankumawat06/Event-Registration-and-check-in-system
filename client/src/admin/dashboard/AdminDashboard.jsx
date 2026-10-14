import { useEffect, useState } from "react";
import {
  CalendarDays,
  Users,
  Ticket,
  UserCheck,
  Armchair,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

import { getAllEvents } from "../../services/eventAPI";
import { getAllUsers } from "../../services/userAPI";
import { getAllBookings } from "../../services/bookingAPI";

import "./AdminDashboard.css";

const isCheckedIn = (status) =>
  String(status || "")
    .toLowerCase()
    .replace(/[-_\s]/g, "") === "checkedin";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    events: 0,
    users: 0,
    bookings: 0,
    checkedIn: 0,
    totalCapacity: 0,
    bookedSeats: 0,
    availableSeats: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [eventsRes, usersRes, bookingsRes] = await Promise.all([
        getAllEvents(),
        getAllUsers(),
        getAllBookings(),
      ]);

      const events = eventsRes.data?.events || [];
      const users = usersRes.data?.users || [];
      const bookings = bookingsRes.data?.bookings || [];

      const totalCapacity = events.reduce(
        (total, event) => total + Number(event.maxQuantity || 0),
        0,
      );

      const bookedSeats = events.reduce(
        (total, event) => total + Number(event.bookedSeats || 0),
        0,
      );

      setStats({
        events: events.length,
        users: users.length,
        bookings: bookings.length,
        checkedIn: bookings.filter((booking) => isCheckedIn(booking.status))
          .length,
        totalCapacity,
        bookedSeats,
        availableSeats: Math.max(0, totalCapacity - bookedSeats),
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load dashboard data. Please check your APIs.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      label: "Total Events",
      value: stats.events,
      icon: CalendarDays,
      color: "blue",
    },
    {
      label: "Total Users",
      value: stats.users,
      icon: Users,
      color: "purple",
    },
    {
      label: "Total Bookings",
      value: stats.bookings,
      icon: Ticket,
      color: "orange",
    },
    {
      label: "Checked-in Bookings",
      value: stats.checkedIn,
      icon: UserCheck,
      color: "green",
    },
  ];

  const occupancy = stats.totalCapacity
    ? Math.round((stats.bookedSeats / stats.totalCapacity) * 100)
    : 0;

  return (
    <section className="adminDashboard">
      <div className="adminDashboard__header">
        <div>
          <span className="adminDashboard__eyebrow">OVERVIEW</span>
         </div>

        <button
          className="adminDashboard__refresh"
          onClick={fetchDashboardData}
          disabled={loading}
        >
          <RefreshCw
            size={17}
            className={loading ? "adminDashboard__spin" : ""}
          />
          Refresh
        </button>
      </div>

      {error && (
        <div className="adminDashboard__error">
          <span>{error}</span>
          <button onClick={fetchDashboardData}>Try again</button>
        </div>
      )}

      <div className="adminDashboard__stats">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <article className="adminDashboard__stat" key={card.label}>
              <div
                className={`adminDashboard__icon adminDashboard__icon--${card.color}`}
              >
                <Icon size={22} />
              </div>

              <div className="adminDashboard__statInfo">
                <span>{card.label}</span>
                <h2>{loading ? "-" : card.value.toLocaleString("en-IN")}</h2>
              </div>
            </article>
          );
        })}
      </div>

      <div className="adminDashboard__sectionTitle">
        <div>
          <h2>Event Capacity</h2>
          <p>Overview of seats across all events</p>
        </div>
        <Armchair size={22} />
      </div>

      <div className="adminDashboard__capacity">
        <div className="adminDashboard__capacityItem">
          <span>Total Capacity</span>
          <strong>{loading ? "-" : stats.totalCapacity}</strong>
        </div>

        <div className="adminDashboard__capacityItem">
          <span>Booked Seats</span>
          <strong>{loading ? "-" : stats.bookedSeats}</strong>
        </div>

        <div className="adminDashboard__capacityItem">
          <span>Available Seats</span>
          <strong>{loading ? "-" : stats.availableSeats}</strong>
        </div>

        <div className="adminDashboard__progressTrack">
          <div
            className="adminDashboard__progressFill"
            style={{ width: `${loading ? 0 : Math.min(100, occupancy)}%` }}
          />
        </div>

        <p className="adminDashboard__capacityNote">
          <TrendingUp size={16} />
          {loading
            ? "Calculating occupancy..."
            : stats.totalCapacity
              ? `${occupancy}% of total seats booked`
              : "Create an event to start tracking capacity"}
        </p>
      </div>
    </section>
  );
};

export default AdminDashboard;
