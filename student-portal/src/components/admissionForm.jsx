import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getFaculties,
  getDepartmentsByFaculty,
  applyAdmission,
} from "../Services/Api";

const AdmissionForm = () => {
  const [step, setStep] = useState(1);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    otherName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    passport: null,
    jambRegNumber: "",
    jambScore: "",
    jambResult: null,
    oLevelExamNumber: "",
    oLevelSubjects: [{ subject: "", grade: "" }], // ✅ array of objects
    oLevelResult: null,
    faculty: "",
    department: "",
  });

  // Fetch faculties on mount
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const res = await getFaculties();
        setFaculties(res.data);
      } catch (err) {
        console.error("Error fetching faculties:", err);
      }
    };
    fetchFaculties();
  }, []);

  // Fetch departments when faculty changes
  useEffect(() => {
    if (formData.faculty) {
      const fetchDepartments = async () => {
        try {
          const res = await getDepartmentsByFaculty(formData.faculty);
          console.log("Departments API response:", res.data);
          setDepartments(res.data.departments || res.data || []);
        } catch (err) {
          console.error("Error fetching departments:", err);
          setDepartments([]);
        }
      };
      fetchDepartments();
    } else {
      setDepartments([]);
    }
  }, [formData.faculty]);

  // Handle text/select input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is updated
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle file input
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  // Handle O-Level subjects
  const handleSubjectChange = (index, field, value) => {
    const updated = [...formData.oLevelSubjects];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, oLevelSubjects: updated }));
  };

  const addSubject = () => {
    setFormData((prev) => ({
      ...prev,
      oLevelSubjects: [...prev.oLevelSubjects, { subject: "", grade: "" }],
    }));
  };

  const removeSubject = (index) => {
    if (formData.oLevelSubjects.length <= 1) return;
    const updated = [...formData.oLevelSubjects];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, oLevelSubjects: updated }));
  };

  // Validate current step
  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email is invalid";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.dateOfBirth)
        newErrors.dateOfBirth = "Date of birth is required";
    } else if (step === 2) {
      if (!formData.jambRegNumber.trim())
        newErrors.jambRegNumber = "JAMB exam number is required";
      if (!formData.jambScore) newErrors.jambScore = "JAMB score is required";
      else if (formData.jambScore < 0 || formData.jambScore > 400)
        newErrors.jambScore = "JAMB score must be between 0 and 400";

      formData.oLevelSubjects.forEach((subject, index) => {
        if (!subject.subject.trim())
          newErrors[`subject-${index}`] = "Subject is required";
        if (!subject.grade) newErrors[`grade-${index}`] = "Grade is required";
      });
    } else if (step === 3) {
      if (!formData.faculty) newErrors.faculty = "Faculty is required";
      if (!formData.department) newErrors.department = "Department is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step navigation
  const nextStep = () => {
    if (validateStep()) {
      setStep((s) => s + 1);
    }
  };

  const prevStep = () => setStep((s) => s - 1);

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep()) {
      alert("Please fix the errors before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData object
      const submitData = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (key === "oLevelSubjects") {
          // Stringify the array for subjects
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });

      // Log the FormData to check what's being sent
      console.log("FormData contents:");
      for (let pair of submitData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      // Call the API
      await applyAdmission(submitData);
      alert("Application submitted successfully!");
      // Reset form or redirect if needed
    } catch (err) {
      console.error("Error submitting application:", err);

      if (err.response?.status === 400) {
        // Handle specific backend validation errors
        if (err.response.data.errors) {
          const apiErrors = {};
          err.response.data.errors.forEach((error) => {
            apiErrors[error.path] = error.msg;
          });
          setErrors(apiErrors);
          alert("Please fix the validation errors.");
        } else {
          alert(err.response.data.message || "Failed to submit application.");
        }
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Routes */}
      <div className="container d-flex gap-3 pt-5">
        <a
          href="/admission/status"
          className="btn btn-sm btn-secondary text-decoration-none"
        >
          Check Status
        </a>

        <a href="/student" className="btn btn-sm btn-dark text-decoration-none">
          Student Portal
        </a>
      </div>

      <div className="container my-4 shadow rounded border border-secondary-subtle p-3">
        <h2 className="mb-4 text-center">Admission Application</h2>

        {/* Progress Bar */}
        <div className="progress mb-4" style={{ height: "25px" }}>
          <div
            className={`progress-bar ${
              step === 1
                ? "bg-secondary"
                : step === 2
                ? "bg-warning"
                : "bg-success"
            }`}
            role="progressbar"
            style={{ width: `${(step / 3) * 100}%` }}
          >
            Step {step} of 3
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="row g-3"
          encType="multipart/form-data"
        >
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <>
              <div className="col-md-4">
                <label className="form-label">
                  First Name <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.firstName ? "is-invalid" : ""
                    }`}
                    required
                  />
                </div>
                {errors.firstName && (
                  <div className="invalid-feedback d-block">
                    {errors.firstName}
                  </div>
                )}
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  Last Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`form-control ${
                    errors.lastName ? "is-invalid" : ""
                  }`}
                  required
                />
                {errors.lastName && (
                  <div className="invalid-feedback d-block">
                    {errors.lastName}
                  </div>
                )}
              </div>

              <div className="col-md-4">
                <label className="form-label">Other Name</label>
                <input
                  type="text"
                  name="otherName"
                  value={formData.otherName}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Email <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    required
                  />
                </div>
                {errors.email && (
                  <div className="invalid-feedback d-block">{errors.email}</div>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Phone <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                  required
                />
                {errors.phone && (
                  <div className="invalid-feedback d-block">{errors.phone}</div>
                )}
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  Gender <span className="text-danger">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`form-select ${errors.gender ? "is-invalid" : ""}`}
                  required
                >
                  <option value="">-- Select --</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors.gender && (
                  <div className="invalid-feedback d-block">
                    {errors.gender}
                  </div>
                )}
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  Date of Birth <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`form-control ${
                    errors.dateOfBirth ? "is-invalid" : ""
                  }`}
                  required
                />
                {errors.dateOfBirth && (
                  <div className="invalid-feedback d-block">
                    {errors.dateOfBirth}
                  </div>
                )}
              </div>

              <div className="col-md-4">
                <label className="form-label">Passport Photo</label>
                <input
                  type="file"
                  name="passport" // Changed to match backend
                  onChange={handleFileChange}
                  className="form-control"
                  accept="image/*"
                />
                <small className="form-text text-muted">
                  Accepted formats: JPG, PNG (Max 2MB)
                </small>
              </div>

              <div className="col-12">
                <label className="form-label">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-control"
                  rows="2"
                ></textarea>
              </div>
            </>
          )}

          {/* Step 2: JAMB & O-Level */}
          {step === 2 && (
            <>
              <div className="col-md-6">
                <label className="form-label">
                  JAMB Exam Number <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="jambRegNumber"
                  value={formData.jambRegNumber}
                  onChange={handleChange}
                  className={`form-control ${
                    errors.jambRegNumber ? "is-invalid" : ""
                  }`}
                  required
                />
                {errors.jambRegNumber && (
                  <div className="invalid-feedback d-block">
                    {errors.jambRegNumber}
                  </div>
                )}
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  JAMB Score <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  name="jambScore"
                  value={formData.jambScore}
                  onChange={handleChange}
                  className={`form-control ${
                    errors.jambScore ? "is-invalid" : ""
                  }`}
                  min="0"
                  max="400"
                  required
                />
                {errors.jambScore && (
                  <div className="invalid-feedback d-block">
                    {errors.jambScore}
                  </div>
                )}
              </div>

              <div className="col-md-3">
                <label className="form-label">JAMB Result File</label>
                <input
                  type="file"
                  name="jambResult" // Changed to match backend
                  onChange={handleFileChange}
                  className="form-control"
                  accept=".pdf,.jpg,.png"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">O-Level Exam Number</label>
                <input
                  type="text"
                  name="oLevelExamNumber"
                  value={formData.oLevelExamNumber}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-12">
                <label className="form-label">
                  O-Level Subjects & Grades{" "}
                  <span className="text-danger">*</span>
                </label>
                {formData.oLevelSubjects.map((sub, idx) => (
                  <div key={idx} className="row mb-2">
                    <div className="col-md-5">
                      <input
                        type="text"
                        placeholder="Subject"
                        value={sub.subject}
                        onChange={(e) =>
                          handleSubjectChange(idx, "subject", e.target.value)
                        }
                        className={`form-control ${
                          errors[`subject-${idx}`] ? "is-invalid" : ""
                        }`}
                        required
                      />
                      {errors[`subject-${idx}`] && (
                        <div className="invalid-feedback d-block">
                          {errors[`subject-${idx}`]}
                        </div>
                      )}
                    </div>
                    <div className="col-md-4">
                      <select
                        value={sub.grade}
                        onChange={(e) =>
                          handleSubjectChange(idx, "grade", e.target.value)
                        }
                        className={`form-select ${
                          errors[`grade-${idx}`] ? "is-invalid" : ""
                        }`}
                        required
                      >
                        <option value="">Select Grade</option>
                        <option value="A1">A1</option>
                        <option value="B2">B2</option>
                        <option value="B3">B3</option>
                        <option value="C4">C4</option>
                        <option value="C5">C5</option>
                        <option value="C6">C6</option>
                        <option value="D7">D7</option>
                        <option value="E8">E8</option>
                        <option value="F9">F9</option>
                      </select>
                      {errors[`grade-${idx}`] && (
                        <div className="invalid-feedback d-block">
                          {errors[`grade-${idx}`]}
                        </div>
                      )}
                    </div>
                    <div className="col-md-2">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => removeSubject(idx)}
                        disabled={formData.oLevelSubjects.length <= 1}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={addSubject}
                >
                  + Add Subject
                </button>
              </div>

              <div className="col-md-6">
                <label className="form-label">O-Level Result File</label>
                <input
                  type="file"
                  name="oLevelResult" // Changed to match backend
                  onChange={handleFileChange}
                  className="form-control"
                  accept=".pdf,.jpg,.png"
                />
              </div>
            </>
          )}

          {/* Step 3: Academic Details */}
          {step === 3 && (
            <>
              <div className="col-md-6">
                <label className="form-label">Intended Course</label>
                <input
                  type="text"
                  name="intendedCourse"
                  value={formData.intendedCourse}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Faculty <span className="text-danger">*</span>
                </label>
                <select
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleChange}
                  className={`form-select ${
                    errors.faculty ? "is-invalid" : ""
                  }`}
                  required
                >
                  <option value="">-- Select Faculty --</option>
                  {faculties.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.name}
                    </option>
                  ))}
                </select>
                {errors.faculty && (
                  <div className="invalid-feedback d-block">
                    {errors.faculty}
                  </div>
                )}
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Department <span className="text-danger">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`form-select ${
                    errors.department ? "is-invalid" : ""
                  }`}
                  required
                  disabled={!departments.length}
                >
                  <option value="">-- Select Department --</option>
                  {Array.isArray(departments) &&
                    departments.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                </select>
                {errors.department && (
                  <div className="invalid-feedback d-block">
                    {errors.department}
                  </div>
                )}
              </div>

              <div className="col-12">
                <div className="card mt-3">
                  <div className="card-header bg-light">
                    <h6 className="mb-0">Application Summary</h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <p>
                          <strong>Name:</strong> {formData.firstName}{" "}
                          {formData.lastName}
                        </p>
                        <p>
                          <strong>Email:</strong> {formData.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {formData.phone}
                        </p>
                        <p>
                          <strong>JAMB Score:</strong> {formData.jambScore}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>Faculty:</strong>{" "}
                          {faculties.find((f) => f._id === formData.faculty)
                            ?.name || "Not selected"}
                        </p>
                        <p>
                          <strong>Department:</strong>{" "}
                          {departments.find(
                            (d) => d._id === formData.department
                          )?.name || "Not selected"}
                        </p>
                        <p>
                          <strong>O-Level Subjects:</strong>{" "}
                          {formData.oLevelSubjects
                            .map((s) => s.subject)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="col-12 d-flex justify-content-between mt-4">
            {step > 1 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={prevStep}
              >
                ← Previous
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                className="btn btn-primary ms-auto"
                onClick={nextStep}
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-success ms-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default AdmissionForm;
