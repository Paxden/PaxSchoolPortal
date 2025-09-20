import Fee from "../models/Fee.js";
import Payment from "../models/payment.js";
import Student from "../models/Students.js";

// Admin creates a fee
export const createFee = async (req, res) => {
  try {
    const { title, session, semester, amount } = req.body;

    // ensure uniqueness
    const exists = await Fee.findOne({ title, session, semester });
    if (exists)
      return res
        .status(400)
        .json({ message: "Fee already exists for this session & semester" });

    const fee = await Fee.create({ title, session, semester, amount });
    res.status(201).json(fee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all fees
export const getFees = async (req, res) => {
  try {
    const fees = await Fee.find().sort({ createdAt: -1 });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Student pay fee
export const payFee = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { feeId } = req.body;
    const receipt = req.file ? req.file.filename : null; // multer upload

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const fee = await Fee.findById(feeId);
    if (!fee) return res.status(404).json({ message: "Fee not found" });

    // 🔑 Check if student has already made a payment for this fee
    const existingPayment = await Payment.findOne({
      student: student._id,
      fee: fee._id,
    });

    if (existingPayment) {
      return res
        .status(400)
        .json({ message: "You have already submitted payment for this fee." });
    }

    // Create new payment
    const payment = await Payment.create({
      student: student._id,
      fee: fee._id,
      receipt,
      status: "Pending", // default status
    });

    student.payments.push(payment._id);
    await student.save();

    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin verifies payment
export const verifyFee = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body; // verified or rejected

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = status;
    await payment.save();

    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all students who paid a fee
export const getPaidStudents = async (req, res) => {
  try {
    const { feeId } = req.params;
    const payments = await Payment.find()
      .populate({
        path: "student",
        select: "studentId firstName lastName faculty department passport", // 👈 more details
      })
      .populate("fee", "title amount session semester")
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all students who have not paid a fee
export const getUnpaidStudents = async (req, res) => {
  try {
    const { feeId } = req.params;

    const allStudents = await Student.find();
    const paid = await Payment.find({ fee: feeId }).distinct("student");

    const unpaid = allStudents.filter((s) => !paid.includes(s._id.toString()));
    res.json(unpaid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all payments (Admin)
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: "student",
        populate: [
          { path: "faculty", select: "name" },
          { path: "department", select: "name" },
        ],
      })
      .populate("fee")
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 
export const getStudentPayments = async (req, res) => {
  try {
    const { studentId } = req.params;
    const payments = await Payment.find({ student: studentId })
      .populate("fee", "title semester session amount")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
