import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = form;

    if (email === "admin@demo.com" && password === "admin") {
      localStorage.setItem("adminLoggedIn", "true");
      navigate("/admin");
    } else {
      setError("Invalid admin credentials.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="w-50">
        <div className="mb-3">
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" required />
        </div>

        <button type="submit" className="btn btn-dark">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
