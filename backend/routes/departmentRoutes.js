const express = require("express");
const {
  createDepartment,
  getDepartments,
} = require("../controllers/departmenController");

const router = express.Router();

// Create deparment
router.post("/", createDepartment);

// Get department
router.get("/", getDepartments);

module.exports = router
