import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const AdmissionForm = () => {
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    intendedCourse: "",
    department: "",
  });

  const [status, setStatus] = useState(null);

  // Load all faculties on mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/faculties")
      .then((res) => setFaculties(res.data))
      .catch((err) => console.error("Error fetching faculties:", err));
  }, []);

  // Fetch departments when a faculty is selected
  const handleFacultyChange = async (e) => {
    const facultyId = e.target.value;
    setSelectedFaculty(facultyId);
    setFormData({ ...formData, department: "" });

    try {
      const res = await axios.get(
        `http://localhost:5000/api/faculties/${facultyId}/departments`
      );
      setDepartments(res.data.departments);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setDepartments([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/admissions/apply", formData);
      setStatus("Application submitted successfully.");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        dateOfBirth: "",
        address: "",
        intendedCourse: "",
        department: "",
      });
      setSelectedFaculty("");
      setDepartments([]);
    } catch (err) {
      console.error("Error submitting application:", err);
      setStatus("Error submitting application. Check your input.");
    }
  };

  const [step, setStep] = useState(1);

  // Animation variants
  const variants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // Validation for each step
  const validateStep = () => {
    switch (step) {
      case 1:
        return formData.fullName && formData.email;
      case 2:
        return formData.phone && formData.gender && formData.dateOfBirth;
      case 3:
        return formData.address;
      case 4:
        return (
          formData.intendedCourse && selectedFaculty && formData.department
        );
      default:
        return false;
    }
  };
  return (
    <div className="shadow border mt-5 mx-auto rounded p-4 mt-3">
      <h4 className="text-center mb-4">Student Admission Application</h4>
      {status && <div className="alert alert-info">{status} <div className="ms-3"><a href="admission/status">Check Status</a></div></div>}
      <form onSubmit={handleSubmit} className="row justify-content-center g-3">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="row g-3"
            >
              {/* Full Name */}
              <div className="col-md-6">
                <label className="form-label">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-person-fill"></i>
                  </span>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <div className="input-group">
                  <span className="input-group-text">@</span>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="row g-3"
            >
              {/* Phone */}
              <div className="col-md-6">
                <label className="form-label">Phone</label>
                <div className="input-group">
                  <span className="input-group-text">+1</span>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="col-md-3">
                <label className="form-label">Gender</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-gender-ambiguous"></i>
                  </span>
                  <select
                    name="gender"
                    className="form-select"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="col-md-3">
                <label className="form-label">Date of Birth</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-calendar"></i>
                  </span>
                  <input
                    type="date"
                    name="dateOfBirth"
                    className="form-control"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="row g-3"
            >
              {/* Address */}
              <div className="col-12">
                <label className="form-label">Home Address</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-geo-alt-fill"></i>
                  </span>
                  <textarea
                    name="address"
                    className="form-control"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="row g-3"
            >
              {/* Intended Course */}
              <div className="col-md-6">
                <label className="form-label">Intended Course</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-book"></i>
                  </span>
                  <input
                    type="text"
                    name="intendedCourse"
                    className="form-control"
                    value={formData.intendedCourse}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Faculty */}
              <div className="col-md-6">
                <label className="form-label">Select Faculty</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-diagram-3-fill"></i>
                  </span>
                  <select
                    name="faculty"
                    className="form-select"
                    value={selectedFaculty}
                    onChange={handleFacultyChange}
                    required
                  >
                    <option value="">Choose Faculty...</option>
                    {faculties.map((fac) => (
                      <option key={fac._id} value={fac._id}>
                        {fac.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Department */}
              <div className="col-md-6">
                <label className="form-label">Select Department</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-building"></i>
                  </span>
                  <select
                    name="department"
                    className="form-select"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    disabled={!selectedFaculty}
                  >
                    <option value="">Choose Department...</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="d-flex justify-content-between mt-4">
          {step > 1 && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={prevStep}
            >
              ← Back
            </button>
          )}
          {step < 4 ? (
            <button
              type="button"
              className="btn btn-primary ms-auto"
              onClick={nextStep}
              disabled={!validateStep()}
            >
              Next →
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-success ms-auto"
              onClick={handleSubmit}
              disabled={!validateStep()}
            >
              <i className="bi bi-send-fill me-2"></i>
              Submit Application
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdmissionForm;
