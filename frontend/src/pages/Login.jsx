import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css"; // shared stylesheet for login & signup

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      setError("Invalid username or password");
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    navigate("/home");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to continue</p>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="text"
            placeholder="Username"
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="auth-btn">Login</button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign up</span>
        </p>
      </div>
    </div>
  );
}
