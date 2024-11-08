// DatabasePage.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import { supabase } from './supabaseClient';

const DatabasePage = () => {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [neuEmail, setNeuEmail] = useState('');
  const [courseNumber, setCourseNumber] = useState('');
  const [status, setStatus] = useState('loading'); // Status: 'loading', 'success', 'error'

  // Fetch students from the database on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from('userData')
        .select('id, name, neu_email, course_number');

      if (error) {
        console.error("Error loading data:", error);
        setStatus('error'); // Set status to red
      } else {
        setStudents(data);
        setStatus(data.length > 0 ? 'success' : 'error'); // Green if data is present, red otherwise
      }
    };

    fetchStudents();
  }, []);

  // Add a new student to the database and update the list
  const handleAddStudent = async (e) => {
    e.preventDefault();

    // Check for duplicate email
    if (students.find((student) => student.neu_email === neuEmail)) {
      alert('Error: The email already exists.');
      return;
    }

    // Insert the new student into the Supabase database
    const { data, error } = await supabase
      .from('userData')
      .insert([{ name, neu_email: neuEmail, course_number: courseNumber }]);

    if (error) {
      console.error("Error adding student:", error.message);
    } else {
      setStudents((prev) => [...prev, data[0]]);
      setName('');
      setNeuEmail('');
      setCourseNumber('');
    }
  };

  // Delete a student by email
  const handleDeleteStudent = async (email) => {
    const { error } = await supabase
      .from('userData')
      .delete()
      .eq('neu_email', email);

    if (error) {
      console.error("Error deleting student:", error.message);
    } else {
      setStudents((prev) => prev.filter((student) => student.neu_email !== email));
    }
  };

  return (
    <div className="databasePage">
      {/* Status indicator box */}
      <div
        className="status-indicator"
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '15px',
          height: '15px',
          borderRadius: '50%',
          backgroundColor: status === 'success' ? 'green' : 'red',
        }}
      ></div>

      {/* Student input and list management */}
      <h1>Student Database</h1>
      <form onSubmit={handleAddStudent}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="NEU Email"
          value={neuEmail}
          onChange={(e) => setNeuEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Course Number"
          value={courseNumber}
          onChange={(e) => setCourseNumber(e.target.value)}
          required
        />
        <button type="submit">Add Student</button>
      </form>

      <h2>Students List</h2>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            {student.name} - {student.neu_email} - {student.course_number}
            <button onClick={() => handleDeleteStudent(student.neu_email)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DatabasePage;
