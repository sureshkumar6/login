import React, { useState, useEffect } from "react";
import axios from "axios";
import "./timeLogger.css";

const Timelogger = () => {
  const [employeeName, setEmployeeName] = useState("");
  const [logType, setLogType] = useState("Login Time");
  const [logTime, setLogTime] = useState("");
  const [comment, setComment] = useState("");
  const [logs, setLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

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

  const fetchLogs = async () => {
    try {
      const response = await axios.get("http://localhost:6060/logs", {
        params: { employeeName },
      });
      setLogs(response.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const calculateHours = (start, end) => {
    if (!start || !end) return "0";
  
    const startTime = new Date(`2023-01-01T${start}`);
    let endTime = new Date(`2023-01-01T${end}`);
  
    if (endTime < startTime) {
      endTime.setDate(endTime.getDate() + 1);
    }
  
    const diff = (endTime - startTime) / 1000 / 60; // Convert milliseconds to minutes
    return diff > 5 ? (diff / 60).toFixed(2) + " hrs" : "0 hrs"; // Only count if > 5 minutes
  };

  const handleSubmit = async () => {
    if (!logTime || !selectedDate) {
      alert("Please provide Log Time and select a Date.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));

    try {
      await axios.post(
        "http://localhost:6060/logs",
        {
          date: selectedDate,
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
        
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border p-2 w-full" />

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
      <td>{calculateHours(log.loginTime, log.logoutTime)}</td>
      <td>{calculateHours(log.dinnerStartTime, log.dinnerEndTime)}</td>
      <td>
        {(
          parseFloat(calculateHours(log.loginTime, log.logoutTime)) -
          parseFloat(calculateHours(log.dinnerStartTime, log.dinnerEndTime))
        ).toFixed(2) + " hrs"}
      </td>
    </tr>
  ))}
</tbody>
      </table>
      </div>
    </div>
  );
};

export default Timelogger;



//server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Timelog from "./db/timelog.js"; // Import your model
import usersModel from "./db/user.js";


const app = express();
app.use(express.json());
app.use(cors());

// 🔹 Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/timelogger", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 🔹 Get logs by employeeName
app.get("/logs", async (req, res) => {
  try {
    const { employeeName } = req.query;

    if (!employeeName) {
      return res.status(400).json({ error: "Employee name is required" });
    }

    const logs = await Timelog.find({ employeeName });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// app.post("/logs", async (req, res) => {
//   try {
//     const { date, comment, ...logTimes } = req.body;
//     const userEmail = req.headers["user-email"];

//     if (!date || !userEmail || Object.keys(logTimes).length === 0) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const user = await usersModel.findOne({ email: userEmail });
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const employeeName = user.name;
//     let logEntry = await Timelog.findOne({ date, employeeName });

//     const fieldMap = {
//       "Login Time": "loginTime",
//       "Dinner Break - Start Time": "dinnerStartTime",
//       "Dinner Break - End Time": "dinnerEndTime",
//       "Logout Time": "logoutTime",
//       "Short Break 1 Start": "shortBreak1Start",
//       "Short Break 1 End": "shortBreak1End",
//       "Short Break 2 Start": "shortBreak2Start",
//       "Short Break 2 End": "shortBreak2End",
//       "Short Break 3 Start": "shortBreak3Start",
//       "Short Break 3 End": "shortBreak3End",
//     };

//     if (logEntry) {
//       for (const [key, value] of Object.entries(logTimes)) {
//         const field = fieldMap[key];

//         if (logEntry[field]) {
//           return res.status(400).json({
//             error: `Time already entered for ${key}. Please contact admin to update.`,
//           });
//         }
//         logEntry[field] = value;
//       }
//     } else {
//       logEntry = new Timelog({ date, employeeName, comment });

//       for (const [key, value] of Object.entries(logTimes)) {
//         logEntry[fieldMap[key]] = value;
//       }
//     }

//     await logEntry.save();
//     res.json({ message: "Time log submitted successfully!" });
//   } catch (error) {
//     console.error("Error submitting log:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.post("/logs", async (req, res) => {
  try {
    const { date, comment, ...logTimes } = req.body;
    const userEmail = req.headers["user-email"];

    if (!date || !userEmail || Object.keys(logTimes).length === 0) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await usersModel.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const employeeName = user.name;
    let logEntry = await Timelog.findOne({ date, employeeName });

    const fieldMap = {
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

    if (logEntry) {
      for (const [key, value] of Object.entries(logTimes)) {
        const field = fieldMap[key];

        if (logEntry[field]) {
          return res.status(400).json({
            error: `Time already entered for ${key}. Please contact admin to update.`,
          });
        }
        logEntry[field] = value;
      }
    } else {
      logEntry = new Timelog({ date, employeeName, comment });

      for (const [key, value] of Object.entries(logTimes)) {
        logEntry[fieldMap[key]] = value;
      }
    }

    // 🔹 Calculate Total Login Hrs, Break Duration, and Actual Login Hrs
    const calculateHours = (start, end) => {
      if (!start || !end) return 0;
      const startTime = new Date(`2023-01-01T${start}`);
      let endTime = new Date(`2023-01-01T${end}`);

      if (endTime < startTime) {
        endTime.setDate(endTime.getDate() + 1);
      }

      return (endTime - startTime) / 1000 / 60 / 60; // Convert ms to hours
    };

    const totalLoginHours = calculateHours(logEntry.loginTime, logEntry.logoutTime);
    const breakDuration = calculateHours(logEntry.dinnerStartTime, logEntry.dinnerEndTime) +
                          calculateHours(logEntry.shortBreak1Start, logEntry.shortBreak1End) +
                          calculateHours(logEntry.shortBreak2Start, logEntry.shortBreak2End) +
                          calculateHours(logEntry.shortBreak3Start, logEntry.shortBreak3End);

    const actualLoginHours = (totalLoginHours - breakDuration).toFixed(2);

    logEntry.totalLoginHours = `${totalLoginHours.toFixed(2)} hrs`;
    logEntry.breakDuration = `${breakDuration.toFixed(2)} hrs`;
    logEntry.actualLoginHours = `${actualLoginHours} hrs`;

    await logEntry.save();
    res.json({ message: "Time log submitted successfully!" });
  } catch (error) {
    console.error("Error submitting log:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🔹 Check if the email already exists
    const existingUser = await usersModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // 🔹 Create a new user if email is not found
    let user = new usersModel({ name, email, password });
    let result = await user.save();
    res.json(result);
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

  
app.post('/login', async (req, resp) => {
  // let user = await usersModel.findOne(req.body).select("-password")
  if (req.body.email && req.body.password) {
      let user = await usersModel.findOne(req.body).select("-password")
      if (user) {
          resp.send(user)
      } else {
          resp.send({ result: "user not found" })
      }
  } else {
      resp.send({ result: "outside user not found" })
  }

})
app.listen(6060, () => {
  console.log("Server running on port 6060");
});
