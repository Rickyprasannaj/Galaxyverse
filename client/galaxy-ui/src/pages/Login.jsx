import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/home");
    } catch {
      setError("Server unreachable");
    }
  };

  return (
    <div className="space-auth">
      <div className="space-card">
        <div className="earth-icon">🌍</div>

        <h2>GalaxyVerse</h2>
        <p className="subtitle">Login to your galaxy</p>

        <input
          placeholder="Username or Galaxy ID"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button onClick={handleLogin}>Enter Galaxy</button>

        <p className="link" onClick={() => navigate("/signup")}>
          Create new account →
        </p>
      </div>
    </div>
  );
}

export default Login;