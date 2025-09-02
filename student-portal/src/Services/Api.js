// src/Services/api.js
import axios from "axios";

const isLocal = window.location.hostname === "localhost";

const API = axios.create({
  baseURL: isLocal
    ? "http://localhost:5000/api"
    : "https://paxschoolportal-backend.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

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
// create new fee record (student paying)
export const createStudentFee = (studentId, feeData) =>
  API.post(`/students/${studentId}/fees`, feeData);

// ✅ Student Auth
export const studentLogin = (loginData) =>
  API.post("/students/login", loginData);

// ✅ Courses
export const getCoursesByDepartment = (departmentId) =>
  API.get(`/courses/department/${departmentId}`);

export const registerStudentCourses = (studentId, courseIds) =>
  API.put(`/students/register-courses/${studentId}`, { courseIds });

export const getRegisteredCourses = (studentId) =>
  API.get(`/students/courses/${studentId}`);

export const refreshStudentData = (studentId) =>
  API.get(`/students/${studentId}`);

// ✅ default export
export default API;
