import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./Components/Home.js";
import PrivateComponent from "./Components/PrivateComponent.js";
import Timelogger from "./Components/Timelogger.js";
import Salary from "./Components/Salary.js";
import Profile from "./Components/Profile.js";
import DailyActivity from "./Components/DailyActivity.js";
import LeaveRequest from "./Components/LeaveRequest.js";
import LeaveManagement from "./Components/LeaveManagement.js";
import EmployeeManagement from "./Components/Admin/EmployeeManagement.js";
import AdminDashboard from "./Components/Admin/AdminDashboard.js";
import ManageLeaves from "./Components/Admin/ManageLeaves.js";
import AdminTimelogger from "./Components/Admin/AdminTimelogger.js";
import AdminComponent from "./Components/AdminComponent.js";
import DoubleSliderAuth from "./Components/DoubleSliderAuth.js";
import EmployeeAcitivities from "./Components/Admin/EmployeeAcitivities.js";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
  
    if (storedUser) {
      setUser({ 
        isAuthenticated: true, 
        isAdmin: storedUser.isAdmin === true // Ensure boolean check
      });
    } else {
      setUser({ isAuthenticated: false, isAdmin: false });
    }
  }, []);
  

  if (user === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App my-bg">
      <BrowserRouter>
        <Routes>
          {/* Private Routes - Only logged-in employees can access */}
          <Route element={<PrivateComponent />}>
            <Route path="/" element={<Home />} />
            <Route path="/Time" element={<Timelogger />} />
            <Route path="/daily" element={<DailyActivity />} />
            <Route path="/salary" element={<Salary />} />
            <Route path="/leaves" element={<LeaveRequest />} />
            <Route path="/manage" element={<LeaveManagement />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Private Admin Routes - Only admins can access */}
          <Route element={<AdminComponent />}>
            <Route path="/admin" element={<EmployeeManagement />} />
            {/* <Route path="/admin/employees" element={<EmployeeManagement />} /> */}
            <Route path="/admin/leaves" element={<ManageLeaves />} />
            <Route path="/admin/timelogger" element={<AdminTimelogger />} />
            <Route path="/admin/employee-acitivities" element={<EmployeeAcitivities />} />
          </Route>

          {/* Public Routes - Only for non-logged-in users */}
          <Route
            path="/login"
            element={
              user.isAuthenticated ? (
                user.isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/" replace />
              ) : (
                <DoubleSliderAuth />
              )
            }
          />

          {/* Catch-All Route - Redirect unknown paths */}
          <Route path="*" element={<Navigate to={user.isAdmin ? "/admin" : "/"} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
