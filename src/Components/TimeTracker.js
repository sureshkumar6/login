import React, { useState, useEffect } from "react";
import axios from "axios";

const TimeTracker = () => {
  const [employeeName, setEmployeeName] = useState("");
  const [logType, setLogType] = useState("Login Time");
  const [logTime, setLogTime] = useState("");
  const [comment, setComment] = useState("");
  const [logs, setLogs] = useState([]);
  
  useEffect(() => {
    fetchLogs();
  }, []);
  
  const fetchLogs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/logs", {
        params: { employeeName }
      });
      setLogs(response.data);
    } catch (error) {
      console.error("Error fetching logs", error);
    }
  };

  const handleSubmit = async () => {
    if (!employeeName) {
      alert("Please select an Employee Name.");
      return;
    }
    
    const currentDate = new Date().toLocaleDateString("en-US");
    const existingLog = logs.find(log => log.date === currentDate);
    
    if (existingLog && existingLog[logType]) {
      alert(`Error: Time already entered for ${logType}!`);
      return;
    }
    
    try {
      await axios.post("http://localhost:5000/logs", {
        date: currentDate,
        employeeName,
        logType,
        logTime,
        comment
      });
      alert("Time log submitted successfully!");
      fetchLogs();
    } catch (error) {
      console.error("Error submitting log", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Time Logger</h1>
      <div className="space-y-4">
        <input type="text" placeholder="Employee Name" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} className="border p-2 w-full" />
        <select value={logType} onChange={(e) => setLogType(e.target.value)} className="border p-2 w-full">
          <option>Login Time</option>
          <option>Dinner Break - Start Time</option>
          <option>Dinner Break - End Time</option>
          <option>Logout Time</option>
        </select>
        <input type="time" value={logTime} onChange={(e) => setLogTime(e.target.value)} className="border p-2 w-full" />
        <input type="text" placeholder="Comment" value={comment} onChange={(e) => setComment(e.target.value)} className="border p-2 w-full" />
        <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 w-full">Submit</button>
      </div>
      <h2 className="text-lg font-bold mt-6">Time Logs</h2>
      <table className="w-full border mt-2">
        <thead>
          <tr>
            <th>Date</th>
            <th>Login</th>
            <th>Dinner Start</th>
            <th>Dinner End</th>
            <th>Logout</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td>{log.date}</td>
              <td>{log["Login Time"] || "-"}</td>
              <td>{log["Dinner Break - Start Time"] || "-"}</td>
              <td>{log["Dinner Break - End Time"] || "-"}</td>
              <td>{log["Logout Time"] || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default TimeTracker;
