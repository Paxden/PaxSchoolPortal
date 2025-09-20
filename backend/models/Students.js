const mongoose = require("mongoose");

const oLevelSchema = new mongoose.Schema({
  examNumber: { type: String, required: true },
  subjects: [
    {
      subject: { type: String, required: true },
      grade: { type: String, required: true },
    },
  ],
  resultFile: { type: String, required: true }, // file path or URL
});

const jambSchema = new mongoose.Schema({
  regNumber: { type: String, required: true },
  score: { type: Number, required: true },
  resultFile: { type: String, require: true }, // file path or URL
});

const studentSchema = new mongoose.Schema({
  // Step 1 - Personal Details
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  otherName: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  gender: { type: String, enum: ["male", "female", "other"] },
  dob: { type: Date },
  address: { type: String },
  passport: { type: String, required: true }, // file path or URL

  intendedCourse: { type: String }, // plain string field

  // Step 2 - Academic Details
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },

  jamb: jambSchema,
  olevel: oLevelSchema,

  // System fields
  studentId: { type: String, unique: true }, // e.g. STU/2025/1234
  enrolledAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["active", "graduated", "inactive"],
    default: "active",
  },
  courses: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Course", default: [] },
  ],
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment" }],

  password: { type: String, default: null },
});

module.exports = mongoose.model("Student", studentSchema);
