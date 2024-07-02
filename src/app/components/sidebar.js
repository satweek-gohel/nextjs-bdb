'use client'
import React from 'react';
import { Offcanvas, Nav } from 'react-bootstrap';
import { FaUser, FaProjectDiagram, FaDollarSign, FaUsers, FaLifeRing,FaTachometerAlt, FaTimes } from 'react-icons/fa';


const Sidebarcom = ({ show, handleClose }) => {
  return (
    <Offcanvas show={show} onHide={handleClose} placement="start">
      <Offcanvas.Header closeButtonn>
        <Offcanvas.Title style={{ color: 'blue', marginLeft:'20px', marginTop:'10px' }}><span style={{fontWeight:'bold'}}>01 </span> Binary Solutions</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Nav className="flex-column">
          <Nav.Link href="/" className="nav-link-custom active" style={{ marginBottom: '10px' }}>
            <FaTachometerAlt className="nav-icon" /> Dashboard
          </Nav.Link>
          <Nav.Link href="clients" className="nav-link-custom" style={{ marginBottom: '10px' }}>
            <FaUser className="nav-icon" /> Clients
          </Nav.Link>
          <Nav.Link href="projects" className="nav-link-custom" style={{ marginBottom: '10px' }}>
            <FaProjectDiagram className="nav-icon" /> Projects
          </Nav.Link>
          <Nav.Link href="employees" className="nav-link-custom" style={{ marginBottom: '10px' }}>
            <FaUsers className="nav-icon" /> Employees
          </Nav.Link>
        </Nav>
        <div className="support-section p-3" style={{marginTop:'41vh'}}>
          <Nav.Link href="support" className="nav-link-custom support-link p-2">
            <FaLifeRing className="nav-icon" /> Support
          </Nav.Link>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Sidebarcom;
