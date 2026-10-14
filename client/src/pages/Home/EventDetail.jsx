import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Users,
  Ticket,
  CheckCircle2,
} from "lucide-react";
import { getEventById } from "../../services/eventAPI";
import "./EventDetail.css";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking } from "../../services/bookingAPI";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, authLoading } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getEventById(id);
        const eventData = response.data.event;

        if (!eventData) {
          setError("Event not found.");
          return;
        }

        setEvent(eventData);
      } catch (err) {
        console.error("Event detail fetching error:", err);

        setError(
          err.response?.status === 404
            ? "Event not found."
            : "Unable to load event details. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleBookEvent = async () => {
    if (!user) {
      navigate("/login", {
        state: { from: location.pathname },
      });
      return;
    }

    if (!window.confirm("Do you want to book this event?")) {
      return;
    }

    if (!event?._id) {
      setBookingError("Event details are not available.");
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError("");

      const response = await createBooking({
        eventId: event._id,
        quantity: Number(quantity),
      });

      navigate("/my-events", {
        state: {
          successMessage:
            response.data?.message || "Event booked successfully!",
        },
      });
    } catch (err) {
      setBookingError(
        err.response?.data?.message ||
          "Unable to book this event. Please try again.",
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not specified";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "Not specified";

    const match = time.match(/^(\d{1,2}):(\d{2})$/);

    if (!match) return time;

    const hours = Number(match[1]);
    const minutes = Number(match[2]);

    if (hours > 23 || minutes > 59) return time;

    const parsedTime = new Date();
    parsedTime.setHours(hours, minutes, 0, 0);

    return parsedTime.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="event-detail-message">
        <div className="detail-loader" />
        <p>Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-detail-message">
        <h2>{error || "Event not found."}</h2>
        <Link to="/" className="back-events-link">
          <ArrowLeft size={17} />
          Back to Events
        </Link>
      </div>
    );
  }

  const capacity = Number(event.maxQuantity) || 0;
  const booked = Number(event.bookedSeats) || 0;
  const available = Math.max(0, capacity - booked);
  const isFull = capacity > 0 && available === 0;

  const isPastEvent =
    event.date &&
    new Date(event.date).getTime() <
      new Date(new Date().toDateString()).getTime();

  return (
    <div className="event-detail-page">
      <Link to="/" className="back-events-link">
        <ArrowLeft size={18} />
        Back to All Events
      </Link>

      <section className="event-detail-hero">
        <div className="detail-hero-content">
 
          <h1>{event.name}</h1>

          <p>
            {event.description ||
              "Discover the event and get all the information you need."}
          </p>

          <div className="detail-hero-meta">
            <span>
              <CalendarDays size={18} />
              {formatDate(event.date)}
            </span>

            <span>
              <MapPin size={18} />
              {event.venue || "Location not specified"}
            </span>
          </div>
        </div>

        <div className="detail-hero-icon">
          <CalendarDays size={100} strokeWidth={1.1} />
        </div>
      </section>

      <div className="event-detail-layout">
        <section className="event-detail-main">
          <div className="detail-section">
            <h2>About This Event</h2>
            <p className="full-event-description">
              {event.description ||
                "No additional description is available for this event."}
            </p>
          </div>

          <div className="detail-section">
            <h2>Event Information</h2>

            <div className="detail-info-grid">
              <div className="detail-info-item">
                <div className="detail-info-icon">
                  <CalendarDays size={21} />
                </div>
                <div>
                  <span className="detail-info-label">Event Date</span>
                  <strong>{formatDate(event.date)}</strong>
                </div>
              </div>

              <div className="detail-info-item">
                <div className="detail-info-icon">
                  <Clock3 size={21} />
                </div>
                <div>
                  <span className="detail-info-label">Starting Time</span>
                  <strong>{formatTime(event.time)}</strong>
                </div>
              </div>

              <div className="detail-info-item">
                <div className="detail-info-icon">
                  <MapPin size={21} />
                </div>
                <div>
                  <span className="detail-info-label">Venue</span>
                  <strong>{event.venue || "Not specified"}</strong>
                </div>
              </div>

              <div className="detail-info-item">
                <div className="detail-info-icon">
                  <Users size={21} />
                </div>
                <div>
                  <span className="detail-info-label">Total Capacity</span>
                  <strong>
                    {capacity > 0 ? `${capacity} people` : "Not specified"}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h2>Registration Information</h2>

            <div className="registration-stats">
              <div>
                <span>Total Seats</span>
                <strong>{capacity || "-"}</strong>
              </div>

              <div>
                <span>Booked Seats</span>
                <strong>{booked}</strong>
              </div>

              <div>
                <span>Available Seats</span>
                <strong>{capacity > 0 ? available : "-"}</strong>
              </div>
            </div>

            {capacity > 0 && (
              <div className="capacity-progress">
                <div
                  className="capacity-progress-fill"
                  style={{
                    width: `${Math.min(100, (booked / capacity) * 100)}%`,
                  }}
                />
              </div>
            )}

            {capacity > 0 && (
              <p className="capacity-caption">
                {available} of {capacity} seats available
              </p>
            )}
          </div>
        </section>

        <aside className="event-booking-panel">
          <div className="booking-panel-icon">
            <Ticket size={28} />
          </div>

          <h2>Join This Event</h2>
          <p>Check the event information and reserve your place.</p>

          <div className="booking-panel-date">
            <CalendarDays size={18} />
            <div>
              <span>Date</span>
              <strong>{formatDate(event.date)}</strong>
            </div>
          </div>

          <div className="booking-panel-date">
            <Clock3 size={18} />
            <div>
              <span>Time</span>
              <strong>{formatTime(event.time)}</strong>
            </div>
          </div>

          <div className="booking-panel-date">
            <MapPin size={18} />
            <div>
              <span>Location</span>
              <strong>{event.venue || "Not specified"}</strong>
            </div>
          </div>

          {authLoading ? (
            <button className="detail-book-button" disabled>
              Please wait...
            </button>
          ) : !user ? (
            <Link
              to="/login"
              state={{ from: `/events/${event._id}` }}
              className="detail-book-button"
            >
              Login to Book Event
            </Link>
          ) : (
            <div className="booking-controls">
              <label htmlFor="booking-quantity">Number of seats</label>

              <select
                id="booking-quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                disabled={bookingLoading}
              >
                {[1, 2, 3, 4, 5].map((number) => (
                  <option key={number} value={number}>
                    {number} {number === 1 ? "seat" : "seats"}
                  </option>
                ))}
              </select>

              {bookingError && (
                <p className="booking-error" role="alert">
                  {bookingError}
                </p>
              )}

              <button
                type="button"
                className="detail-book-button"
                onClick={handleBookEvent}
                disabled={authLoading || bookingLoading}
              >
                {authLoading
                  ? "Checking login..."
                  : bookingLoading
                    ? "Booking..."
                    : user
                      ? "Book Event"
                      : "Login to Book Event"}
              </button>
            </div>
          )}

          
        </aside>
      </div>
    </div>
  );
};

export default EventDetail;
