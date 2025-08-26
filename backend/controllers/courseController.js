const Course = require("../models/Course");

const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCoursesByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const courses = await Course.find({ department: departmentId });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses" });
  }
};

module.exports = {
  createCourse,
  getCoursesByDepartment,
};
