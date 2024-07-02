// pages/support.js
'use client'

import 'bootstrap/dist/css/bootstrap.min.css';

// pages/support.js
import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import Navbarcom from '../components/Navbarcom';
import Sidebarcom from '../components/sidebar';
import Footer from '../components/Footer';

const SupportPage = () => {

    const [showSidebar, setShowSidebar] = useState(false);

  const handleCloseSidebar = () => setShowSidebar(false);
  const handleShowSidebar = () => setShowSidebar(true);
  return (

    <>
    <Navbarcom handleShow={handleShowSidebar} />
      <Sidebarcom show={showSidebar} handleClose={handleCloseSidebar} />
    <Container className="mt-5">
      <div className="support-form-container border rounded p-4 bg-light">
        <h2 className="fw-bold mb-4">Support</h2>
        <Form action="https://formsubmit.co/satweekgohel@gmail.com" method="POST">
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter your name" name='Name' />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter your email" name='Email'/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicQuery">
            <Form.Label>Query</Form.Label>
            <Form.Control as="textarea" rows={4} placeholder="Enter your query" name='Query' />
          </Form.Group>

          <Button variant="primary" type="submit">
            Send
          </Button>
        </Form>
      </div>
    </Container>
   
    </>
  );
};

export default SupportPage;
