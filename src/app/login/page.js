// app/login/page.js
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use from 'next/navigation' in App Router
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbarcom from '../components/Navbarcom';
import Footer from '../components/Footer';
import Sidebarcom from '../components/sidebar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err) {
      setError(err.message);
    }
  };
 
  return (
    <>
     <Navbarcom  />
      
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="login-container p-4 rounded shadow" style={{ maxWidth: '400px', width: '100%', backgroundColor:'white !important' }}>
        <h2 className="text-center mb-4" style={{fontWeight:'bold'}}>Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleLogin}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3 w-100" >
            Login
          </Button>
        </Form>
       
  
      </div>
    </Container>
  <Footer />
    </>
  );
};

export default Login;
