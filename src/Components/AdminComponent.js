import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar.js";

const AdminComponent = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = JSON.parse(localStorage.getItem("admin") || "false"); // Convert to boolean

  // If the user is NOT logged in or NOT an admin, redirect them to login
  if (!user || !isAdmin) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Navbar /> {/* Navbar only visible when logged in */}
      <Outlet />  {/* Render admin pages if user is an admin */}
    </>
  );
};

export default AdminComponent;
