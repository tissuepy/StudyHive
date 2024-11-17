import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const DatabasePage = () => {
  const [users, setUsers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch users from Supabase
  const fetchUsers = async () => {
    console.log("Fetching users from Supabase...");
    const { data, error } = await supabase.from("userData").select("neu_email, available_time, course_number");

    if (error) {
      console.error("Error fetching users:", error);
      setMessage("Error fetching user data.");
      return [];
    }

    console.log("Fetched users:", data);
    return data.map((user) => ({
      ...user,
      available_time: normalizeAvailableTime(user.available_time),
    }));
  };

  // Normalize available_time to ["start", "end"]
  const normalizeAvailableTime = (availableTime) => {
    if (!availableTime) return null;

    if (Array.isArray(availableTime) && availableTime.length === 2) {
      // Already in correct format
      return availableTime;
    }

    if (Array.isArray(availableTime) && availableTime.length === 1 && typeof availableTime[0] === "string") {
      const splitTime = availableTime[0].split(",");
      if (splitTime.length === 2) {
        return splitTime.map((time) => time.trim()); // Trim and return as array
      }
    }

    console.warn("Invalid available_time format:", availableTime);
    return null; // Return null if format is invalid
  };

  // Parse time strings into minutes
  const parseTime = (time) => {
    if (!time || typeof time !== "string" || !time.includes(":")) return NaN;
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes; // Convert time to total minutes
  };

  // Validate and calculate overlap in minutes between two time ranges
  const calculateTimeOverlap = (timeRange1, timeRange2) => {
    if (!Array.isArray(timeRange1) || timeRange1.length !== 2 || !Array.isArray(timeRange2) || timeRange2.length !== 2) {
      console.warn("Invalid time range format:", timeRange1, timeRange2);
      return 0;
    }

    const [start1, end1] = timeRange1.map(parseTime);
    const [start2, end2] = timeRange2.map(parseTime);

    if (isNaN(start1) || isNaN(end1) || isNaN(start2) || isNaN(end2)) {
      console.warn("Invalid time values in ranges:", timeRange1, timeRange2);
      return 0;
    }

    const overlapStart = Math.max(start1, start2);
    const overlapEnd = Math.min(end1, end2);

    return Math.max(0, overlapEnd - overlapStart); // Returns 0 if no overlap
  };

  // Main matching logic
  const calculateMatches = (users) => {
    console.log("Calculating matches...");
    const results = [];

    // Compare all pairs of users
    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        const user1 = users[i];
        const user2 = users[j];

        // Skip if course numbers are not the same
        if (user1.course_number !== user2.course_number) continue;

        // Parse available_time arrays into usable ranges
        const timeRange1 = user1.available_time; // ["start", "end"]
        const timeRange2 = user2.available_time; // ["start", "end"]

        const overlapMinutes = calculateTimeOverlap(timeRange1, timeRange2);

        // Skip if overlap is less than 60 minutes
        if (overlapMinutes < 60) continue;

        // Add match with overlap in hours
        results.push({
          user1: user1.neu_email,
          user2: user2.neu_email,
          overlapHours: (overlapMinutes / 60).toFixed(1), // Convert to hours and round
        });
      }
    }

    console.log("All Matches:", results);
    return results;
  };

  // Fetch and process matches
  const handleCalculateMatches = async () => {
    setLoading(true);
    setMessage("");

    try {
      const users = await fetchUsers();
      const finalMatches = calculateMatches(users);
      setMatches(finalMatches);
      setMessage("Matches calculated successfully!");
    } catch (error) {
      console.error("Error during match calculation:", error);
      setMessage("Error calculating matches.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCalculateMatches(); // Automatically calculate matches on mount
  }, []);

  return (
    <div className="DatabasePage">
      <h1>Database Page</h1>
      <button onClick={handleCalculateMatches} disabled={loading}>
        {loading ? "Calculating Matches..." : "Calculate Matches"}
      </button>
      {message && <p>{message}</p>}
      <div>
        <h2>Match Results</h2>
        {matches.length > 0 ? (
          <ul>
            {matches.map((match, index) => (
              <li key={index}>
                {match.user1} and {match.user2} with {match.overlapHours} hours of overlap
              </li>
            ))}
          </ul>
        ) : (
          <p>No matches found.</p>
        )}
      </div>
    </div>
  );
};

export default DatabasePage;
