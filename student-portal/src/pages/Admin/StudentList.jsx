import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Alert, Spinner } from "react-bootstrap";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(
        "https://paxschoolportal-backend.onrender.com/api/admissions/students"
      );
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students", err);
      setError("Failed to load students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [refreshCount]);

  const handleRefresh = () => {
    setRefreshCount((prev) => prev + 1);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Enrolled Students</h2>
        <Button variant="primary" onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Loading students...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((s) => (
                  <tr key={s._id}>
                    <td>{s.studentId}</td>
                    <td>{s.fullName}</td>
                    <td>{s.email}</td>
                    <td>{s.department?.name || "N/A"}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          s.status === "active" ? "success" : "secondary"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentList;
