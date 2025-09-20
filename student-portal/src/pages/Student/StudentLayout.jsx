import React, { useState, useMemo } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import ProfilePreview from "./ProfilePreview";
import { useStudent } from "../../context/StudentContext";

const StudentLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { student, setStudent } = useStudent();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { label: "Dashboard", path: "/student/" },
    { label: "Course Registration", path: "/student/course-reg" },
    { label: "Fees", path: "/student/fees" },
    { label: "Profile", path: "/student/profile" },
  ];

  // ✅ Memoize active path calculation for better performance
  const activePath = useMemo(() => {
    return (
      navItems.find(
        (item) =>
          location.pathname === item.path ||
          location.pathname.startsWith(item.path + "/")
      )?.path || ""
    );
  }, [location.pathname]);

  const handleLogout = () => {
    setStudent(null);
    sessionStorage.removeItem("studentInfo");
    navigate("/student/login");
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        className={`bg-dark text-white p-3 ${
          sidebarOpen ? "d-block" : "d-none d-md-block"
        }`}
        style={{
          width: "280px",
          minHeight: "100vh",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <h4 className="mb-4">🎓 Student Panel</h4>
        <ul className="nav flex-column">
          {navItems.map((item) => (
            <li className="nav-item mb-2" key={item.path}>
              <Link
                className={`nav-link text-white ${
                  activePath === item.path
                    ? "bg-success rounded px-2"
                    : "hover-bg-gray"
                }`}
                to={item.path}
                onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <button
          onClick={handleLogout}
          className="btn btn-danger btn-sm mt-5 w-100"
          aria-label="Logout from student panel"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 bg-light p-3 p-md-4">
        {/* Toggle Sidebar (Mobile) */}
        <button
          className="btn btn-outline-secondary d-md-none mb-3"
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? "Hide Menu" : "Show Menu"}
        </button>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="text-dark mb-0">
            Welcome, {student?.firstName} {student?.lastName}
          </h4>
          <span className="badge bg-success text">
            ID: {student?.studentId}
          </span>
        </div>

        <div className="row">
          <div className="col-lg-8 col-md-7">
            <Outlet />
          </div>
          <div className="col-lg-4 col-md-5 mt-4 mt-md-0">
            <ProfilePreview />
          </div>
        </div>
      </div>

      {/* Mobile overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          className="d-md-none position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50"
          style={{ zIndex: 999 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default StudentLayout;
