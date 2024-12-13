import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  RecaptchaVerifier, 
  sendEmailVerification, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider, 
  signInWithPopup, 
  setPersistence, 
  browserLocalPersistence ,
  signInWithPhoneNumber,
  fetchSignInMethodsForEmail
} from "firebase/auth";

import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  addDoc ,
  arrayUnion
} from 'firebase/firestore';
import { getStorage } from "firebase/storage";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyCJ1u_EZPv86YAfI6J8IELyFFQKw2rZCFA",
  authDomain: "alphavtar.firebaseapp.com",
  projectId: "alphavtar",
  storageBucket: "alphavtar.firebasestorage.app",
  messagingSenderId: "1001615900919",
  appId: "1:1001615900919:web:76c4cc7355176581b3d3f2",
  measurementId: "G-ZYN12JG9Y9"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

// Set persistence for auth state (optional but recommended for persistence)
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

// Initialize Google Auth provider
const provider = new GoogleAuthProvider();

export { 
  auth, 
  firestore, 
  RecaptchaVerifier, 
  sendEmailVerification, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  collection, 
  setDoc, 
  doc, 
  signInWithPopup, 
  provider, 
  getDocs, 
  addDoc ,
  firestore as db,
  storage,
  getDoc,
  signInWithPhoneNumber,
  getAuth,
  fetchSignInMethodsForEmail,
  updateDoc,
  deleteDoc,
  arrayUnion
};
