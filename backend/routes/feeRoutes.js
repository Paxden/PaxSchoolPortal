import express from "express";
import {
  getStudentFees,
  markFeeAsPaid,
  approveFeePayment,
} from "../controllers/feeController.js";

const router = express.Router();

// GET student fees
router.get("/:studentId/fees", getStudentFees);

// PUT student mark fee as paid
router.put("/:studentId/fees/mark-paid", markFeeAsPaid);

// PUT admin approve fee
router.put("/:studentId/fees/:feeId/approve", approveFeePayment);

export default router;
