import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserRound, Mail, Phone, ArrowLeft } from "lucide-react";
import { getMe } from "../../services/userAPI";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

function Profile() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(!user);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMe();

        if (active) {
          const currentUser = response.data?.user;
          setProfile(currentUser);
          if (currentUser) setUser(currentUser);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message || "Unable to load your profile.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      active = false;
    };
  }, [setUser]);

  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-loading">Loading your profile...</div>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="profile-page">
        <div className="profile-empty">
          <UserRound size={42} />
          <h2>Profile unavailable</h2>
          <p>{error || "Please log in to view your profile."}</p>
          <Link to="/login" className="profile-back-btn">
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  const displayName = profile.name || "User";
  const initials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <main className="profile-page">
      <header className="profile-page-header">
        <div>
          <span className="profile-eyebrow">ACCOUNT</span>
          <h1>My Profile</h1>
        </div>

        <Link to="/" className="profile-back-btn">
          <ArrowLeft size={17} />
          All Events
        </Link>
      </header>

      <section className="profile-card">
        <div className="profile-banner" />

        <div className="profile-main">
          <div className="profile-avatar">{initials || "U"}</div>

          <div className="profile-identity">
            <h2>{displayName}</h2>
            <p>{profile.email || "No email available"}</p>
          </div>
        </div>

        <div className="profile-divider" />

        <div className="profile-information">
          <h3>Personal Information</h3>

          <div className="profile-info-grid">
            <div className="profile-info-item">
              <div className="profile-info-icon">
                <UserRound size={20} />
              </div>
              <div>
                <span>Full Name</span>
                <strong>{profile.name || "Not provided"}</strong>
              </div>
            </div>

            <div className="profile-info-item">
              <div className="profile-info-icon">
                <Mail size={20} />
              </div>
              <div>
                <span>Email Address</span>
                <strong>{profile.email || "Not provided"}</strong>
              </div>
            </div>

            <div className="profile-info-item">
              <div className="profile-info-icon">
                <Phone size={20} />
              </div>
              <div>
                <span>Phone Number</span>
                <strong>{profile.phone || "Not provided"}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-card-footer">
          <p></p>
          <Link to="/my-events">View My Bookings</Link>
        </div>
      </section>
    </main>
  );
}

export default Profile;
