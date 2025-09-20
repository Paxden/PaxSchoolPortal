import React from "react";
import { Outlet } from "react-router-dom";
import { FaBeer } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const ApplyPage = () => {
  return (
    <div className="">
      <nav className="navbar shadow bg-body-tertiary">
        <div className="container">
          <a className="navbar-brand" href="#">
            <h2 className="d-flex align-items-center gap-2 text-success">
              <FaBeer /> <span>Pinecrest College of Nursing and Midwifery</span>
            </h2>
          </a>
        </div>
      </nav>
      <Outlet />
    </div>
  );
};

export default ApplyPage;
