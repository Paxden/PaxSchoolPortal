const express = require("express");
const {
  createFaculty,
  getFaculties,
  addDepartmentToFaculty,
  getDepartmentsByFaculty,
} = require("../controllers/facultyController");

const router = express.Router();

// Create department
router.post("/", createFaculty);

// Get Faculty
router.get("/", getFaculties);

router.post(
  "/:facultyId/departments",
  addDepartmentToFaculty
);
router.get(
  "/:facultyId/departments",
  getDepartmentsByFaculty
);

module.exports = router;
