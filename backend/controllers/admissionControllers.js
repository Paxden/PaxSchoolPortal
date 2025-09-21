const Applicant = require("../models/Applicants");
const Student = require("../models/Students");
const Department = require("../models/Department");

// ------------------- Submit Application -------------------
const apply = async (req, res) => {
  try {
    // Pretty log for uploaded files
    console.log("Received files:", JSON.stringify(req.files, null, 2));

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
      oLevelSubjects, // JSON string from frontend
    } = req.body;

    // Safely extract uploaded files from Cloudinary
    const passport = req.files?.passport?.[0] || null;
    const jamb = req.files?.jamb?.[0] || null;
    const oLevel = req.files?.olevel?.[0] || null;

    // Parse O-Level subjects
    let parsedSubjects = [];
    if (oLevelSubjects) {
      try {
        parsedSubjects = JSON.parse(oLevelSubjects);
      } catch (err) {
        console.warn("Failed to parse O-Level subjects:", err.message);
      }
    }

    // Prepare file data
    const fileData = (file) =>
      file ? { secure_url: file.path, public_id: file.filename } : null;

    // Create new applicant in MongoDB
    const newApplicant = await Applicant.create({
      firstName,
      lastName,
      otherName,
      email,
      phone,
      gender,
      dateOfBirth: dob,
      address,
      intendedCourse,
      faculty,
      department,

      passport: fileData(passport),

      jamb: {
        regNumber: jambRegNumber,
        score: jambScore,
        resultFile: fileData(jamb),
      },

      olevel: {
        examNumber: oLevelExamNumber,
        resultFile: fileData(oLevel),
        subjects: parsedSubjects,
      },
    });

    res.status(201).json({
      message: "Application submitted successfully",
      applicant: newApplicant,
    });
  } catch (err) {
    console.error("Application Error:", err);
    res.status(500).json({ message: "Application failed", error: err.message });
  }
};


// ------------------- Check status -------------------
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

// ------------------- Approve Application -------------------
const approveApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const applicant = await Applicant.findById(id);
    if (!applicant)
      return res.status(404).json({ message: "Applicant not found" });

    // Update applicant status
    applicant.applicationStatus = "accepted";
    applicant.reviewedAt = new Date();
    applicant.reviewedBy = req.user?.id || null;
    await applicant.save();

    // Generate Student ID
    const studentId = `STU/${new Date().getFullYear()}/${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    // Create student record using applicant data
    const newStudent = new Student({
      firstName: applicant.firstName,
      lastName: applicant.lastName,
      otherName: applicant.otherName,
      email: applicant.email,
      phone: applicant.phone,
      gender: applicant.gender,
      dob: applicant.dateOfBirth,
      address: applicant.address,

      // Cloudinary passport
      passport: applicant.passport
        ? {
            secure_url: applicant.passport.secure_url,
            public_id: applicant.passport.public_id,
          }
        : null,

      studentId,
      faculty: applicant.faculty,
      department: applicant.department,

      jamb: applicant.jamb
        ? {
            regNumber: applicant.jamb.regNumber,
            score: applicant.jamb.score,
            resultFile: applicant.jamb.resultFile
              ? {
                  secure_url: applicant.jamb.resultFile.secure_url,
                  public_id: applicant.jamb.resultFile.public_id,
                }
              : null,
          }
        : null,

      olevel: applicant.olevel
        ? {
            examNumber: applicant.olevel.examNumber,
            subjects: applicant.olevel.subjects,
            resultFile: applicant.olevel.resultFile
              ? {
                  secure_url: applicant.olevel.resultFile.secure_url,
                  public_id: applicant.olevel.resultFile.public_id,
                }
              : null,
          }
        : null,

      enrolledAt: new Date(),
      status: "active",
    });

    await newStudent.save();

    res.json({
      message: "Application approved and student enrolled.",
      student: newStudent,
    });
  } catch (err) {
    console.error("Approve Application Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ------------------- Reject Application -------------------
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

const getApplicants = async (req, res) => {
  const applicants = await Applicant.find().populate("department", "name");
  res.json(applicants);
};

// ------------------- Get Students -------------------
const getStudents = async (req, res) => {
  const students = await Student.find().populate("department", "name");
  res.json(students);
};

const approveFee = async (req, res) => {
  try {
    const { studentId, feeId } = req.params;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const fee = student.fees.id(feeId);
    if (!fee) {
      return res.status(404).json({ message: "Fee record not found" });
    }

    fee.status = "Approved";
    fee.approvedAt = new Date();

    await student.save();

    res.status(200).json({
      message: "Fee approved successfully.",
      fees: student.fees,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error approving fee", error: error.message });
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
