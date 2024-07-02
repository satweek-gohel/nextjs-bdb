'use client'
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { db } from '../config/firebase'; // Adjust the path based on your project structure
import { collection, addDoc } from 'firebase/firestore';

const AddEmployeeModal = ({ show, handleClose }) => {
  const [employeeName, setEmployeeName] = useState('');
  const [designation, setDesignation] = useState('');
  const [technology, setTechnology] = useState('');
  const [validated, setValidated] = useState(false); // State to manage form validation

  const technologies = ['.NET', 'Next.js', 'MERN', 'WordPress', 'Shopify', 'Odoo', 'Wix'];

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'employees'), {
        name: employeeName,
        designation,
        technology,
      });
      console.log('Document written with ID: ', docRef.id);
      handleClose(); // Close the modal after successful submission
    } catch (error) {
      console.error('Error adding employee: ', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Employee</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleAddEmployee}>
          <Form.Group controlId="employeeName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter employee name"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter employee name.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="designation">
            <Form.Label>Designation</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter designation.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="technology">
            <Form.Label>Technology</Form.Label>
            <Form.Control
              as="select"
              value={technology}
              onChange={(e) => setTechnology(e.target.value)}
              required
            >
              <option value="">Select technology</option>
              {technologies.map((tech) => (
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              Please select technology.
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleAddEmployee}>
          Add Employee
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEmployeeModal;
