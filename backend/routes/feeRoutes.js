const express = require("express");
const upload = require("../middlewares/upload.js");
const {
  createFee,
  getFees,
  payFee,
  verifyFee,
  getPaidStudents,
  getUnpaidStudents,
  getAllPayments,
  getStudentPayments,
  uploadDocuments,
} = require("../controllers/feeController.js");

const router = express.Router();

// ---------- Admin Routes ----------
router.post("/", createFee);
router.get("/", getFees);
router.get("/payments", getAllPayments);
router.put("/verify/:paymentId", verifyFee);
router.get("/:feeId/paid", getPaidStudents);
router.get("/:feeId/unpaid", getUnpaidStudents);

// ---------- Student Routes ----------
router.post(
  "/:studentId/upload",
  upload.fields([
    { name: "passport", maxCount: 1 },
    { name: "olevel", maxCount: 1 },
    { name: "jamb", maxCount: 1 },
    { name: "receipt", maxCount: 1 },
  ]),
  uploadDocuments
);

router.post("/:studentId/pay", upload.single("receipt"), payFee);

router.get("/:studentId/payments", getStudentPayments);

module.exports = router;
