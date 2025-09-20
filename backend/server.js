const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");


// Modules
const facultyRoutes = require("./routes/facultyRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const admissionRoutes = require("./routes/admissionRoutes");
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoute");
const feeRoutes = require("./routes/feeRoutes");


// Express App
const app = express();

dotenv.config();
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use("/api/faculties", facultyRoutes);
app.use("/api/departments", departmentRoutes);
// Admission Routes
app.use("/api/admissions", admissionRoutes);
// Student Routes
app.use("/api/students", studentRoutes);
// Course Routes
app.use("/api/courses", courseRoutes);
// Fee Routes
app.use("/api/fees", feeRoutes);


console.log("Connecting to db ...");

// DB Connect
mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(process.env.PORT, () => {
    console.log("DB connected & listening on port:", process.env.PORT);
  });
});
