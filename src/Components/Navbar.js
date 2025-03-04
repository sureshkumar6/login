import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css"; // Ensure you have this file for styling

const Navbar = () => {
  const navigate = useNavigate();

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

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img 
          src="/logo.png" 
          alt="Company Logo" 
          className="logo" 
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />
      </div>

      <div className="navbar-right">
        {storedData ? (
          isAdmin ? (
            // If Admin: Show Admin Menu
            <>
              <button className="nav-button" onClick={() => navigate("/admin/employees")}>Manage Employees</button>
              <button className="nav-button" onClick={() => navigate("/admin/leaves")}>Manage Leaves</button>
              <button className="nav-button" onClick={() => navigate("/admin/timelogger")}>Modify Timelogger</button>
              <button className="nav-button logout-button" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            // If Employee: Show Employee Menu
            <>
              <button className="nav-button" onClick={() => navigate("/")}>Home</button>
              <button className="nav-button" onClick={() => navigate("/salary")}>Salary</button>
              <button className="nav-button" onClick={() => navigate("/Time")}>Time</button>
              <button className="nav-button" onClick={() => navigate("/profile")}>Profile</button>
              <button className="nav-button" onClick={() => navigate("/leaves")}>Leaves</button>
              <button className="nav-button" onClick={() => navigate("/manage")}>Manage</button>
              <button className="nav-button" onClick={() => navigate("/Daily")}>Daily</button>
              <button className="nav-button logout-button" onClick={handleLogout}>Logout</button>
            </>
          )
        ) : (
          <button className="nav-button" onClick={() => navigate("/login")}>Login</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
