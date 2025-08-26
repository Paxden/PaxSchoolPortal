const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Faculty name is required"],
      trim: true,
      unique: true,
    },
    code: {
      type: String,
      required: [true, "Faculty code is required"],
      uppercase: true,
    },
    departments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Department",
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Faculty", facultySchema);
