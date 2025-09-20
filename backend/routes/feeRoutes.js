const express = require("express");
const upload = require("../middlewares/upload"); // multer middleware

const {
  createFee,
  getFees,
  payFee,
  verifyFee,
  getPaidStudents,
  getUnpaidStudents,
  getAllPayments,
  getStudentPayments,
} = require("../controllers/feeController"); // if you move controllers separate

const router = express.Router();

// ------------------- Admin ------------------- //
// Create a new fee (Admin)
router.post("/", createFee);

// Get all fees
router.get("/", getFees);
// Get all payments (Admin dashboard)
router.get("/payments", getAllPayments);

// Verify a student’s payment (Admin approves/rejects)
router.put("/verify/:paymentId", verifyFee);

// Get all students who paid a specific fee
router.get("/:feeId/paid", getPaidStudents);

// Get all students who have not paid a specific fee
router.get("/:feeId/unpaid", getUnpaidStudents);

// ------------------- Student ------------------- //
// Student pays fee (upload receipt)
router.post("/:studentId/pay", upload.single("receipt"), payFee);
// Get all payments made by a student
router.get("/:studentId/payments", getStudentPayments);

// Get student by ID
router.get("/students/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate(
      "department",
      "name"
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student payments
router.get("/fees/:studentId/payments", async (req, res) => {
  try {
    const payments = await Payment.find({ student: req.params.studentId })
      .populate("fee", "title semester session amount")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get student by ID
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("department", "name code") // Populate department details
      .select("-password"); // Exclude password field

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
