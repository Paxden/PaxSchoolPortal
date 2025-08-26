const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const applicantSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    address: {
      type: String,
    },
    intendedCourse: {
      type: String,
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    applicationStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    reviewedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAtBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Applicant", applicantSchema);
