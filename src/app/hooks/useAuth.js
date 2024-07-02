// hooks/useAuth.js

import { useEffect, useState } from 'react';
import { auth } from '../config/firebase'; // Import your Firebase authentication instance

export const useAuth = () => {
  const [user, setUser] = useState(null);

  const signIn = async (email, password) => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  return { user, signIn, signOut };
};
