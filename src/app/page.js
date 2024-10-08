'use client'

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbarcom from './components/Navbarcom';
import DashboardComponent from './components/DashboardComponent';
import Sidebarcom from './components/sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';


function Page() {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleCloseSidebar = () => setShowSidebar(false);
  const handleShowSidebar = () => setShowSidebar(true);

  return (
    
    <ProtectedRoute>
      <Navbarcom handleShow={handleShowSidebar} />
      <Sidebarcom show={showSidebar} handleClose={handleCloseSidebar} />
      <DashboardComponent />
      <Footer />
      </ProtectedRoute>
    
  );
}

export default Page;
