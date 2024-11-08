// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import coverlogo from './assets/coverlogo.png';
import { Link } from 'react-router-dom';
import { supabase } from './supabaseClient.js';


const Login = () => {
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

    if (data) {
      if (data.password === password) {
        setMessage('Login successful!');
        // Navigate to a dashboard or home page after login
        navigate('/dashboard');
      } else {
        setMessage('Error: Incorrect password.');
      }
    } else {
      setMessage('Error: No account found with this email.');
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
              placeholder="neu_email                                                                                           📧"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password                                                                                            🔒"
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
