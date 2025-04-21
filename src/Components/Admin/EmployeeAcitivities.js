import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import NeatBackground from "../NeatBackground.js";
import {
  TextField,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Paper,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  IconButton,
  Pagination,
  CheckCircle,
  HourglassEmpty,
  Cancel,
} from "@mui/material";
import "./EmployeeAcitivities.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";

const EmployeeActivities = () => {
  const [activities, setActivities] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("All");
  const [selectedDate, setSelectedDate] = useState(""); // State for selected date
  const [page, setPage] = useState(1); // current page
  const [itemsPerPage, setItemsPerPage] = useState(5); // number of activities per page
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    fetchActivities();
    fetchEmployees();
  }, [selectedEmployee, page, selectedDate]); // Re-fetch when selected employee, page, or date changes

  const fetchActivities = async () => {
    try {
      const url =
        selectedEmployee === "All"
          ? `${API_BASE_URL}/daily-activity`
          : `${API_BASE_URL}/daily-activity?email=${selectedEmployee}`;

      const response = await axios.get(url);
      const groupedActivities = groupByDate(response.data);

      // If a specific date is selected, filter activities by date
      if (selectedDate) {
        const filteredActivities = Object.keys(groupedActivities).reduce(
          (acc, date) => {
            if (date === selectedDate) acc[date] = groupedActivities[date];
            return acc;
          },
          {}
        );
        setActivities(filteredActivities);
      } else {
        // Sort dates (most recent first)
        const sortedKeys = Object.keys(groupedActivities).sort(
          (a, b) => new Date(b) - new Date(a)
        );

        // Build new sorted activity object
        const sortedActivities = {};
        sortedKeys.forEach((date) => {
          sortedActivities[date] = groupedActivities[date];
        });

        setActivities(sortedActivities);

        // Automatically expand only the most recent date
        setExpandedGroups({ [sortedKeys[0]]: true });
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/daily-activity`);
      const activities = response.data;
      const uniqueEmployees = [];
      const employeeMap = new Map();

      activities.forEach((activity) => {
        if (!employeeMap.has(activity.email)) {
          employeeMap.set(activity.email, activity.employeeName);
          uniqueEmployees.push({
            email: activity.email,
            name: activity.employeeName,
          });
        }
      });

      console.log("Fetched employees:", uniqueEmployees);
      setEmployees(uniqueEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const getColorFromString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 50%)`; // Generates a different hue for each name
    return color;
  };

  const groupByDate = (data) => {
    return data.reduce((acc, activity) => {
      // Format the date to exclude time for accurate comparison
      const activityDate = new Date(activity.date);
      const formattedDate = activityDate.toISOString().split("T")[0]; // yyyy-mm-dd format
      console.log("Activity Date: ", formattedDate); // Log to check

      if (!acc[formattedDate]) acc[formattedDate] = [];
      acc[formattedDate].push(activity);
      return acc;
    }, {});
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0].toUpperCase())
      .join("");
  };

  const calculateTimeSpent = (startTime, endTime) => {
    if (!endTime) return "Ongoing";

    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);

    // Check if endTime is earlier than startTime (e.g., might be a misentry or incorrect data)
    if (end < start) {
      return "Invalid Time"; // Or handle it as you see fit
    }

    const diffMs = end - start;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  // Function to paginate activities (grouped by date)
  const paginateActivities = () => {
    const activityList = Object.keys(activities).reduce((acc, date) => {
      return [...acc, ...activities[date]];
    }, []);

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
    return activityList.slice(startIndex, endIndex);
  };

  const handlePageChange = (event, value) => {
    setPage(value); // Update the current page
  };

  // Function to handle date change
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value); // Update selected date
  };

  const toggleGroup = (date) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  return (
    <Box className="daily-activities-container">
      <NeatBackground />

      <div className="dailyFilterContainer">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            marginBottom: 2,
          }}
        >
          <IconButton
            onClick={() => setSelectedEmployee("All")}
            sx={{
              width: 40,
              height: 40,
              backgroundColor: "lightgrey",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              All
            </Typography>
          </IconButton>

          {employees.map((employee) => (
            <IconButton
              key={employee.email}
              onClick={() => setSelectedEmployee(employee.email)}
              sx={{
                width: 40,
                height: 40,
                backgroundColor: getColorFromString(employee.name),
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "50%",
              }}
            >
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", color: "black" }}
              >
                {getInitials(employee.name)}
              </Typography>
            </IconButton>
          ))}
        </Box>

        <FormControl fullWidth sx={{ width: "20%" }}>
          <InputLabel>Select Employee</InputLabel>
          <Select
            value={selectedEmployee || "All"}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <MenuItem value="All">All Employees</MenuItem>
            {employees.map((employee) => (
              <MenuItem key={employee.email} value={employee.email}>
                {employee.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Add Date Filter */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            my: 2,
            width: "20%",
          }}
        >
          <TextField
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            style={{ padding: "6px 12px", fontSize: "16px" }}
          />
        </Box>
      </div>

      <Box className="employeeActivityContainer">
        <Typography className="timeline-heading" variant="h5">
          Activity Timeline
        </Typography>
        <hr className="timeline-divider" />
        {Object.keys(activities).map((date) => (
          <Box key={date} className="activity-group mb-6">
            {/* Header */}
            <Box
              className="activity-group-header"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#f9fafb",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "12px",
                cursor: "pointer",
              }}
              onClick={() => toggleGroup(date)}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: "#e0e7ff",
                    color: "#4f46e5",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "12px",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  📅
                </Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" color="gray">
                  {activities[date].length} activities
                </Typography>
                <Typography
                  sx={{
                    transform: expandedGroups[date]
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                >
                  ▼
                </Typography>
              </Box>
            </Box>

            {/* Activities List */}
            {expandedGroups[date] &&
              activities[date].map((activity) => (
                <Box
                  key={activity._id}
                  className="activity-item"
                  sx={{
                    padding: "16px",
                    borderBottom: "1px solid #f3f4f6",
                    display: "flex",
                    alignItems: "start",
                  }}
                >
                  <Box
                    className="avatar"
                    sx={{
                      marginRight: "16px",
                      width: "40px",
                      height: "40px",
                      backgroundColor: getColorFromString(
                        activity.employeeName
                      ),
                      color: "#fff",
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {getInitials(activity.employeeName)}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        justifyContent: "space-between",
                        alignItems: { sm: "center" },
                        marginBottom: "8px",
                      }}
                    >
                      <Typography fontWeight="bold">{activity.work}</Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography className="time-badge" fontSize="14px">
                          {activity.startTime} - {activity.endTime || "Ongoing"}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      color="text.secondary"
                      fontSize="14px"
                      marginBottom={1}
                    >
                      {activity.work} - {activity.subWorkType}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      <span className="badge badge-primary">
                        Duration:{" "}
                        {calculateTimeSpent(
                          activity.startTime,
                          activity.endTime
                        )}
                      </span>
                    </Box>
                  </Box>
                </Box>
              ))}
          </Box>
        ))}
      </Box>

      {/* Pagination Component */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Pagination
          count={Math.ceil(Object.keys(activities).length / itemsPerPage)} // Total pages based on items per page
          page={page}
          onChange={handlePageChange}
        />
      </Box>
    </Box>
  );
};

export default EmployeeActivities;
