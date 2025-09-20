const Applicant = require("../models/Applicants");
const Student = require("../models/Students");
const Department = require("../models/Department");

// Submit application
const apply = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      otherName,
      email,
      phone,
      gender,
      dob,
      address,
      intendedCourse,
      faculty,
      department,
      jambRegNumber,
      jambScore,
      oLevelExamNumber,
    } = req.body;

    // Parse subjects (string → array of objects)
    let oLevelSubjects = [];
    if (req.body.oLevelSubjects) {
      try {
        oLevelSubjects = JSON.parse(req.body.oLevelSubjects);
      } catch (err) {
        return res
          .status(400)
          .json({ error: "Invalid O'Level subjects format" });
      }
    }

    // Handle files
    const passport = req.files?.passport
      ? req.files.passport[0].filename
      : null;
    const jambResultFile = req.files?.jambResult
      ? req.files.jambResult[0].filename
      : null;
    const oLevelResultFile = req.files?.oLevelResult
      ? req.files.oLevelResult[0].filename
      : null;

    const applicant = new Applicant({
      firstName,
      lastName,
      otherName,
      email,
      phone,
      gender,
      dateOfBirth: dob,
      address,
      passport,
      intendedCourse,
      faculty,
      department,
      jamb: {
        regNumber: jambRegNumber,
        score: jambScore,
        resultFile: jambResultFile,
      },
      olevel: {
        examNumber: oLevelExamNumber,
        subjects: oLevelSubjects, // ✅ array saved here
        resultFile: oLevelResultFile,
      },
    });

    await applicant.save();
    res.status(201).json(applicant);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ error: "Email already exists. Use another email." });
    }
    console.error("Application submission error:", err);
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
    applicant.reviewedBy = req.user?.id || null;
    await applicant.save();

    const studentId = `STU/${new Date().getFullYear()}/${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const newStudent = new Student({
      firstName: applicant.firstName,
      lastName: applicant.lastName,
      otherName: applicant.otherName,
      email: applicant.email,
      phone: applicant.phone,
      gender: applicant.gender,
      dob: applicant.dateOfBirth,
      address: applicant.address,
      passport: applicant.passport,
      studentId,
      faculty: applicant.faculty,
      department: applicant.department,
      jamb: applicant.jamb,
      olevel: applicant.olevel,
      enrolledAt: new Date(),
      status: "active",
    });

    await newStudent.save();

    res.json({
      message: "Application approved and student enrolled.",
      student: newStudent,
    });
  } catch (err) {
    console.error(err);
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

// Approve fees payment
 const approveFee = async (req, res) => {
  try {
    const { studentId, feeId } = req.params;

    // Find student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find the specific fee
    const fee = student.fees.id(feeId);
    if (!fee) {
      return res.status(404).json({ message: "Fee record not found" });
    }

    // Update fee status
    fee.status = "Approved";
    fee.approvedAt = new Date();

    await student.save();

    res.status(200).json({
      message: "Fee approved successfully.",
      fees: student.fees,
    });
  } catch (error) {
    res.status(500).json({ message: "Error approving fee", error: error.message });
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
