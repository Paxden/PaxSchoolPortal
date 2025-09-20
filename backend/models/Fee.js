import mongoose from "mongoose";

const feeSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g. "Tuition Fee"
  session: { type: String, required: true }, // e.g. "2024/2025"
  semester: { type: String, required: true }, // e.g. "First Semester"
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Fee", feeSchema);
