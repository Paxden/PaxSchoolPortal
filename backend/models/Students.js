const mongoose = require("mongoose");

const oLevelSchema = new mongoose.Schema({
  examNumber: { type: String, required: true },
  subjects: [
    {
      subject: { type: String, required: true },
      grade: { type: String, required: true },
    },
  ],
  resultFile: {
    secure_url: { type: String, required: true }, // Cloudinary URL
    public_id: { type: String, required: true }, // Cloudinary public ID
  },
});

const jambSchema = new mongoose.Schema({
  regNumber: { type: String, required: true },
  score: { type: Number, required: true },
  resultFile: {
    secure_url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
});

const studentSchema = new mongoose.Schema({
  // Personal
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  otherName: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  gender: { type: String, enum: ["male", "female", "other"] },
  dob: { type: Date },
  address: { type: String },
  passport: {
    secure_url: { type: String, required: true },
    public_id: { type: String, required: true },
  },

  intendedCourse: { type: String },

  faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },

  jamb: jambSchema,
  olevel: oLevelSchema,

  studentId: { type: String, unique: true },
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
