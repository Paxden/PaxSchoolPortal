const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);
