import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));

  return isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute;
