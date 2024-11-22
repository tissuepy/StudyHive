import React, { useState, useEffect } from 'react';
import './CommonStyles.css';
import coverlogo from './assets/coverlogo.png';
import { supabase } from './supabaseClient';

const MatchPage = () => {
  const [matches, setMatches] = useState([]);
  const loggedInEmail = localStorage.getItem('neu_email');

  const fetchMatches = async () => {
    const { data, error } = await supabase.from('userData').select('*');

    if (!error && data) {
      const user = data.find((user) => user.neu_email === loggedInEmail);
      const userClass = user.course_number;
      const userTime = user.available_time;

      const results = data
        .filter(
          (match) =>
            match.course_number === userClass &&
            match.neu_email !== loggedInEmail &&
            match.available_time &&
            calculateOverlap(userTime, match.available_time) >= 60
        )
        .map((match) => ({
          name: match.name,
          email: match.neu_email,
          overlapHours: calculateOverlap(userTime, match.available_time) / 60,
        }))
        .sort((a, b) => b.overlapHours - a.overlapHours);

      setMatches(results);
    }
  };

  const calculateOverlap = (time1, time2) => {
    const [start1, end1] = time1.map((t) => parseTime(t));
    const [start2, end2] = time2.map((t) => parseTime(t));
    return Math.max(0, Math.min(end1, end2) - Math.max(start1, start2));
  };

  const parseTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  useEffect(() => {
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
