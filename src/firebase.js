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
  apiKey: "AIzaSyDXhwjSSt60vxIjKLajrgdkQbcDGFnr4Jo",
  authDomain: "alphavatar-solutions-inc.firebaseapp.com",
  projectId: "alphavatar-solutions-inc",
  storageBucket: "alphavatar-solutions-inc.firebasestorage.app",
  messagingSenderId: "527436815669",
  appId: "1:527436815669:web:8621dca883418b86b5007c",
  measurementId: "G-FEZW1RRE8L",
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
