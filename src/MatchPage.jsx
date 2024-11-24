import React, { useState, useEffect } from 'react';
import './CommonStyles.css';
import coverlogo from './assets/coverlogo.png';
import { supabase } from './supabaseClient';

const MatchPage = () => {
  const [matches, setMatches] = useState([]);
  const loggedInEmail = localStorage.getItem('neu_email');

  const normalizeAvailableTime = (time) => {
    if (Array.isArray(time)) {
      // Check if the first element is a single string that needs splitting
      if (time.length === 1 && typeof time[0] === "string" && time[0].includes(",")) {
        return time[0].split(",").map((t) => t.trim()); // Split and trim
      }
      return time; // Already in correct format
    }
    if (typeof time === "string") {
      return time.split(",").map((t) => t.trim()); // Split single string into array
    }
    console.warn("Invalid available_time format:", time);
    return null; // Return null for invalid format
  };

  const parseTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes; // Convert time to total minutes
  };

  const calculateOverlap = (time1, time2) => {
    if (!Array.isArray(time1) || !Array.isArray(time2) || time1.length !== 2 || time2.length !== 2) {
      console.warn('Invalid time format:', time1, time2);
      return 0; // No overlap
    }

    const [start1, end1] = time1.map((t) => parseTime(t));
    const [start2, end2] = time2.map((t) => parseTime(t));

    if (isNaN(start1) || isNaN(end1) || isNaN(start2) || isNaN(end2)) {
      console.warn('Invalid parsed times:', { start1, end1, start2, end2 });
      return 0;
    }

    return Math.max(0, Math.min(end1, end2) - Math.max(start1, start2));
  };

  const fetchMatches = async () => {
    const { data, error } = await supabase.from('userData').select('*');

    if (error) {
      console.error("Error fetching users:", error);
      setMatches([]);
      return;
    }

    const user = data.find((user) => user.neu_email === loggedInEmail);
    if (!user) {
      console.error("Logged-in user not found in database.");
      setMatches([]);
      return;
    }

    const userClass = user.course_number;
    const userTime = normalizeAvailableTime(user.available_time);

    const results = data
      .filter(
        (match) =>
          match.course_number === userClass &&
          match.neu_email !== loggedInEmail &&
          normalizeAvailableTime(match.available_time) &&
          calculateOverlap(userTime, normalizeAvailableTime(match.available_time)) >= 60
      )
      .map((match) => ({
        name: match.name,
        email: match.neu_email,
        overlapHours: calculateOverlap(userTime, normalizeAvailableTime(match.available_time)) / 60,
      }))
      .sort((a, b) => b.overlapHours - a.overlapHours);

    setMatches(results);
  };

  useEffect(() => {
    document.title = 'Match Page';
    fetchMatches();
  }, []);

  return (
    <div className="container">
      <img src={coverlogo} alt="Logo" className="logo" />
      <h1>Your Matches</h1>

      <div className="match-results">
        <ul>
          {matches.length > 0 ? (
            matches.map((match, index) => (
              <li key={index}>
                <strong>{match.name}</strong> ({match.email}) - {match.overlapHours.toFixed(1)} hours of overlap
              </li>
            ))
          ) : (
            <p>No matches found.</p>
          )}
        </ul>
      </div>

      <button onClick={() => window.history.back()}>Back</button>
    </div>
  );
};

export default MatchPage;
