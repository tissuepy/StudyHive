// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import coverlogo from './assets/coverlogo.png';
import { Link } from 'react-router-dom';
import { supabase } from './supabaseClient';

const Login = () => {
  document.title = 'Login';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('userData')
      .select('password')
      .eq('neu_email', email)
      .single();

    // Inside handleLogin function in Login.jsx
if (data) {
  if (data.password === password) {
    localStorage.setItem("authToken", "yourAuthToken"); // Store auth token on successful login
    localStorage.setItem("neu_email", email); // Store the email to use as username
    setMessage('Login successful!');
    navigate('/dashboard'); // Navigate to the main dashboard
  } else {
    setMessage('Error: Incorrect password.');
  }
}
  };

  return (
    <div className="login-container">
      <img src={coverlogo} alt="Logo" className="logo" />
      <div className="wrapper">
        <form className="login-form" onSubmit={handleLogin}>
          <h1 className="title">Welcome to StudyHive! 📚</h1>
          <div className="input-box">
            <input
              type="email"
              placeholder="NEU Email 📧"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password 🔒"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
          <p>{message && <span>{message}</span>}</p>
          <p className="link-text">
            Don't have an account? <Link to="/create-account">Create one here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
