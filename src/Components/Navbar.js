import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
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
                    <NavLink to="/admin/employees">Manage Employees</NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/leaves">Manage Leaves</NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/timelogger">Modify Timelogger</NavLink>
                  </li>
                  <li>
                    <button className="nav-button logout-button" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink to="/">Home</NavLink>
                  </li>
                  <li>
                    <NavLink to="/salary">Salary</NavLink>
                  </li>
                  <li>
                    <NavLink to="/Time">Time</NavLink>
                  </li>
                  <li>
                    <NavLink to="/profile">Profile</NavLink>
                  </li>
                  <li>
                    <NavLink to="/leaves">Leaves</NavLink>
                  </li>
                  <li>
                    <NavLink to="/manage">Manage</NavLink>
                  </li>
                  <li>
                    <NavLink to="/Daily">Daily</NavLink>
                  </li>
                  <li onClick={handleLogout} className="logout">
                    Logout
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
