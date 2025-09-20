import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Table,
  Spinner,
  InputGroup,
  Badge,
} from "react-bootstrap";

const API_BASE = "https://paxschoolportal-backend.onrender.com/api";

const AdminCoursesPage = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    semester: "Harmattan",
    level: "",
    unit: "",
    department: "",
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDept) fetchCourses(selectedDept);
  }, [selectedDept]);

  // Filter courses based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCourses(courses);
    } else {
      const term = searchTerm.toLowerCase().trim();
      const filtered = courses.filter(
        (course) =>
          course.title.toLowerCase().includes(term) ||
          course.code.toLowerCase().includes(term)
      );
      setFilteredCourses(filtered);
    }
  }, [searchTerm, courses]);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API_BASE}/departments`);
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments", err);
    }
  };

  const fetchCourses = async (deptId) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/courses/department/${deptId}`);
      setCourses(res.data);
      setFilteredCourses(res.data);
      setLoading(false);
      setSearchTerm(""); // Clear search when department changes
    } catch (err) {
      console.error("Error fetching courses", err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!selectedDept) return alert("Select a department first");
    try {
      const res = await axios.post(`${API_BASE}/courses/create`, {
        ...formData,
        department: selectedDept,
      });

      console.log("Course created:", res.data);
      fetchCourses(selectedDept); // Refresh course list
      setFormData({
        title: "",
        code: "",
        semester: "Harmattan",
        level: "",
        unit: "",
      });
    } catch (err) {
      console.error("Error creating course", err);
    }
  };

  return (
    <Container fluid className="p-3">
      <Row>
        <Col md={4}>
          <Card className="shadow px-3">
            <Card.Body>
              <h5>Create New Course</h5>
              <Form
                className="row mt-4 gy-4 justify-content-between"
                onSubmit={handleCreate}
              >
                <Form.Group className="mb-2 col-6">
                  <Form.Label>Course Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-2 col-6">
                  <Form.Label>Course Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-2 col-6">
                  <Form.Label>Semester</Form.Label>
                  <Form.Select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                  >
                    <option value="First">Harmattan</option>
                    <option value="Second">Rain</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-2 col-6">
                  <Form.Label>Level</Form.Label>
                  <Form.Control
                    type="text"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-2 col-6">
                  <Form.Label>Unit</Form.Label>
                  <Form.Control
                    type="number"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-2 col-6">
                  <Form.Label>Select Department</Form.Label>
                  <Form.Select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    required
                  >
                    <option value="">-- Select Department --</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name} ({dept.code})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Button variant="success" type="submit" className="w-100 mt-2">
                  Create Course
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Courses List</h5>
                {selectedDept && (
                  <Badge bg="info" pill>
                    {filteredCourses.length} of {courses.length} courses
                  </Badge>
                )}
              </div>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Filter by Department</Form.Label>
                    <Form.Select
                      value={selectedDept}
                      onChange={(e) => setSelectedDept(e.target.value)}
                      required
                    >
                      <option value="">-- Select Department --</option>
                      {departments.map((dept) => (
                        <option key={dept._id} value={dept._id}>
                          {dept.name} ({dept.code})
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Search Courses</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="bi bi-search"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search by title or code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={!selectedDept}
                      />
                      {searchTerm && (
                        <Button
                          variant="outline-secondary"
                          onClick={() => setSearchTerm("")}
                        >
                          <i className="bi bi-x"></i>
                        </Button>
                      )}
                    </InputGroup>
                    <Form.Text className="text-muted">
                      {!selectedDept
                        ? "Select a department first to search courses"
                        : "Enter course title or code to filter results"}
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading courses...</p>
                </div>
              ) : (
                <>
                  {searchTerm && (
                    <div className="mb-3">
                      <Badge bg="info" className="p-2">
                        {filteredCourses.length} course(s) found for "
                        {searchTerm}"
                      </Badge>
                      <Button
                        variant="link"
                        size="sm"
                        className="ms-2"
                        onClick={() => setSearchTerm("")}
                      >
                        Clear search
                      </Button>
                    </div>
                  )}

                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Code</th>
                        <th>Semester</th>
                        <th>Level</th>
                        <th>Unit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => (
                          <tr key={course._id}>
                            <td>{course.title}</td>
                            <td>{course.code}</td>
                            <td>{course.semester}</td>
                            <td>{course.level}</td>
                            <td>{course.unit}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-4">
                            <i className="bi bi-book display-4 text-muted d-block mb-2"></i>
                            {selectedDept
                              ? searchTerm
                                ? `No courses found for "${searchTerm}"`
                                : "No courses found for this department"
                              : "Select a department to view courses"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminCoursesPage;
