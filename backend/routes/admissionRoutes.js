const express = require("express");
const upload = require("../middlewares/upload");
const {
  apply,
  checkStatus,
  approveApplication,
  rejectApplication,
  getApplicants,
  getStudents,
  approveFee,
} = require("../controllers/admissionControllers");

const router = express.Router();

// Apply with files
router.post(
  "/apply",
  upload.fields([
    { name: "passport", maxCount: 1 },
    { name: "jamb", maxCount: 1 },
    { name: "olevel", maxCount: 1 },
  ]),
  apply
);

router.get("/status/:email", checkStatus);
router.get("/", getApplicants);
router.get("/students", getStudents);
router.patch("/:id/accept", approveApplication);
router.patch("/:id/reject", rejectApplication);
router.put("/fees/:studentId/fees/:feeId/approve", approveFee);

module.exports = router;
