import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";

const MultiStepForm = ({
  formData,
  handleChange,
  handleFacultyChange,
  faculties,
  departments,
  handleSubmit,
  selectedFaculty,
}) => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: { duration: 0.4 },
  };

  return (
    <form onSubmit={handleSubmit} className="row justify-content-center g-3">
      <AnimatePresence mode="wait">
        {/* Step 1: Personal Info */}
        {step === 1 && (
          <motion.div key="step1" {...fadeIn} className="col-md-10">
            <h4 className="mb-3 text-primary">Step 1: Personal Information</h4>
            <div className="row g-3">
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
            </div>
            <div className="d-flex justify-content-end mt-4">
              <button
                type="button"
                className="btn btn-primary"
                onClick={nextStep}
              >
                Next →
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Contact Info */}
        {step === 2 && (
          <motion.div key="step2" {...fadeIn} className="col-md-10">
            <h4 className="mb-3 text-primary">Step 2: Contact Information</h4>
            <div className="row g-3">
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
            </div>
            <div className="d-flex justify-content-between mt-4">
              <button type="button" className="btn btn-secondary" onClick={prevStep}>
                ← Back
              </button>
              <button type="button" className="btn btn-primary" onClick={nextStep}>
                Next →
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Academic Info */}
        {step === 3 && (
          <motion.div key="step3" {...fadeIn} className="col-md-10">
            <h4 className="mb-3 text-primary">Step 3: Academic Information</h4>
            <div className="row g-3">
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
            </div>
            <div className="d-flex justify-content-between mt-4">
              <button type="button" className="btn btn-secondary" onClick={prevStep}>
                ← Back
              </button>
              <button type="submit" className="btn btn-success">
                <i className="bi bi-send-fill me-2"></i>
                Submit Application
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

export default MultiStepForm;
