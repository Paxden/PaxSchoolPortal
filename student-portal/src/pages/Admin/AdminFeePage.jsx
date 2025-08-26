import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminFeePage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          "http://localhost:5000/api/admissions/students"
        );
        setStudents(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load student data");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [refresh]);

  const handleApprove = async (studentId, session, semester) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admissions/approve-fee/${studentId}`,
        {
          session,
          semester,
        }
      );
      setRefresh(!refresh); // Trigger re-fetch
    } catch (err) {
      console.error("Error approving fee:", err);
      alert("Failed to approve fee");
    }
  };

  const getFeeRecords = () => {
    if (!Array.isArray(students)) return [];

    return students.reduce((acc, student) => {
      if (Array.isArray(student.fees)) {
        return [
          ...acc,
          ...student.fees.map((fee) => ({
            ...fee,
            studentId: student._id,
            studentName: student.name,
            studentEmail: student.email,
          })),
        ];
      }
      return acc;
    }, []);
  };

  const feeRecords = getFeeRecords();

  const getStatus = (fee) => {
    if (fee.paid && fee.approved) return "Approved";
    if (fee.paid && !fee.approved) return "Paid";
    return "Unpaid";
  };

  const getStatusClass = (fee) => {
    if (fee.paid && fee.approved) return "bg-success";
    if (fee.paid && !fee.approved) return "bg-warning text-dark";
    return "bg-secondary";
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            <i className="bi bi-cash-stack me-2"></i>
            Approve Student Fees
          </h4>
          <button
            className="btn btn-light btn-sm"
            onClick={() => setRefresh(!refresh)}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              <i className="bi bi-arrow-clockwise"></i>
            )}{" "}
            Refresh
          </button>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Fetching fee data...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center">
              {error}
              <button
                className="btn btn-sm btn-outline-danger ms-3"
                onClick={() => setRefresh(!refresh)}
              >
                Retry
              </button>
            </div>
          ) : feeRecords.length === 0 ? (
            <div className="alert alert-info text-center">
              No fee records available.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-bordered align-middle">
                <thead className="table-dark text-white">
                  <tr>
                    <th>Student</th>
                    <th>Session</th>
                    <th>Semester</th>
                    <th className="text-end">Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {feeRecords.map((fee, index) => (
                    <tr key={`${fee.studentId}-${index}`}>
                      <td>
                        <div className="fw-semibold">{fee.studentName}</div>
                        <div className="text-muted small">
                          {fee.studentEmail}
                        </div>
                      </td>
                      <td>{fee.session}</td>
                      <td>{fee.semester}</td>
                      <td className="text-end">
                        ₦
                        {typeof fee.amount === "number"
                          ? fee.amount.toLocaleString()
                          : fee.amount}
                      </td>
                      <td>
                        <span className={`badge ${getStatusClass(fee)}`}>
                          {getStatus(fee)}
                        </span>
                      </td>
                      <td>
                        {fee.paid && !fee.approved && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() =>
                              handleApprove(
                                fee.studentId,
                                fee.session,
                                fee.semester
                              )
                            }
                          >
                            <i className="bi bi-check-circle me-1"></i>
                            Approve
                          </button>
                        )}
                        {!fee.paid && (
                          <span className="text-muted small">
                            Waiting for payment
                          </span>
                        )}
                        {fee.paid && fee.approved && (
                          <i className="bi bi-check-circle-fill text-success"></i>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFeePage;
