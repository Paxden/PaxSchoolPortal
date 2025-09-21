import React from "react";

function ProfilePreview() {
  // Get student info from session storage
  const studentInfo = sessionStorage.getItem("studentInfo");
  const student = studentInfo ? JSON.parse(studentInfo) : null;

  // Determine profile image
  const profileImage = (() => {
    if (!student?.passport) return "https://avatar.iran.liara.run/public/boy"; // default avatar

    // If passport is a string
    if (typeof student.passport === "string") {
      return student.passport.startsWith("http")
        ? student.passport // full URL
        : `http://localhost:5000/uploads/${student.passport}`; // legacy local upload
    }

    // If passport is an object (Cloudinary)
    if (typeof student.passport === "object") {
      return (
        student.passport.secure_url ||
        student.passport.url ||
        "https://avatar.iran.liara.run/public/boy"
      );
    }

    // Fallback
    return "https://avatar.iran.liara.run/public/boy";
  })();

  // Sample reminders
  const reminders = [
    "Submit assignment by Friday",
    "Meet with study group at 3 PM",
    "Pay tuition fee before deadline",
    "Prepare for midterm exams",
    "Update your portfolio projects",
  ];

  if (!student) {
    return (
      <div className="bg-light p-4 shadow rounded-3" style={{ width: "300px" }}>
        <div className="text-center">
          <p className="text-muted">No student data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light p-4 shadow rounded-3" style={{ width: "300px" }}>
      <div className="profile text-center">
        <img
          src={profileImage}
          className="rounded-circle mb-3"
          style={{ width: "120px", height: "120px", objectFit: "cover" }}
          alt="Student Passport"
        />
        <h5>
          {student.firstName} {student.lastName}
        </h5>
        <p className="mb-1">{student.email}</p>
        <h6 className="text-muted">🎓 Student</h6>
      </div>

      <div className="mt-4">
        <h6>Reminders</h6>
        <div className="list-unstyled mt-3 text-muted">
          {reminders.map((reminder, index) => (
            <small key={index} className="mb-2 d-flex align-items-center">
              • {reminder}
            </small>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfilePreview;
