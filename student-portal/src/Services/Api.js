// src/Services/api.js
import axios from "axios";

const isLocal = window.location.hostname === "localhost";

const API = axios.create({
  baseURL: isLocal
    ? "http://localhost:5000/"
    : "https://paxschoolportal-backend.onrender.com/api",
});

// Request interceptor to handle multipart/form-data
API.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
  API.post("/admissions/apply", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const checkAdmissionStatus = (email) =>
  API.get(`/admissions/status/${email}`);
export const getApplicants = () => API.get("/admissions");
export const approveApplicant = (id) => API.patch(`/admissions/${id}/accept`);
export const rejectApplicant = (id) => API.patch(`/admissions/${id}/reject`);
export const getStudents = async () => {
  const res = await API.get("/admissions/students");
  return res.data;
};

// =====================
// Fees (Admin)
// =====================
export const createFee = (feeData) => API.post("/fees", feeData);

export const getFees = () => API.get("/fees");

export const verifyFee = (paymentId, status) =>
  API.put(`/fees/verify/${paymentId}`, { status });

export const getPaidStudents = (feeId) => API.get(`/fees/${feeId}/paid`);

export const getUnpaidStudents = (feeId) => API.get(`/fees/${feeId}/unpaid`);

export const getAllPayments = () => API.get("/fees/payments"); // NEW: fetch all payments for admin dashboard

// =====================
// Fees (Student)
// =====================
export const payFee = (studentId, formData) =>
  API.post(`/fees/${studentId}/pay`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getStudentPayments = (studentId) =>
  API.get(`/fees/${studentId}/payments`); // NEW: student can see their own payment history
export const getStudentById = (studentId) => API.get(`/students/${studentId}`);
export const updateStudent = (studentId, studentData) =>
  API.put(`/students/${studentId}`, studentData);
export const deleteStudent = (studentId) =>
  API.delete(`/students/${studentId}`);

// Student Auth
export const studentLogin = (loginData) =>
  API.post("/students/login", loginData);

// Courses
export const getCoursesByDepartment = (departmentId) =>
  API.get(`/courses/department/${departmentId}`);

export const registerStudentCourses = (studentId, courseIds) =>
  API.put(`/students/register-courses/${studentId}`, { courseIds });

export const getRegisteredCourses = (studentId) =>
  API.get(`/students/courses/${studentId}`);

export const refreshStudentData = (studentId) =>
  API.get(`/students/${studentId}`);

export default API;
