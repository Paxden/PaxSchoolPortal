const Student = require("../models/Students");
const express = require("express");
const {
  studentLogin,
  registerCourses,
  getCoursesByDepartment,
  getRegisteredCourses,
  payFee,
} = require("../controllers/studentController");
const {
  getStudentFees,
  markFeeAsPaid,
  approveFeePayment,
  createStudentFee,
} = require("../controllers/feeController.js");

const router = express.Router();
// Student Login Route
router.post("/login", studentLogin);

// Register Courses Route
router.put("/register-courses/:studentId", registerCourses);

// Get courses by department, level and semester
router.get("/courses/department/:departmentId", getCoursesByDepartment);

// Get registered courses for a student
router.get("/courses/:studentId", getRegisteredCourses);

// Pay fees
// create fees
router.post("/:studentId/pay-fee", payFee);


module.exports = router;
