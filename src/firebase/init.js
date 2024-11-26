import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDXImtDLTo5sZz_N8tIVyDQiCB-gV3WHuE",
  authDomain: "q2v3paasapp.firebaseapp.com",
  projectId: "q2v3paasapp",
  storageBucket: "q2v3paasapp.firebasestorage.app",
  messagingSenderId: "360690875355",
  appId: "1:360690875355:web:dae8060e410338a820c5fe",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication instance
const auth = getAuth(app);
// Initialize Firestore service
const db = getFirestore(app);

// Export the Firebase Authentication and Firestore instances
export { db, auth, app };
