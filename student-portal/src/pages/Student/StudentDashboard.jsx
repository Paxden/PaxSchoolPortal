import React, { useEffect, useState } from "react";
import axios from "axios";
import Reading from "../Student/img/reading.png";

const StudentDashboard = () => {
  const student = JSON.parse(localStorage.getItem("studentInfo"));
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegisteredCourses = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/students/courses/${student._id}`
        );
        setRegisteredCourses(data || []);
      } catch (err) {
        console.error("Error fetching courses", err);
      } finally {
        setLoading(false);
      }
    };

    if (student?._id) {
      fetchRegisteredCourses();
    }
  }, [student]);

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center fw-bold">PineCrest</h2>

      {/* Academic Summary */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card text-bg-success h-100 shadow rounded-3">
            <div className="card-body">
              <h5 className="card-title">Faculty</h5>
              <p className="card-text">
                {student.department?.faculty?.name || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <div className="card text-bg-dark h-100 shadow rounded-3">
            <div className="card-body">
              <h5 className="card-title">Department</h5>
              <p className="card-text">{student.department?.name || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card text-bg-warning h-100 shadow rounded-3">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">Courses</h6>
                <p className="mb-0">
                  {loading
                    ? "Loading..."
                    : registeredCourses.length > 0
                    ? `course${
                        registeredCourses.length > 1 ? "s" : ""
                      } registered`
                    : "No course registered"}
                </p>
              </div>
              <h3 className="mb-0">
                {loading ? "--" : registeredCourses.length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Session Info */}
      <div className="card shadow border-light rounded-3 d-flex flex-md-row align-items-center p-3">
        <div className="flex-grow-1">
          <h5 className="mb-1">2024/2025 Academic Session</h5>
          <p className="mb-0">Harmattan Semester</p>
        </div>
        <img
          src={Reading}
          alt="Reading"
          width="150"
          className="ms-md-3 mt-3 mt-md-0"
        />
      </div>
    </div>
  );
};

export default StudentDashboard;
