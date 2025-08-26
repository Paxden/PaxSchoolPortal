import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBeer } from "react-icons/fa";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/admin/applicants">
        <h2 className="d-flex align-items-center gap-2 text-light">
          {" "}
          <FaBeer /> <span>Pinecrest </span>
        </h2>
      </Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link" to="/admin/faculty">
              Faculty
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin/">
              Applicants
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin/students">
              Students
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin/courses">
              Courses
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin/fees">
              Fees
            </Link>
          </li>
        </ul>
        <button onClick={handleLogout} className="btn btn-outline-light">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
