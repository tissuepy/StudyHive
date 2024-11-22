import React, { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './CommonStyles.css';
import coverlogo from './assets/coverlogo.png';
import { supabase } from './supabaseClient';

const DatabasePage = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [courseNumber, setCourseNumber] = useState('');
  const [timeRange, setTimeRange] = useState([600, 1020]); // Default time range (10:00 AM to 5:00 PM)

  const loggedInEmail = localStorage.getItem('neu_email');

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from('userData')
        .select('*')
        .eq('neu_email', loggedInEmail)
        .single();

      if (data) {
        setName(data.location || '');
        setCourseNumber(data.course_number || '');
        setLocation(data.location || '');
        if (data.available_time) {
          const [start, end] = data.available_time.map((t) => parseInt(t.split(':')[0]) * 60 + parseInt(t.split(':')[1]));
          setTimeRange([start, end]);
        }
      }
      
    };
    fetchUserData();
  }, [loggedInEmail]);

  const handleUpdate = async () => {
    const formattedTime = timeRange.map((t) => {
      const hours = Math.floor(t / 60).toString().padStart(2, '0');
      const minutes = (t % 60).toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    });

    const { error } = await supabase
      .from('userData')
      .update({ location, name, course_number: courseNumber, available_time: formattedTime })
      .eq('neu_email', loggedInEmail);

    if (!error) alert('Details updated successfully!');
  };

  return (
    <div className="container">
      <img src={coverlogo} alt="Logo" className="logo" />
      <h1>Enter Your Data</h1>

      <div className="time-slider">
        <h2>Time</h2>
        <Slider
          range
          min={0}
          max={1440} // Minutes in a day
          step={15}
          defaultValue={timeRange}
          onChange={(value) => setTimeRange(value)}
          tipFormatter={(value) => `${Math.floor(value / 60).toString().padStart(2, '0')}:${(value % 60).toString().padStart(2, '0')}`}
        />
      </div>
      {/* 
      <div className="input-box">
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      */}
      <div className="input-box">
        <label>Location:</label> 
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>

      <div className="input-box">
        <label>Class:</label>
        <input type="text" value={courseNumber} onChange={(e) => setCourseNumber(e.target.value)} />
      </div>

      <div className="action-buttons">
        <button onClick={handleUpdate}>Update</button>
        <button onClick={() => window.history.back()}>Back</button>
      </div>
    </div>
  );
};

export default DatabasePage;
