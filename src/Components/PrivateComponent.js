import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar.js";

const PrivateComponent = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = JSON.parse(localStorage.getItem("admin") || "false"); // Convert to boolean

  // If the user is NOT logged in or is an Admin, redirect them to login
  if (!user || isAdmin) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Navbar /> {/* Navbar only visible when logged in */}
      <Outlet />  {/* Render child routes like Timelogger, Salary, etc. */}
    </>
  );
};

export default PrivateComponent;
