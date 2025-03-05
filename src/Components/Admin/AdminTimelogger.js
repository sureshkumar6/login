// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const AdminTimeLogger = () => {
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";

//   // Fetch employees on mount
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(`${API_BASE_URL}/employees`);
//         setEmployees(response.data);
//       } catch (error) {
//         console.error("Error fetching employees:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmployees();
//   }, []);

//   // Fetch logs when employee is selected
//   useEffect(() => {
//     if (selectedEmployee) {
//       fetchLogs();
//     }
//   }, [selectedEmployee]);

//   const fetchLogs = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${API_BASE_URL}/logs`, {
//         params: { employeeName: selectedEmployee },
//       });
//       setLogs(response.data);
//     } catch (error) {
//       console.error("Error fetching logs:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-4">Admin Time Logger</h1>

//       <div className="space-y-4">
//         {/* Select Employee */}
//         <select
//           value={selectedEmployee}
//           onChange={(e) => setSelectedEmployee(e.target.value)}
//           className="border p-2 w-full"
//         >
//           <option value="">Select Employee</option>
//           {employees.map((emp) => (
//             <option key={emp._id} value={emp.name}>
//               {emp.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Loading State */}
//       {loading && <p className="mt-4 text-center">Loading...</p>}

//       {/* Display Logs */}
//       {logs.length > 0 && (
//         <>
//           <h2 className="text-lg font-bold mt-6">
//             Logs for {selectedEmployee}
//           </h2>
//           <div className="table-wrap overflow-x-auto">
//             <table className="w-full border mt-2 table-auto">
//               <thead className="thead-primary bg-gray-200">
//                 <tr>
//                   <th className="border px-2 py-1">Date</th>
//                   <th className="border px-2 py-1">Login</th>
//                   <th className="border px-2 py-1">Dinner Break Start</th>
//                   <th className="border px-2 py-1">Dinner Break End</th>
//                   <th className="border px-2 py-1">Logout</th>
//                   <th className="border px-2 py-1">Short Break 1 Start</th>
//                   <th className="border px-2 py-1">Short Break 1 End</th>
//                   <th className="border px-2 py-1">Short Break 2 Start</th>
//                   <th className="border px-2 py-1">Short Break 2 End</th>
//                   <th className="border px-2 py-1">Short Break 3 Start</th>
//                   <th className="border px-2 py-1">Short Break 3 End</th>
//                   <th className="border px-2 py-1">Total Login Hrs</th>
//                   <th className="border px-2 py-1">Break Duration</th>
//                   <th className="border px-2 py-1">Actual Login Hrs</th>
//                   <th className="border px-2 py-1">Admin Hrs</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {logs.map((log) => (
//                   <tr key={log._id}>
//                     <td className="border px-2 py-1">{log.date}</td>
//                     <td className="border px-2 py-1">{log.loginTime || "-"}</td>
//                     <td className="border px-2 py-1">{log.dinnerStartTime || "-"}</td>
//                     <td className="border px-2 py-1">{log.dinnerEndTime || "-"}</td>
//                     <td className="border px-2 py-1">{log.logoutTime || "-"}</td>
//                     <td className="border px-2 py-1">{log.shortBreak1Start || "-"}</td>
//                     <td className="border px-2 py-1">{log.shortBreak1End || "-"}</td>
//                     <td className="border px-2 py-1">{log.shortBreak2Start || "-"}</td>
//                     <td className="border px-2 py-1">{log.shortBreak2End || "-"}</td>
//                     <td className="border px-2 py-1">{log.shortBreak3Start || "-"}</td>
//                     <td className="border px-2 py-1">{log.shortBreak3End || "-"}</td>
//                     <td className="border px-2 py-1">{log.totalLoginHours || "-"}</td>
//                     <td className="border px-2 py-1">{log.breakDuration || "-"}</td>
//                     <td className="border px-2 py-1">{log.actualLoginHours || "-"}</td>
//                     <td className="border px-2 py-1">{log.adminLoginHours || "-"}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default AdminTimeLogger;

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

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/employees`);
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);
  // Fetch logs when employee is selected
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
    } catch (error) {
      console.error("Error fetching logs:", error);
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
  
    const requestData = {
      employeeName: selectedEmployee,
      date: selectedDate,
      logType: logType,  // ✅ Send logType as well
      [logTypeMap[logType]]: logTime,
    };
    
  
    console.log("Sending PUT request with:", requestData); // Debugging log
    if (!logTypeMap[logType]) {
      console.error("Invalid logType received:", logType);
      return;
    }
    
    try {
      const response = await axios.put(`${API_BASE_URL}/logs`, requestData);
      console.log("Log updated successfully:", response.data);
      alert("Log updated successfully!");
      fetchLogs();
    } catch (error) {
      console.error("Error updating log:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Something went wrong");
    }
  };
  
  
  

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Admin Time Logger</h1>
      <div className="space-y-4">
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

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 w-full"
        />

        <select
          value={logType}
          onChange={(e) => setLogType(e.target.value)}
          className="border p-2 w-full"
        >
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

        <input
          type="time"
          value={logTime}
          onChange={(e) => setLogTime(e.target.value)}
          className="border p-2 w-full"
        />

        <button onClick={handleSubmit} className="submitButton">
          Submit
        </button>
      </div>
      <div>
        {/* Loading State */}
      {loading && <p className="mt-4 text-center">Loading...</p>}

{/* Display Logs */}
{logs.length > 0 && (
  <>
    <h2 className="text-lg font-bold mt-6">
      Logs for {selectedEmployee}
    </h2>
    <div className="table-wrap overflow-x-auto">
      <table className="w-full border mt-2 table-auto">
        <thead className="thead-primary bg-gray-200">
          <tr>
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Login</th>
            <th className="border px-2 py-1">Dinner Break Start</th>
            <th className="border px-2 py-1">Dinner Break End</th>
            <th className="border px-2 py-1">Logout</th>
            <th className="border px-2 py-1">Short Break 1 Start</th>
            <th className="border px-2 py-1">Short Break 1 End</th>
            <th className="border px-2 py-1">Short Break 2 Start</th>
            <th className="border px-2 py-1">Short Break 2 End</th>
            <th className="border px-2 py-1">Short Break 3 Start</th>
            <th className="border px-2 py-1">Short Break 3 End</th>
            <th className="border px-2 py-1">Total Login Hrs</th>
            <th className="border px-2 py-1">Break Duration</th>
            <th className="border px-2 py-1">Actual Login Hrs</th>
            <th className="border px-2 py-1">Admin Hrs</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
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
          ))}
        </tbody>
      </table>
    </div>
  </>
)}
      </div>
    </div>
  );
};

export default AdminTimeLogger;
