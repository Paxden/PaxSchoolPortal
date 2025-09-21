import React, { useState, useEffect } from "react";
import { payFee, getStudentPayments, getFees } from "../../Services/Api";
import { toast } from "react-toastify";

const StudentFeePage = () => {
  const [activeTab, setActiveTab] = useState("pay");
  const [fees, setFees] = useState([]);
  const [selectedFee, setSelectedFee] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    // Get student info from session storage
    const studentInfo = sessionStorage.getItem("studentInfo");
    if (studentInfo) {
      try {
        const studentData = JSON.parse(studentInfo);
        setStudent(studentData);
        fetchFees();
        fetchPayments(studentData._id);
      } catch (error) {
        console.error("Error parsing student info:", error);
        toast.error("Failed to load student information");
      }
    } else {
      toast.error("Student information not found. Please log in again.");
    }
  }, []);

  const fetchFees = async () => {
    try {
      const response = await getFees();
      setFees(response.data);
    } catch {
      toast.error("Failed to fetch fees");
    }
  };

  const fetchPayments = async (studentId) => {
    try {
      const response = await getStudentPayments(studentId);
      setPayments(response.data);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Failed to fetch payment history");
    }
  };

  const handleFeeSubmit = async (e) => {
    e.preventDefault();

    if (!student || !student._id) {
      toast.error("Student information not available");
      return;
    }

    if (!selectedFee || !receipt) {
      toast.error("Please select a fee and upload a receipt");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("feeId", selectedFee);
      formData.append("receipt", receipt);

      await payFee(student._id, formData);
      toast.success(
        "Payment submitted successfully! Waiting for verification."
      );
      setSelectedFee("");
      setReceipt(null);
      fetchPayments(student._id); // Refresh payment history
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.message || "Failed to submit payment");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  if (!student) {
    return (
      <div className="container mt-4">
        <h2>Fee Management</h2>
        <p>Loading student information...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-2">
        Fee Management - {student.firstName} {student.lastName}
      </h2>
      <p className="text-muted mb-4">Student ID: {student.studentId}</p>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "pay" ? "active" : ""}`}
            onClick={() => setActiveTab("pay")}
          >
            Pay Fee
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            Payment History
          </button>
        </li>
      </ul>

      {activeTab === "pay" && (
        <div className="pay-fee-section">
          <h3 className="mb-4">Pay New Fee</h3>
          <form onSubmit={handleFeeSubmit}>
            <div className="mb-3">
              <label htmlFor="feeSelect" className="form-label">
                Select Fee:
              </label>
              <select
                id="feeSelect"
                className="form-select"
                value={selectedFee}
                onChange={(e) => setSelectedFee(e.target.value)}
                required
              >
                <option value="">-- Select Fee --</option>
                {fees.map((fee) => (
                  <option key={fee._id} value={fee._id}>
                    {fee.title} - {fee.session} {fee.semester} (
                    {formatCurrency(fee.amount)})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="receiptUpload" className="form-label">
                Upload Payment Receipt:
              </label>
              <input
                type="file"
                id="receiptUpload"
                className="form-control"
                accept="image/*,.pdf"
                onChange={(e) => setReceipt(e.target.files[0])}
                required
              />
              {receipt && <p className="text-success mt-2">{receipt.name}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? "Processing..." : "Submit Payment"}
            </button>
          </form>

          <div className="mt-5 p-3 bg-light rounded">
            <h4>Payment Instructions:</h4>
            <ol className="mt-3">
              <li>Select the fee you want to pay</li>
              <li>Make payment through your bank or online platform</li>
              <li>Upload a clear image or PDF of your payment receipt</li>
              <li>Submit for verification by the admin</li>
              <li>Check back later to see if your payment has been verified</li>
            </ol>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="payment-history-section">
          <h3 className="mb-4">Payment History</h3>

          {payments.length === 0 ? (
            <p className="text-muted">No payment history found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Fee</th>
                    <th>Amount</th>
                    <th>Date Paid</th>
                    <th>Status</th>
                    <th>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment._id}>
                      <td>
                        <strong>{payment.fee?.title}</strong>
                        <div className="text-muted small">
                          {payment.fee?.session} - {payment.fee?.semester}
                        </div>
                      </td>
                      <td>{formatCurrency(payment.amount)}</td>
                      <td>{formatDate(payment.paidAt || payment.createdAt)}</td>
                      <td>
                        <span
                          className={`badge ${
                            payment.status === "pending"
                              ? "bg-warning text-dark"
                              : payment.status === "verified"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td>
                        {payment.receipt && (
                          <a
                            href={payment.receipt}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary"
                          >
                            View Receipt
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentFeePage;
