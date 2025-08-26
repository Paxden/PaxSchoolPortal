const express = require("express");
const router = express.Router();
const {
  createCourse,
  getCoursesByDepartment,
} = require("../controllers/courseController");

router.post("/create", createCourse);
router.get("/department/:departmentId", getCoursesByDepartment);

module.exports = router;
