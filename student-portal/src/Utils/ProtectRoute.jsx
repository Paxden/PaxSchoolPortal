import React from "react";
import { Navigate } from "react-router-dom";

const ProtectRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
  return isLoggedIn ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectRoute;
