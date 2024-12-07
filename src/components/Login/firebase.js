// firebase.js

// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBB2YLYlT2GwvvJeF8_S_03cSFDf4UVTPA",
  authDomain: "kickoff-task.firebaseapp.com",
  projectId: "kickoff-task",
  storageBucket: "kickoff-task.firebasestorage.app",
  messagingSenderId: "128674718419",
  appId: "1:128674718419:web:f8cd872ff8dc9513ed6a26",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Export auth for use in other files
export default auth;
