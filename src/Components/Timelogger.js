import React, { useState, useEffect } from "react";
import axios from "axios";
import "./timeLogger.css";
import Clock from "./Clock.js";
import { TextField,Select, Box, MenuItem, Button, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Paper } from "@mui/material";
import Polygonmaskparticle from "./Polygonmaskparticle.js";
import AnimatedBackground from "./AnimatedBackground.js";
import NeatBackground from "./NeatBackground.js";


const columns = [
  { id: "date", label: "Date", minWidth: 80 },
  { id: "loginTime", label: "Login", minWidth: 80 },
  { id: "dinnerStartTime", label: "Dinner Start", minWidth: 80 },
  { id: "dinnerEndTime", label: "Dinner End", minWidth: 80 },
  { id: "logoutTime", label: "Logout", minWidth: 80 },
  { id: "shortBreak1Start", label: "Break 1 Start", minWidth: 80 },
  { id: "shortBreak1End", label: "Break 1 End", minWidth: 80 },
  { id: "shortBreak2Start", label: "Break 2 Start", minWidth: 80 },
  { id: "shortBreak2End", label: "Break 2 End", minWidth: 80 },
  { id: "shortBreak3Start", label: "Break 3 Start", minWidth: 80 },
  { id: "shortBreak3End", label: "Break 3 End", minWidth: 80 },
  { id: "totalLoginHours", label: "Total Login Hrs", minWidth: 80 },
  { id: "breakDuration", label: "Break Duration", minWidth: 80 },
  { id: "actualLoginHours", label: "Actual Login Hrs", minWidth: 80 },
  { id: "adminLoginHours", label: "Admin Hrs", minWidth: 80 },
];

const Timelogger = () => {
  const [employeeName, setEmployeeName] = useState("");
  const [logType, setLogType] = useState("Login Time");
  const [logTime, setLogTime] = useState("");
  const [comment, setComment] = useState("");
  const [logs, setLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchDate, setSearchDate] = useState(""); 

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
  }, [employeeName, searchDate]);

  useEffect(() => {
    const updateDate = () => {
      const options = { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" };
      const formattedDate = new Intl.DateTimeFormat("en-CA", options).format(new Date());
      setSelectedDate(formattedDate);
    };
    updateDate();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/logs`, {
        params: { employeeName },
      });
  
      let filteredLogs = response.data;
  
      // Convert date to YYYY-MM-DD format before comparing
      if (searchDate) {
        filteredLogs = filteredLogs.filter(log => {
          const logDate = new Date(log.date).toISOString().split("T")[0]; // Convert to YYYY-MM-DD
          return logDate === searchDate;
        });
      }
  
      // Sort logs by date (newest first)
      filteredLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
  
      setLogs(filteredLogs);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div>
      {/* <Polygonmaskparticle /> */}
      {/* <AnimatedBackground/> */}
      <NeatBackground/>
    
    <div className="p-4">
      
      <h1 className="text-xl font-bold">Welcome, {employeeName} 👋</h1>
      
      <Box className="employeeLogger">
      
      {/* Employee Name */}
      <TextField 
        label="Name"
        value={employeeName}
        InputProps={{ readOnly: true }}
        fullWidth
      />

      {/* Selected Date */}
      <TextField 
        label="Date"
        value={selectedDate}
        InputProps={{ readOnly: true }}
        sx={{ width: "650px" }}
      />

      {/* Log Type Selection */}
      <Select
        value={logType}
        onChange={(e) => setLogType(e.target.value)}
        fullWidth
        displayEmpty
      >
        <MenuItem value="" disabled>Select Log Type</MenuItem>
        <MenuItem value="Login Time">Login Time</MenuItem>
        <MenuItem value="Dinner Break - Start Time">Dinner Break - Start Time</MenuItem>
        <MenuItem value="Dinner Break - End Time">Dinner Break - End Time</MenuItem>
        <MenuItem value="Logout Time">Logout Time</MenuItem>
        <MenuItem value="Short Break 1 Start">Short Break 1 Start</MenuItem>
        <MenuItem value="Short Break 1 End">Short Break 1 End</MenuItem>
        <MenuItem value="Short Break 2 Start">Short Break 2 Start</MenuItem>
        <MenuItem value="Short Break 2 End">Short Break 2 End</MenuItem>
        <MenuItem value="Short Break 3 Start">Short Break 3 Start</MenuItem>
        <MenuItem value="Short Break 3 End">Short Break 3 End</MenuItem>
      </Select>

      {/* Log Time */}
      <TextField 
        label="Log Time"
        type="time"
        value={logTime}
        onChange={(e) => setLogTime(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ width: "650px" }}
      />

      {/* Comment Field */}
      {/* <TextField 
        label="Comment"
        placeholder="Add a comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        fullWidth
      /> */}

      {/* Submit Button */}
      <Button 
        variant="contained" 
        className="timeBtn"
        color="primary" 
        onClick={handleSubmit} 
      >
        Submit
      </Button>

    </Box>

      <h2 className="text-lg font-bold mt-6">Time Logs</h2>
      <div>
      <input
  type="date"
  value={searchDate}
  onChange={(e) => setSearchDate(e.target.value)}
  className="border p-2 w-full"
/>

      </div>
      <Paper sx={{ width: "100%", overflow: "hidden" }} className="table-wrap">
      <TableContainer sx={{ maxHeight: 570 }}>
        <Table stickyHeader aria-label="time logs table" className="table">
          <TableHead className="thead-primary" >
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log) => (
              <React.Fragment key={log._id}>
                <TableRow hover role="checkbox" tabIndex={-1}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {log[column.id] || "-"}
                    </TableCell>
                  ))}
                </TableRow>

                {log.modifications?.length > 0 && (
                  <TableRow>
                  <TableCell colSpan={columns.length} className="border px-2 py-1 bg-gray-100">
                    <strong>Change History:</strong>
                    <ul className="changeHistory text-sm list-disc pl-4">
                      {log.modifications.map((mod, index) => (
                        <li key={index}>
                          🔹 <span className="font-semibold">{mod.field}</span>: 
                          <span className="text-red-500"> ⛔ {mod.oldTime} </span> → 
                          <span className="text-green-500"> ✅ {mod.newTime} </span> 
                          <span className="text-gray-500 text-xs"> (Modified on {new Date(mod.modifiedAt).toLocaleString()})</span>
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                </TableRow>
                
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={logs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>

    <Clock />
    </div>
    </div>
  );
};

export default Timelogger;
