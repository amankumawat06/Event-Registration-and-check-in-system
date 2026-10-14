import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/userAPI";
import "./Auth.css";
import desertImage from "../../assets/event-login-image.png";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!/^\d{10}$/.test(form.phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (form.password.length < 5) {
      setError("Password must contain at least 5 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await registerUser(form);

      setSuccess(response.data?.message || "Account created successfully!");

      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create your account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-visual">
          <img
            src={desertImage}
            alt="Purple desert at sunset"
            className="auth-background"
          />

          <div className="auth-visual-overlay" />

          <Link to="/" className="auth-brand">
            EventHub<span>.</span>
          </Link>

          <Link to="/" className="auth-back-link">
            Back to events <span>→</span>
          </Link>

          <div className="auth-visual-caption">
            <span className="auth-eyebrow">DISCOVER SOMETHING NEW</span>
            <h2>
              Moments worth
              <br />
              showing up for.
            </h2>
            <p>Discover events. Meet people. Make memories.</p>
            <div className="auth-dots">
              <span />
              <span />
              <span className="selected" />
            </div>
          </div>
        </section>

        <section className="auth-form-panel">
          <div className="auth-form-content">
            <div className="auth-mobile-brand">EventHub.</div>

            <h1>Create an account</h1>
            <p className="auth-subtitle">
              Already have an account? <Link to="/login">Log in</Link>
            </p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                  maxLength={100}
                />
              </div>

              <div className="auth-field">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="phone">Mobile number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={(e) => {
                    const phone = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                    setForm({ ...form, phone });
                  }}
                  autoComplete="tel"
                  inputMode="numeric"
                  required
                  maxLength={10}
                />
              </div>

              <div className="auth-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={5}
                  required
                />
              </div>

              {error && (
                <p className="auth-message auth-error" role="alert">
                  {error}
                </p>
              )}

              {success && (
                <p className="auth-message auth-success" role="status">
                  {success}
                </p>
              )}

              <button className="auth-submit" type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Signup;
