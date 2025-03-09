// Import Firebase dependencies
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, increment } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCX9gwxJDg-2WyJTzMphrQ6v1FrnyB9qHU",
  authDomain: "flashcard-generator-611ed.firebaseapp.com",
  projectId: "flashcard-generator-611ed",
  storageBucket: "flashcard-generator-611ed.firebasestorage.app",
  messagingSenderId: "917989841329",
  appId: "1:917989841329:web:2bf4e17948f9edec224590",
  measurementId: "G-SYM0R5PYY9"
};

// Initialize Firebase app first
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Export all initialized services
export { auth, db, increment };
export default app;
