import React from "react";
import { Row, Col } from "react-bootstrap";

const Profile = () => {
  // ✅ Get student info from sessionStorage instead of localStorage
  const studentInfo = sessionStorage.getItem("studentInfo");
  const student = studentInfo ? JSON.parse(studentInfo) : null;

  if (!student) {
    return <div className="text-center py-5">Loading profile...</div>;
  }

  console.log("Student passport:", student.passport);

  return (
    <div className="container w-100 py-5">
      <div className="card shadow-lg border-0 rounded-4 px-4 py-5 bg-light">
        <h3 className="text-center fw-bold mb-4">🎓 Student Profile</h3>

        {/* Passport */}
        {student.passport && (
          <img
            src={
              typeof student.passport === "string"
                ? student.passport
                : student.passport.secure_url || student.passport.url
            }
            alt="Passport"
            className="rounded-circle shadow mx-auto mb-3"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
        )}

        <Row className="gy-4">
          <Col md={6}>
            <div className="bg-white rounded-3 shadow-sm p-3">
              <strong>Full Name:</strong>
              <p className="mb-0">
                {student.firstName} {student.otherName || ""} {student.lastName}
              </p>
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
                <p className="mb-0">
                  {new Date(student.dob).toLocaleDateString()}
                </p>
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
