import React, { useState, useEffect } from "react";
import axios from "axios";
import "./timeLogger.css";
import Clock from "./Clock.js";

const Timelogger = () => {
  const [employeeName, setEmployeeName] = useState("");
  const [logType, setLogType] = useState("Login Time");
  const [logTime, setLogTime] = useState("");
  const [comment, setComment] = useState("");
  const [logs, setLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(""); // Keep date input
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setEmployeeName(storedUser.name);
    }
  }, []);

  useEffect(() => {
    if (employeeName) {
      fetchLogs();
    }
  }, [employeeName]);

  useEffect(() => {
    // Get Alabama date and set it in selectedDate field
    const updateDate = () => {
      const options = { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" };
      const formattedDate = new Intl.DateTimeFormat("en-CA", options).format(new Date()); // Format: YYYY-MM-DD
      setSelectedDate(formattedDate);
    }; // 

    updateDate();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/logs`, {
        params: { employeeName },
      });
      setLogs(response.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const handleSubmit = async () => {
    if (!logTime || !selectedDate) {
      alert("Please provide Log Time and Date.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));

    try {
      await axios.post(
        `${API_BASE_URL}/logs`,
        {
          date: selectedDate, // Use Alabama date (editable)
          [logType]: logTime,
          comment,
        },
        {
          headers: {
            "user-email": storedUser.email,
          },
        }
      );

      alert("Time log submitted successfully!");
      fetchLogs();
    } catch (error) {
      console.error("Error submitting log:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Welcome, {employeeName} 👋</h1>
      <div className="space-y-4">
        <input type="text" value={employeeName} readOnly className="border p-2 w-full bg-gray-100" />

        {/* Date Input - Pre-filled with Alabama date  type= date*/}
        <input 
          readOnly
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)} 
          className="border p-2 w-full" 
        />

        <select value={logType} onChange={(e) => setLogType(e.target.value)} className="border p-2 w-full">
          <option>Login Time</option>
          <option>Dinner Break - Start Time</option>
          <option>Dinner Break - End Time</option>
          <option>Logout Time</option>
          <option>Short Break 1 Start</option>
          <option>Short Break 1 End</option>
          <option>Short Break 2 Start</option>
          <option>Short Break 2 End</option>
          <option>Short Break 3 Start</option>
          <option>Short Break 3 End</option>
        </select>

        <input type="time" value={logTime} onChange={(e) => setLogTime(e.target.value)} className="border p-2 w-full" />

        <input type="text" placeholder="Comment" value={comment} onChange={(e) => setComment(e.target.value)} className="border p-2 w-full" />

        <button onClick={handleSubmit} className="submitButton">
          Submit
        </button>
      </div>

      <h2 className="text-lg font-bold mt-6">Time Logs</h2>
      <div className="table-wrap">
        <table className="w-full border mt-2 table">
          <thead className="thead-primary">
            <tr>
              <th>Date</th>
              <th>Login</th>
              <th>Dinner Break Start</th>
              <th>Dinner Break End</th>
              <th>Logout</th>
              <th>Short Break 1 Start</th>
              <th>Short Break 1 End</th>
              <th>Short Break 2 Start</th>
              <th>Short Break 2 End</th>
              <th>Short Break 3 Start</th>
              <th>Short Break 3 End</th>
              <th>Total Login Hrs</th>
              <th>Break Duration</th>
              <th>Actual Login Hrs</th>
              <th>Admin Hrs</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td>{log.date}</td>
                <td>{log.loginTime || "-"}</td>
                <td>{log.dinnerStartTime || "-"}</td>
                <td>{log.dinnerEndTime || "-"}</td>
                <td>{log.logoutTime || "-"}</td>
                <td>{log.shortBreak1Start || "-"}</td>
                <td>{log.shortBreak1End || "-"}</td>
                <td>{log.shortBreak2Start || "-"}</td>
                <td>{log.shortBreak2End || "-"}</td>
                <td>{log.shortBreak3Start || "-"}</td>
                <td>{log.shortBreak3End || "-"}</td>
                <td>{log.totalLoginHours || "-"}</td>
                <td>{log.breakDuration || "-"}</td>
                <td>{log.actualLoginHours || "-"}</td>
                <td>{log.adminLoginHours || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Clock />
    </div>
  );
};

export default Timelogger;
