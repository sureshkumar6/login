import React, { useState, useEffect } from "react";
import axios from "axios";
import NeatBackground from "./NeatBackground.js";

const Salary = () => {
  const [logs, setLogs] = useState([]);
  const [salaryData, setSalaryData] = useState({
    totalDays: 0,
    daysOff: 0,
    workingDays: 0,
    leaves: 0,
    avgHoursWorked: 0,
  });
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";
  useEffect(() => {
    const fetchSalaryData = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) return;

      try {
        const response = await axios.get("http://localhost:6060/logs", {
          params: { employeeName: storedUser.name },
        });

        setLogs(response.data);
        calculateSalaryData(response.data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchSalaryData();
  }, []);

  const calculateSalaryData = (logs) => {
    const daysInMonth = new Date().getDate();
    const uniqueDates = [...new Set(logs.map((log) => log.date))];

    const totalWorkingDays = uniqueDates.length;
    const daysOff = daysInMonth - totalWorkingDays;
    const leaves = logs.filter((log) => !log.totalLoginHours).length;
    const avgHoursWorked =
      logs.reduce((acc, log) => acc + parseFloat(log.actualLoginHours || 0), 0) /
      (totalWorkingDays || 1);

    setSalaryData({
      totalDays: daysInMonth,
      daysOff,
      workingDays: totalWorkingDays,
      leaves,
      avgHoursWorked: avgHoursWorked.toFixed(2),
    });
  };

  return (
    <div className="salary-container">
      <NeatBackground/>
      <h2>Salary Details</h2>
      <p><strong>Days in Month:</strong> {salaryData.totalDays}</p>
      <p><strong>Days Off:</strong> {salaryData.daysOff}</p>
      <p><strong>Total Working Days:</strong> {salaryData.workingDays}</p>
      <p><strong>Leave(s):</strong> {salaryData.leaves}</p>
      <p><strong>Avg Hours Worked:</strong> {salaryData.avgHoursWorked} hrs</p>
    </div>
  );
};

export default Salary;
