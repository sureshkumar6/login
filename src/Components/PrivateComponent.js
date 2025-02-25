import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar.js"; // Import Navbar

const PrivateComponent = () => {
  const auth = localStorage.getItem("user"); // Check if user is logged in

  return auth ? (
    <>
      <Navbar /> {/* Navbar only visible when logged in */}
      <Outlet />  {/* This renders the child routes (Timelogger, Salary, etc.) */}
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateComponent;
