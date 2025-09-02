import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    session: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      enum: ["Harmattan", "Rain"], // example semesters
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    studentsPaid: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
        },
        status: {
          type: String,
          enum: ["Pending", "Paid", "Approved"],
          default: "Paid",
        },
        paidAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Fee", feeSchema);
