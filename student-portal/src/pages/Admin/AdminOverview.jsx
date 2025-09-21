import React, { useState, useEffect } from "react";
import {
  getStudents,
  getFees,
  getApplicants,
  getAllPayments,
} from "../../Services/Api";
import { Row, Col, Card, Table, Spinner, Badge } from "react-bootstrap";
import {
  FaUsers,
  FaMoneyBillWave,
  FaUserClock,
  FaCheckCircle,
  FaGraduationCap,
  FaChartLine,
} from "react-icons/fa";

const AdminOverview = () => {
  const [students, setStudents] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [fees, setFees] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsRes, feesRes, applicantsRes, paymentsRes] =
          await Promise.all([
            getStudents(),
            getFees(),
            getApplicants(),
            getAllPayments(),
          ]);

        setStudents(studentsRes);
        setFees(feesRes.data || []);
        setApplicants(applicantsRes.data || []);
        setPayments(paymentsRes.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading Dashboard...</p>
      </div>
    );
  }

  const verifiedPaymentsCount = payments.filter(
    (p) => p.status === "verified"
  ).length;
  const pendingApplicantsCount = applicants.filter(
    (a) => a.status === "pending"
  ).length;
  const totalRevenue = payments
    .filter((p) => p.status === "verified")
    .reduce(
      (sum, payment) =>
        sum +
        (payment.amount !== undefined
          ? payment.amount
          : payment.fee?.amount || 0),
      0
    );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Admin Dashboard</h2>
        <Badge bg="light" text="dark" className="p-2">
          <FaChartLine className="me-1" /> Real-time Data
        </Badge>
      </div>

      <Row className="mb-4">
        <Col xl={3} lg={6} className="mb-3">
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <FaUsers className="text-primary fs-1 me-3" />
              <div>
                <small className="text-muted">Total Students</small>
                <h3>{students.length}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} lg={6} className="mb-3">
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <FaMoneyBillWave className="text-success fs-1 me-3" />
              <div>
                <small className="text-muted">Total Revenue</small>
                <h3>₦{totalRevenue.toLocaleString()}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} lg={6} className="mb-3">
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <FaUserClock className="text-warning fs-1 me-3" />
              <div>
                <small className="text-muted">Pending Applications</small>
                <h3>{pendingApplicantsCount}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} lg={6} className="mb-3">
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <FaCheckCircle className="text-info fs-1 me-3" />
              <div>
                <small className="text-muted">Verified Payments</small>
                <h3>{verifiedPaymentsCount}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={6} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header>
              <FaGraduationCap className="me-2" /> Recent Students
            </Card.Header>
            <Card.Body className="p-0 table-responsive">
              <Table hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.slice(0, 5).map((s) => (
                    <tr key={s._id}>
                      <td>{s.studentId}</td>
                      <td>
                        {s.firstName} {s.lastName}
                      </td>
                      <td>{s.department?.name || "-"}</td>
                      <td>
                        <Badge
                          bg={s.status === "active" ? "success" : "secondary"}
                        >
                          {s.status || "inactive"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header>
              <FaUserClock className="me-2 text-warning" /> Pending Applications
            </Card.Header>
            <Card.Body className="p-0 table-responsive">
              <Table hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Program</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants
                    .filter((a) => a.status === "pending")
                    .slice(0, 5)
                    .map((a) => (
                      <tr key={a._id}>
                        <td>
                          {a.firstName} {a.lastName}
                        </td>
                        <td>{a.email}</td>
                        <td>{a.program || "-"}</td>
                        <td>
                          <Badge bg="warning">Pending</Badge>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm mb-4">
        <Card.Header>
          <FaMoneyBillWave className="text-success me-2" /> Recent Payments
        </Card.Header>
        <Card.Body className="p-0 table-responsive">
          <Table hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Student</th>
                <th>Fee Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.slice(0, 10).map((payment) => (
                <tr key={payment._id}>
                  <td>
                    {payment.student?.firstName || "Unknown"}{" "}
                    {payment.student?.lastName || "Student"}
                  </td>
                  <td>{payment.fee?.name || "Fee"}</td>
                  <td>
                    ₦
                    {(
                      payment.amount ||
                      payment.fee?.amount ||
                      0
                    ).toLocaleString()}
                  </td>
                  <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Badge
                      bg={
                        payment.status === "verified"
                          ? "success"
                          : payment.status === "pending"
                          ? "warning"
                          : "danger"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminOverview;
