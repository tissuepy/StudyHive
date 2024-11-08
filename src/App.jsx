// Import dependencies
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

// Import Components
import Login from './Login';
import CreateAccount from './CreateAccount';
import DatabasePage from './DatabasePage';

// Main App Component
function App() {
  return (
    <Router>
      <div className="card">
        <button onClick={() => window.location.assign("/login")}>
          Get started!
        </button>
      </div>

      {/* Define Routes for each page */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/DatabasePage" element={<DatabasePage />} />
      </Routes>
    </Router>
  );
}

export default App;
