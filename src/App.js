import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  return (
    <div className="App my-bg">
      <BrowserRouter>
        <Routes>
          {/* Private Routes */}
          <Route element={<PrivateComponent />}>
            <Route path="/" element={<Home />} />
            <Route path="/Time" element={<Timelogger />} />
            <Route path="/daily" element={<DailyActivity />} />
            <Route path="/salary" element={<Salary />} />
            <Route path="/leaves" element={<LeaveRequest />} />
            <Route path="/manage" element={<LeaveManagement />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Public Routes */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
