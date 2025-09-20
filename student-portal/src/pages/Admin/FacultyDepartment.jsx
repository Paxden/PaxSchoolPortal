// src/pages/Admin/FacultyDepartment.jsx
import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  ListGroup,
  Form,
  Button,
  Alert,
  Container,
  InputGroup,
  Badge,
} from "react-bootstrap";
import {
  getFaculties,
  createFaculty,
  getDepartmentsByFaculty,
  createDepartment,
} from "../../Services/Api"; // adjust path if needed

const FacultyDepartment = () => {
  const [faculties, setFaculties] = useState([]);
  const [filteredFaculties, setFilteredFaculties] = useState([]);
  const [facultyName, setFacultyName] = useState("");
  const [facultyCode, setFacultyCode] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [facultySearchTerm, setFacultySearchTerm] = useState("");

  const [departmentName, setDepartmentName] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState("");

  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  // Show alert helper
  const showAlert = (message, type = "info") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };

  // Load faculties
  const fetchFaculties = async () => {
    try {
      const { data } = await getFaculties();
      setFaculties(data);
      setFilteredFaculties(data);
    } catch (error) {
      console.error("Error fetching faculties", error);
      showAlert("Error fetching faculties", "danger");
    }
  };

  // Load departments for selected faculty
  const fetchDepartments = async (facultyId) => {
    try {
      const { data } = await getDepartmentsByFaculty(facultyId);
      setDepartments(data.departments || []);
      setFilteredDepartments(data.departments || []);
    } catch (error) {
      console.error("Error fetching departments", error);
      showAlert("Error fetching departments", "danger");
    }
  };

  // Filter faculties based on search term
  useEffect(() => {
    if (!facultySearchTerm.trim()) {
      setFilteredFaculties(faculties);
    } else {
      const term = facultySearchTerm.toLowerCase().trim();
      const filtered = faculties.filter(
        (faculty) =>
          faculty.name.toLowerCase().includes(term) ||
          faculty.code.toLowerCase().includes(term)
      );
      setFilteredFaculties(filtered);
    }
  }, [facultySearchTerm, faculties]);

  // Filter departments based on search term
  useEffect(() => {
    if (!departmentSearchTerm.trim()) {
      setFilteredDepartments(departments);
    } else {
      const term = departmentSearchTerm.toLowerCase().trim();
      const filtered = departments.filter(
        (dept) =>
          dept.name.toLowerCase().includes(term) ||
          dept.code.toLowerCase().includes(term)
      );
      setFilteredDepartments(filtered);
    }
  }, [departmentSearchTerm, departments]);

  // Submit new faculty
  const handleFacultySubmit = async (e) => {
    e.preventDefault();
    try {
      await createFaculty({ name: facultyName, code: facultyCode });
      setFacultyName("");
      setFacultyCode("");
      setFacultySearchTerm(""); // Clear search when adding new faculty
      fetchFaculties();
      showAlert("Faculty created successfully!", "success");
    } catch (error) {
      console.error("Error creating faculty", error);
      showAlert("Error creating faculty", "danger");
    }
  };

  // Submit new department
  const handleDepartmentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFaculty) {
      showAlert("Select a faculty first!", "warning");
      return;
    }
    try {
      await createDepartment(selectedFaculty, {
        name: departmentName,
        code: departmentCode,
      });
      setDepartmentName("");
      setDepartmentCode("");
      setDepartmentSearchTerm(""); // Clear search when adding new department
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
        {/* Faculty Form */}
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
                <Button variant="success" type="submit" className="w-100">
                  Add Faculty
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Department Form */}
        <Col md={6}>
          <Card className="shadow-sm p-4">
            <Card.Body>
              <Card.Title>Create Department</Card.Title>
              <Form onSubmit={handleDepartmentSubmit}>
                <div className="d-flex gap-3">
                  <Form.Group className="mb-3">
                    <Form.Label>Department Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={departmentName}
                      onChange={(e) => setDepartmentName(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Department Code</Form.Label>
                    <Form.Control
                      type="text"
                      value={departmentCode}
                      onChange={(e) => setDepartmentCode(e.target.value)}
                      required
                    />
                  </Form.Group>
                </div>
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
                <Button variant="success" type="submit" className="w-100">
                  Add Department
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Lists */}
      <Row className="mt-5 shadow border rounded p-4">
        <Col md={6}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>📋 Faculties</h5>
            <Badge bg="success" pill>
              {filteredFaculties.length} of {faculties.length}
            </Badge>
          </div>

          {/* Faculty Search */}
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search faculties by name or code..."
              value={facultySearchTerm}
              onChange={(e) => setFacultySearchTerm(e.target.value)}
            />
            {facultySearchTerm && (
              <Button
                variant="outline-secondary"
                onClick={() => setFacultySearchTerm("")}
              >
                <i className="bi bi-x"></i>
              </Button>
            )}
          </InputGroup>

          <ListGroup variant="flush" className="shadow-sm">
            {filteredFaculties.length > 0 ? (
              filteredFaculties.map((fac) => (
                <ListGroup.Item
                  key={fac._id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>
                    {fac.name}{" "}
                    <small className="text-muted">({fac.code})</small>
                  </div>
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => {
                      setSelectedFaculty(fac._id);
                      fetchDepartments(fac._id);
                    }}
                  >
                    View Departments
                  </Button>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item className="text-muted text-center py-4">
                <i className="bi bi-building display-4 d-block mb-2"></i>
                {facultySearchTerm
                  ? `No faculties found for "${facultySearchTerm}"`
                  : "No faculties found"}
              </ListGroup.Item>
            )}
          </ListGroup>
        </Col>

        <Col md={6}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>🏢 Departments</h5>
            {selectedFaculty && (
              <Badge bg="info" pill>
                {filteredDepartments.length} of {departments.length}
              </Badge>
            )}
          </div>

          {selectedFaculty ? (
            <>
              {/* Department Search */}
              <InputGroup className="mb-3">
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search departments by name or code..."
                  value={departmentSearchTerm}
                  onChange={(e) => setDepartmentSearchTerm(e.target.value)}
                />
                {departmentSearchTerm && (
                  <Button
                    variant="outline-secondary"
                    onClick={() => setDepartmentSearchTerm("")}
                  >
                    <i className="bi bi-x"></i>
                  </Button>
                )}
              </InputGroup>

              <ListGroup variant="flush" className="shadow-sm">
                {filteredDepartments.length > 0 ? (
                  filteredDepartments.map((dept) => (
                    <ListGroup.Item key={dept._id}>
                      {dept.name}{" "}
                      <small className="text-muted">({dept.code})</small>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item className="text-muted text-center py-4">
                    <i className="bi bi-door-closed display-4 d-block mb-2"></i>
                    {departmentSearchTerm
                      ? `No departments found for "${departmentSearchTerm}"`
                      : "No departments found"}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </>
          ) : (
            <div className="text-center py-4 text-muted">
              <i className="bi bi-info-circle display-4 d-block mb-2"></i>
              Select a faculty to view departments
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default FacultyDepartment;
