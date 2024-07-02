import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { db } from '../config/firebase'; // Adjust the path based on your project structure
import { collection, addDoc, getDocs } from 'firebase/firestore';

const AddProjectModal = ({ show, handleClose }) => {
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [technology, setTechnology] = useState('');
  const [budget, setBudget] = useState('');
  const [remark, setRemark] = useState('');
  const [employee, setEmployee] = useState('');
  const [projectStatus, setProjectStatus] = useState('');
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [technologies, setTechnologies] = useState([]);
  const [loadingTechnologies, setLoadingTechnologies] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [validated, setValidated] = useState(false); // State to manage form validation

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'clients'));
        const clientsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setClients(clientsList);
        setLoadingClients(false);
      } catch (error) {
        console.error('Error fetching clients: ', error);
        setLoadingClients(false);
      }
    };

    const fetchTechnologies = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'technologies'));
        const technologiesList = querySnapshot.docs.map(doc => doc.data().name);
        setTechnologies(technologiesList);
        setLoadingTechnologies(false);
      } catch (error) {
        console.error('Error fetching technologies: ', error);
        setLoadingTechnologies(false);
      }
    };

    const fetchEmployees = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'employees'));
        const employeesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEmployees(employeesList);
        setLoadingEmployees(false);
      } catch (error) {
        console.error('Error fetching employees: ', error);
        setLoadingEmployees(false);
      }
    };

    fetchClients();
    fetchTechnologies();
    fetchEmployees();
  }, []);

  const handleAddProject = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      await addDoc(collection(db, 'projects'), {
        projectName,
        clientName,
        technology,
        budget,
        remark,
        employee,
        projectStatus  // Include projectStatus in the data being saved
      });
      handleClose(); // Close the modal after successful submission
    } catch (error) {
      console.error('Error adding project: ', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleAddProject}>
          <Form.Group controlId="projectName">
            <Form.Label>Project Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter project name.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="clientName" className="mt-3">
            <Form.Label>Client Name</Form.Label>
            {loadingClients ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              <Form.Control
                as="select"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              >
                <option value="">Select client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.name}>{client.name}</option>
                ))}
              </Form.Control>
            )}
            <Form.Control.Feedback type="invalid">
              Please select client.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="technology" className="mt-3">
            <Form.Label>Technology</Form.Label>
            {loadingTechnologies ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              <Form.Control
                as="select"
                value={technology}
                onChange={(e) => setTechnology(e.target.value)}
                required
              >
                <option value="">Select technology</option>
                <option value=".NET">.NET</option>
                <option value="Next.js">Next.js</option>
                <option value="MERN">MERN</option>
                <option value="WordPress">WordPress</option>
                <option value="Odoo">Odoo</option>
                <option value="Wix">Wix</option>
                <option value="Shopify">Shopify</option>
              </Form.Control>
            )}
            <Form.Control.Feedback type="invalid">
              Please select technology.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="employee" className="mt-3">
            <Form.Label>Employee Assigned</Form.Label>
            {loadingEmployees ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              <Form.Control
                as="select"
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
                required
              >
                <option value="">Select employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.name}>{emp.name}</option>
                ))}
              </Form.Control>
            )}
            <Form.Control.Feedback type="invalid">
              Please select employee.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="budget" className="mt-3">
            <Form.Label>Budget</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter budget.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="remark" className="mt-3">
            <Form.Label>Remark</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="projectStatus" className="mt-3">
            <Form.Label>Project Status</Form.Label>
            <Form.Control
              as="select"
              value={projectStatus}
              onChange={(e) => setProjectStatus(e.target.value)}
              required
            >
              <option value="">Select status</option>
              <option value="Pending">Pending</option>
              <option value="Complete">Complete</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              Please select project status.
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleAddProject}>
          Add Project
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddProjectModal;
