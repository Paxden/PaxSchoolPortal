const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  gender: { type: String, enum: ["male", "female", "other"] },
  dob: { type: Date },

  studentId: { type: String, unique: true }, // e.g. STU/2025/1234
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },

  enrolledAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["active", "graduated", "inactive"],
    default: "active",
  },
  courses: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Course", default: [] },
  ],
  fees: [
    {
      session: { type: String, required: true },
      semester: { type: String, enum: ["Harmattan", "Rain"], required: true },
      amount: { type: Number, default: 0 },
      paid: { type: Boolean, default: false },
      paidAt: { type: Date },
      approved: { type: Boolean, default: false },
      approvedAt: { type: Date },
    },
  ],

  password: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("Student", studentSchema);
