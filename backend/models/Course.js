const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    semester: { type: String, enum: ["Harmattan", "Rain"], required: true },
    level: {
      type: String,
      enum: ["100", "200", "300", "400"],
      required: true,
    },
    unit: { type: Number, required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
