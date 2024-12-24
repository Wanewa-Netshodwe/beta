// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBOlcdjKnXpR6FQTYh9o7IdnF1cyvU4Sm8",
  authDomain: "pocketpal-509a5.firebaseapp.com",
  projectId: "pocketpal-509a5",
  storageBucket: "pocketpal-509a5.firebasestorage.app",
  messagingSenderId: "46628389457",
  appId: "1:46628389457:web:2be6231a2b3244fcc2ae70",
  measurementId: "G-8QRB5WF1F6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth();
export { db, auth };
