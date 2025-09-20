import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaGraduationCap } from "react-icons/fa"; // better icon for school
import api from "../../Services/Api.js"; // centralized API instance

const StudentLogin = () => {
  const [form, setForm] = useState({ email: "", studentId: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/students/login", {
        email: form.email,
        studentId: form.studentId,
      });

      if (res.data) {
        // ✅ Save in sessionStorage instead of localStorage
        sessionStorage.setItem("studentInfo", JSON.stringify(res.data));
        toast.success("Login successful!");
        navigate("/student");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);

      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Invalid login credentials. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Navbar / Header */}
      <div className="bg-dark py-2 px-4">
        <h2 className="d-flex align-items-center gap-2 text-light m-0">
          <FaGraduationCap /> <span>Pinecrest School</span>
        </h2>
      </div>

      {/* Login Box */}
      <div className="container rounded shadow p-4 w-50 mx-auto text-center border mt-5">
        <h2 className="mb-4">Student Login</h2>

        <form onSubmit={handleSubmit} className="w-75 mx-auto">
          {/* Email */}
          <div className="mb-3 text-start">
            <label className="form-label fw-bold">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Student ID */}
          <div className="mb-3 text-start">
            <label className="form-label fw-bold">Student ID</label>
            <input
              type="text"
              name="studentId"
              className="form-control"
              value={form.studentId}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;
