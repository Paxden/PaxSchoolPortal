import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  fee: { type: mongoose.Schema.Types.ObjectId, ref: "Fee", required: true },
  receipt: { type: String }, // filename from multer
  status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Payment", paymentSchema);
