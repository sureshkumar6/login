import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar.js";

const AdminComponent = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!user.isAdmin) {
    return <Navigate to="/" />; // Redirect non-admins to the home page
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};


export default AdminComponent;
