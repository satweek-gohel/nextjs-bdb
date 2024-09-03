import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { MdOutlineMenuOpen } from 'react-icons/md';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebarcom from './sidebar';
import { useAuth } from '../hooks/useAuth';
import { FaSignOutAlt } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import { MdOutlineMenu } from "react-icons/md";
import Link from 'next/link';

const Navbarcom = ({ handleShow }) => {
  const { user, signOut } = useAuth(); // Assuming you have a custom hook for Firebase Authentication
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(); // Call your signOut function from the Firebase Authentication hook
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!isClient) {
    return null; // Prevent rendering on the server
  }

  return (
    <>
      <Sidebarcom />
      <Navbar bg="white" variant="light" expand="lg" className="border-bottom">
        <Container>
          {/* Sidebar Toggle Button - Visible on all screen sizes */}
          <Button
            variant="outline-primary"
            onClick={handleShow}
            className="me-3 d-block"
          >
            <MdOutlineMenuOpen style={{ fontSize: '1.5rem' }} />
          </Button>

          {/* Logo and Brand */}
          <Navbar.Brand href="https://binarysolutions.co.in" target='blank' className="d-flex align-items-center">
            <div style={{ color: 'blue', fontWeight: 'bold', fontSize: '24px' }}>
              01
            </div>
            <div style={{ color: 'blue', marginLeft: '10px', fontSize: '20px' }}>
              Binary Solutions
            </div>
          </Navbar.Brand>

          {/* Toggler for Collapsible Navbar */}
          <Navbar.Toggle aria-controls="basic-navbar-nav">
            <MdOutlineMenu style={{ fontSize: '1.5rem', color: 'white' }} />
          </Navbar.Toggle>

          {/* Navbar Collapsible Items */}
          <Navbar.Collapse id="basic-navbar-nav">
            {/* Menu Items - Left-aligned on large screens, centered on small screens */}
            {user && (
              <Nav className="mx-auto text-center text-lg-start">
                <Nav.Link className='mx-2'>
                  <Link href="/clients" passHref>
                    Clients
                  </Link>
                </Nav.Link>
                <Nav.Link className='mx-2'>
                  <Link href="/projects" passHref>
                    Projects
                  </Link>
                </Nav.Link>
                <Nav.Link className='mx-2'>
                  <Link href="/employees" passHref>
                    Employees
                  </Link>
                </Nav.Link>
              </Nav>
            )}

            {/* Buttons on the Right */}
            {user ? (
              <Nav className="ms-auto d-flex align-items-center">
                <Button variant="outline-primary" onClick={handleSignOut}>
                  Sign Out <FaSignOutAlt style={{ marginLeft: '5px' }} />
                </Button>
              </Nav>
            ) : (
              <Nav className="ms-auto d-flex align-items-center">
                <Nav.Link>
                  <Link href="/login" passHref>
                    <Button variant="outline-primary">Login</Button>
                  </Link>
                </Nav.Link>
                <Nav.Link>
                  <Link href="/support" passHref>
                    <Button variant="outline-primary"><BiSupport /></Button>
                  </Link>
                </Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Navbarcom;
