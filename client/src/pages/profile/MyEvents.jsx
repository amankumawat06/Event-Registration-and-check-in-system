import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock3, MapPin, Ticket, XCircle } from "lucide-react";
import { getMyBookings, cancelBooking } from "../..//services/bookingAPI";
import { useAuth } from "../../context/AuthContext";
import "./MyEvents.css";

function MyEvents() {
  const { user, authLoading } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyBookings();
      setBookings(response.data?.bookings || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load your bookings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchBookings();
      } else {
        setBookings([]);
        setLoading(false);
      }
    }
  }, [user, authLoading, fetchBookings]);

  const handleCancelBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmed) return;

    try {
      setCancelingId(bookingId);
      setError("");
      setMessage("");

      const response = await cancelBooking(bookingId);

      setBookings((previous) =>
        previous.filter((booking) => booking._id !== bookingId),
      );

      setMessage(response.data?.message || "Booking cancelled successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to cancel this booking.");
    } finally {
      setCancelingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Date not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (authLoading || loading) {
    return (
      <main className="my-events-page">
        <div className="my-events-header">
          <h1>My Bookings</h1>
          <p>Loading your bookings...</p>
        </div>

        <div className="booking-skeleton-list">
          {[1, 2, 3].map((item) => (
            <div className="booking-skeleton" key={item} />
          ))}
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="my-events-page">
        <div className="my-events-empty">
          <Ticket size={46} />
          <h2>Login to view your bookings</h2>
          <p>Sign in to see the events you have registered for.</p>
          <Link className="my-events-primary-btn" to="/login">
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="my-events-page">
      <header className="my-events-header">
        <div>
          <span className="my-events-eyebrow">YOUR ACTIVITY</span>
          <h1>My Bookings</h1>
        </div>

        <div className="booking-count">
          <Ticket size={19} />
          <span>
            {bookings.length} {bookings.length === 1 ? "Booking" : "Bookings"}
          </span>
        </div>
      </header>

      {message && (
        <div className="my-events-message" role="status">
          {message}
        </div>
      )}

      {error && (
        <div className="my-events-error" role="alert">
          {error}
          <button type="button" onClick={fetchBookings}>
            Try again
          </button>
        </div>
      )}

      {!error && bookings.length === 0 ? (
        <section className="my-events-empty">
          <div className="my-events-empty-icon">
            <CalendarDays size={35} />
          </div>
          <h2>No bookings yet</h2>
          <p>
            You haven't registered for any events. Find an event to get started.
          </p>
          <Link to="/" className="my-events-primary-btn">
            Explore Events
          </Link>
        </section>
      ) : (
        <section className="my-bookings-list">
          {bookings.map((booking) => {
            const event = booking.eventId;
            const bookingId = booking._id;
            const status = booking.status || "registered";
            const isCheckedIn =
              status.toLowerCase().replace(/[-_ ]/g, "") === "checkedin";

            return (
              <article className="my-booking-card" key={bookingId}>
                <div className="my-booking-content">
                  <div className="my-booking-top">
                    <span className="my-booking-label">
                      <Ticket size={15} />
                      Event Booking
                    </span>

                    <span
                      className={`my-booking-status ${
                        isCheckedIn ? "checked-in" : "registered"
                      }`}
                    >
                      {isCheckedIn ? "Checked In" : status}
                    </span>
                  </div>

                  <h2>{event?.name || "Event details unavailable"}</h2>

                  <div className="my-booking-details">
                    <span>
                      <CalendarDays size={17} />
                      {formatDate(event?.date)}
                    </span>

                    <span>
                      <Clock3 size={17} />
                      {event?.time || "Time not available"}
                    </span>

                    <span>
                      <MapPin size={17} />
                      {event?.venue || "Venue not available"}
                    </span>
                  </div>

                  <div className="my-booking-footer">
                    <div className="my-booking-seats">
                      <span>Seats booked</span>
                      <strong>{booking.quantity || 1}</strong>
                    </div>

                    <div className="my-booking-date">
                      <span>Booking date</span>
                      <strong>{formatDate(booking.bookingDate)}</strong>
                    </div>
                  </div>
                </div>

                <div className="my-booking-actions">
                  {event?._id && (
                    <Link
                      to={`/events/${event._id}`}
                      className="my-booking-view-btn"
                    >
                      View Event
                    </Link>
                  )}

                  {!isCheckedIn && (
                    <button
                      type="button"
                      className="my-booking-cancel-btn"
                      onClick={() => handleCancelBooking(bookingId)}
                      disabled={cancelingId === bookingId}
                    >
                      <XCircle size={17} />
                      {cancelingId === bookingId
                        ? "Cancelling..."
                        : "Cancel Booking"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default MyEvents;
