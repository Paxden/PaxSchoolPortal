const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  apply,
  checkStatus,
  approveApplication,
  rejectApplication,
  getApplicants,
  getStudents,
  approveFee,
} = require("../controllers/admissionControllers");

// -------------------- Multer Config --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // ensure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

// -------------------- Routes --------------------

// Public - Apply with file uploads
router.post(
  "/apply",
  upload.fields([
    { name: "passport", maxCount: 1 },
    { name: "jambResult", maxCount: 1 },
    { name: "oLevelResult", maxCount: 1 },
  ]),
  apply
);

router.get("/status/:email", checkStatus);

// Admin
router.get("/", getApplicants);
router.get("/students", getStudents);
router.patch("/:id/accept", approveApplication);
router.patch("/:id/reject", rejectApplication);

// Approve fees payment
router.put("/fees/:studentId/fees/:feeId/approve", approveFee);

module.exports = router;
