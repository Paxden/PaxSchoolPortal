const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const applicantSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    otherName: { type: String },

    email: { type: String, required: true, unique: true },
    phone: { type: String },
    gender: { type: String, enum: ["male", "female", "other"] },
    dateOfBirth: { type: Date },
    address: { type: String },

    passport: { type: String }, // file path or URL

    intendedCourse: { type: String, required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    jamb: {
      regNumber: { type: String },
      score: { type: Number },
      resultFile: { type: String }, // upload path
    },

    olevel: {
      examNumber: { type: String },
      subjects: [
        {
          subject: { type: String },
          grade: { type: String },
        },
      ],
      resultFile: { type: String }, // upload path
    },

    applicationStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    reviewedAt: { type: Date },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // reviewer (Admin/Staff)
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Applicant", applicantSchema);
