import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Gels() {
  const [galaxyId, setGalaxyId] = useState("");
  const [gels, setGels] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchGels();
  }, []);

  const fetchGels = async () => {
    const res = await fetch("http://localhost:3000/api/friends/list", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setGels(data);
  };

  const addGel = async () => {
    if (!galaxyId) return;

    await fetch("http://localhost:3000/api/friends/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ galaxyId })
    });

    setGalaxyId("");
    alert("🌌 Gel request sent");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      color: "white",
      padding: "30px"
    }}>
      <h2 style={{ textAlign: "center" }}>🪐 Your Gels</h2>

      {/* Add Gel */}
      <div style={{ marginBottom: "25px", textAlign: "center" }}>
        <input
          placeholder="Enter Galaxy ID"
          value={galaxyId}
          onChange={(e) => setGalaxyId(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "2px solid black",
            marginRight: "10px"
          }}
        />
        <button
          onClick={addGel}
          style={{
            padding: "10px 18px",
            borderRadius: "10px",
            background: "#00a0f2",
            color: "white",
            border: "2px solid black",
            cursor: "pointer"
          }}
        >
          Add
        </button>
      </div>

      {/* Gels List */}
      {gels.length === 0 && (
        <p style={{ textAlign: "center", opacity: 0.7 }}>
          No Gels yet 🌌
        </p>
      )}

      <h3>Your Gels</h3>

{gels.map((g) => (
  <div
    key={g._id}
    onClick={() => navigate(`/chat/${g.galaxyId}`)}
    style={{
      marginTop: "15px",
      padding: "15px",
      borderRadius: "16px",
      border: "2px solid black",
      background: "rgba(0,160,242,0.1)",
      boxShadow: "0 0 15px rgba(0,160,242,0.5)",
      cursor: "pointer"
    }}
  >
    🌍 <b>{g.username}</b>
    <br />
    <small>{g.galaxyId}</small>
  </div>
))}
    </div>
  );
}

export default Gels;