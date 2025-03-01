import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css"; // Ensure you have this file for styling

const Navbar = () => {
  const navigate = useNavigate();

  // Safely parse user data
  let storedData = null;
  try {
    storedData = JSON.parse(localStorage.getItem("user")) || null;
  } catch (error) {
    console.error("Error parsing localStorage data:", error);
  }

  const handleLogout = () => {
    localStorage.removeItem("user");       // Remove user data
    localStorage.removeItem("employeeId"); // Remove employeeId if stored separately
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img 
          src="/logo.png" 
          alt="Company Logo" 
          className="logo" 
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }} // Ensure logo is clickable
        />
      </div>

      <div className="navbar-right">
        <button className="nav-button" onClick={() => navigate("/")} aria-label="Home">Home</button>
        <button className="nav-button" onClick={() => navigate("/salary")} aria-label="Salary">Salary</button>

        {storedData ? (
          <>
            <button className="nav-button" onClick={() => navigate("/Time")} aria-label="Time">Time</button>
            <button className="nav-button" onClick={() => navigate("/profile")} aria-label="Profile">Profile</button>
            <button className="nav-button" onClick={() => navigate("/leaves")} aria-label="Leaves">Leaves</button>
            <button className="nav-button" onClick={() => navigate("/manage")} aria-label="Leaves">Manage</button>
            <button className="nav-button" onClick={() => navigate("/Daily")} aria-label="Daily Activity">Daily Activity</button>
            <button className="nav-button logout-button" onClick={handleLogout} aria-label="Logout">Logout</button>
          </>
        ) : (
          <button className="nav-button" onClick={() => navigate("/login")} aria-label="Login">Login</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
