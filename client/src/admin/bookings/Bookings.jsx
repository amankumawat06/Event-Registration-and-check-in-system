
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Ticket,
  Users,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Mail,
  Phone,
  RefreshCw,
  LoaderCircle,
  UserCheck,
} from "lucide-react";
import {
  getAllBookings,
  markBookingCheckedIn,
} from "../../services/bookingAPI";
import "./Bookings.css";

const normalizeStatus = (status) => {
  const value = String(status || "").toLowerCase();

  if (value === "checked-in" || value === "checkedin") {
    return "checked-in";
  }

  return "registered";
};

const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "-";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  "Something went wrong. Please try again.";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAllBookings();
      setBookings(data.data.bookings || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const stats = useMemo(() => {
    const checkedIn = bookings.filter(
      (booking) =>
        normalizeStatus(booking.status) === "checked-in"
    ).length;

    return {
      total: bookings.length,
      checkedIn,
      registered: bookings.length - checkedIn,
    };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const user = booking.userId || {};
      const event = booking.eventId || {};

      const matchesSearch =
        !query ||
        String(user.name || "").toLowerCase().includes(query) ||
        String(user.email || "").toLowerCase().includes(query) ||
        String(user.phone || "").toLowerCase().includes(query) ||
        String(event.name || "").toLowerCase().includes(query) ||
        String(booking._id || "").toLowerCase().includes(query);

      const status = normalizeStatus(booking.status);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "registered" && status === "registered") ||
        (statusFilter === "checked-in" && status === "checked-in");

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  const handleCheckIn = async (booking) => {
    const confirmed = window.confirm(
      `Mark ${booking.userId?.name || "this attendee"} as checked in?`
    );

    if (!confirmed) return;

    setUpdatingId(booking._id);
    setError("");
    setSuccess("");

    try {
      await markBookingCheckedIn(booking._id);

      setBookings((previous) =>
        previous.map((item) =>
          item._id === booking._id
            ? { ...item, status: "checked-In" }
            : item
        )
      );

      setSuccess("Attendee checked in successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="admin-bookings-page">
      <div className="bookings-page-heading">
        <div>
          <p className="bookings-eyebrow">BOOKING MANAGEMENT</p>
          <h2>Manage Bookings</h2>
          <p className="bookings-subtitle">
           </p>
        </div>

        <button
          type="button"
          className="bookings-refresh-button"
          onClick={fetchBookings}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bookings-alert error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")}>
            Dismiss
          </button>
        </div>
      )}

      {success && (
        <div className="bookings-alert success" role="status">
          <span>{success}</span>
          <button type="button" onClick={() => setSuccess("")}>
            Dismiss
          </button>
        </div>
      )}

      <div className="bookings-stats">
        <article className="bookings-stat-card">
          <div className="bookings-stat-icon purple">
            <Ticket size={21} />
          </div>
          <div>
            <p>Total Bookings</p>
            <h3>{stats.total}</h3>
          </div>
        </article>

        <article className="bookings-stat-card">
          <div className="bookings-stat-icon amber">
            <Clock size={21} />
          </div>
          <div>
            <p>Awaiting Check-In</p>
            <h3>{stats.registered}</h3>
          </div>
        </article>

        <article className="bookings-stat-card">
          <div className="bookings-stat-icon green">
            <CheckCircle2 size={21} />
          </div>
          <div>
            <p>Checked-In</p>
            <h3>{stats.checkedIn}</h3>
          </div>
        </article>
      </div>

      <section className="bookings-panel">
        <div className="bookings-toolbar">
          <div>
            <h3>All Reservations</h3>
            <p>{filteredBookings.length} bookings found</p>
          </div>

          <div className="bookings-filters">
            <label className="bookings-search">
              <Search size={18} />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search user, event, email..."
              />
            </label>

            <select
              aria-label="Filter by booking status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="registered">Registered</option>
              <option value="checked-in">Checked-In</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="bookings-state">
            <LoaderCircle className="bookings-spin" size={30} />
            <p>Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bookings-state">
            <Ticket size={36} />
            <h3>
              {search || statusFilter !== "all"
                ? "No matching bookings"
                : "No bookings yet"}
            </h3>
            <p>
              {search || statusFilter !== "all"
                ? "Try changing your search or status filter."
                : "Bookings will appear here when users register for events."}
            </p>
          </div>
        ) : (
          <div className="bookings-table-scroll">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Attendee</th>
                  <th>Event</th>
                  <th>Booking Date</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Check-In</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => {
                  const user = booking.userId || {};
                  const event = booking.eventId || {};
                  const status = normalizeStatus(booking.status);
                  const checkedIn = status === "checked-in";

                  return (
                    <tr key={booking._id}>
                      <td>
                        <div className="booking-attendee">
                          <div className="booking-avatar">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>

                          <div className="booking-attendee-info">
                            <strong>{user.name || "User unavailable"}</strong>
                            <span>
                              <Mail size={13} />
                              {user.email || "No email"}
                            </span>
                            <span>
                              <Phone size={13} />
                              {user.phone || "No phone"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="booking-event-info">
                          <strong>{event.name || "Event unavailable"}</strong>
                          <span>
                            <CalendarDays size={14} />
                            {formatDate(event.date)}
                          </span>
                          <span>
                            <MapPin size={14} />
                            {event.venue || "No venue"}
                          </span>
                        </div>
                      </td>

                      <td>{formatDate(booking.bookingDate || booking.createdAt)}</td>

                      <td>
                        <span className="booking-quantity">
                          {booking.quantity ?? 1}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`booking-status ${
                            checkedIn ? "checked-in" : "registered"
                          }`}
                        >
                          {checkedIn ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <Clock size={14} />
                          )}
                          {checkedIn ? "Checked-In" : "Registered"}
                        </span>
                      </td>

                      <td>
                        {checkedIn ? (
                          <span className="booking-completed">
                            <CheckCircle2 size={16} />
                            Completed
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="booking-checkin-button"
                            onClick={() => handleCheckIn(booking)}
                            disabled={updatingId === booking._id}
                          >
                            {updatingId === booking._id ? (
                              <LoaderCircle
                                className="bookings-spin"
                                size={15}
                              />
                            ) : (
                              <UserCheck size={15} />
                            )}
                            Check In
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Bookings;
