import React from "react";
import { Navigate } from "react-router-dom";

const ProtectStudent = ({ children }) => {
  const isLoggedIn = localStorage.getItem("studentInfo");
  return isLoggedIn ? children : <Navigate to="/student/login" replace />;
};

export default ProtectStudent;
