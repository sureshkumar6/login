import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar.js";

const PrivateComponent = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" />;
  }

  // If the user is an admin, redirect them to the admin dashboard
  if (user.isAdmin) {
    return <Navigate to="/admin" />;
  }

  return (
    <>
      <Navbar /> {/* Navbar only visible when logged in */}
      <Outlet />  {/* Render child routes like Timelogger, Salary, etc. */}
    </>
  );
};

export default PrivateComponent;
