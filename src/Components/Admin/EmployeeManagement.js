import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import AddEmployee from "./AddEmployee.js"; // Import the new component
import Announcements from "./Announcements.js";
import EmployeeLoginChart from "../EmployeeLoginChart.js";
import NeatBackground from "../NeatBackground.js";
import AnimatedBackground from "../AnimatedBackground.js";
import { Button } from "@mui/material";
import "./EmployeeManagement.css"; // Import CSS for styling


const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [employeeLogs, setEmployeeLogs] = useState([]);
  const [dailyActivities, setDailyActivities] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [showAddEmployee, setShowAddEmployee] = useState(false); // State to toggle modal
  const [showAnnouncements, setShowAnnouncements] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";

  useEffect(() => {
    const options = { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" };
    const formattedDate = new Intl.DateTimeFormat("en-CA", options).format(new Date());
    setSelectedDate(formattedDate);
  }, []);

  useEffect(() => {
    if (!selectedDate) return;

    const fetchData = async () => {
      try {
        const [empRes, logRes, activityRes, leaveRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/employees`),
          axios.get(`${API_BASE_URL}/employees-logs`),
          axios.get(`${API_BASE_URL}/daily-activity`),
          axios.get(`${API_BASE_URL}/leave-requests`)
        ]);

        setEmployees(empRes.data);
        console.log(empRes.data)
        setEmployeeLogs(logRes.data.filter(log => log.date === selectedDate));
        setDailyActivities(activityRes.data.filter(activity => activity.date === selectedDate));
        setLeaveRequests(leaveRes.data.filter(leave => leave.requestDate === selectedDate));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedDate]);

  const getEmployeeLog = (name) => employeeLogs.find(log => log.employeeName === name);
  const getEmployeeLeave = (name) => leaveRequests.find(req => req.email === getEmployeeLog(name)?.email && req.status === "Approved");
  const getEmployeeActivity = (name) => dailyActivities.find(act => act.email === getEmployeeLog(name)?.email && !act.endTime);

  const getStatus = (name) => {
    const log = getEmployeeLog(name);
    const leave = getEmployeeLeave(name);
    if (leave) return "On Leave";
    if (!log) return "NA";
    if (log.logoutTime) return "Logged Out";
    if (log.dinnerStartTime && !log.dinnerEndTime) return "On Break";
    return "Working";
  };

  const getLoginTime = (name) => {
    const log = getEmployeeLog(name);
    return log && !getEmployeeLeave(name) ? log.loginTime || "NA" : "NA";
  };

  const getCurrentTask = (name) => {
    const activity = getEmployeeActivity(name);
    return activity ? activity.work : "NA";
  };

  // Handle new employee addition
  const handleEmployeeAdded = (newEmployee) => {
    setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
  };

  return (
    <div className="container">
      <NeatBackground/>
       {/* <AnimatedBackground/> */}
      {/* <h2 className="title">Employee Management</h2> */}
      {/* Employee Carousel */}
      <div>

      
      <Swiper
        key={employees.length} // Ensures Swiper reinitializes when employees change
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={5}
        loop={true}
        autoplay={{ delay: 3000 }}
        navigation
        pagination={{ clickable: true }}
        className="employee-carousel"
      >
        {employees.map((employee) => (
          <SwiperSlide key={employee._id} className="employee-card">
            <div className={`emloyees-pic ${getStatus(employee.name) === "NA" ? "red-border" : "green-border"}`}>
              {employee.profilePicture ? (
                <img src={employee.profilePicture || "/default-profile.jpg"} alt={employee.name} />
              ) : (
                <span>{employee.name.charAt(0)}</span>
              )}
            </div>
            <h3 className="employee-name">{employee.name}</h3>
            <p className={`employee-status ${getStatus(employee.name).toLowerCase().replace(" ", "-")}`}>
              {getStatus(employee.name)}
            </p>
            <p className="employee-login-time">Login: {getLoginTime(employee.name)}</p>
            <p className="employee-task">Task: {getCurrentTask(employee.name)}</p>
          </SwiperSlide>
        ))}
      </Swiper>
      </div>
      <div>
      <div className="btnDiv">
        {/* Add Employee Button */}
        {/* <button className="add-employee-btn" onClick={() => setShowAddEmployee(true)}>Add Employee</button> */}
        <Button variant="contained" onClick={() => setShowAddEmployee(true)}>
          Add Employee
        </Button>
        {/* Make Announcement Button */}
        <Button variant="contained" color="primary" onClick={() => setShowAnnouncements(true)}
          sx={{ backgroundColor: "#FF5733", color: "white", "&:hover": { backgroundColor: "#E64A19" } }}
          >
          Make Announcement
        </Button>
      </div>
      <div className="charts">
        <EmployeeLoginChart selectedEmployee="Rohit"  isAdmin={true}/>
        <EmployeeLoginChart selectedEmployee="Suresh" isAdmin={true}/>
      </div>
      </div>
      {/* Add Employee Modal */}
      {showAddEmployee && (
        <AddEmployee onClose={() => setShowAddEmployee(false)} onEmployeeAdded={handleEmployeeAdded} />
      )}
      {/* Announcement Modal */}
      {showAnnouncements && <Announcements onClose={() => setShowAnnouncements(false)} />}
    </div>
  );
};

export default EmployeeManagement;
