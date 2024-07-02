// components/ProtectedRoute.js
'use client'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth'; // Assuming you're using Firebase hooks for authentication
import { auth } from '../config/firebase'; // Import your Firebase auth instance

const ProtectedRoute = ({ children }) => {
  const [user, loading, error] = useAuthState(auth); // Use the imported auth instance
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login'); // Redirect to login page if user is not authenticated
    }
  }, [user, loading, router]);

  return <>{children}</>;
};

export default ProtectedRoute;
