import React, { useEffect, useState } from "react";
import {
  getFees,
  createFee,
  getAllPayments,
  verifyFee,
} from "../../Services/Api";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const AdminFeePage = () => {
  const [fees, setFees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    session: "",
    semester: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("fees");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Fees + Payments
  useEffect(() => {
    fetchFees();
    fetchPayments();
  }, []);

  const fetchFees = async () => {
    try {
      const res = await getFees();
      setFees(res.data || []);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to fetch fees.");
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await getAllPayments();
      setPayments(res.data || []);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to fetch payments.");
    }
  };

  // Handle Fee Form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateFee = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage("");
      await createFee(formData);
      setMessage("✅ Fee created successfully.");
      setFormData({ title: "", amount: "", session: "", semester: "" });
      fetchFees();
    } catch (err) {
      console.error(err);
      setMessage("❌ Error creating fee.");
    } finally {
      setLoading(false);
    }
  };

  // Verify Payment
  const handleVerify = async (paymentId, status) => {
    try {
      await verifyFee(paymentId, status);
      setMessage(`✅ Payment marked as ${status}.`);
      fetchPayments();
    } catch (err) {
      console.error(err);
      setMessage("❌ Error verifying payment.");
    }
  };

  // Filter payments by status
  const filteredPayments = payments
    .filter((payment) => {
      if (filterStatus === "all") return true;
      return payment.status === filterStatus;
    })
    .filter((payment) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        (payment.student?.firstName || "")
          .toLowerCase()
          .includes(searchLower) ||
        (payment.student?.lastName || "").toLowerCase().includes(searchLower) ||
        (payment.student?.studentId || "")
          .toLowerCase()
          .includes(searchLower) ||
        (payment.fee?.title || "").toLowerCase().includes(searchLower)
      );
    });

  // Calculate statistics
  const totalFees = fees.length;
  const totalPayments = payments.length;
  // eslint-disable-next-line no-unused-vars
  const pendingPayments = payments.filter((p) => p.status === "pending").length;
  // eslint-disable-next-line no-unused-vars
  const verifiedPayments = payments.filter(
    (p) => p.status === "verified"
  ).length;
  const totalRevenue = payments
    .filter((p) => p.status === "verified")
    .reduce((sum, payment) => sum + (payment.fee?.amount || 0), 0);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Fee Management Dashboard</h2>
        <div className="d-flex gap-2">
          <div className="bg-light p-2 rounded text-center">
            <small className="text-muted d-block">Total Fees</small>
            <span className="fw-bold text-success">{totalFees}</span>
          </div>
          <div className="bg-light p-2 rounded text-center">
            <small className="text-muted d-block">Total Payments</small>
            <span className="fw-bold text-info">{totalPayments}</span>
          </div>
          <div className="bg-light p-2 rounded text-center">
            <small className="text-muted d-block">Revenue</small>
            <span className="fw-bold text-success">
              ₦{totalRevenue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "fees" ? "active" : ""}`}
            onClick={() => setActiveTab("fees")}
          >
            <i className="bi bi-cash-coin me-2"></i>Fee Management
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "payments" ? "active" : ""}`}
            onClick={() => setActiveTab("payments")}
          >
            <i className="bi bi-receipt me-2"></i>Payment Verification
          </button>
        </li>
      </ul>

      {/* Fees Management Tab */}
      {activeTab === "fees" && (
        <>
          {/* Fee Creation Form */}
          <div className="card p-4 shadow-sm mb-4">
            <h4 className="card-title mb-4">
              <i className="bi bi-plus-circle me-2"></i>Create New Fee
            </h4>
            <form onSubmit={handleCreateFee}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Fee Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. Tuition Fee"
                    required
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Amount (₦)</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Amount"
                    min="0"
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Session</label>
                  <input
                    type="text"
                    name="session"
                    value={formData.session}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. 2024/2025"
                    required
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Semester</label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Semester</option>
                    <option value="Harmattan">Harmattan</option>
                    <option value="Rain">Rain</option>
                  </select>
                </div>
                <div className="col-md-1 d-flex align-items-end">
                  <button
                    className="btn btn-success w-100"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : (
                      <i className="bi bi-check-lg"></i>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Fees List */}
          <div className="card p-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="card-title mb-0">
                <i className="bi bi-list-ul me-2"></i>All Fees
              </h4>
              <span className="badge bg-success">{fees.length} fees</span>
            </div>

            {fees.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Title</th>
                      <th>Amount</th>
                      <th>Session</th>
                      <th>Semester</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees.map((fee) => (
                      <tr key={fee._id}>
                        <td className="fw-bold">{fee.title}</td>
                        <td>₦{fee.amount?.toLocaleString()}</td>
                        <td>{fee.session}</td>
                        <td>
                          <span className="badge bg-info">{fee.semester}</span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-success me-2">
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger">
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-cash-coin" style={{ fontSize: "3rem" }}></i>
                <p className="mt-3">No fees created yet.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Payments Verification Tab */}
      {activeTab === "payments" && (
        <div className="card p-4 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="card-title mb-0">
              <i className="bi bi-receipt me-2"></i>Student Payments
            </h4>
            <div className="d-flex gap-2">
              <div className="input-group" style={{ width: "250px" }}>
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="form-select"
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
              <table className="table table-striped table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Faculty</th>
                    <th>Department</th>
                    <th>Fee</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Receipt</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((pay) => (
                    <tr key={pay._id}>
                      <td className="fw-bold">
                        {pay.student?.studentId || "N/A"}
                      </td>
                      <td>
                        {pay.student?.firstName} {pay.student?.lastName}
                      </td>
                      <td>{pay.student?.faculty?.name || "N/A"}</td>
                      <td>{pay.student?.department?.name || "N/A"}</td>
                      <td>{pay.fee?.title || "N/A"}</td>
                      <td>₦{(pay.fee?.amount || 0).toLocaleString()}</td>
                      <td>{new Date(pay.createdAt).toLocaleDateString()}</td>
                      <td>
                        {pay.receipt ? (
                          <a
                            href={`/uploads/${pay.receipt}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-outline-success"
                          >
                            <i className="bi bi-eye me-1"></i>View
                          </a>
                        ) : (
                          <span className="text-muted">No Receipt</span>
                        )}
                      </td>
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
                        {pay.status === "pending" && (
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleVerify(pay._id, "verified")}
                              title="Approve Payment"
                            >
                              <i className="bi bi-check-lg"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleVerify(pay._id, "rejected")}
                              title="Reject Payment"
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </div>
                        )}
                        {(pay.status === "verified" ||
                          pay.status === "rejected") && (
                          <span className="text-muted">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-receipt" style={{ fontSize: "3rem" }}></i>
              <p className="mt-3">
                {searchTerm || filterStatus !== "all"
                  ? "No payments match your search criteria"
                  : "No student payments yet."}
              </p>
              {(searchTerm || filterStatus !== "all") && (
                <button
                  className="btn btn-outline-success mt-2"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("all");
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      )}

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
  );
};

export default AdminFeePage;
