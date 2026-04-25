import { useState } from "react";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [username, setUsername] = useState(user.username);

  const saveProfile = async () => {
    const res = await fetch("https://galaxyverse.onrender.com/api/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ username })
    });

    const updatedUser = await res.json();

    // 🔥 THIS IS THE KEY LINE
    localStorage.setItem("user", JSON.stringify(updatedUser));

    navigate("/home");
  };

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button onClick={saveProfile}>Save</button>
    </div>
  );
}

export default EditProfile;