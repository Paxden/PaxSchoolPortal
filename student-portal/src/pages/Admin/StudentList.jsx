import React, { useEffect, useState } from "react";
import {
  Button,
  Alert,
  Spinner,
  Modal,
  Badge,
  Row,
  Col,
  Form,
  InputGroup,
} from "react-bootstrap";
import { getStudents } from "../../Services/Api";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStudents();
      setStudents(data);
      setFilteredStudents(data);
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

  // Filter students based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStudents(students);
    } else {
      const term = searchTerm.toLowerCase().trim();
      const filtered = students.filter(
        (student) =>
          student.email.toLowerCase().includes(term) ||
          (student.studentId && student.studentId.toLowerCase().includes(term))
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  const handleRefresh = () => {
    setRefreshCount((prev) => prev + 1);
    setSearchTerm(""); // Clear search on refresh
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  // Build full file path from backend
  const fileUrl = (filename) =>
    filename ? `http://localhost:5000/uploads/${filename}` : null;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-success">
          <i className="bi bi-people-fill me-2"></i>
          Enrolled Students
        </h2>
        <Button
          variant="success"
          onClick={handleRefresh}
          disabled={loading}
          className="d-flex align-items-center"
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Refreshing...
            </>
          ) : (
            <>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Refresh Data
            </>
          )}
        </Button>
      </div>

      {/* Search Bar */}
      <div className="row mb-4">
        <div className="col-md-6">
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by email or student ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="outline-secondary"
                onClick={() => setSearchTerm("")}
              >
                <i className="bi bi-x"></i>
              </Button>
            )}
          </InputGroup>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner
            animation="border"
            role="status"
            variant="success"
            className="mb-3"
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Loading students...</p>
        </div>
      ) : (
        <>
          {/* Search Results Info */}
          {searchTerm && (
            <div className="mb-3">
              <Badge bg="info" className="p-2">
                {filteredStudents.length} student(s) found for "{searchTerm}"
              </Badge>
              <Button
                variant="link"
                size="sm"
                className="ms-2"
                onClick={() => setSearchTerm("")}
              >
                Clear search
              </Button>
            </div>
          )}

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s) => (
                    <tr key={s._id}>
                      <td>{s.studentId || "N/A"}</td>
                      <td>
                        {s.firstName} {s.lastName} {s.otherName || ""}
                      </td>
                      <td>{s.email}</td>
                      <td>{s.department?.name || "N/A"}</td>
                      <td>
                        <span
                          className={`badge rounded-pill ${
                            s.applicationStatus === "accepted"
                              ? "bg-success"
                              : s.applicationStatus === "pending"
                              ? "bg-warning text-dark"
                              : "bg-danger"
                          }`}
                        >
                          {s.applicationStatus || s.status}
                        </span>
                      </td>
                      <td>
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => handleViewDetails(s)}
                        >
                          <i className="bi bi-eye me-1"></i> View
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <i className="bi bi-people display-4 text-muted d-block mb-2"></i>
                      {searchTerm
                        ? `No students found for "${searchTerm}"`
                        : "No students found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Student Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <div className="modal-content border-0 rounded-4 shadow-lg">
          <Modal.Header closeButton className="bg-light border-0">
            <Modal.Title className="fw-bold">
              <i className="bi bi-person-badge me-2"></i> Student Details
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="bg-light px-4 py-4">
            {selectedStudent && (
              <div>
                {/* Header Section */}
                <div className="text-center mb-4">
                  {selectedStudent.passport && (
                    <img
                      src={fileUrl(selectedStudent.passport)}
                      alt="Passport"
                      className="rounded-circle shadow"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <h4 className="mt-3 fw-bold">
                    {selectedStudent.firstName} {selectedStudent.lastName}{" "}
                    {selectedStudent.otherName || ""}
                  </h4>
                  <p className="text-muted mb-1">{selectedStudent.email}</p>
                  <span
                    className={`badge ${
                      selectedStudent.applicationStatus === "accepted"
                        ? "bg-success"
                        : selectedStudent.applicationStatus === "pending"
                        ? "bg-warning"
                        : "bg-danger"
                    }`}
                  >
                    {selectedStudent.applicationStatus?.toUpperCase() ||
                      selectedStudent.status}
                  </span>
                </div>

                <Row className="gy-4">
                  <Col md={6}>
                    <div className="bg-white rounded-3 shadow-sm p-3">
                      <h6 className="text-success">Personal Information</h6>
                      <p>
                        <strong>Student ID:</strong>{" "}
                        {selectedStudent.studentId || "N/A"}
                      </p>
                      <p>
                        <strong>Phone:</strong> {selectedStudent.phone || "N/A"}
                      </p>
                      <p>
                        <strong>Gender:</strong>{" "}
                        {selectedStudent.gender || "N/A"}
                      </p>
                      <p>
                        <strong>Address:</strong>{" "}
                        {selectedStudent.address || "N/A"}
                      </p>
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="bg-white rounded-3 shadow-sm p-3">
                      <h6 className="text-success">Academic Information</h6>
                      <p>
                        <strong>Department:</strong>{" "}
                        {selectedStudent.department?.name || "N/A"}
                      </p>
                      <p>
                        <strong>Faculty:</strong>{" "}
                        {selectedStudent.faculty?.name || "N/A"}
                      </p>
                      <p>
                        <strong>Intended Course:</strong>{" "}
                        {selectedStudent.intendedCourse || "N/A"}
                      </p>
                      <p>
                        <strong>Applied On:</strong>{" "}
                        {new Date(
                          selectedStudent.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </Col>
                </Row>

                {/* O'Level Results */}
                {selectedStudent.olevel && (
                  <div className="bg-white rounded-3 shadow-sm p-3 mt-4">
                    <h6 className="text-success border-bottom pb-2">
                      O'Level Results
                    </h6>
                    <p>
                      <strong>Exam Number:</strong>{" "}
                      {selectedStudent.olevel.examNumber}
                    </p>

                    {selectedStudent.olevel.subjects?.length > 0 && (
                      <div className="table-responsive">
                        <table className="table table-sm">
                          <thead className="table-light">
                            <tr>
                              <th>Subject</th>
                              <th>Grade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedStudent.olevel.subjects.map((s, idx) => (
                              <tr key={idx}>
                                <td>{s.subject}</td>
                                <td>
                                  <span className="badge bg-secondary">
                                    {s.grade}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {selectedStudent.olevel.resultFile && (
                      <a
                        href={fileUrl(selectedStudent.olevel.resultFile)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-outline-success mt-2"
                      >
                        <i className="bi bi-download me-1"></i> View O'Level
                        Result
                      </a>
                    )}
                  </div>
                )}

                {/* JAMB Info */}
                {selectedStudent.jamb && (
                  <div className="bg-white rounded-3 shadow-sm p-3 mt-4">
                    <h6 className="text-success border-bottom pb-2">
                      JAMB Details
                    </h6>
                    <Row>
                      <Col md={6}>
                        <p>
                          <strong>Reg Number:</strong>{" "}
                          {selectedStudent.jamb.regNumber}
                        </p>
                      </Col>
                      <Col md={6}>
                        <p>
                          <strong>Score:</strong>{" "}
                          <span className="badge bg-info ms-2">
                            {selectedStudent.jamb.score}
                          </span>
                        </p>
                      </Col>
                    </Row>
                    {selectedStudent.jamb.resultFile && (
                      <a
                        href={fileUrl(selectedStudent.jamb.resultFile)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-outline-success"
                      >
                        <i className="bi bi-download me-1"></i> View JAMB Result
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </Modal.Body>

          <Modal.Footer className="border-0 bg-light">
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
};

export default StudentList;
