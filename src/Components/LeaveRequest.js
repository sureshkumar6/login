
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NeatBackground from "./NeatBackground.js";
import axios from "axios";
import {
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Box,
} from "@mui/material";
import "./LeaveRequest.css";

const LeaveRequest = () => {
  const [email, setEmail] = useState("");
  const [requestDate, setRequestDate] = useState("");
  const [requestTime, setRequestTime] = useState("");
  const [leaveType, setLeaveType] = useState("Full Day Off");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [specificTime, setSpecificTime] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [compensationOption, setCompensationOption] = useState("Deduct from Pay");
  const navigate = useNavigate();


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setEmail(storedUser.email);
    }

    const options = { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" };
    const timeOptions = { timeZone: "America/Chicago", hour12: true, hour: "2-digit", minute: "2-digit" };

    setRequestDate(new Intl.DateTimeFormat("en-US", options).format(new Date()));
    setRequestTime(new Intl.DateTimeFormat("en-US", timeOptions).format(new Date()));
  }, []);

  const handleSubmit = async () => {
    if (!leaveReason) {
      alert("Please provide a reason for the leave request.");
      return;
    }

    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";

    try {
      await axios.post(`${API_BASE_URL}/leave-requests`, {
        email,
        requestDate,
        requestTime,
        leaveType,
        fromDate: leaveType === "Full Day Off" || leaveType === "Multiple Days Off" ? fromDate : null,
        toDate: leaveType === "Full Day Off" || leaveType === "Multiple Days Off" ? toDate : null,
        specificTime: leaveType === "Arriving Late" || leaveType === "Leaving Early" ? specificTime : null,
        leaveReason,
        compensationOption,
      });

      alert("Leave request submitted successfully!");
      navigate("/manage");

      setLeaveType("Full Day Off");
      setFromDate("");
      setToDate("");
      setSpecificTime("");
      setLeaveReason("");
      setCompensationOption("Deduct from Pay");

    } catch (error) {
      console.error("Error submitting leave request:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        padding: 3,
      }}
    >
      <NeatBackground/>
      <Paper elevation={5} sx={{ padding: 4, borderRadius: 3, maxWidth: 500, width: "100%" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Leave Request Form
        </Typography>

        <TextField label="Email" value={email} fullWidth disabled margin="normal" />

        <TextField label="Request Date" value={requestDate} fullWidth disabled margin="normal" />

        <TextField label="Request Time" value={requestTime} fullWidth disabled margin="normal" />

        <FormControl fullWidth margin="normal">
          <InputLabel>Type of Leave</InputLabel>
          <Select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
            <MenuItem value="Full Day Off">Full Day Off</MenuItem>
            <MenuItem value="Multiple Days Off">Multiple Days Off</MenuItem>
            <MenuItem value="Arriving Late">Arriving Late</MenuItem>
            <MenuItem value="Leaving Early">Leaving Early</MenuItem>
          </Select>
        </FormControl>

        {(leaveType === "Full Day Off" || leaveType === "Multiple Days Off") && (
          <>
            <TextField
              label="From Date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="To Date"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </>
        )}

        {(leaveType === "Arriving Late" || leaveType === "Leaving Early") && (
          <TextField
            label="Specify Time"
            type="time"
            value={specificTime}
            onChange={(e) => setSpecificTime(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        )}

        <TextField
          label="Reason for Leave"
          value={leaveReason}
          onChange={(e) => setLeaveReason(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={3}
          placeholder="Enter reason here..."
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Compensation Option</InputLabel>
          <Select value={compensationOption} onChange={(e) => setCompensationOption(e.target.value)}>
            <MenuItem value="Deduct from Pay">Deduct from Pay</MenuItem>
            <MenuItem value="Make up Lost Time">Make up Lost Time</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2, fontSize: "16px" }}
          onClick={handleSubmit}
        >
          Submit Request
        </Button>
      </Paper>
    </Box>
  );
};

export default LeaveRequest;
