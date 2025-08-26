const Department = require("../models/Department");

// Create a new Faculty
const createDepartment = async (req, res) => {
  const { name, code, faculty } = req.body;
  try {
    const exists = await Department.findOne({ code });
    if (exists)
      return res.status(400).json({ message: "Department already exists" });

    const department = await Department.create({ name, code, faculty });
    res.status(201).json(department);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all faculty
const getDepartments = async (req, res) => {
  const departments = await Department.find({});
  res.status(201).json(departments);
};

module.exports = {
  createDepartment,
  getDepartments,
};
