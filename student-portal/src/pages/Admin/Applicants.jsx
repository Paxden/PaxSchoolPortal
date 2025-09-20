import React, { useEffect, useState } from "react";
import {
  getApplicants,
  approveApplicant,
  rejectApplicant,
} from "../../Services/Api";
import ApplicantTable from "../../components/Admin/ApplicantTable";

function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await getApplicants();
      setApplicants(res.data);
    } catch (err) {
      console.error("Error fetching applicants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveApplicant(id);
      fetchApplicants();
      setSelectedApplicant(null);
    } catch (err) {
      console.error("Error approving applicant:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectApplicant(id);
      fetchApplicants();
      setSelectedApplicant(null);
    } catch (err) {
      console.error("Error rejecting applicant:", err);
    }
  };

  const filteredApplicants = applicants.filter((a) =>
    filter === "all" ? true : a.applicationStatus === filter
  );

  // Build full file path from backend
  const fileUrl = (filename) =>
    filename ? `http://localhost:5000/uploads/${filename}` : null;

  return (
    <div className="container mt-5">
      <h2>Manage Applicants</h2>

      {/* Filter */}
      <div className="mb-3">
        <label className="form-label me-2">Filter by status:</label>
        <select
          className="form-select w-auto d-inline"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="accepted">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading applicants...</p>
      ) : (
        <ApplicantTable
          applicants={filteredApplicants}
          onViewDetails={(a) => setSelectedApplicant(a)}
        />
      )}

      {/* Modal */}
      {selectedApplicant && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  Applicant Details - {selectedApplicant.firstName}{" "}
                  {selectedApplicant.lastName}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setSelectedApplicant(null)}
                ></button>
              </div>

              <div className="modal-body bg-light px-4 py-4">
                {/* Passport + Basic Info */}
                <div className="text-center mb-4">
                  {selectedApplicant.passport && (
                    <img
                      src={fileUrl(selectedApplicant.passport)}
                      alt="Passport"
                      className="rounded-circle shadow"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <h6 className="mt-3 fw-bold text-secondary">
                    {selectedApplicant.email}
                  </h6>
                  <p className="mb-1">
                    <strong>Phone:</strong> {selectedApplicant.phone}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="badge bg-secondary">
                      {selectedApplicant.applicationStatus}
                    </span>
                  </p>
                </div>

                {/* O'Level */}
                {selectedApplicant.olevel && (
                  <div className="bg-white rounded-3 shadow-sm p-3 mb-4">
                    <h6 className="fw-bold">O'Level Results</h6>
                    <p>
                      <strong>Exam Number:</strong>{" "}
                      {selectedApplicant.olevel.examNumber}
                    </p>
                    {selectedApplicant.olevel.resultFile && (
                      <a
                        href={fileUrl(selectedApplicant.olevel.resultFile)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-outline-success mb-2"
                      >
                        <i className="bi bi-file-earmark-text"></i> View Result
                        File
                      </a>
                    )}
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedApplicant.olevel.subjects?.map((s, i) => (
                          <tr key={i}>
                            <td>{s.subject}</td>
                            <td>{s.grade}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* JAMB */}
                {selectedApplicant.jamb && (
                  <div className="bg-white rounded-3 shadow-sm p-3 mb-4">
                    <h6 className="fw-bold">JAMB Details</h6>
                    <p>
                      <strong>Reg Number:</strong>{" "}
                      {selectedApplicant.jamb.regNumber}
                    </p>
                    <p>
                      <strong>Score:</strong> {selectedApplicant.jamb.score}
                    </p>
                    {selectedApplicant.jamb.resultFile && (
                      <a
                        href={fileUrl(selectedApplicant.jamb.resultFile)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-outline-success"
                      >
                        <i className="bi bi-file-earmark-text"></i> View JAMB
                        Result
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div className="modal-footer border-0 bg-light">
                <button
                  className="btn btn-success"
                  onClick={() => handleApprove(selectedApplicant._id)}
                >
                  <i className="bi bi-check-circle"></i> Approve
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleReject(selectedApplicant._id)}
                >
                  <i className="bi bi-x-circle"></i> Reject
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedApplicant(null)}
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
}

export default Applicants;
