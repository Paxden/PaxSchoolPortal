const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  session: { type: String, required: true },
  semester: { type: String, required: true },
  amount: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Fee", feeSchema);
