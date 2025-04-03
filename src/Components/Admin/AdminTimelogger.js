import React, { useState, useEffect } from "react";
import axios from "axios";
import NeatBackground from "../NeatBackground.js";
import {
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  CircularProgress,
} from "@mui/material";
import "./AdminTimeLogger.css";

const AdminTimeLogger = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [logType, setLogType] = useState("Login Time");
  const [logTime, setLogTime] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


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
  }, [selectedEmployee, searchDate]);
  useEffect(() => {
    setPage(0);
  }, [selectedEmployee, searchDate]);
  
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/logs`, {
        params: { employeeName: selectedEmployee },
      });
      let filteredLogs = response.data;

      if (searchDate) {
        filteredLogs = filteredLogs.filter((log) => {
          const logDate = new Date(log.date).toISOString().split("T")[0]; // Convert to YYYY-MM-DD
          return logDate === searchDate;
        });
      }

      filteredLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
  
      setLogs(filteredLogs); 
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
      await axios.put(`${API_BASE_URL}/logs`, requestData);
      alert("Log updated successfully!");
      fetchLogs();
    } catch (err) {
      console.error("Error updating log:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleDateChange = (e) => {
    const selected = e.target.value;
    setSelectedDate(selected);
    setSearchDate(selected); // ✅ Update search date for filtering logs
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };
  
  const paginatedLogs = logs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="adminLogger">
      <NeatBackground/>
      {/* <Typography variant="h4" gutterBottom className="text-xl font-bold mb-4">
        Admin Time Logger
      </Typography> */}

      {/* Error Message */}
      {error && <Typography color="error">{error}</Typography>}

      <div className="space-y-4 employelogsforadmin">
        {/* Employee Dropdown */}
        <FormControl fullWidth className="border p-2">
          <InputLabel>Select Employee</InputLabel>
          <Select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <MenuItem value="">Select Employee</MenuItem>
            {employees.map((emp) => (
              <MenuItem key={emp._id} value={emp.name}>
                {emp.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Date Picker */}
        <TextField
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          fullWidth
          className="border p-2"
        />

        {/* Log Type Dropdown */}
        <FormControl fullWidth className="border p-2">
          <InputLabel>Log Type</InputLabel>
          <Select
            value={logType}
            onChange={(e) => setLogType(e.target.value)}
          >
            {Object.keys(logTypeMap).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Time Picker */}
        <TextField
          type="time"
          value={logTime}
          onChange={(e) => setLogTime(e.target.value)}
          fullWidth
          className="border p-2"
        />

        {/* Submit Button */}
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="mt-4 text-center">
          <CircularProgress />
        </div>
      )}

      {/* Display Logs */}
      {logs.length > 0 && (
        <>
          <Typography variant="h6" className="text-lg font-bold mt-6">
            Logs for {selectedEmployee}
          </Typography>

          <Paper className="table-wrap">
            <TableContainer>
              <Table className="table">
                <TableHead className="thead-primary">
                  <TableRow>
                    {[
                      "Date", "Login", "Dinner Break Start", "Dinner Break End", "Logout",
                      "Short Break 1 Start", "Short Break 1 End", "Short Break 2 Start", "Short Break 2 End",
                      "Short Break 3 Start", "Short Break 3 End", "Total Login Hrs", "Break Duration",
                      "Actual Login Hrs", "Admin Hrs"
                    ].map((header) => (
                      <TableCell key={header}>{header}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
  {paginatedLogs.map((log) => (
    <React.Fragment key={log._id}>
      <TableRow>
        <TableCell>{log.date}</TableCell>
        <TableCell>{log.loginTime || "-"}</TableCell>
        <TableCell>{log.dinnerStartTime || "-"}</TableCell>
        <TableCell>{log.dinnerEndTime || "-"}</TableCell>
        <TableCell>{log.logoutTime || "-"}</TableCell>
        <TableCell>{log.shortBreak1Start || "-"}</TableCell>
        <TableCell>{log.shortBreak1End || "-"}</TableCell>
        <TableCell>{log.shortBreak2Start || "-"}</TableCell>
        <TableCell>{log.shortBreak2End || "-"}</TableCell>
        <TableCell>{log.shortBreak3Start || "-"}</TableCell>
        <TableCell>{log.shortBreak3End || "-"}</TableCell>
        <TableCell>{log.totalLoginHours || "-"}</TableCell>
        <TableCell>{log.breakDuration || "-"}</TableCell>
        <TableCell>{log.actualLoginHours || "-"}</TableCell>
        <TableCell>{log.adminLoginHours || "-"}</TableCell>
      </TableRow>

      {/* ✅ Display Change History Below Each Log Row */}
      {log.modifications?.length > 0 && (
        <TableRow>
          <TableCell colSpan={15} className="bg-gray-100">
            <Typography variant="subtitle2" gutterBottom>
              <strong>Change History:</strong>
            </Typography>
            <ul className="text-sm list-disc pl-4">
              {log.modifications.map((mod, index) => (
                <li key={index}>
                  🔹 <strong>{mod.field}</strong>: 
                  <span style={{ color: "red", marginLeft: "5px" }}>⛔ {mod.oldTime} </span> → 
                  <span style={{ color: "green", marginLeft: "5px" }}>✅ {mod.newTime} </span> 
                  <span style={{ color: "gray", fontSize: "12px", marginLeft: "5px" }}>
                    (Modified on {new Date(mod.modifiedAt).toLocaleString()})
                  </span>
                </li>
              ))}
            </ul>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  ))}
</TableBody>

{/* ✅ Add Pagination Below the Table */}
<TablePagination
  rowsPerPageOptions={[10, 25, 50]}
  component="tfoot"
  count={logs.length}
  rowsPerPage={rowsPerPage}
  page={page}
  onPageChange={handleChangePage}
  onRowsPerPageChange={handleChangeRowsPerPage}
  className="table-pagination"
/>

              
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
    </div>
  );
};

export default AdminTimeLogger;
