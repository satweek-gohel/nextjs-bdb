'use client';
import React, { useState } from 'react';
import ClientPage from '../components/ClientPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbarcom from '../components/Navbarcom';
import Sidebarcom from '../components/sidebar';
import ProtectedRoute from '../components/ProtectedRoute';

function Login() {  // Changed from 'login' to 'Login'
  const [showSidebar, setShowSidebar] = useState(false);

  const handleCloseSidebar = () => setShowSidebar(false);
  const handleShowSidebar = () => setShowSidebar(true);

  return (
    <ProtectedRoute>
      <Navbarcom handleShow={handleShowSidebar} />
      <Sidebarcom show={showSidebar} handleClose={handleCloseSidebar} />
      <ClientPage />
    </ProtectedRoute>
  );
}

export default Login;  // Changed from 'login' to 'Login'
