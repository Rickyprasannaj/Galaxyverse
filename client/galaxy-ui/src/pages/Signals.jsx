import { useEffect, useState } from "react";

function Signals() {
  const [signals, setSignals] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSignals();
  }, []);

  const fetchSignals = async () => {
    const res = await fetch("https://galaxyverse.onrender.com/api/friends/requests", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setSignals(data);
  };

  const accept = async (userId) => {
    await fetch("https://galaxyverse.onrender.com/api/friends/accept", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });
    fetchSignals();
  };

  const reject = async (userId) => {
    await fetch("https://galaxyverse.onrender.com/api/friends/reject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ senderId: userId }),
    });
    fetchSignals();
  };

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h2>🔔 Signals</h2>

      {signals.length === 0 && <p>No new signals</p>}

      {signals.map((u) => (
        <div
          key={u._id}
          style={{
            marginTop: "15px",
            padding: "15px",
            borderRadius: "14px",
            border: "2px solid black",
            background: "rgba(0,160,242,0.08)",
            boxShadow: "0 0 15px rgba(0,160,242,0.4)",
          }}
        >
          <p>
            🌍 <b>{u.username}</b> ({u.galaxyId})
          </p>

          <button onClick={() => accept(u._id)}>✅ Accept</button>
          <button onClick={() => reject(u._id)} style={{ marginLeft: "10px" }}>
            ❌ Reject
          </button>
        </div>
      ))}
    </div>
  );
}

export default Signals;