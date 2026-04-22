import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      navigate("/login");
    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="space-auth">
      <div className="space-card">
        <div className="earth-icon">🌍</div>

        <h2>Create Galaxy</h2>
        <p className="subtitle">Join the cosmic network</p>

        <input
          placeholder="Choose username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Create password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button onClick={handleSignup}>Create Account</button>

        <p className="link" onClick={() => navigate("/login")}>
          Already have an account →
        </p>
      </div>
    </div>
  );
}

export default Signup;