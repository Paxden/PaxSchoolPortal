import React, { useState, useEffect } from "react";
import {
  getStudentFees,
  createStudentFee,
  markFeeAsPaid,
} from "../../Services/Api";

const StudentFeePage = () => {
  const [studentInfo] = useState(
    JSON.parse(localStorage.getItem("studentInfo")) || {}
  );

  const [fees, setFees] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [session, setSession] = useState("2024/2025");
  // eslint-disable-next-line no-unused-vars
  const [semester, setSemester] = useState("Harmattan");
  // eslint-disable-next-line no-unused-vars
  const [amount, setAmount] = useState(50000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load student fee history
  useEffect(() => {
    const loadFees = async () => {
      if (studentInfo._id) {
        setLoading(true);
        try {
          const response = await getStudentFees(studentInfo._id);
          setFees(response.data);
        } catch (error) {
          setError("Failed to load fee history");
          console.error("Fee loading error:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadFees();
  }, [studentInfo._id]); // Added dependency

  // Create a new fee
  const handleCreateFee = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await createStudentFee(studentInfo._id, {
        session,
        semester,
        amount,
      });

      const { data } = await getStudentFees(studentInfo._id);
      setFees(data);
      setSuccess(
        "Fee record created successfully. You can now Pay your tuition."
      );
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to create fee record";
      setError(errorMsg);
      console.error("Fee creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mark an existing fee as paid
  const handleMarkPaid = async (feeId) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await markFeeAsPaid(studentInfo._id, feeId);
      const { data } = await getStudentFees(studentInfo._id);
      setFees(data);
      setSuccess("Fee marked as paid. Awaiting administrator approval.");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to mark fee as paid";
      setError(errorMsg);
      console.error("Mark paid error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-4">Tuition Payment</h2>

      {/* Success and Error Messages */}
      {success && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          {success}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccess("")}
          ></button>
        </div>
      )}

      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      {/* Create fee section */}
      <div className="card shadow border-0 p-4 mb-4">
        <h5>Academic Session: {session}</h5>
        <p>Semester: {semester}</p>
        <p>Amount: ₦{amount.toLocaleString()}</p>

        <button
          className="btn btn-primary"
          onClick={handleCreateFee}
          disabled={loading}
        >
          {loading ? "Processing..." : "Create Fee Record"}
        </button>
      </div>

      {/* Student Fee History */}
      <div className="card shadow-sm mt-3 p-3 border-0">
        <h4 className="mb-3">Fee History</h4>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <ul className="list-group list-group-flush">
            {fees?.length > 0 ? (
              fees.map((fee, i) => (
                <li
                  key={fee._id || i}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    {fee.session} - {fee.semester} (₦
                    {fee.amount?.toLocaleString()})
                  </div>
                  <div>
                    <span
                      className={`badge  me-2 ${
                        fee.status === "Approved"
                          ? "bg-success"
                          : fee.status === "Pending"
                          ? "bg-warning"
                          : "bg-secondary"
                      }`}
                    >
                      {fee.status}
                    </span>
                    {fee.status === "Pending" && (
                      <button
                        className="btn  btn-success"
                        onClick={() => handleMarkPaid(fee._id)}
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Pay Now"}
                      </button>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li className="list-group-item text-muted">
                No fee records yet.
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StudentFeePage;
