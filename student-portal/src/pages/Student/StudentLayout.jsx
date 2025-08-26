import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import ProfilePreview from "./ProfilePreview";

const StudentLayout = () => {
  const location = useLocation();
  const student = JSON.parse(localStorage.getItem("studentInfo"));

  const navItems = [
    { label: "Dashboard", path: "/student/" },
    { label: "Course Registration", path: "/student/course-reg" },
    { label: "Fees", path: "/student/fees" },
    { label: "Profile", path: "/student/profile" },
    { label: "CBT Exams", path: "/student/cbt" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("studentInfo");
    window.location.href = "/student/login";
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <div className="bg-dark text-white p-3" style={{ width: "300px" }}>
        <h4 className="mb-4">🎓 Student Panel</h4>
        <ul className="nav flex-column">
          {navItems.map((item) => (
            <li className="nav-item mb-2" key={item.path}>
              <Link
                className={`nav-link text-white ${
                  isActive(item.path) ? "bg-success rounded" : ""
                }`}
                to={item.path}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <button
          onClick={handleLogout}
          className="btn btn-danger btn-sm mt-5 w-100"
        >
          Logout
        </button>
      </div>

      <div className="flex-grow-1 bg-light p-4">
        <h5 className="text-muted mb-4">Welcome, {student.fullName}</h5>
        <div className="row">
          <div className="col-md-8">
            <Outlet />
          </div>
          <div className="col-md-4">
            <ProfilePreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;
