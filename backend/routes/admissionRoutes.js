const express = require("express");
const router = express.Router();
const {
  apply,
  checkStatus,
  approveApplication,
  rejectApplication,
  getApplicants,
  getStudents,
  approveFee,
} = require("../controllers/admissionControllers");

// Public
router.post("/apply", apply);
router.get("/status/:email", checkStatus);

// Admin
router.get("/", getApplicants);
router.get("/students", getStudents);
router.patch("/:id/accept", approveApplication);
router.patch("/:id/reject", rejectApplication);
// Approve fees payment
router.put("/approve-fee/:studentId", approveFee);

module.exports = router;
