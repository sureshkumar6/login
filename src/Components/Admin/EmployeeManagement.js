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
import RecentActivityTable from "./RecentActivityTable.js";
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

  // NEW: State for RecentActivityTable
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";

  useEffect(() => {
    const options = {
      timeZone: "America/Chicago",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    const formattedDate = new Intl.DateTimeFormat("en-CA", options).format(
      new Date()
    );
    setSelectedDate(formattedDate);
  }, []);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/employees`).then((res) => {
      setEmployees(res.data);
    }).catch(err => console.error(err));
  }, []);
  

  useEffect(() => {
    if (!selectedDate) return;
  
    const fetchData = async () => {
      try {
        const [logRes, activityRes, leaveRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/employees-logs`),
          axios.get(`${API_BASE_URL}/daily-activity`),
          axios.get(`${API_BASE_URL}/leave-requests`),
        ]);
  
        setEmployeeLogs(logRes.data.filter(log => log.date === selectedDate));
        setDailyActivities(activityRes.data.filter(activity => activity.date === selectedDate));
        setLeaveRequests(leaveRes.data.filter(leave => leave.requestDate === selectedDate));
      } catch (error) {
        console.error("Error fetching logs/activities:", error);
      }
    };
  
    fetchData();
  }, [selectedDate]);
  

  const getEmployeeLog = (name) =>
    employeeLogs.find((log) => log.employeeName === name);
  const getEmployeeLeave = (name) =>
    leaveRequests.find(
      (req) =>
        req.email === getEmployeeLog(name)?.email && req.status === "Approved"
    );

  const getEmployeeActivity = (name) =>
    dailyActivities.find(
      (act) => act.email === getEmployeeLog(name)?.email && !act.endTime
    );

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

  // ✅ NEW FUNCTIONS FOR TABLE
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowClick = (employee) => {
    alert(`Clicked on ${employee.name}`);
    // Optionally navigate to profile or open modal
  };

  const getAvatarColor = (name) => {
    const colors = ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa"];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="container">
      <NeatBackground />
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
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            480: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
            1280: {
              slidesPerView: 5,
            },
          }}
        >
          {employees.map((employee) => (
            <SwiperSlide key={employee._id} className="employee-card">
              <div
                className={`emloyees-pic ${
                  getStatus(employee.name) === "NA"
                    ? "red-border"
                    : "green-border"
                }`}
              >
                {employee.profilePicture ? (
                  <img
                    src={employee.profilePicture || "/default-profile.jpg"}
                    alt={employee.name}
                  />
                ) : (
                  <span>{employee.name.charAt(0)}</span>
                )}
              </div>
              <h3 className="employee-name">{employee.name}</h3>
              <p
                className={`employee-status ${getStatus(employee.name)
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {getStatus(employee.name)}
              </p>
              <p className="employee-login-time">
                Login: {getLoginTime(employee.name)}
              </p>
              <p className="employee-task">
                Task: {getCurrentTask(employee.name)}
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div>
        <div className="btnDiv">
          <div className="btnContainer">
            <Button
              className="bigBtn"
              variant="contained"
              onClick={() => setShowAddEmployee(true)}
              startIcon={<i className="fas fa-user-plus"></i>} // <-- icon inside button
            >
              Add Employee
            </Button>
          </div>
          <div className="btnContainer">
            <Button
              variant="contained"
              className="bigBtn"
              color="primary"
              onClick={() => setShowAnnouncements(true)}
              startIcon={<i className="fas fa-bullhorn"></i>} // <-- different icon for announcement
              sx={{
                backgroundColor: "#FF5733",
                color: "white",
                "&:hover": { backgroundColor: "#E64A19" },
              }}
            >
              Make Announcement
            </Button>
          </div>
        </div>
        <section className="summary-section animate-fade-in">
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-content">
                <div className="summary-icon bg-indigo-100 text-indigo-600">
                  <i className="fas fa-users"></i>
                </div>
                <div>
                  <p className="summary-label">Total Employees</p>
                  <p className="summary-value">{employees.length}</p>
                </div>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-content">
                <div className="summary-icon bg-green-100 text-green-600">
                  <i className="fas fa-user-check"></i>
                </div>
                <div>
                  <p className="summary-label">Active Now</p>
                  <p className="summary-value">
                    {
                      employeeLogs.filter(
                        (log) =>
                          !log.logoutTime &&
                          !leaveRequests.find(
                            (req) =>
                              req.email === log.email &&
                              req.status === "Approved"
                          )
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-content">
                <div className="summary-icon bg-red-100 text-red-600">
                  <i className="fas fa-user-times"></i>
                </div>
                <div>
                  <p className="summary-label">On Leave</p>
                  <p className="summary-value">
                    {
                      leaveRequests.filter((req) => req.status === "Approved")
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-content">
                <div className="summary-icon bg-blue-100 text-blue-600">
                  <i className="fas fa-chart-line"></i>
                </div>
                <div>
                  <p className="summary-label">Productivity</p>
                  <p className="summary-value">
                    {(() => {
                      const working = employeeLogs.filter(
                        (log) =>
                          !log.logoutTime &&
                          !leaveRequests.find(
                            (req) =>
                              req.email === log.email &&
                              req.status === "Approved"
                          )
                      ).length;
                      const totalLogged = employeeLogs.length || 1;
                      return `${Math.round((working / totalLogged) * 100)}%`;
                    })()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="charts">
          <EmployeeLoginChart selectedEmployee="Rohit" isAdmin={true} />
          <EmployeeLoginChart selectedEmployee="Suresh" isAdmin={true} />
        </div>
        <RecentActivityTable
          employees={employees}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          getEmployeeLog={getEmployeeLog}
          getEmployeeActivity={getEmployeeActivity}
          getEmployeeLeave={getEmployeeLeave}
          getStatus={getStatus}
          handlePageChange={handlePageChange}
          handleRowClick={handleRowClick}
          getAvatarColor={getAvatarColor}
        />
      </div>
      {/* Add Employee Modal */}
      {showAddEmployee && (
        <AddEmployee
          onClose={() => setShowAddEmployee(false)}
          onEmployeeAdded={handleEmployeeAdded}
        />
      )}
      {/* Announcement Modal */}
      {showAnnouncements && (
        <Announcements onClose={() => setShowAnnouncements(false)} />
      )}
    </div>
  );
};

export default EmployeeManagement;
