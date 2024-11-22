// Import dependencies
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

// Import Components
import Login from './Login';
import CreateAccount from './CreateAccount';
import Dashboard from './Dashboard';
import DatabasePage from './DatabasePage';
import MatchPage from './MatchPage';

// Helper function to check login status
const isLoggedIn = () => {
  return !!localStorage.getItem("authToken"); // Check for token in local storage
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/login" />;
};

// Main App Component
function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root path to login page if not logged in */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login and Create Account Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />

        {/* Protected routes for Dashboard and DatabasePage */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/DatabasePage"
          element={
            <ProtectedRoute>
              <DatabasePage />
            </ProtectedRoute>
          }
        />
                <Route
          path="/MatchPage"
          element={
            <ProtectedRoute>
              <MatchPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
