import React from "react";

function Home() {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100 text-center">
      <h1 className="mb-4 fw-bold text-primary">
        🎓 Welcome to the Pinecrest Portal
      </h1>
      <p className="lead mb-5 text-muted">
        Your one-stop solution for all academic needs.
      </p>

      <div className="row g-4 w-100 justify-content-center">
        {/* Apply for Admission */}
        <div className="col-12 col-md-4">
          <div className="card shadow-sm h-100 border-0">
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <h5 className="card-title">Admission</h5>
              <p className="card-text">Apply to join our institution.</p>
              <a href="/admission/apply" className="btn btn-primary w-100">
                Apply Now
              </a>
            </div>
          </div>
        </div>

        {/* Student Login */}
        <div className="col-12 col-md-4">
          <div className="card shadow-sm h-100 border-0">
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <h5 className="card-title">Student Login</h5>
              <p className="card-text">
                Access your courses, fees, and results.
              </p>
              <a href="/student/login" className="btn btn-success w-100">
                Student Login
              </a>
            </div>
          </div>
        </div>

        {/* Admin Login */}
        <div className="col-12 col-md-4">
          <div className="card shadow-sm h-100 border-0">
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <h5 className="card-title">Admin Login</h5>
              <p className="card-text">
                Manage admissions, fees, and student data.
              </p>
              <a href="/admin/login" className="btn btn-danger w-100">
                Admin Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
