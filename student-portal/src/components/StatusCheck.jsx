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
      if (err.response?.status === 404)
        setError("⚠️ No application found for this email.");
      else if (err.response?.status >= 500)
        setError("⚠️ Server error. Try again later.");
      else setError("⚠️ An error occurred. Please try again.");
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
            @media print { .no-print { display: none; } .card { border: none; box-shadow: none; } }
            iframe { width: 100%; height: 500px; border: none; }
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
        return status?.toUpperCase();
    }
  };

  // Robust file rendering for Cloudinary objects
  const renderFile = (fileData) => {
    if (!fileData) return <span className="text-muted">N/A</span>;

    let fileUrl = "";

    // Handle string URL
    if (typeof fileData === "string") {
      fileUrl = fileData;
    }
    // Handle Cloudinary object
    else if (fileData.secure_url) {
      fileUrl = fileData.secure_url;
    } else if (fileData.url) {
      fileUrl = fileData.url;
    }
    // Handle nested objects (e.g., jamb.resultFile, olevel.resultFile)
    else if (fileData.resultFile) {
      if (typeof fileData.resultFile === "string")
        fileUrl = fileData.resultFile;
      else if (fileData.resultFile.secure_url)
        fileUrl = fileData.resultFile.secure_url;
      else if (fileData.resultFile.url) fileUrl = fileData.resultFile.url;
    }

    if (!fileUrl || typeof fileUrl !== "string")
      return <span className="text-muted">N/A</span>;

    const ext = fileUrl.split(".").pop().toLowerCase();

    if (ext === "pdf") {
      return (
        <iframe
          src={fileUrl}
          title="document"
          style={{ width: "100%", height: "400px", border: "none" }}
        />
      );
    }

    return (
      <img
        src={fileUrl}
        alt="uploaded file"
        style={{ maxWidth: "100%", borderRadius: "8px" }}
      />
    );
  };

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <i className="bi bi-file-earmark-person display-4 text-success"></i>
        <h1 className="h2 fw-bold mt-3">Application Status Check</h1>
        <p className="text-muted">
          Enter your application email to check your admission status
        </p>
      </div>

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
              />
              <Button variant="success" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Spinner animation="border" size="sm" className="me-2" />
                ) : (
                  <>
                    <i className="bi bi-search me-2"></i>Check Status
                  </>
                )}
              </Button>
            </InputGroup>
          </Form>

          {error && (
            <Alert variant="danger" className="d-flex align-items-center">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </Alert>
          )}
        </Col>
      </Row>

      {result && (
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card
              id="status-card"
              className="shadow-lg border-0 rounded-4 overflow-hidden mb-5"
            >
              <Card.Body className="p-4">
                {/* Header */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom pb-3 mb-4">
                  <div className="d-flex align-items-center mb-3 mb-md-0">
                    {result.passport && (
                      <div className="me-3">
                        <img
                          src={
                            typeof result.passport === "string"
                              ? result.passport
                              : result.passport.secure_url ||
                                result.passport.url
                          }
                          alt="passport"
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
                    className="fs-6 px-3 py-2"
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

                {/* Applied Date & Print */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-top pt-3 mt-4">
                  <p className="text-muted mb-2 mb-md-0">
                    <i className="bi bi-calendar me-1"></i>Applied on{" "}
                    {new Date(result.createdAt).toLocaleDateString()}
                  </p>
                  <Button
                    variant="outline-success"
                    onClick={handlePrint}
                    className="no-print"
                  >
                    <i className="bi bi-printer me-2"></i>Print
                  </Button>
                </div>

                {/* O'Level */}
                {result.olevel && (
                  <div className="mt-5">
                    <h5 className="fw-bold">
                      <i className="bi bi-journal-text me-2"></i>O'Level Results
                    </h5>
                    {renderFile(result.olevel)}
                  </div>
                )}

                {/* JAMB */}
                {result.jamb && (
                  <div className="mt-5">
                    <h5 className="fw-bold">
                      <i className="bi bi-pencil-square me-2"></i>JAMB Details
                    </h5>
                    {renderFile(result.jamb)}
                  </div>
                )}

                {/* Fee Receipt */}
                {result.receipt && (
                  <div className="mt-5">
                    <h5 className="fw-bold">
                      <i className="bi bi-receipt me-2"></i>Payment Receipt
                    </h5>
                    {renderFile(result.receipt)}
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
