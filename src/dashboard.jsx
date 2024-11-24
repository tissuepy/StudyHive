import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import coverlogo from './assets/coverlogo.png';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("neu_email");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <img
      src={coverlogo}
      alt="Logo"
      className="dashboard-logo"
      style={{
        width: '20%',
        height: 'auto', // Maintain aspect ratio
  }}
/>

      <h1>Welcome to the Dashboard</h1>
      <div className="button-container">
        <button onClick={() => navigate("/DatabasePage")}>Update Your Details</button>
        <button onClick={() => navigate("/MatchPage")}>Find Matches</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;
