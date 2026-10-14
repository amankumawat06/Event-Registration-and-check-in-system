import { useState } from "react";
import { Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import { loginUser } from "../../services/userAPI";
import "./Auth.css";
import desertImage from "../../assets/event-login-image.png";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const { refreshUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      await loginUser(form);
      const updatedUser = await refreshUser();

      if (updatedUser?.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        const redirectTo = location.state?.from || "/";
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials.",
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
            <span className="auth-eyebrow">
              YOUR NEXT EXPERIENCE STARTS HERE
            </span>
            <h2>
              Good times.
              <br />
              Great people.
            </h2>
            <p>Sign in and pick up where your next adventure begins.</p>
            <div className="auth-dots">
              <span className="selected" />
              <span />
              <span />
            </div>
          </div>
        </section>

        <section className="auth-form-panel">
          <div className="auth-form-content login-content">
            <div className="auth-mobile-brand">EventHub.</div>

            <h1>Welcome back</h1>
            <p className="auth-subtitle">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>

            <form onSubmit={handleSubmit} className="auth-form">
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
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
              </div>

              {error && (
                <p className="auth-message auth-error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? "Signing in..." : "Log in"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
