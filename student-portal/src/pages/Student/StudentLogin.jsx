import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { FaBeer } from "react-icons/fa";

const StudentLogin = () => {
  const [form, setForm] = useState({ email: "", studentId: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/api/students/login`, {
        email: form.email,
        studentId: form.studentId,
      });

      localStorage.setItem("studentInfo", JSON.stringify(res.data));
      toast.success("Login successful!");
      navigate("/student");
    } catch {
      toast.error("Invalid login credentials.");
    }
  };

  return (
    <div className="">
      <div className="bg-dark py-2 px-4">
        <h2 className="d-flex align-items-center gap-2 text-light">
          {" "}
          <FaBeer /> <span>Pinecrest </span>
        </h2>
      </div>
      <div className="container rounded shadow p-3 w-50 mx-auto text-center border mt-5">
        <h2>Student Login</h2>
        <form onSubmit={handleSubmit} className="w-50 mx-auto mt-5">
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Student ID</label>
            <input
              type="text"
              name="studentId"
              className="form-control"
              value={form.studentId}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-primary">Login</button>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;
