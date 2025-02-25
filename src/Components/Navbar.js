import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css"; // Ensure you have this file for styling

const Navbar = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("user"); // Check if user is logged in

  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user from local storage
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/logo.png" alt="Company Logo" className="logo" />
      </div>
      <div className="navbar-right">
        <button className="logout-button" onClick={() => navigate("/")}>Home</button>
        <button className="logout-button" onClick={() => navigate("/salary")}>Salary</button>
        {user ? (
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        ) : (
          <button className="logout-button" onClick={() => navigate("/login")}>Login</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
