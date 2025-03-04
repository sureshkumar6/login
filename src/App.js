import "./App.css";
import { BrowserRouter, Routes, Route, Navigate  } from "react-router-dom";
import Home from "./Components/Home.js";
import Login from "./Components/Login.js";
import SignUp from "./Components/SignUp.js";
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
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  return (
    <div className="App my-bg">
      <BrowserRouter>
        <Routes>
          {/* Private Routes - Only logged-in users can access */}
          <Route element={<PrivateComponent />}>
            <Route path="/" element={<Home />} />
            <Route path="/Time" element={<Timelogger />} />
            <Route path="/daily" element={<DailyActivity />} />
            <Route path="/salary" element={<Salary />} />
            <Route path="/leaves" element={<LeaveRequest />} />
            <Route path="/manage" element={<LeaveManagement />} />
            <Route path="/profile" element={<Profile />} />
            {/* Catch-all route for employees */}
            <Route path="*" element={<Navigate to="/" />} />
          </Route>

          {/* Private Admin Routes */}
          <Route element={<AdminComponent />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/employees" element={<EmployeeManagement />} />
            <Route path="/admin/leaves" element={<ManageLeaves />} />
            <Route path="/admin/timelogger" element={<AdminTimelogger />} />
             {/* Catch-all route for admins */}
             <Route path="*" element={<Navigate to="/admin" />} />
          </Route>

          {/* Public Routes - Only for non-logged-in users */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          {/* Catch-all for undefined routes for non-logged-in users */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}


export default App;
