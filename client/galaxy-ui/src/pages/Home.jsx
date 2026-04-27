import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

function Home() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  return (
    <div className="home-container">
      
      {/* Profile Card */}
      <div className="profile-card">
        <div className="earth-icon">🌍</div>

        <h2 className="username">{user?.username || "Unknown"}</h2>
        <p className="galaxy-id">{user?.galaxyId || "No ID"}</p>
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

    </div>
  );
}

export default Home;