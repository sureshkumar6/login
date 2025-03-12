import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminTimeLogger = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [logType, setLogType] = useState("Login Time");
  const [logTime, setLogTime] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/employees`);
        setEmployees(response.data);
      } catch (err) {
        setError("Error fetching employees");
        console.error("Error fetching employees:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      fetchLogs();
    }
  }, [selectedEmployee]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/logs`, {
        params: { employeeName: selectedEmployee },
      });
      setLogs(response.data);
    } catch (err) {
      setError("Error fetching logs");
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const logTypeMap = {
    "Login Time": "loginTime",
    "Dinner Break - Start Time": "dinnerStartTime",
    "Dinner Break - End Time": "dinnerEndTime",
    "Logout Time": "logoutTime",
    "Short Break 1 Start": "shortBreak1Start",
    "Short Break 1 End": "shortBreak1End",
    "Short Break 2 Start": "shortBreak2Start",
    "Short Break 2 End": "shortBreak2End",
    "Short Break 3 Start": "shortBreak3Start",
    "Short Break 3 End": "shortBreak3End",
  };

  const handleSubmit = async () => {
    if (!selectedEmployee || !selectedDate || !logTime) {
      alert("Please select an employee, date, and log time.");
      return;
    }

    if (!logTypeMap[logType]) {
      console.error("Invalid logType received:", logType);
      return;
    }

    const requestData = {
      employeeName: selectedEmployee,
      date: selectedDate,
      logType,
      [logTypeMap[logType]]: logTime,
    };

    try {
      const response = await axios.put(`${API_BASE_URL}/logs`, requestData);
      alert("Log updated successfully!");
      fetchLogs();
    } catch (err) {
      console.error("Error updating log:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Admin Time Logger</h1>

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4 adminLogger">
        {/* Employee Dropdown */}
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp.name}>{emp.name}</option>
          ))}
        </select>

        {/* Date Picker */}
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 w-full"
        />

        {/* Log Type Dropdown */}
        <select
          value={logType}
          onChange={(e) => setLogType(e.target.value)}
          className="border p-2 w-full"
        >
          {Object.keys(logTypeMap).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        {/* Time Picker */}
        <input
          type="time"
          value={logTime}
          onChange={(e) => setLogTime(e.target.value)}
          className="border p-2 w-full"
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </div>

      {/* Loading State */}
      {loading && <p className="mt-4 text-center">Loading...</p>}

      {/* Display Logs */}
      {logs.length > 0 && (
        <>
          <h2 className="text-lg font-bold mt-6">Logs for {selectedEmployee}</h2>
          <div className="table-wrap overflow-x-auto">
            <table className="w-full border mt-2 table-auto">
              <thead className="thead-primary bg-gray-200">
                <tr>
                  {[
                    "Date", "Login", "Dinner Break Start", "Dinner Break End", "Logout",
                    "Short Break 1 Start", "Short Break 1 End", "Short Break 2 Start", "Short Break 2 End",
                    "Short Break 3 Start", "Short Break 3 End", "Total Login Hrs", "Break Duration",
                    "Actual Login Hrs", "Admin Hrs"
                  ].map((header) => (
                    <th key={header} className="border px-2 py-1">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
  {logs.map((log) => (
    <React.Fragment key={log._id}>
      <tr>
        <td className="border px-2 py-1">{log.date}</td>
        <td className="border px-2 py-1">{log.loginTime || "-"}</td>
        <td className="border px-2 py-1">{log.dinnerStartTime || "-"}</td>
        <td className="border px-2 py-1">{log.dinnerEndTime || "-"}</td>
        <td className="border px-2 py-1">{log.logoutTime || "-"}</td>
        <td className="border px-2 py-1">{log.shortBreak1Start || "-"}</td>
        <td className="border px-2 py-1">{log.shortBreak1End || "-"}</td>
        <td className="border px-2 py-1">{log.shortBreak2Start || "-"}</td>
        <td className="border px-2 py-1">{log.shortBreak2End || "-"}</td>
        <td className="border px-2 py-1">{log.shortBreak3Start || "-"}</td>
        <td className="border px-2 py-1">{log.shortBreak3End || "-"}</td>
        <td className="border px-2 py-1">{log.totalLoginHours || "-"}</td>
        <td className="border px-2 py-1">{log.breakDuration || "-"}</td>
        <td className="border px-2 py-1">{log.actualLoginHours || "-"}</td>
        <td className="border px-2 py-1">{log.adminLoginHours || "-"}</td>
      </tr>

      {/* ✅ Display Change History */}
      {log.modifications?.length > 0 && (
        <tr>
          <td colSpan="15" className="border px-2 py-1 bg-gray-100">
            <strong>Change History:</strong>
            <ul className="text-sm list-disc pl-4">
              {log.modifications.map((mod, index) => (
                <li key={index}>
                  🔹 <span className="font-semibold">{mod.field}</span>: 
                  <span className="text-red-500"> ⛔ {mod.oldTime} </span> → 
                  <span className="text-green-500"> ✅ {mod.newTime} </span> 
                  <span className="text-gray-500 text-xs"> (Modified on {new Date(mod.modifiedAt).toLocaleString()})</span>
                </li>
              ))}
            </ul>
          </td>
        </tr>
      )}
    </React.Fragment>
  ))}
</tbody>

            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminTimeLogger;
