import { Outlet, Navigate } from "react-router-dom";

const AdminPrivateComponent = () => {
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));

  return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminPrivateComponent;
