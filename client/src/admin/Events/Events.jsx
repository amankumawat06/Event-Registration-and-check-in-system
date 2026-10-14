import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { getAllEvents, deleteEvent } from "../../services/eventAPI";
import "./AdminEvents.css";

const getEventDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  return Number.isNaN(parsedDate.getTime())
    ? date
    : parsedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

function Events() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllEvents();
      setEvents(response.data.events || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filteredEvents = events.filter((event) => {
    const searchText = search.trim().toLowerCase();

    return [
      event.name,
      event.description,
      event.venue,
      event.createdBy?.name,
    ].some((value) =>
      String(value || "")
        .toLowerCase()
        .includes(searchText),
    );
  });

  const totalCapacity = events.reduce(
    (total, event) => total + Number(event.maxQuantity || 0),
    0,
  );

  const bookedSeats = events.reduce(
    (total, event) => total + Number(event.bookedSeats || 0),
    0,
  );

  const handleDelete = async (event) => {
    const confirmed = window.confirm(
      `Delete "${event.name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(event._id);
      setError("");
      setNotice("");

      await deleteEvent(event._id);

      setEvents((currentEvents) =>
        currentEvents.filter((item) => item._id !== event._id),
      );

      setNotice("Event deleted successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete event.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="event-management">
      <div className="event-page-heading">
        <div>
          <span className="event-eyebrow">EVENTS</span>
          <h2>Manage Events</h2>
         </div>

        <button
          className="event-primary-button"
          onClick={() => navigate("/admin/events/create")}
        >
          <Plus size={18} />
          Create Event
        </button>
      </div>

      <div className="event-stats">
        <div className="event-stat-card">
          <span className="event-stat-icon blue">
            <CalendarDays size={21} />
          </span>
          <div>
            <p>Total Events</p>
            <h3>{events.length}</h3>
          </div>
        </div>

        <div className="event-stat-card">
          <span className="event-stat-icon purple">
            <Users size={21} />
          </span>
          <div>
            <p>Total Capacity</p>
            <h3>{totalCapacity}</h3>
          </div>
        </div>

        <div className="event-stat-card">
          <span className="event-stat-icon orange">
            <Users size={21} />
          </span>
          <div>
            <p>Booked Seats</p>
            <h3>{bookedSeats}</h3>
          </div>
        </div>
      </div>

      <div className="event-list-card">
        <div className="event-list-toolbar">
          <div>
            <h3>All Events</h3>
            <p>{filteredEvents.length} events</p>
          </div>

          <div className="event-toolbar-actions">
            <label className="event-search">
              <Search size={18} />
              <input
                type="search"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>

            <button
              className="event-icon-button"
              onClick={fetchEvents}
              title="Refresh events"
              aria-label="Refresh events"
              disabled={loading}
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {error && (
          <div className="event-alert error" role="alert">
            {error}
          </div>
        )}

        {notice && (
          <div className="event-alert success" role="status">
            {notice}
          </div>
        )}

        {loading ? (
          <div className="event-empty-state">Loading events...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="event-empty-state">
            <CalendarDays size={34} />
            <h3>{search ? "No matching events" : "No events yet"}</h3>
            <p>
              {search
                ? "Try searching with another keyword."
                : "Create your first event to get started."}
            </p>

            {!search && (
              <button
                className="event-primary-button"
                onClick={() => navigate("/admin/events/create")}
              >
                <Plus size={18} />
                Create Event
              </button>
            )}
          </div>
        ) : (
          <div className="event-table-wrapper">
            <table className="event-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date & Time</th>
                  <th>Venue</th>
                  <th>Seats</th>
                  <th>Created By</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredEvents.map((event) => {
                  const capacity = Number(event.maxQuantity || 0);
                  const booked = Number(event.bookedSeats || 0);
                  const remaining = Math.max(capacity - booked, 0);

                  return (
                    <tr key={event._id}>
                      <td>
                        <div className="event-name-cell">
                          <strong>{event.name}</strong>
                          {/* <span>{event.description || "No description"}</span> */}
                        </div>
                      </td>

                      <td>
                        <div className="event-detail-cell">
                          <span>
                            <CalendarDays size={15} />
                            {getEventDate(event.date)}
                          </span>
                          <span>
                            <Clock3 size={15} />
                            {event.time || "-"}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className="event-venue-cell">
                          <MapPin size={15} />
                          {event.venue || "-"}
                        </span>
                      </td>

                      <td>
                        <div className="event-seat-cell">
                          <strong>
                            {booked} / {capacity}
                          </strong>
                          <span>{remaining} remaining</span>
                        </div>
                      </td>

                      <td>{event.createdBy?.name || "-"}</td>

                      <td>
                        <div className="event-row-actions">
                          <button
                            className="event-icon-button edit"
                            title="Edit event"
                            aria-label={`Edit ${event.name}`}
                            onClick={() =>
                              navigate(`/admin/events/${event._id}/edit`)
                            }
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            className="event-icon-button delete"
                            title="Delete event"
                            aria-label={`Delete ${event.name}`}
                            disabled={deletingId === event._id}
                            onClick={() => handleDelete(event)}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;
