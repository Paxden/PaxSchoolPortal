import React, { useEffect, useState } from "react";
import { getFees, payFee, getStudentPayments } from "../../Services/Api";
import "bootstrap/dist/css/bootstrap.min.css";

const StudentFeePage = () => {
  const student = JSON.parse(localStorage.getItem("studentInfo"));
  const studentId = student?._id;

  const [fees, setFees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedFee, setSelectedFee] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("payment");
  const [filterStatus, setFilterStatus] = useState("all");

  // Load fees
  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await getFees();
        setFees(res.data);
      } catch (err) {
        console.error(err);
        setMessage("❌ Failed to load fees. Please try again later.");
      }
    };
    fetchFees();
  }, []);

  // Load student payment history
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await getStudentPayments(studentId);
        setPayments(res.data);
      } catch (err) {
        console.error(err);
        setMessage("❌ Failed to load payment history.");
      }
    };
    if (studentId) fetchPayments();
  }, [studentId]);

  // Handle receipt preview
  const handleReceiptChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceipt(file);

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setReceiptPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setReceiptPreview(null);
      }
    }
  };

  // Handle payment
  const handlePay = async (e) => {
    e.preventDefault();
    if (!selectedFee || !receipt) {
      setMessage("Please select a fee and upload a receipt.");
      return;
    }

    const formData = new FormData();
    formData.append("feeId", selectedFee);
    formData.append("receipt", receipt);

    try {
      setLoading(true);
      setMessage("");

      await payFee(studentId, formData);

      setMessage("✅ Payment submitted successfully. Awaiting verification.");
      setReceipt(null);
      setReceiptPreview(null);
      setSelectedFee("");

      // refresh history
      const res = await getStudentPayments(studentId);
      setPayments(res.data);

      // Switch to history tab
      setActiveTab("history");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error submitting payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter payments by status
  const filteredPayments = payments.filter((payment) => {
    if (filterStatus === "all") return true;
    return payment.status === filterStatus;
  });

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Tuition Management </h2>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "payment" ? "active" : ""}`}
            onClick={() => setActiveTab("payment")}
          >
            Make Payment
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

      {/* Payment Form Tab */}
      {activeTab === "payment" && (
        <div className="card">
          <div className="card-body">
            <h4 className="card-title mb-4">Submit Fee Payment</h4>

            <form onSubmit={handlePay}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Select Fee</label>
                  <select
                    className="form-select"
                    value={selectedFee}
                    onChange={(e) => setSelectedFee(e.target.value)}
                    required
                  >
                    <option value="">-- Choose Fee --</option>
                    {fees.map((fee) => (
                      <option key={fee._id} value={fee._id}>
                        {fee.title} - {fee.session} {fee.semester} (₦
                        {fee.amount.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Upload Receipt (Image or PDF)
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*,application/pdf"
                    onChange={handleReceiptChange}
                    required
                  />
                  <div className="form-text">
                    Upload a clear image or PDF of your payment receipt
                  </div>
                </div>
              </div>

              {receiptPreview && (
                <div className="mb-3">
                  <label className="form-label">Receipt Preview</label>
                  <div>
                    <img
                      src={receiptPreview}
                      alt="Receipt preview"
                      className="img-thumbnail"
                      style={{ maxHeight: "200px" }}
                    />
                  </div>
                </div>
              )}

              <button
                className="btn btn-success"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Submitting...
                  </>
                ) : (
                  "Submit Payment"
                )}
              </button>
            </form>

            {message && (
              <div
                className={`alert ${
                  message.includes("✅") ? "alert-success" : "alert-danger"
                } mt-3`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment History Tab */}
      {activeTab === "history" && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Payment History</h4>

            <div className="d-flex gap-2 align-items-center">
              <span>Filter by:</span>
              <select
                className="form-select form-select-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ width: "auto" }}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {filteredPayments.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Fee</th>
                    <th>Semester</th>
                    <th>Session</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((pay) => (
                    <tr key={pay._id}>
                      <td>{pay.fee?.title}</td>
                      <td>{pay.fee?.semester}</td>
                      <td>{pay.fee?.session}</td>
                      <td>₦{(pay.fee?.amount || 0).toLocaleString()}</td>
                      <td>{new Date(pay.createdAt).toLocaleDateString()}</td>
                      <td>
                        {pay.status === "pending" && (
                          <span className="badge bg-warning text-dark">
                            Pending
                          </span>
                        )}
                        {pay.status === "verified" && (
                          <span className="badge bg-success">Verified</span>
                        )}
                        {pay.status === "rejected" && (
                          <span className="badge bg-danger">Rejected</span>
                        )}
                      </td>
                      <td>
                        {pay.receipt ? (
                          <a
                            href={`/uploads/${pay.receipt}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-outline-success"
                          >
                            View
                          </a>
                        ) : (
                          "No receipt"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="text-muted mb-3">
                <i className="bi bi-receipt" style={{ fontSize: "3rem" }}></i>
              </div>
              <h5>No payment history found</h5>
              <p className="text-muted">
                {filterStatus !== "all"
                  ? `No payments with status '${filterStatus}'`
                  : "You haven't made any payments yet."}
              </p>
              {filterStatus !== "all" && (
                <button
                  className="btn btn-outline-success"
                  onClick={() => setFilterStatus("all")}
                >
                  View All Payments
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentFeePage;
