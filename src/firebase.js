// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkjND00zz_scgVb3Yh1A7SYyGPupdIocg",
  authDomain: "finance-tracker-22625.firebaseapp.com",
  projectId: "finance-tracker-22625",
  storageBucket: "finance-tracker-22625.appspot.com",
  messagingSenderId: "499722579620",
  appId: "1:499722579620:web:5ac0ef11f06c32f37f0031",
  measurementId: "G-JJCVHY92MK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Export Firebase services for use in other files
export { db, auth, provider, doc, setDoc };
