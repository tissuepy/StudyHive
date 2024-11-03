// Import dependencies
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

// Import Components
import Login from './Login'; // Ensure this is in your project or import other needed components
import CreateAccount from './CreateAccount';

// Main App Component
function App() {
  // State Management
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [neuEmail, setNeuEmail] = useState('');
  const [courseNumber, setCourseNumber] = useState('');
  const [count, setCount] = useState(0);

  // Handle adding a student
  const handleAddStudent = (e) => {
    e.preventDefault();

    // Check for duplicate email
    if (students.find((student) => student.neu_email === neuEmail)) {
      alert('Error: The email already exists.');
      return;
    }

    const newStudent = {
      id: students.length + 1,
      name,
      neu_email: neuEmail,
      course_number: courseNumber,
    };

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

  // Render Function
  return (
    <Router>
      <div className="header">
        <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src="./assets/react.svg" className="logo react" alt="React logo" />
        </a>
        <h1>Vite + React</h1>
      </div>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      {/* Login component route */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
      </Routes>

      {/* Student input and list management */}
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
    </Router>
  );
}

export default App;
