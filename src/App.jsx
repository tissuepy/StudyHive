// src/App.jsx
import React, { useState } from 'react';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [neuEmail, setNeuEmail] = useState('');
  const [courseNumber, setCourseNumber] = useState('');

  // Handle adding a student
  const handleAddStudent = (e) => {
    e.preventDefault();

    // Check for duplicate email
    if (students.find((student) => student.neu_email === neuEmail)) {
      alert('Error: The email already exists.');
      return;
    }

    const newStudent = { id: students.length + 1, name, neu_email: neuEmail, course_number: courseNumber };

    // Update the students list
    setStudents((prev) => [...prev, newStudent]);

    // Clear input fields
    setName('');
    setNeuEmail('');
    setCourseNumber('');
  };

  // Handle deleting a student
  const handleDeleteStudent = (email) => {
    setStudents((prev) => prev.filter((student) => student.neu_email !== email));
  };

  return (
    <div className="App">
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
}

export default App;
