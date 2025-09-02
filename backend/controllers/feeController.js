import Fee from "../models/Fee.js";
import Student from "../models/Students.js";

// Get all fees for a student (from Student collection)
export const getStudentFees = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student.fees); // return student’s fees history
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching student fees" });
  }
};

// Get all students for a fee (admin view)
export const getFeeStudents = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.feeId).populate(
      "students",
      "name email department"
    );
    if (!fee) {
      return res.status(404).json({ message: "Fee not found" });
    }

    res.json(fee.students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching fee students" });
  }
};

// Create a new fee record (student pays)
export const createStudentFee = async (req, res) => {
  try {
    const { session, semester, amount } = req.body;

    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const newFee = new Fee({
      student: student._id,
      session,
      semester,
      amount,
      status: "Paid", // student marks as paid first
    });

    await newFee.save();
    res.json(newFee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark fee as paid (student action)
// Mark fee as paid (student action)
export const markFeeAsPaid = async (req, res) => {
  try {
    const { studentId, feeId } = req.params;

    // 1. Find the student
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // 2. Find the fee in student's embedded fees
    const fee = student.fees.id(feeId);
    if (!fee) return res.status(404).json({ message: "Fee not found" });

    // 3. Update fee status if not already paid
    if (fee.status === "Paid" || fee.status === "Approved") {
      return res
        .status(400)
        .json({ message: "Fee is already paid or approved" });
    }

    fee.status = "Paid"; // student marked it as paid (awaiting admin approval)

    // 4. Save student document
    await student.save();

    res.json({
      message: "Fee marked as paid. Awaiting admin approval.",
      fee,
      studentFees: student.fees,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Approve fee payment (Admin action)
export const approveFeePayment = async (req, res) => {
  try {
    const fee = await Fee.findOne({
      _id: req.params.feeId,
      student: req.params.studentId,
    });

    if (!fee) return res.status(404).json({ message: "Fee not found" });

    fee.status = "Approved";
    await fee.save();

    res.json(fee);
  } catch (error) {
    res.status(500).json({ message: "Error approving fee" });
  }
};
