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

  if (loading) return <h2 className="loading">Checking authentication...</h2>;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">My Dashboard</h2>

        <ul className="sidebar-menu">
          <li>🏠 Home</li>
          <li>⚙ Settings</li>
        </ul>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>Welcome, {user?.username}! 👋</h1>
          <p>This is your simple, clean dashboard.</p>
        </header>

        <section className="info-section">
          <h2>Dashboard Overview</h2>
          <p>
            This is a protected page. You can add charts, tables, links,
            user activity, or any details here later whenever you need.
          </p>
        </section>
      </main>
    </div>
  );
}
