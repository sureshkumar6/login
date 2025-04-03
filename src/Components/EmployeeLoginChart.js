import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const EmployeeLoginChart = ({ selectedEmployee, isAdmin }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState(selectedEmployee);

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";

  useEffect(() => {
    if (isAdmin) {
      // Admins can fetch all employees
      const fetchEmployees = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/employees`);
          const employeeList = response.data.map((emp) => emp.name);
          setEmployees(employeeList);

          // Set default employee if none selected
          if (!employeeList.includes(selectedEmployee) && employeeList.length > 0) {
            setCurrentEmployee(employeeList[0]);
          }
        } catch (error) {
          console.error("Error fetching employees:", error);
        }
      };
      fetchEmployees();
    }
  }, [isAdmin, selectedEmployee]);

  useEffect(() => {
    if (!currentEmployee) return;

    const fetchLoginData = async () => {
      try {
        setLoading(true);
        console.log("Fetching data for:", currentEmployee);
        const response = await axios.get(`${API_BASE_URL}/logs?employeeName=${currentEmployee}`);
        const logs = response.data;

        if (!logs || logs.length === 0) {
          console.warn("No data received for employee:", currentEmployee);
          setChartData([]);
          return;
        }

        let formattedData = logs.map((log) => ({
          date: new Date(log.date).toLocaleDateString("en-CA"),
          hours:
            parseFloat(log.actualLoginHours.split(":")[0]) +
            parseFloat(log.actualLoginHours.split(":")[1]) / 60,
        }));

        formattedData.sort((a, b) => new Date(b.date) - new Date(a.date));
        const latest6DaysData = formattedData.slice(0, 6);
        latest6DaysData.sort((a, b) => new Date(a.date) - new Date(b.date));

        setChartData(latest6DaysData);
      } catch (error) {
        console.error("Error fetching login data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoginData();
  }, [currentEmployee]);

  return (
    <Box width={600} margin="20px auto">
      <Typography variant="h6" align="center">
        Chart (Last 6 Days)
      </Typography>

      {/* Show dropdown only for Admin */}
      {isAdmin && (
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Employee</InputLabel>
          <Select value={currentEmployee} onChange={(e) => setCurrentEmployee(e.target.value)}>
            {employees.map((employee) => (
              <MenuItem key={employee} value={employee}>
                {employee}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="subtitle1" align="center" sx={{ mt: 2, fontWeight: "bold" }}>
        Showing data for: {currentEmployee}
      </Typography>
        </FormControl>
      )}

      {/* Show employee name */}
      {/* <Typography variant="subtitle1" align="center" sx={{ mt: 2, fontWeight: "bold" }}>
        Showing data for: {currentEmployee}
      </Typography> */}

      {loading ? (
        <Typography align="center">Loading chart...</Typography>
      ) : chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="hours" fill="#007bff" name="Login Hours" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Typography align="center">No data available</Typography>
      )}
    </Box>
  );
};

export default EmployeeLoginChart;
