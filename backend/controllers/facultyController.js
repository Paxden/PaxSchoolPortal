const express = require("express");
const Department = require("../models/Department");

const Faculty = require("../models/Faculty");

// Create a new Faculty
const createFaculty = async (req, res) => {
  try {
    const { name, code } = req.body;

    console.log(req.body);

    // Validate input
    if (!name || !code) {
      return res.status(400).json({ error: "Name and code are required" });
    }

    const exists = await Faculty.findOne({ code });
    if (exists) {
      return res.status(400).json({ message: "Faculty already exists" });
    }

    const faculty = await Faculty.create({ name, code });
    res.status(201).json(faculty);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all faculty
const getFaculties = async (req, res) => {
  const faculties = await Faculty.find({});
  res.status(201).json(faculties);
};

// Add department to faculty
const addDepartmentToFaculty = async (req, res) => {
  const { facultyId } = req.params;
  const { name, code } = req.body;

  try {
    // Check if department already exists globally
    const existingDept = await Department.findOne({ code });
    if (existingDept) {
      return res.status(400).json({
        message: "Department code already exists",
      });
    }

    // Create new department
    const department = new Department({ name, code, faculty: facultyId });
    await department.save();

    // Add to faculty
    await Faculty.findByIdAndUpdate(
      facultyId,
      { $push: { departments: department._id } },
      { new: true }
    );

    res
      .status(201)
      .json({ message: "Department added successfully", department });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/faculties/:facultyId/departments
const getDepartmentsByFaculty = async (req, res) => {
  const { facultyId } = req.params;

  try {
    const faculty = await Faculty.findById(facultyId)
      .populate("departments") 
      .exec();

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.status(200).json({
      faculty: faculty.name, // Optional: include faculty name
      departments: faculty.departments,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = {
  createFaculty,
  getFaculties,
  addDepartmentToFaculty,
  getDepartmentsByFaculty,
};
