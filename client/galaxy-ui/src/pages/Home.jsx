import { useEffect } from "react";
import { useNavigate ,useLocation} from "react-router-dom";
import "./home.css";
function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  return (
    <div className="home-container">
      
      {/* Profile Card */}
      <div className="profile-card">
        <div className="earth-icon">🌍</div>

        <h2 className="username">{user?.username}</h2>
        <p className="galaxy-id">{user?.galaxyId}</p>
        <p className="status">● Online</p>

        <div className="profile-actions">
          <button className="btn">Edit Profile</button>
          <button
            className="btn"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div
  className={`tab ${location.pathname === "/home" ? "active" : ""}`}
  onClick={() => navigate("/home")}
>
  🏠 Home
</div>

<div
  className={`tab ${location.pathname === "/gels" ? "active" : ""}`}
  onClick={() => navigate("/gels")}
>
  🪐 Gels
</div>

<div
  className={`tab ${location.pathname === "/signals" ? "active" : ""}`}
  onClick={() => navigate("/signals")}
>
  🔔 Signals
</div>

    </div>
  );
}

export default Home;