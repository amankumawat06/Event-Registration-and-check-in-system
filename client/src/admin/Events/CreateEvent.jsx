import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, Save } from "lucide-react";
import { createEvent } from "../../services/eventAPI";
import "./AdminEvents.css";

const initialForm = {
  name: "",
  description: "",
  date: "",
  time: "",
  venue: "",
  maxQuantity: "",
};

function CreateEvent() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const capacity = Number(form.maxQuantity);

    if (!Number.isInteger(capacity) || capacity < 1) {
      setError("Capacity must be a positive whole number.");
      return;
    }

    try {
      setLoading(true);

      await createEvent({
        ...form,
        maxQuantity: capacity,
      });

      navigate("/admin/events", {
        replace: true,
        state: { message: "Event created successfully." },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-form-page">
      <button
        type="button"
        className="event-back-button"
        onClick={() => navigate("/admin/events")}
      >
        <ArrowLeft size={18} />
        Back to Events
      </button>

      <div className="event-form-heading">
        <span className="event-form-heading-icon">
          <CalendarDays size={23} />
        </span>
        <div>
          <h2>Create Event</h2>
          <p>Add a new event to EventHub.</p>
        </div>
      </div>

      <form className="event-form-card" onSubmit={handleSubmit}>
        {error && (
          <div className="event-alert error" role="alert">
            {error}
          </div>
        )}

        <div className="event-form-grid">
          <div className="event-form-field full-width">
            <label htmlFor="name">Event Name *</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter event name"
              required
              maxLength={150}
            />
          </div>

          <div className="event-form-field full-width">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your event"
              rows={4}
              required
            />
          </div>

          <div className="event-form-field">
            <label htmlFor="date">Event Date *</label>
            <input
              id="date"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="event-form-field">
            <label htmlFor="time">Event Time *</label>
            <input
              id="time"
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="event-form-field">
            <label htmlFor="venue">Venue *</label>
            <input
              id="venue"
              name="venue"
              value={form.venue}
              onChange={handleChange}
              placeholder="Enter event venue"
              required
            />
          </div>

          <div className="event-form-field">
            <label htmlFor="maxQuantity">Maximum Capacity *</label>
            <input
              id="maxQuantity"
              type="number"
              name="maxQuantity"
              value={form.maxQuantity}
              onChange={handleChange}
              placeholder="Enter seat capacity"
              min="1"
              step="1"
              required
            />
          </div>
        </div>

        <div className="event-form-footer">
          <button
            type="button"
            className="event-secondary-button"
            onClick={() => navigate("/admin/events")}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="event-primary-button"
            disabled={loading}
          >
            <Save size={18} />
            {loading ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateEvent;
