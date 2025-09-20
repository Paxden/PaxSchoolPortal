import React, { useState } from "react";
import { checkAdmissionStatus } from "../Services/Api";
import {
  Row,
  Col,
  Alert,
  Card,
  Badge,
  Button,
  Form,
  InputGroup,
  Spinner,
  Container,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const StatusCheck = () => {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckStatus = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await checkAdmissionStatus(email);
      setResult(res.data);
    } catch (err) {
      setResult(null);
      if (err.response?.status === 404) {
        setError("⚠️ No application found for this email.");
      } else if (err.response?.status >= 500) {
        setError("⚠️ Server error. Please try again later.");
      } else {
        setError("⚠️ An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById("status-card");
    const printWindow = window.open("", "_blank", "height=800,width=1000");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Admission Status - ${result.firstName} ${result.lastName}</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
          <style>
            body { padding: 20px; background-color: white; }
            @media print {
              .no-print { display: none; }
              .card { border: none; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    }, 250);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "accepted":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "accepted":
        return "ACCEPTED";
      case "pending":
        return "PENDING REVIEW";
      case "rejected":
        return "NOT ACCEPTED";
      default:
        return status.toUpperCase();
    }
  };

  return (
    <Container className="py-5">
      {/* Header Section */}
      <div className="text-center mb-5">
        <i
          className="bi bi-file-earmark-person display-4 text-success"
          aria-hidden="true"
        ></i>
        <h1 className="h2 fw-bold mt-3">Application Status Check</h1>
        <p className="text-muted">
          Enter your application email to check your admission status
        </p>
      </div>

      {/* Form */}
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Form onSubmit={handleCheckStatus} className="mb-4">
            <InputGroup size="lg" className="shadow-sm">
              <InputGroup.Text>
                <i className="bi bi-envelope"></i>
              </InputGroup.Text>
              <Form.Control
                type="email"
                placeholder="Enter your application email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                aria-label="Application email"
              />
              <Button
                variant="success"
                type="submit"
                disabled={isLoading}
                className="d-flex align-items-center"
              >
                {isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Checking...
                  </>
                ) : (
                  <>
                    <i className="bi bi-search me-2"></i>Check Status
                  </>
                )}
              </Button>
            </InputGroup>
          </Form>

          {/* Error Alert */}
          {error && (
            <Alert variant="danger" className="d-flex align-items-center">
              <i
                className="bi bi-exclamation-triangle-fill me-2"
                aria-hidden="true"
              ></i>
              <span>{error}</span>
            </Alert>
          )}
        </Col>
      </Row>

      {/* Result */}
      {result && (
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card
              id="status-card"
              className="shadow-lg border-0 rounded-4 overflow-hidden mb-5"
            >
              <Card.Body className="p-4">
                {/* Header Section */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom pb-3 mb-4">
                  <div className="d-flex align-items-center mb-3 mb-md-0">
                    {result.passport && (
                      <div className="me-3">
                        <img
                          src={`http://localhost:5000/uploads/${result.passport}`}
                          alt={`Passport of ${result.firstName} ${result.lastName}`}
                          className="rounded-circle shadow"
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="fw-bold mb-1">
                        {result.firstName} {result.lastName}
                      </h4>
                      <p className="mb-0 text-muted">{result.email}</p>
                    </div>
                  </div>
                  <Badge
                    bg={getStatusVariant(result.applicationStatus)}
                    className="fs-6 px-3 py-2 align-self-start align-self-md-center"
                  >
                    {getStatusText(result.applicationStatus)}
                  </Badge>
                </div>

                {/* Details */}
                <Row className="gy-3">
                  <Col md={6}>
                    <div className="bg-light rounded-3 p-3 h-100">
                      <strong>Department:</strong>
                      <p className="mb-0">{result.department?.name || "N/A"}</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="bg-light rounded-3 p-3 h-100">
                      <strong>Phone:</strong>
                      <p className="mb-0">{result.phone || "N/A"}</p>
                    </div>
                  </Col>
                </Row>

                {/* Applied Date and Print Button */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-top pt-3 mt-4">
                  <p className="text-muted mb-2 mb-md-0">
                    <i className="bi bi-calendar me-1" aria-hidden="true"></i>
                    Applied on {new Date(result.createdAt).toLocaleDateString()}
                  </p>
                  <Button
                    variant="outline-success"
                    onClick={handlePrint}
                    className="no-print"
                  >
                    <i className="bi bi-printer me-2" aria-hidden="true"></i>
                    Print
                  </Button>
                </div>

                {/* O'Level Results */}
                {result.olevel && (
                  <div className="mt-5">
                    <h5 className="fw-bold">
                      <i
                        className="bi bi-journal-text me-2"
                        aria-hidden="true"
                      ></i>
                      O'Level Results
                    </h5>
                    <p>
                      <strong>Exam Number:</strong>{" "}
                      {result.olevel.examNumber || "N/A"}
                    </p>
                    {result.olevel.subjects?.length > 0 && (
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead className="table-light">
                            <tr>
                              <th>Subject</th>
                              <th>Grade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.olevel.subjects.map((s, idx) => (
                              <tr key={idx}>
                                <td>{s.subject}</td>
                                <td>
                                  <span className="badge bg-info">
                                    {s.grade}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* JAMB Info */}
                {result.jamb && (
                  <div className="mt-5">
                    <h5 className="fw-bold">
                      <i
                        className="bi bi-pencil-square me-2"
                        aria-hidden="true"
                      ></i>
                      JAMB Details
                    </h5>
                    <p>
                      <strong>Reg Number:</strong>{" "}
                      {result.jamb.regNumber || "N/A"}
                    </p>
                    <p>
                      <strong>Score:</strong>{" "}
                      <span className="badge bg-primary">
                        {result.jamb.score || "N/A"}
                      </span>
                    </p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default StatusCheck;
