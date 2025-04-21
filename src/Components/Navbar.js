import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

//icons
import HomeIcon from '@mui/icons-material/Home';
import PaidIcon from '@mui/icons-material/Paid';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import SettingsIcon from '@mui/icons-material/Settings';
import TodayIcon from '@mui/icons-material/Today';
import LogoutIcon from '@mui/icons-material/Logout';

import GroupIcon from '@mui/icons-material/Group';
import EventNoteIcon from '@mui/icons-material/EventNote';
import EditNoteIcon from '@mui/icons-material/EditNote';
import InsightsIcon from '@mui/icons-material/Insights';


import "./Navbar.css"; // Ensure you have this file for styling

const Navbar = () => {
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(false); // Manage mobile menu state

  // Get user and admin status
  let storedData = null;
  let isAdmin = false;

  try {
    storedData = JSON.parse(localStorage.getItem("user")) || null;
    isAdmin = localStorage.getItem("admin") === "true"; // Check if "true" as string
  } catch (error) {
    console.error("Error parsing localStorage data:", error);
  }

  const handleLogout = () => {
    localStorage.removeItem("user");       
    localStorage.removeItem("employeeId"); 
    localStorage.removeItem("admin");  
    localStorage.removeItem("dailyShloka")    
    navigate("/login"); 
  };

  // Testing
  const handleLogoClick = () => {
    if (isAdmin) {
      navigate("/admin"); // Admins should go to the admin dashboard
    } else if (storedData) {
      navigate("/"); // Employees should go to home
    } else {
      navigate("/login"); // If no user is logged in, send to login page
    }
  };
  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  return (
    <nav className="navbar">
      <div className="navContainer">
        <div className="navbar-logo">
          <img 
            src="/logo.png" 
            alt="Company Logo" 
            className="logo" 
            onClick={handleLogoClick} // Testing
            style={{ cursor: "pointer" }}
          />
        </div>

        {/* Menu Toggle Button for Mobile */}
        <div className="menu-icon" onClick={handleShowNavbar}>
          ☰ {/* You can replace this with an actual hamburger icon component */}
        </div>

        <div className={`nav-elements ${showNavbar ? "active" : ""}`}>
          <ul>
            {storedData ? (
              isAdmin ? (
                <>
                  <li>
                    <NavLink to="/admin/employees"><GroupIcon fontSize="small" /> Manage Employees</NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/leaves"><EventNoteIcon fontSize="small" /> Manage Leaves</NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/timelogger"><EditNoteIcon fontSize="small" /> Modify Timelogger</NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/employee-acitivities"><InsightsIcon fontSize="small" /> Employees Activities</NavLink>
                  </li>
                  <li>
                    <button className="nav-button logout-button" onClick={handleLogout}>
                      <LogoutIcon fontSize="small" className="logoutIcon" /> Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink to="/"><HomeIcon fontSize="small"/> Home</NavLink>
                  </li>
                  <li>
                    <NavLink to="/salary"><PaidIcon fontSize="small" /> Salary</NavLink>
                  </li>
                  <li>
                    <NavLink to="/Time"><AccessTimeIcon fontSize="small" /> Time</NavLink>
                  </li>
                  <li>
                    <NavLink to="/profile"><AccountCircleIcon fontSize="small" /> Profile</NavLink>
                  </li>
                  <li>
                    <NavLink to="/leaves"><BeachAccessIcon fontSize="small" /> Leaves</NavLink>
                  </li>
                  <li>
                    <NavLink to="/manage"><SettingsIcon fontSize="small" /> Manage</NavLink>
                  </li>
                  <li>
                    <NavLink to="/Daily"><TodayIcon fontSize="small" /> Daily</NavLink>
                  </li>
                  <li onClick={handleLogout} className="logout">
                    <LogoutIcon fontSize="small" className="logoutIcon"/> Logout
                  </li>
                </>
              )
            ) : (
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
