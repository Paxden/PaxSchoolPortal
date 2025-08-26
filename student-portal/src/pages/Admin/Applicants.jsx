
import React, { useEffect, useState } from "react";
import axios from "axios";
import ApplicantTable from "../../components/Admin/ApplicantTable";

function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/admissions");
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
    await axios.patch(`http://localhost:5000/api/admissions/${id}/accept`);
    fetchApplicants();
  };

  const handleReject = async (id) => {
    await axios.patch(`http://localhost:5000/api/admissions/${id}/reject`);
    fetchApplicants();
  };

  const filteredApplicants = applicants.filter((a) =>
    filter === "all" ? true : a.applicationStatus === filter
  );

  return (
    <div className="container mt-5">
      <h2> Manage Applicants</h2>

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

      {loading ? (
        <p>Loading applicants...</p>
      ) : (
        <ApplicantTable
          applicants={filteredApplicants}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}

export default Applicants;
