import React from "react";
import { Row, Col } from "react-bootstrap";

const Profile = () => {
  const studentInfo = localStorage.getItem("studentInfo");
  const student = studentInfo ? JSON.parse(studentInfo) : null;

  if (!student) {
    return <div className="text-center py-5">Loading profile...</div>;
  }

  return (
    <div className="container w-100 py-5">
      <div className="card shadow-lg border-0 rounded-4 px-4 py-5 bg-light">
        <h3 className="text-center fw-bold mb-4">🎓 Student Profile</h3>
        <Row className="gy-4">
          <Col md={6}>
            <div className="bg-white rounded-3 shadow-sm p-3">
              <strong>Full Name:</strong>
              <p className="mb-0">{student.fullName}</p>
            </div>
          </Col>

          <Col md={6}>
            <div className="bg-white rounded-3 shadow-sm p-3">
              <strong>Email:</strong>
              <p className="mb-0">{student.email}</p>
            </div>
          </Col>

          <Col md={6}>
            <div className="bg-white rounded-3 shadow-sm p-3">
              <strong>Student ID:</strong>
              <p className="mb-0">{student.studentId}</p>
            </div>
          </Col>

          {student.department && (
            <Col md={6}>
              <div className="bg-white rounded-3 shadow-sm p-3">
                <strong>Department:</strong>
                <p className="mb-0">{student.department.name}</p>
              </div>
            </Col>
          )}

          {student.phone && (
            <Col md={6}>
              <div className="bg-white rounded-3 shadow-sm p-3">
                <strong>Phone:</strong>
                <p className="mb-0">{student.phone}</p>
              </div>
            </Col>
          )}

          {student.dob && (
            <Col md={6}>
              <div className="bg-white rounded-3 shadow-sm p-3">
                <strong>Date of Birth:</strong>
                <p className="mb-0">{student.dob}</p>
              </div>
            </Col>
          )}

          {student.gender && (
            <Col md={6}>
              <div className="bg-white rounded-3 shadow-sm p-3">
                <strong>Gender:</strong>
                <p className="mb-0">{student.gender}</p>
              </div>
            </Col>
          )}

          {student.status && (
            <Col md={6}>
              <div className="bg-white rounded-3 shadow-sm p-3">
                <strong>Status:</strong>
                <p className="mb-0 text-success">{student.status}</p>
              </div>
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
};

export default Profile;
