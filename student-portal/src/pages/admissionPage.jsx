import React from "react";
import { Outlet } from "react-router-dom";
import { FaBeer } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const ApplyPage = () => {
  return (
    <div className="container-lg py-3">
      <h2 className="d-flex align-items-center gap-2 text-success">
        {" "}
        <FaBeer /> <span>Pinecrest </span>
      </h2>
      <Outlet />
    </div>
  );
};

export default ApplyPage;
