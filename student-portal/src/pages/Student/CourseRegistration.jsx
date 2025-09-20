import React, { useState, useEffect, useCallback } from "react";
import {
  getCoursesByDepartment,
  registerStudentCourses,
  getRegisteredCourses,
  refreshStudentData,
} from "../../Services/Api"; // ✅ centralized API helpers

const CourseRegistration = () => {
  const MAX_UNITS = 24; // Maximum allowed units

  // State
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
  const [showRegistered, setShowRegistered] = useState(false);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [loadingRegistered, setLoadingRegistered] = useState(false);

  // Load student from sessionStorage
  useEffect(() => {
    try {
      const studentInfo = sessionStorage.getItem("studentInfo");
      if (!studentInfo)
        throw new Error("No student info found. Please log in.");

      const parsedInfo = JSON.parse(studentInfo);
      if (!parsedInfo._id || !parsedInfo.department) {
        throw new Error("Invalid student information.");
      }
      setStudent(parsedInfo);
    } catch (err) {
      console.error("Student load error:", err);
      setError(err.message);
      sessionStorage.removeItem("studentInfo");
    }
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

  // Refresh student data
  const refreshStudent = useCallback(async () => {
    if (!student?._id) return;
    try {
      setLoading((prev) => ({ ...prev, refresh: true }));
      const { data } = await refreshStudentData(student._id);
      sessionStorage.setItem("studentInfo", JSON.stringify(data));
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
    } catch {
      setError("Unable to load registered courses");
    } finally {
      setLoadingRegistered(false);
    }
  };

  // Filter courses
  const filteredCourses = courses.filter((course) =>
    searchTerm
      ? course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  // Units calculation
  const totalUnits = selectedCourses.reduce((total, courseId) => {
    const course = courses.find((c) => c._id === courseId);
    return total + (course?.unit || 0);
  }, 0);

  const getUnitText = (units, max) => {
    const pct = (units / max) * 100;
    if (pct >= 90) return `${units}/${max} (Warning: Nearly full)`;
    if (pct >= 75) return `${units}/${max} (Approaching limit)`;
    return `${units}/${max}`;
  };

  // Checkbox handler
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

  // Print course registration
  const printCourseRegistration = () => {
    const printContent = document.getElementById("course-registration-content");
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  // Fetch on mount
  useEffect(() => {
    if (student?.department?._id) fetchCourses();
  }, [student, fetchCourses]);

  if (!student) {
    return (
      <div className="loading-container">
        <p>Loading student info...</p>
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
    );
  }

  return (
    <div className="course-registration container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Course Registration</h2>
      </div>

      <div className="card shadow">
        <div className="card-body">
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
              Registration successful!
              <button
                type="button"
                className="btn-close"
                onClick={() => setSubmitted(false)}
              ></button>
            </div>
          )}

          {/* Courses Section */}
          <div className="courses-section">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="badge bg-success-subtle text-dark px-3 p-2 fs-6">
                Department: <strong>{student.department?.name || "N/A"}</strong>
              </div>
              <div style={{ maxWidth: "250px" }}>
                <input
                  type="text"
                  placeholder="Search courses..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                  disabled={loading.fetch}
                />
              </div>
            </div>

            <div className="mb-3 d-flex">
              <div className="p-1 rounded text-bg-secondary ms-auto">
                Total Units: {getUnitText(totalUnits, MAX_UNITS)}
              </div>
            </div>

            {loading.fetch ? (
              <div className="text-center py-4">
                <div className="spinner-border text-success"></div>
                <p>Loading courses...</p>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="alert alert-secondary text-center py-4">
                {courses.length === 0
                  ? "No courses for your department"
                  : "No match found"}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Select</th>
                      <th>Code</th>
                      <th>Title</th>
                      <th>Units</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((course) => (
                      <tr key={course._id}>
                        <td>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedCourses.includes(course._id)}
                            onChange={() => handleCheckboxChange(course._id)}
                            disabled={loading.submit}
                          />
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

          {/* Actions */}
          <div className="d-flex justify-content-between mt-4">
            <button
              onClick={fetchRegisteredCoursesData}
              disabled={loadingRegistered}
              className="btn btn-outline-success"
            >
              {loadingRegistered ? "Loading..." : "View Registered Courses"}
            </button>
            <div>
              <button
                onClick={handleSubmitClick}
                disabled={selectedCourses.length === 0 || loading.submit}
                className="btn btn-success"
              >
                {loading.submit ? "Submitting..." : "Register Courses"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden content for printing */}
      <div id="course-registration-content" style={{ display: "none" }}>
        <h2>Course Registration - {student.department?.name || "N/A"}</h2>
        <h3>Selected Courses</h3>
        {selectedCourses.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Units</th>
              </tr>
            </thead>
            <tbody>
              {selectedCourses.map((courseId) => {
                const course = courses.find((c) => c._id === courseId);
                return course ? (
                  <tr key={course._id}>
                    <td>{course.code}</td>
                    <td>{course.title}</td>
                    <td>{course.unit}</td>
                  </tr>
                ) : null;
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2">
                  <strong>Total Units:</strong>
                </td>
                <td>
                  <strong>{totalUnits}</strong>
                </td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <p>No courses selected</p>
        )}
        <p>Printed on: {new Date().toLocaleString()}</p>
      </div>

      {/* Modals */}
      {showConfirm && (
        <div className="modal show d-block" style={{ background: "#0006" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Confirm Registration</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">
                Register {selectedCourses.length} courses ({totalUnits} units)?
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleSubmit}
                  disabled={loading.submit}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRegistered && (
        <div className="modal show d-block" style={{ background: "#0006" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Registered Courses</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowRegistered(false)}
                ></button>
              </div>
              <div className="modal-body">
                {registeredCourses.length === 0 ? (
                  <p>No registered courses yet.</p>
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
                <button
                  onClick={printCourseRegistration}
                  className="btn btn-outline-secondary me-2"
                >
                  Print Registration
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
