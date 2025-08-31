import axios from "axios";

// const isLocal = window.location.hostname === "localhost";

const API = axios.create({
  baseURL:
    "https://paxschoolportal-backend.onrender.com/api", // replace with your tunnel URL
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Student Auth
export const studentLogin = (loginData) =>
  API.post("/students/login", loginData);

// Faculties
export const getFaculties = () => API.get("/faculties");
export const createFaculty = (facultyData) =>
  API.post("/faculties", facultyData);

// Departments
export const getDepartmentsByFaculty = (facultyId) =>
  API.get(`/faculties/${facultyId}/departments`);
export const createDepartment = (facultyId, deptData) =>
  API.post(`/faculties/${facultyId}/departments`, deptData);

// Admissions
export const applyAdmission = (formData) =>
  API.post("/admissions/apply", formData);
export const checkAdmissionStatus = (email) =>
  API.get(`/admissions/status/${email}`);

// Fees
export const getStudentFees = (studentId) =>
  API.get(`/students/${studentId}/fees`);
export const markFeeAsPaid = (studentId, feeId) =>
  API.put(`/students/${studentId}/fees/${feeId}/mark-paid`);
export const approveFeePayment = (studentId, feeId) =>
  API.put(`/students/${studentId}/fees/${feeId}/approve`);

// ✅ default export for generic requests
export default API;
