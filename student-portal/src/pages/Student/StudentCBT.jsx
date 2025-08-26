import React from "react";

const CBT = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center mt-5 bg-light text-center">
      <div className="card shadow-lg p-5 border-0 rounded-4" style={{ maxWidth: "500px" }}>
        <h1 className="fw-bold text-success mb-3"></h1>
        <h3 className="mb-3 text-success">💻 CBT Portal Coming Soon 🚀</h3>
        <p className="text-muted">
          Our Computer-Based Test (CBT) system is under development.  
          Please check back later for updates.
        </p>
        <div className="spinner-border mx-auto text-success mt-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default CBT;
