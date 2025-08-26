import React, { useState } from "react";
import axios from "axios";

const StatusCheck = () => {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleCheckStatus = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admissions/status/${email}`
      );
      setResult(res.data);
      setError("");
    } catch {
      setResult(null);
      setError("No application found for this email.");
    }
  };

  return (
    <div className="container mt-5">
      <h4>Check Application Status</h4>

      <form onSubmit={handleCheckStatus} className="mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-auto">
            <input
              type="email"
              className="form-control"
              placeholder="Enter your application email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="col-auto">
            <button className="btn btn-sm btn-success" type="submit">
              Check Status
            </button>
          </div>
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {result && (
        <div className="card shadow rounded-3">
          <div className="card-body">
            <h5 className="card-title">{result.fullName}</h5>
            <p className="card-text">
              <strong>Email:</strong> {result.email}
            </p>
            <p className="card-text">
              <strong>Department:</strong> {result.department?.name}
            </p>
            <p className="card-text">
              <strong>Application Status:</strong>
              <span
                className={`badge ms-2 ${
                  result.applicationStatus === "approved"
                    ? "bg-success"
                    : result.applicationStatus === "pending"
                    ? "bg-warning text-dark"
                    : "bg-danger"
                }`}
              >
                {result.applicationStatus.toUpperCase()}
              </span>
            </p>
            <p className="text-muted">
              Applied on {new Date(result.appliedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusCheck;
