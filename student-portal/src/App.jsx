import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// cloudflared tunnel Set-Alias cloudflared "C:\Program Files (x86)\cloudflared\cloudflared.exe"
// cloudflared tunnel --url http://localhost:5173
// Cloudname: dj3la93pq
// Api key: 411464191644249
// Api secret: gzo7z5HzC1hbVV0OI-cn0QFtVH4

// Components
import ProtectRoute from "./Utils/ProtectRoute";
// Pages
import AdmissionPage from "./pages/admissionPage";
import AdmissionForm from "./components/admissionForm";
import StatusCheck from "./components/StatusCheck";
//  Admin
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminLogin from "./components/Admin/AdminLogin";
import StudentList from "./pages/Admin/StudentList";
import AdminFeePage from "./pages/Admin/AdminFeePage";
import FacultyDepartment from "./pages/Admin/FacultyDepartment";
import AdminOvervew from "./pages/Admin/AdminOverview";
// Students
import StudentLogin from "./pages/Student/StudentLogin";
import StudentDashboard from "./pages/Student/StudentDashboard";
import ProtectStudent from "./Utils/ProtectStudent";
import StudentLayout from "./pages/Student/StudentLayout";
import Profile from "./pages/Student/Profile";
import Applicants from "./pages/Admin/Applicants";
import AdminCourses from "./pages/Admin/AdminCourses";
import StudentCourseRegistration from "./pages/Student/CourseRegistration";
import StudentFeePage from "./pages/Student/StudentFeePage";
import StudentCBT from "./pages/Student/StudentCBT";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />
        {/* Admission routes */}
        <Route path="/admission" element={<AdmissionPage />}>
          <Route path="apply" element={<AdmissionForm />} />
          <Route path="status" element={<StatusCheck />} />
        </Route>

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectRoute>
              {" "}
              <AdminDashboard />
            </ProtectRoute>
          }
        >
          <Route
            index
            element={
              <ProtectRoute>
                <AdminOvervew />
              </ProtectRoute>
            }
          />
          <Route
            path="applicants"
            element={
              <ProtectRoute>
                <Applicants />
              </ProtectRoute>
            }
          />
          <Route
            path="faculty"
            element={
              <ProtectRoute>
                <FacultyDepartment />
              </ProtectRoute>
            }
          />
          <Route
            path="students"
            element={
              <ProtectRoute>
                <StudentList />
              </ProtectRoute>
            }
          />
          <Route
            path="courses"
            element={
              <ProtectRoute>
                <AdminCourses />
              </ProtectRoute>
            }
          />
          <Route
            path="fees"
            element={
              <ProtectRoute>
                <AdminFeePage />
              </ProtectRoute>
            }
          />
        </Route>

        {/* Students */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route
          path="/student/"
          element={
            <ProtectStudent>
              <StudentLayout />
            </ProtectStudent>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="course-reg" element={<StudentCourseRegistration />} />
          <Route path="fees" element={<StudentFeePage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cbt" element={<StudentCBT />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
