import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const DatabasePage = () => {
  // User details (for updating)
  const [name, setName] = useState("");
  const [courseNumber, setCourseNumber] = useState("");
  const [availableTime, setAvailableTime] = useState([]); // Array of strings
  const [timeInput, setTimeInput] = useState(""); // Temporary input for new time slots
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Matching logic
  const [users, setUsers] = useState([]);
  const [matches, setMatches] = useState([]);
  const loggedInEmail = localStorage.getItem("neu_email");

  // Fetch user data for updating
  useEffect(() => {
    if (!loggedInEmail) {
      setMessage("You must be logged in to view this page.");
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("userData")
        .select("name, course_number, available_time")
        .eq("neu_email", loggedInEmail)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
        setMessage("Error fetching your details.");
      } else if (data) {
        setName(data.name || "");
        setCourseNumber(data.course_number || "");
        setAvailableTime(data.available_time || []);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [loggedInEmail]);

  // Add a new time slot
  const handleAddTime = () => {
    if (timeInput.trim()) {
      setAvailableTime((prev) => [...prev, timeInput.trim()]);
      setTimeInput(""); // Clear input
    }
  };

  // Remove a time slot
  const handleRemoveTime = (timeToRemove) => {
    setAvailableTime((prev) => prev.filter((time) => time !== timeToRemove));
  };

  // Update user data
  const handleUpdateUserData = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("userData")
      .update({
        name,
        course_number: courseNumber,
        available_time: availableTime,
      })
      .eq("neu_email", loggedInEmail);

    if (error) {
      console.error("Error updating user data:", error);
      setMessage("Failed to update your details.");
    } else {
      setMessage("Your details have been updated successfully!");
    }
  };

  // Fetch all users for matching
  const fetchUsers = async () => {
    console.log("Fetching all users...");
    const { data, error } = await supabase.from("userData").select("neu_email, name, available_time, course_number");

    if (error) {
      console.error("Error fetching all users:", error);
      setMessage("Error fetching all users.");
      return [];
    }

    return data.map((user) => ({
      ...user,
      available_time: normalizeAvailableTime(user.available_time),
    }));
  };

  // Normalize available_time to ["start", "end"]
  const normalizeAvailableTime = (availableTime) => {
    if (!availableTime) return null;

    if (Array.isArray(availableTime) && availableTime.length === 2) {
      return availableTime;
    }

    if (Array.isArray(availableTime) && availableTime.length === 1 && typeof availableTime[0] === "string") {
      const splitTime = availableTime[0].split(",");
      if (splitTime.length === 2) {
        return splitTime.map((time) => time.trim());
      }
    }

    console.warn("Invalid available_time format:", availableTime);
    return null;
  };

  // Parse time strings into minutes
  const parseTime = (time) => {
    if (!time || typeof time !== "string" || !time.includes(":")) return NaN;
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
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

  // Calculate matches
  const calculateMatches = async () => {
    setLoading(true);
    setMessage("");

    try {
      const allUsers = await fetchUsers();
      const loggedInUser = allUsers.find((user) => user.neu_email === loggedInEmail);

      if (!loggedInUser) {
        setMessage("Could not find your details for matching.");
        setLoading(false);
        return;
      }

      const results = [];

      for (const user of allUsers) {
        if (user.neu_email === loggedInEmail) continue; // Skip logged-in user

        // Skip if course numbers are not the same
        if (loggedInUser.course_number !== user.course_number) continue;

        // Calculate overlap in minutes
        const overlapMinutes = calculateTimeOverlap(loggedInUser.available_time, user.available_time);

        if (overlapMinutes >= 60) {
          results.push({
            user1: loggedInUser.name,
            user2: user.name,
            user2Email: user.neu_email,
            overlapHours: (overlapMinutes / 60).toFixed(1), // Convert to hours
          });
        }
      }

      results.sort((a, b) => b.overlapHours - a.overlapHours); // Sort by overlap hours
      setMatches(results);
      setMessage("Matches calculated successfully!");
    } catch (error) {
      console.error("Error calculating matches:", error);
      setMessage("Error calculating matches.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="databasePage">
      <h1>Update Your Details</h1>

      {loading && <p>Loading...</p>}

      {!loading && (
        <>
          <form onSubmit={handleUpdateUserData}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Course Number:</label>
              <input
                type="text"
                placeholder="Course Number"
                value={courseNumber}
                onChange={(e) => setCourseNumber(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Available Times:</label>
              <ul>
                {availableTime.map((time, index) => (
                  <li key={index}>
                    {time}{" "}
                    <button type="button" onClick={() => handleRemoveTime(time)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <input
                type="text"
                placeholder="Add Time Slot (e.g., 12:00-14:00)"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
              />
              <button type="button" onClick={handleAddTime}>
                Add Time
              </button>
            </div>

            <button type="submit">Save Changes</button>
          </form>

          <hr />

          <h2>Calculate Matches</h2>
          <button onClick={calculateMatches} disabled={loading}>
            {loading ? "Calculating Matches..." : "Find Matches"}
          </button>

          {message && <p>{message}</p>}

          <div>
            <h2>Your Matches</h2>
            {matches.length > 0 ? (
              <ul>
                {matches.map((match, index) => (
                  <li key={index}>
                    {match.user2} ({match.user2Email}) with {match.overlapHours} hours of overlap
                  </li>
                ))}
              </ul>
            ) : (
              <p>No matches found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DatabasePage;
