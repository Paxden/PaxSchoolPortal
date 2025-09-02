import React, { useState, useEffect, useCallback } from "react";
import {
  getCoursesByDepartment,
  registerStudentCourses,
  getRegisteredCourses,
  refreshStudentData,
} from "../../Services/Api"; // ✅ use API helpers

const CourseRegistration = () => {
  const API_URL = "http://localhost:5000";
  const MAX_UNITS = 24; // Maximum allowed units

  // State management
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState({
    fetch: false,
    submit: false,
    refresh: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  //   LIst course
  const [showRegistered, setShowRegistered] = useState(false);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [loadingRegistered, setLoadingRegistered] = useState(false);

  // Load student data from localStorage
  useEffect(() => {
    const loadStudentData = () => {
      try {
        const studentInfo = localStorage.getItem("studentInfo");
        if (!studentInfo) {
          throw new Error("No student info found. Please log in again.");
        }

        const parsedInfo = JSON.parse(studentInfo);
        console.log("Parsed student info:", parsedInfo);

        if (!parsedInfo.department) {
          throw new Error("Student department information missing");
        }

        if (!parsedInfo._id) {
          throw new Error("Invalid student ID");
        }

        setStudent(parsedInfo);
      } catch (err) {
        console.error("Student data loading error:", err);
        setError(err.message);

        // Clear invalid data if needed
        if (err.message.includes("Invalid")) {
          localStorage.removeItem("studentInfo");
        }
      }
    };

    loadStudentData();
  }, []);

  // Fetch courses
  const fetchCourses = useCallback(async () => {
    if (!student?.department?._id) return;
    try {
      setLoading((prev) => ({ ...prev, fetch: true }));
      const { data } = await getCoursesByDepartment(student.department._id);
      setCourses(data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching courses");
    } finally {
      setLoading((prev) => ({ ...prev, fetch: false }));
    }
  }, [student]);

  // Refresh student
  const refreshStudent = useCallback(async () => {
    if (!student?._id) return;
    try {
      setLoading((prev) => ({ ...prev, refresh: true }));
      const { data } = await refreshStudentData(student._id);
      localStorage.setItem("studentInfo", JSON.stringify(data));
      setStudent(data);
    } catch (err) {
      console.error("Refresh failed:", err);
    } finally {
      setLoading((prev) => ({ ...prev, refresh: false }));
    }
  }, [student]);

  // Fetch registered courses
  const fetchRegisteredCoursesData = async () => {
    if (!student?._id) return;
    setLoadingRegistered(true);
    try {
      const { data } = await getRegisteredCourses(student._id);
      setRegisteredCourses(data || []);
      setShowRegistered(true);
    } catch (err) {
      setError("Unable to load registered courses");
    } finally {
      setLoadingRegistered(false);
    }
  };

  // Filter courses by search term
  const filteredCourses = courses.filter((course) =>
    searchTerm
      ? course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  console.log("Filtered courses:", filteredCourses);

  // Calculate total units
  const totalUnits = selectedCourses.reduce((total, courseId) => {
    const course = courses.find((c) => c._id === courseId);
    return total + (course?.unit || 0);
  }, 0);

  const getUnitText = (units, max) => {
    const percentage = (units / max) * 100;
    if (percentage >= 90) return `${units}/${max} (Warning: Nearly full)`;
    if (percentage >= 75) return `${units}/${max} (Approaching limit)`;
    return `${units}/${max}`;
  };

  // Course selection handler
  const handleCheckboxChange = (courseId) => {
    const course = courses.find((c) => c._id === courseId);
    if (!course) return;

    const newUnits = selectedCourses.includes(courseId)
      ? totalUnits - (course.unit || 0)
      : totalUnits + (course.unit || 0);

    if (newUnits > MAX_UNITS) {
      setError(`Cannot exceed maximum of ${MAX_UNITS} units`);
      return;
    }

    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
    setError("");
  };

  // Submit handlers
  const handleSubmitClick = () => {
    if (selectedCourses.length === 0) {
      setError("Please select at least one course");
      return;
    }
    setShowConfirm(true);
  };

  // Submit registration
  const handleSubmit = async () => {
    setShowConfirm(false);
    setLoading((prev) => ({ ...prev, submit: true }));
    try {
      const { data } = await registerStudentCourses(
        student._id,
        selectedCourses
      );
      if (data.warnings?.length) {
        setError(data.warnings.join(", "));
      } else {
        setSubmitted(true);
        setSelectedCourses([]);
        await refreshStudent();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register courses");
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  // Fetch courses when student data is available
  useEffect(() => {
    if (student?.department?._id) {
      console.log("Student data available, fetching courses...");
      fetchCourses();
    }
  }, [student, fetchCourses]);

  // Render loading states
  if (!student) {
    return (
      <div className="loading-container">
        <p>Loading student information...</p>
        {error && <div className="error-message">{error}</div>}
      </div>
    );
  }

  return (
    <div className="course-registration container">
      <h2 className="mb-3">Course Registration</h2>
      <div className="card shadow">
        <div className="card-body">
          <div className="student-info d-flex justify-content-between align-items-center mb-4">
            <div className="badge bg-success-subtle text-dark px-3 p-2 fs-6">
              Department: <strong>{student.department?.name || "N/A"}</strong>
            </div>
            <button
              onClick={fetchRegisteredCoursesData}
              disabled={loadingRegistered}
              className="btn btn-sm btn-outline-primary ms-2"
            >
              {loadingRegistered ? "Loading..." : "View Registered Courses"}
            </button>

            <button
              onClick={refreshStudentData}
              disabled={loading.refresh}
              className="btn btn-sm btn-outline-success"
            >
              {loading.refresh ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-1"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Refreshing...
                </>
              ) : (
                "Refresh Data"
              )}
            </button>
          </div>

          {error && (
            <div
              className={`alert ${
                error.includes("Warning") ? "alert-warning" : "alert-danger"
              } alert-dismissible fade show`}
            >
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError("")}
              ></button>
            </div>
          )}

          {submitted && (
            <div className="alert alert-success alert-dismissible fade show">
              Course registration submitted successfully!
              <button
                type="button"
                className="btn-close"
                onClick={() => setSubmitted(false)}
              ></button>
            </div>
          )}

          <div className="courses-section">
            <div className="courses-header d-flex justify-content-between align-items-center mb-3">
              <div className="mb-0 d-flex align-items-center gap-3">
                <h4>Available Courses</h4>{" "}
                <p className="badge  m-0 text-sm bg-secondary">
                  {filteredCourses.length}
                </p>
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  placeholder="Search courses..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                  disabled={loading.fetch}
                />
              </div>
            </div>

            <div className="alert alert-success mb-3">
              <strong>Total Selected Units:</strong>{" "}
              {getUnitText(totalUnits, MAX_UNITS)}
            </div>

            {loading.fetch ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading courses...</span>
                </div>
                <p className="mt-2">Loading courses...</p>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="alert alert-secondary text-center py-4">
                {courses.length === 0
                  ? "No courses found for your department"
                  : "No courses match your search"}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th width="50px">Select</th>
                      <th width="100px">Code</th>
                      <th>Title</th>
                      <th width="100px">Units</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((course) => (
                      <tr key={course._id}>
                        <td>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={selectedCourses.includes(course._id)}
                              onChange={() => handleCheckboxChange(course._id)}
                              disabled={loading.submit}
                              style={{ transform: "scale(1.5)" }}
                            />
                          </div>
                        </td>
                        <td className="fw-bold">{course.code}</td>
                        <td>{course.title}</td>
                        <td className="text-center">{course.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="actions d-flex justify-content-end mt-4">
            <button
              onClick={handleSubmitClick}
              disabled={selectedCourses.length === 0 || loading.submit}
              className="btn btn-success"
            >
              {loading.submit ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-1"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Submitting...
                </>
              ) : (
                "Register Courses"
              )}
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Registration</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Register {selectedCourses.length} courses ({totalUnits}{" "}
                  units)?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="btn btn-primary"
                  disabled={loading.submit}
                >
                  {loading.submit ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-1"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Processing...
                    </>
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRegistered && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Registered Courses</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowRegistered(false)}
                ></button>
              </div>
              <div className="modal-body">
                {registeredCourses.length === 0 ? (
                  <p>No courses registered for this semester yet.</p>
                ) : (
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Title</th>
                        <th>Units</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registeredCourses.map((course) => (
                        <tr key={course._id}>
                          <td>{course.code}</td>
                          <td>{course.title}</td>
                          <td>{course.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowRegistered(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseRegistration;
