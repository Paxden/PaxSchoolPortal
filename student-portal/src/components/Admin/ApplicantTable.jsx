import React from "react";

const ApplicantTable = ({ applicants, onApprove, onReject }) => {
  return (
    <table className="table table-striped table-hover">
      <thead className="table-dark">
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Course</th>
          <th>Department</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {applicants.map((applicant) => (
          <tr key={applicant._id}>
            <td>{applicant.fullName}</td>
            <td>{applicant.email}</td>
            <td>{applicant.intendedCourse}</td>
            <td>{applicant.department?.name}</td>
            <td>
              <span
                className={`badge ${
                  applicant.applicationStatus === "accepted"
                    ? "bg-success"
                    : applicant.applicationStatus === "pending"
                    ? "bg-warning text-dark"
                    : "bg-danger"
                }`}
              >
                {applicant.applicationStatus}
              </span>
            </td>
            <td>
              {applicant.applicationStatus === "pending" ? (
                <>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => onApprove(applicant._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onReject(applicant._id)}
                  >
                    Reject
                  </button>
                </>
              ) : (
                <small>Reviewed</small>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ApplicantTable;
