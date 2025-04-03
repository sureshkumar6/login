import React, { useState, useEffect } from "react";
import axios from "axios";
import NeatBackground from "./NeatBackground.js";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import "./LeaveManagement.css";

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email) {
      fetchLeaves(user.email);
    }
  }, []);

  const fetchLeaves = async (email) => {
    if (!email) {
      console.error("User email not found!");
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/leave-requests?email=${email}`);
      setLeaves(response.data);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this leave request?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/leave-requests/${id}`);
      alert("Leave request deleted successfully!");
      fetchLeaves(user.email);
    } catch (error) {
      console.error("Error deleting leave request:", error);
      alert("Failed to delete leave request.");
    }
  };

  return (
    <div className="leave-management">
      <NeatBackground/>
      <Typography variant="h4" className="leave-title" gutterBottom >
        Manage Leaves
      </Typography>

      <Paper sx={{ width: "100%", overflow: "hidden" }} className="table-wrap">
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="leave requests table" className="table">
            <TableHead className="thead-primary">
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>Leave Type</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Specific Time</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Applied Date</TableCell>
                <TableCell>Compensation</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaves.length > 0 ? (
                leaves.map((leave, index) => (
                  <TableRow key={leave._id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{leave.leaveType}</TableCell>
                    <TableCell>{leave.fromDate || "N/A"}</TableCell>
                    <TableCell>{leave.toDate || "N/A"}</TableCell>
                    <TableCell>{leave.specificTime || "N/A"}</TableCell>
                    <TableCell>{leave.leaveReason}</TableCell>
                    <TableCell>{leave.requestDate}</TableCell>
                    <TableCell>{leave.compensationOption}</TableCell>
                    <TableCell className={leave.status === "Accepted" ? "status-accepted" : "status-rejected"}>
                      {leave.status || "Pending"}
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" color="error" onClick={() => handleDelete(leave._id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="10" align="center">
                    No leave requests found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default LeaveManagement;
