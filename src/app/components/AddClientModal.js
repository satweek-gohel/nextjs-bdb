'use client';
import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { db } from '../config/firebase'; // Adjust the path based on your project structure
import { collection, addDoc } from 'firebase/firestore';

const AddClientModal = ({ show, handleClose }) => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [validated, setValidated] = useState(false); // State to manage form validation

  const [emailError, setEmailError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);

  const handleAddClient = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'clients'), {
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
      });
      console.log('Document written with ID: ', docRef.id);
      handleClose(); // Close the modal after successful submission
    } catch (error) {
      console.error('Error adding client: ', error);
    }
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setClientEmail(email);

    // Email validation regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError(null);
    }
  };

  const handlePhoneChange = (e) => {
    const phone = e.target.value;
    setClientPhone(phone);

    // Phone number validation regex pattern
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone)) {
      setPhoneError('Please enter a valid 10-digit phone number.');
    } else {
      setPhoneError(null);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">Add Client</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleAddClient}>
          <Form.Group controlId="clientName" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter client name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter client name.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="clientEmail" className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter client email"
              value={clientEmail}
              onChange={handleEmailChange}
              required
              isInvalid={emailError !== null}
            />
            <Form.Control.Feedback type="invalid">
              {emailError}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="clientPhone" className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter client phone number"
              value={clientPhone}
              onChange={handlePhoneChange}
              required
              isInvalid={phoneError !== null}
            />
            <Form.Control.Feedback type="invalid">
              {phoneError}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleAddClient}>
          Add Client
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddClientModal;
