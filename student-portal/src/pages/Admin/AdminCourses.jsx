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
} from "react-bootstrap";

const API_BASE = "http://localhost:5000/api";

const AdminCoursesPage = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
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
      setLoading(false);
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
              <h5>Courses List</h5>
              <div className="w-25">
                <Form.Group className="mb-2 col-6">
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
              </div>
              {loading ? (
                <Spinner animation="border" />
              ) : (
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
                    {courses.length > 0 ? (
                      courses.map((course) => (
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
                        <td colSpan="5" className="text-center">
                          No courses found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminCoursesPage;
