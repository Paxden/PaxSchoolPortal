import React from "react";

function ApplicantTable({ applicants, onViewDetails }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>View Details</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((a) => (
            <tr key={a._id}>
              <td>
                {a.firstName} {a.lastName}
              </td>
              <td>{a.email}</td>
              <td>
                <span
                  className={`badge ${
                    a.applicationStatus === "accepted"
                      ? "bg-success"
                      : a.applicationStatus === "rejected"
                      ? "bg-danger"
                      : "bg-warning text-dark"
                  }`}
                >
                  {a.applicationStatus}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => onViewDetails(a)}
                >
                  <i className="bi bi-eye me-1"></i>
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ApplicantTable;
