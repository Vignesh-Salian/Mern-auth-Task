import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    fetch("http://localhost:3000/auth", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          navigate("/");
          return;
        }

        const data = await res.json();
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => navigate("/"));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) return <h2 className="loading">Authenticating...</h2>;

  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="home-title">Home Dashboard</h1>
        <p className="home-welcome">
          Welcome, <span>{user?.username}!</span>
        </p>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
