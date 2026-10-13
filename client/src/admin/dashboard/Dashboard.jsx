import { useEffect, useState } from "react";
import { FaCalendarAlt, FaUsers, FaTicketAlt } from "react-icons/fa";
import Navbar from "../../components/layout/Navbar";
import { getAllEvents, createEvent } from "../../services/eventAPI";
import { getAllUsers } from "../../services/userAPI";
import Users from "../Users/Users";
import "./Admin.css";

const initialForm = {
  name: "",
  description: "",
  date: "",
  time: "",
  venue: "",
  maxQuantity: "",
};

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("create");
  const [formData, setFormData] = useState(initialForm);
  const [events, setEvents] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getAllEvents();
        setEvents(response.data.events || []);
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error("Failed to fetch events", error);
        }
      }

      try {
        const response = await getAllUsers();
        setTotalUsers(
          response.data.totalUsers ?? response.data.users?.length ?? 0,
        );
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setFetching(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const maxQuantity = Number(formData.maxQuantity);

    if (!Number.isInteger(maxQuantity) || maxQuantity < 1) {
      setMessage({
        type: "error",
        text: "Maximum capacity must be a positive whole number.",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await createEvent({
        name: formData.name.trim(),
        description: formData.description.trim(),
        date: formData.date,
        time: formData.time,
        venue: formData.venue.trim(),
        maxQuantity,
      });

      const newEvent = response.data.event;

      if (newEvent) {
        setEvents((previous) => [newEvent, ...previous]);
      }

      setFormData(initialForm);
      setMessage({
        type: "success",
        text: response.data.message || "Event created successfully!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to create event. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalCapacity = events.reduce(
    (total, event) => total + Number(event.maxQuantity || 0),
    0,
  );

  const totalBookings = events.reduce(
    (total, event) => total + Number(event.bookingCount || 0),
    0,
  );

  return (
    <main className="admin-page">
      <Navbar />

      <section className="admin-content">
        <div className="admin-heading">
          <div>
            <span className="admin-eyebrow">EVENTORA MANAGEMENT</span>
            <h1>
              Admin Dashboard<span>.</span>
            </h1>
            <p>Manage events and view registered users.</p>
          </div>

          <span className="admin-role-badge">Administrator</span>
        </div>

        <div className="admin-stats">
          <article className="admin-stat-card">
            <div className="admin-stat-icon purple">
              <FaCalendarAlt />
            </div>
            <div>
              <span>Total Events</span>
              <strong>{fetching ? "..." : events.length}</strong>
            </div>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-icon blue">
              <FaUsers />
            </div>
            <div>
              <span>Registered Users</span>
              <strong>{fetching ? "..." : totalUsers}</strong>
            </div>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-icon green">
              <FaTicketAlt />
            </div>
            <div>
              <span>Seats Booked</span>
              <strong>{fetching ? "..." : totalBookings}</strong>
              <small>of {totalCapacity} total seats</small>
            </div>
          </article>
        </div>

        <div className="admin-workspace">
          <div className="admin-tabs">
            <button
              type="button"
              className={activeTab === "create" ? "active" : ""}
              onClick={() => {
                setActiveTab("create");
                setMessage(null);
              }}
            >
              <FaCalendarAlt /> Create Event
            </button>

            <button
              type="button"
              className={activeTab === "users" ? "active" : ""}
              onClick={() => {
                setActiveTab("users");
                setMessage(null);
              }}
            >
              <FaUsers /> All Users
            </button>
          </div>

          {activeTab === "create" ? (
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <h2>Create New Event</h2>
                  <p>Enter the details for your upcoming event.</p>
                </div>
              </div>

              {message && (
                <div
                  className={`admin-message ${message.type}`}
                  role={message.type === "error" ? "alert" : "status"}
                >
                  {message.text}
                </div>
              )}

              <form className="admin-event-form" onSubmit={handleSubmit}>
                <div className="admin-form-group full-width">
                  <label htmlFor="event-name">Event Name</label>
                  <input
                    id="event-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Jaipur Tech Meetup"
                    maxLength={120}
                    required
                  />
                </div>

                <div className="admin-form-group full-width">
                  <label htmlFor="event-description">Description</label>
                  <textarea
                    id="event-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the event..."
                    rows={4}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="event-date">Event Date</label>
                  <input
                    id="event-date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="event-time">Event Time</label>
                  <input
                    id="event-time"
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="event-venue">Venue</label>
                  <input
                    id="event-venue"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    placeholder="Enter event location"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="event-capacity">Maximum Capacity</label>
                  <input
                    id="event-capacity"
                    type="number"
                    name="maxQuantity"
                    value={formData.maxQuantity}
                    onChange={handleChange}
                    placeholder="e.g. 100"
                    min="1"
                    step="1"
                    required
                  />
                </div>

                <div className="admin-form-actions full-width">
                  <button
                    type="submit"
                    className="admin-submit"
                    disabled={loading}
                  >
                    {loading ? "Creating Event..." : "Create Event"}
                  </button>
                </div>
              </form>
            </section>
          ) : (
            <Users />
          )}
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;
