import React, { useState, useEffect } from "react";
import axios from "axios";
import NeatBackground from "../NeatBackground.js";
import { 
  TextField, Box, Typography, List, ListItem, ListItemText, Avatar, Paper, FormControl, MenuItem, Select, InputLabel, IconButton, Pagination
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

  useEffect(() => {
    fetchActivities();
    fetchEmployees();
  }, [selectedEmployee, page, selectedDate]); // Re-fetch when selected employee, page, or date changes

  const fetchActivities = async () => {
    try {
      const url = selectedEmployee === "All" 
        ? `${API_BASE_URL}/daily-activity`
        : `${API_BASE_URL}/daily-activity?email=${selectedEmployee}`;

      const response = await axios.get(url);
      const groupedActivities = groupByDate(response.data);
      console.log("Grouped Activities: ", groupedActivities);

      // If a specific date is selected, filter activities by date
      if (selectedDate) {
        const filteredActivities = Object.keys(groupedActivities).reduce((acc, date) => {
          if (date === selectedDate) acc[date] = groupedActivities[date];
          return acc;
        }, {});
        setActivities(filteredActivities);
      } else {
        setActivities(groupedActivities);
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

      activities.forEach(activity => {
        if (!employeeMap.has(activity.email)) {
          employeeMap.set(activity.email, activity.employeeName);
          uniqueEmployees.push({ email: activity.email, name: activity.employeeName });
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
      const formattedDate = activityDate.toISOString().split('T')[0];  // yyyy-mm-dd format
      console.log("Activity Date: ", formattedDate);  // Log to check

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

  return (
    <Box className="daily-activities-container">
      <NeatBackground/>
      {/* <Typography variant="h5" align="center" className="title">
        Daily Activities
      </Typography> */}

      <div className= "dailyFilterContainer">
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 2 }}>
          <IconButton 
            onClick={() => setSelectedEmployee("All")} 
            sx={{ width: 40, height: 40, backgroundColor: 'lightgrey', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>All</Typography>
          </IconButton>

          {employees.map((employee) => (
            <IconButton 
              key={employee.email} 
              onClick={() => setSelectedEmployee(employee.email)} 
              sx={{ 
                width: 40, 
                height: 40, 
                backgroundColor: getColorFromString(employee.name),
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                borderRadius: '50%' 
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'black' }}>
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
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2, width:"20%"}}>
          <TextField
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            style={{ padding: '6px 12px', fontSize: '16px' }}
          />
        </Box>
      </div>

    <Box>
  {Object.keys(activities).map((date, index) => (
    <Paper key={date} className="date-section">
      {/* Render date header only once */}
      <Typography variant="h6" className="date-header">
        {date}
      </Typography>
      <List>
        {/* Render activities under the date */}
        {activities[date].map((activity) => (
          <ListItem key={activity._id} className="activity-item">
            <Avatar className="avatar" sx={{ backgroundColor: getColorFromString(activity.employeeName) }}>
              {getInitials(activity.employeeName)}
            </Avatar>
            <ListItemText
              primary={`${activity.work} - ${activity.subWorkType}`}
              secondary={`Time: ${activity.startTime} - ${activity.endTime || "Ongoing"} | Duration: ${calculateTimeSpent(activity.startTime, activity.endTime)}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  ))}
</Box>


      {/* Pagination Component */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
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
