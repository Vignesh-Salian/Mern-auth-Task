import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.err || "Signup failed");
      return;
    }

    setSuccess("Account created successfully!");
    setTimeout(() => navigate("/"), 1200);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Sign up to get started</p>

        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        <form onSubmit={handleSignup} className="auth-form">
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

          <button className="auth-btn">Sign Up</button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>Login</span>
        </p>
      </div>
    </div>
  );
}
