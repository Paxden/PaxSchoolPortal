const Applicant = require("../models/Applicants");
const Student = require("../models/Students");
const Department = require("../models/Department");

// Submit application
const apply = async (req, res) => {
  try {
    const applicant = new Applicant(req.body);
    await applicant.save();
    res.status(201).json(applicant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Check status
const checkStatus = async (req, res) => {
  try {
    const { email } = req.params;
    const applicant = await Applicant.findOne({ email }).populate(
      "department",
      "name code"
    );
    if (!applicant)
      return res.status(404).json({ message: "Application not found." });
    res.json(applicant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve application
const approveApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const applicant = await Applicant.findById(id);
    if (!applicant)
      return res.status(404).json({ message: "Applicant not found" });

    applicant.applicationStatus = "accepted";
    applicant.reviewedAt = new Date();
    applicant.reviewedBy = req.user?.id || null; // Assuming JWT middleware
    await applicant.save();

    const studentId = `STU/${new Date().getFullYear()}/${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    const newStudent = new Student({
      fullName: applicant.fullName,
      email: applicant.email,
      phone: applicant.phone,
      gender: applicant.gender,
      dob: applicant.dateOfBirth,
      studentId,
      department: applicant.department,
      enrolledAt: new Date(),
      status: "active",
    });
    await newStudent.save();

    res.json({
      message: "Application approved and student enrolled.",
      student: newStudent,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reject application
const rejectApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const applicant = await Applicant.findById(id);
    if (!applicant)
      return res.status(404).json({ message: "Applicant not found" });

    applicant.applicationStatus = "rejected";
    applicant.reviewedAt = new Date();
    await applicant.save();

    res.json({ message: "Application rejected." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all applicants
const getApplicants = async (req, res) => {
  const applicants = await Applicant.find().populate("department", "name");
  res.json(applicants);
};

const getStudents = async (req, res) => {
  const students = await Student.find().populate("department", "name");
  res.json(students);
};

//Approve fees payment
// PUT /api/admin/approve-fee/:studentId
const approveFee = async (req, res) => {
  try {
    const { session, semester } = req.body;
    const student = await Student.findById(req.params.studentId);

    const feeRecord = student.fees.find(
      (f) => f.session === session && f.semester === semester
    );

    if (!feeRecord)
      return res.status(404).json({ message: "Fee record not found" });

    feeRecord.status = "Approved";
    feeRecord.approvedDate = new Date();

    await student.save();
    res.status(200).json({ message: "Fee approved", fees: student.fees });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  apply,
  checkStatus,
  approveApplication,
  rejectApplication,
  getApplicants,
  getStudents,
  approveFee,
};
