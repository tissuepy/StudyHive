// Dashboard.jsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove auth token
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="dashboard">
      <h1>Welcome to Your Dashboard</h1>
      <p>This is your main dashboard where you can view and manage your account.</p>

      <div>
        <Link to="/databasePage">
          <button>Go to Database Page</button>
        </Link>
      </div>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
