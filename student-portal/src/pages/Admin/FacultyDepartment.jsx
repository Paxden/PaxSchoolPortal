import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Row,
  Col,
  Card,
  ListGroup,
  Form,
  Button,
  Alert,
  Container,
} from "react-bootstrap";

const FacultyDepartment = () => {
  const [faculties, setFaculties] = useState([]);
  const [facultyName, setFacultyName] = useState("");
  const [facultyCode, setFacultyCode] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [departmentName, setDepartmentName] = useState("");
  const [departments, setDepartments] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  // Show alert message
  const showAlert = (message, type = "info") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };

  // Fetch all faculties
  const fetchFaculties = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/faculties");
      console.log("Faculties data:", data);
      setFaculties(data);
    } catch (error) {
      console.error("Error fetching faculties", error);
      showAlert("Error fetching faculties", "danger");
    }
  };

  // Fetch departments by faculty
  const fetchDepartments = async (facultyId) => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/faculties/${facultyId}/departments`
      );
      console.log("Departments data:", data.departments);
      setDepartments(data.departments);
    } catch (error) {
      console.error("Error fetching departments", error);
      showAlert("Error fetching departments", "danger");
    }
  };

  // Create faculty
  const handleFacultySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/faculties", {
        name: facultyName,
        code: facultyCode,
      });
      setFacultyName("");
      setFacultyCode("");
      fetchFaculties();
      showAlert("Faculty created successfully!", "success");
    } catch (error) {
      console.error("Error creating faculty", error);
      showAlert("Error creating faculty", "danger");
    }
  };

  // Create department under selected faculty
  const handleDepartmentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFaculty) {
      showAlert("Select a faculty first!", "warning");
      return;
    }
    try {
      await axios.post(
        `http://localhost:5000/api/faculties/${selectedFaculty}/departments`,
        { name: departmentName }
      );
      setDepartmentName("");
      fetchDepartments(selectedFaculty);
      showAlert("Department created successfully!", "success");
    } catch (error) {
      console.error("Error creating department", error);
      showAlert("Error creating department", "danger");
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  return (
    <Container className="py-4">
      <h3 className="mb-4">🏫 Faculty & Department Management</h3>

      {alert.show && (
        <Alert
          variant={alert.type}
          dismissible
          onClose={() => setAlert({ show: false, message: "", type: "" })}
        >
          {alert.message}
        </Alert>
      )}

      <Row className="gy-4">
        {/* Faculty Creation */}
        <Col md={6}>
          <Card className="shadow-sm p-4">
            <Card.Body>
              <Card.Title>Create Faculty</Card.Title>
              <Form onSubmit={handleFacultySubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Faculty Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={facultyName}
                    onChange={(e) => setFacultyName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Faculty Code</Form.Label>
                  <Form.Control
                    type="text"
                    value={facultyCode}
                    onChange={(e) => setFacultyCode(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  Add Faculty
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Department Creation */}
        <Col md={6}>
          <Card className="shadow-sm p-4">
            <Card.Body>
              <Card.Title>Create Department</Card.Title>
              <Form onSubmit={handleDepartmentSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Faculty</Form.Label>
                  <Form.Select
                    value={selectedFaculty || ""}
                    onChange={(e) => {
                      setSelectedFaculty(e.target.value);
                      fetchDepartments(e.target.value);
                    }}
                    required
                  >
                    <option value="">-- Select Faculty --</option>
                    {faculties.map((fac) => (
                      <option key={fac._id} value={fac._id}>
                        {fac.name} ({fac.code})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Department Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="success" type="submit" className="w-100">
                  Add Department
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Faculty & Department Listing */}
      <Row className="mt-5">
        <Col md={6}>
          <h5>📋 Faculties</h5>
          <ListGroup variant="flush" className="shadow-sm">
            {faculties.map((fac) => (
              <ListGroup.Item
                key={fac._id}
                className="d-flex justify-content-between align-items-center"
              >
                {fac.name} ({fac.code})
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    setSelectedFaculty(fac._id);
                    fetchDepartments(fac._id);
                  }}
                >
                  View Departments
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        <Col md={6}>
          <h5>🏢 Departments</h5>
          {selectedFaculty ? (
            <ListGroup variant="flush" className="shadow-sm mt-3">
              {departments.length > 0 ? (
                departments.map((dept) => (
                  <ListGroup.Item key={dept._id}>{dept.name}</ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item className="text-muted">
                  No departments found
                </ListGroup.Item>
              )}
            </ListGroup>
          ) : (
            <p className="text-muted">Select a faculty to view departments</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default FacultyDepartment;
