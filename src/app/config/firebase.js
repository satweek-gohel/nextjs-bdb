// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAIjUpu4QrKuBkCjN17EX5plDRlef-MUL0",
  authDomain: "bsdh-a4e31.firebaseapp.com",
  projectId: "bsdh-a4e31",
  storageBucket: "bsdh-a4e31.appspot.com",
  messagingSenderId: "737307519306",
  appId: "1:737307519306:web:6d4da1fc26bcd964a439b3",
  measurementId: "G-JWL4K8LNFY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { app, db, auth };
