import React from "react";
import { Navigate } from "react-router-dom";

const ProtectStudent = ({ children }) => {
  const isLoggedIn = sessionStorage.getItem("studentInfo"); // ✅ sessionStorage
  return isLoggedIn ? children : <Navigate to="/student/login" replace />;
};

export default ProtectStudent;
