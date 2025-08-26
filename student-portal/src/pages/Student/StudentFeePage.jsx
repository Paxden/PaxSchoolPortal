import React, { useState } from "react";
import axios from "axios";

const StudentFeePage = () => {
  const [studentInfo, setStudentInfo] = useState(
    JSON.parse(localStorage.getItem("studentInfo")) || {}
  );
  const [session, setSession] = useState("2024/2025");
  const [semester, setSemester] = useState("Harmattan");
  const [amount, setAmount] = useState(50000);

  const handlePay = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/students/pay-fee/${studentInfo._id}`,
        { session, semester, amount }
      );

      // Fetch updated student data
      const { data } = await axios.get(
        `http://localhost:5000/api/students/${studentInfo._id}`
      );

      localStorage.setItem("studentInfo", JSON.stringify(data));
      setStudentInfo(data);

      setAmount(0);
      setSession("2024/2025");
      setSemester("Harmattan");
      alert("Fee marked as paid");
    } catch (error) {
      console.error(error.response?.data?.message || "Payment error");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-4">Tuition Payment</h2>

      <div className="card shadow border-0 p-4 mb-4">
        <h5>Academic Session: {session}</h5>
        <p>Semester: {semester}</p>
        <p>Amount: ₦{amount.toLocaleString()}</p>

        <button className="btn btn-success" onClick={handlePay}>
          Mark as Paid
        </button>
      </div>

      <div className="card shadow-sm mt-3 p-3 border-0">
        <h4 className="mb-3">Fee History</h4>
        <ul className="list-group list-group-flush">
          {studentInfo.fees?.length > 0 ? (
            studentInfo.fees.map((fee, i) => (
              <li
                key={i}
                className="list-group-item d-flex justify-content-between"
              >
                <div>
                  {fee.session} - {fee.semester}
                </div>
                <span
                  className={`badge ${
                    fee.status === "Approved"
                      ? "bg-success"
                      : fee.status === "Paid"
                      ? "bg-warning"
                      : "bg-secondary"
                  }`}
                >
                  {fee.status}
                </span>
              </li>
            ))
          ) : (
            <li className="list-group-item text-muted">No fee records yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default StudentFeePage;
