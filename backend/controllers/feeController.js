const Fee = require("../models/Fee");
const Payment = require("../models/payment");
const Student = require("../models/Students");
const cloudinary = require("../config/cloudinary"); // configure Cloudinary
const fs = require("fs");

// ---------- Admin Controllers ---------- //

exports.createFee = async (req, res) => {
  try {
    const { title, session, semester, amount } = req.body;
    const exists = await Fee.findOne({ title, session, semester });
    if (exists) return res.status(400).json({ message: "Fee already exists." });

    const fee = await Fee.create({ title, session, semester, amount });
    res.status(201).json(fee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFees = async (req, res) => {
  try {
    const fees = await Fee.find().sort({ createdAt: -1 });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyFee = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body;
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = status;
    await payment.save();
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPaidStudents = async (req, res) => {
  try {
    const { feeId } = req.params;
    const payments = await Payment.find({ fee: feeId })
      .populate(
        "student",
        "studentId firstName lastName faculty department passport"
      )
      .populate("fee", "title amount session semester")
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUnpaidStudents = async (req, res) => {
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

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: "student",
        populate: [{ path: "faculty" }, { path: "department" }],
      })
      .populate("fee")
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- Student Controllers ---------- //

exports.uploadDocuments = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const updates = {};
    const fields = ["passport", "olevel", "jamb", "receipt"];

    for (let field of fields) {
      if (req.files?.[field]) {
        // Upload to Cloudinary
        const file = req.files[field][0];
        const result = await cloudinary.uploader.upload(file.path, {
          folder: `students/${studentId}/${field}`,
        });
        updates[field] = result.secure_url;
      }
    }

    Object.assign(student, updates);
    await student.save();
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.payFee = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { feeId } = req.body;

    if (!feeId) {
      return res.status(400).json({ message: "Fee ID is required" });
    }

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const fee = await Fee.findById(feeId);
    if (!fee) return res.status(404).json({ message: "Fee not found" });

    let receiptUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: `students/${studentId}/receipts`,
      });
      receiptUrl = result.secure_url;

    
    }

    const existingPayment = await Payment.findOne({
      student: student._id,
      fee: fee._id,
      status: { $in: ["pending", "verified"] },
    });

    if (existingPayment) {
      return res
        .status(400)
        .json({ message: "Payment already submitted for this fee." });
    }

    const payment = await Payment.create({
      student: student._id,
      fee: fee._id,
      receipt: receiptUrl,
      status: "pending",
      amount: fee.amount, // Assuming fee has an amount field
      paidAt: new Date(),
    });

    student.payments.push(payment._id);
    await student.save();

    // Populate the response with useful data
    const populatedPayment = await Payment.findById(payment._id)
      .populate("fee", "name amount dueDate")
      .populate("student", "name studentId");

    res.status(201).json(populatedPayment);
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentPayments = async (req, res) => {
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
