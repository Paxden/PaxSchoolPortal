const Student = require("../models/Students");
const Course = require("../models/Course");
const express = require("express");

const studentLogin = async (req, res) => {
  const { email, studentId } = req.body;

  try {
    console.log("Login attempt:", email, studentId);

    const student = await Student.findOne({ email, studentId }).populate({
      path: "department",
      select: "name faculty",
      populate: {
        path: "faculty",
        select: "name",
      },
    });

    if (!student)
      return res.status(404).json({ message: "Invalid credentials" });

    console.log("Student:", JSON.stringify(student, null, 2));

    res.json(student);
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const registerCourses = async (req, res) => {
  const { courseIds } = req.body;
  const studentId = req.params.studentId;

  try {
    // 1. Update student’s course list
    const student = await Student.findByIdAndUpdate(
      studentId,
      { courses: courseIds },
      { new: true }
    ).populate({
      path: "courses",
      select: "title code semester level unit", // Exclude nested `students`
    });

    // 2. Add student to each course's students array (without duplication)
    await Promise.all(
      courseIds.map(async (courseId) => {
        await Course.findByIdAndUpdate(courseId, {
          $addToSet: { students: studentId },
        });
      })
    );

    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register courses" });
  }
};

// Get courses by department, level and semester
const getCoursesByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { level, semester } = req.query;

    const query = {
      department: departmentId,
    };

    if (level) query.level = level;
    if (semester) query.semester = semester;

    const courses = await Course.find(query).populate("department", "name");

    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses by department:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get student registered courses
const getRegisteredCourses = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId).populate(
      "courses"
    );
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student.courses);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Paid fees
// PUT /api/students/pay-fee/:studentId
const payFee = async (req, res) => {
  try {
    const { session, semester, amount } = req.body;
    const student = await Student.findById(req.params.studentId);

    if (!student) return res.status(404).json({ message: "Student not found" });

    const existing = student.fees.find(
      (f) => f.session === session && f.semester === semester
    );

    if (existing)
      return res
        .status(400)
        .json({ message: "Fee already marked for this session/semester" });

    student.fees.push({
      session,
      semester,
      amount,
      status: "Paid",
      paidDate: new Date(),
    });

    await student.save();
    res.status(200).json({ message: "Fee marked as paid", fees: student.fees });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  studentLogin,
  registerCourses,
  getCoursesByDepartment,
  getRegisteredCourses,
  payFee,
};
