import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock3, MapPin } from "lucide-react";
import { getAllEvents } from "../../services/eventAPI";
import "./Events.css";
import {} from "react";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        setEvents(data.data.events || []);
      } catch (err) {
        console.error("Event fetching error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (date) => {
    if (!date) return "Date not available";

    return new Date(date).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "Time not available";

    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes || 0), 0, 0);

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const imageStyles = [
    "event-image-blue",
    "event-image-purple",
    "event-image-orange",
    "event-image-green",
  ];

  if (loading) {
    return (
      <div className="events-grid">
        {Array.from({ length: 8 }).map((_, index) => (
          <div className="event-card skeleton-card" key={index}>
            <div className="skeleton-image" />
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
            <div className="skeleton-line" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="events-heading">
        <div>
          <h1>Explore Events</h1>
          <p>Discover events and find your next experience.</p>
        </div>

        <span className="events-count">{events.length} Events</span>
      </div>

      {events.length === 0 ? (
        <div className="empty-events">
          <CalendarDays size={42} />
          <h3>No events available</h3>
          <p>New events will appear here when available.</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((evt, index) => (
            <article className="event-card" key={evt._id}>
              <div
                className={`event-image ${
                  imageStyles[index % imageStyles.length]
                }`}
              >
                <CalendarDays size={46} strokeWidth={1.5} />

                <span className="event-category">Event</span>
              </div>

              <div className="event-card-body">
                <h2>{evt.name}</h2>

                <p className="event-description">
                  {evt.description || "Join us for this exciting event."}
                </p>

                <div className="event-meta">
                  <div>
                    <CalendarDays size={16} />
                    <span>{formatDate(evt.date)}</span>
                  </div>

                  <div>
                    <Clock3 size={16} />
                    <span>{formatTime(evt.time)}</span>
                  </div>

                  <div>
                    <MapPin size={16} />
                    <span>{evt.venue || "Location not available"}</span>
                  </div>
                </div>

                <Link to={`/events/${evt._id}`} className="event-view-button">
                  View Event
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
