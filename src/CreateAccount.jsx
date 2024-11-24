// CreateAccount.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import coverlogo from './assets/coverlogo.png';
import { Link } from 'react-router-dom';
import { supabase } from './supabaseClient.js';

const CreateAccount = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [nextId, setNextId] = useState(null); // New state for the next ID
  const navigate = useNavigate();

  // Fetch the next available ID when the component mounts
  useEffect(() => {
    document.title = 'Create Account';
    const fetchNextId = async () => {
      try {
        // Get the highest existing ID in the userData table
        const { data, error } = await supabase
          .from('userData')
          .select('id')
          .order('id', { ascending: false })
          .limit(1);

        if (error) {
          console.error("Error fetching next ID:", error.message);
          setMessage("An error occurred while setting up the form.");
        } else {
          // Set next ID to the highest existing ID + 1, or 1 if the table is empty
          setNextId(data.length > 0 ? data[0].id + 1 : 1);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setMessage("An unexpected error occurred while setting up the form.");
      }
    };

    fetchNextId();
  }, []);

  // Handle account creation
  const handleCreateAccount = async (e) => {
    e.preventDefault();

    // Check if ID has been successfully set
    if (nextId === null) {
      setMessage("Unable to create account. Please try again later.");
      return;
    }

    try {
      // Check if the email already exists in the userData table
      const { data: existingUser, error: checkError } = await supabase
        .from('userData')
        .select('neu_email')
        .eq('neu_email', email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Error checking for existing email:", checkError.message);
        setMessage("An unexpected error occurred. Please try again.");
        return;
      }

      if (existingUser) {
        setMessage('Error: Account with this email already exists.');
        return;
      }

      // Insert the new user with neu_email, password, name, and the next ID
      const { error: insertError } = await supabase
        .from('userData')
        .insert([{ id: nextId, neu_email: email, password, name }]);

      if (insertError) {
        console.error("Error creating account:", insertError.message);
        setMessage('Error: Could not create account.');
      } else {
        setMessage('Account created successfully!');
        setName('');
        setEmail('');
        setPassword('');
        navigate('/login'); // Navigate to the login page upon successful creation
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <img src={coverlogo} alt="Logo" className="logo" />
      <div className="wrapper">
        <form className="login-form" onSubmit={handleCreateAccount}>
          <h1 className="title">Create an Account</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <button type="submit" className="login-button">Create Account</button>
          <p>{message && <span>{message}</span>}</p>
          <p className="link-text">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
