import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { getEventById, updateEvent } from "../../services/eventAPI";
import "./AdminEvents.css";

const formatDateForInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value).slice(0, 10);
  }

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

const initialForm = {
  name: "",
  description: "",
  date: "",
  time: "",
  venue: "",
  maxQuantity: "",
};

function UpdateEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [bookedSeats, setBookedSeats] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getEventById(id);
        const event = response.data.event;

        if (!event) {
          throw new Error("Event details were not returned.");
        }

        if (!active) return;

        setForm({
          name: event.name || "",
          description: event.description || "",
          date: formatDateForInput(event.date),
          time: event.time || "",
          venue: event.venue || "",
          maxQuantity: String(event.maxQuantity ?? ""),
        });

        setBookedSeats(Number(event.bookedSeats || 0));
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load event.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchEvent();

    return () => {
      active = false;
    };
  }, [id]);

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

    if (capacity < bookedSeats) {
      setError(
        `Capacity cannot be less than ${bookedSeats} already booked seats.`,
      );
      return;
    }

    try {
      setSaving(true);

      await updateEvent(id, {
        ...form,
        maxQuantity: capacity,
      });

      navigate("/admin/events", {
        replace: true,
        state: { message: "Event updated successfully." },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update event.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="event-page-loading">Loading event details...</div>;
  }

  if (error && !form.name) {
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

        <div className="event-alert error" role="alert">
          {error}
        </div>

        <button
          type="button"
          className="event-secondary-button"
          onClick={() => navigate("/admin/events")}
        >
          Return to Events
        </button>
      </div>
    );
  }

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
          <Save size={23} />
        </span>
        <div>
          <h2>Update Event</h2>
          <p>Edit event details and manage its capacity.</p>
        </div>
      </div>

      <form className="event-form-card" onSubmit={handleSubmit}>
        {error && (
          <div className="event-alert error" role="alert">
            {error}
          </div>
        )}

        <div className="event-capacity-note">
          Booked seats: <strong>{bookedSeats}</strong>
        </div>

        <div className="event-form-grid">
          <div className="event-form-field full-width">
            <label htmlFor="name">Event Name *</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
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
              min={Math.max(1, bookedSeats)}
              step="1"
              required
            />
            <small>
              Capacity cannot be lower than booked seats ({bookedSeats}).
            </small>
          </div>
        </div>

        <div className="event-form-footer">
          <button
            type="button"
            className="event-secondary-button"
            onClick={() => navigate("/admin/events")}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="event-primary-button"
            disabled={saving}
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateEvent;
