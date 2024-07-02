// pages/_app.js
import React from 'react';
import { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import LoginPage from './login';

const MyApp = ({ Component, pageProps }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Show loading spinner or indicator while checking authentication
    return <div>Loading...</div>;
  }

  // Redirect to login page if user is not authenticated
  if (!user) {
    return <LoginPage />;
  }

  // Render the actual component if user is authenticated
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
};

export default MyApp;
