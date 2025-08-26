import React from "react";

function ProfilePreview() {
  const student = JSON.parse(localStorage.getItem("studentInfo"));
  const profileImage = "https://avatar.iran.liara.run/public/boy";

  // Sample random reminders
  const reminders = [
    "Submit assignment by Friday",
    "Meet with study group at 3 PM",
    "Pay tuition fee before deadline",
    "Prepare for midterm exams",
    "Update your portfolio projects",
  ];

  return (
    <div className="bg-light p-4 shadow" style={{ width: "300px" }}>
      <div className="profile text-center">
        <img src={profileImage} className="rounded-50 mb-3 w-50" alt="" />
        <h5>{student.fullName}</h5>
        <p>{student.email}</p>
        <h6>Student</h6>
      </div>

      <div className="mt-4">
        <h6>Reminders</h6>
        <div className="list-unstyled mt-3  text-muted">
          {reminders.map((reminder, index) => (
            <small key={index} className="mb-2 d-flex align-items-center">
              {reminder}
            </small>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfilePreview;
