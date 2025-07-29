// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLIYykSYrj8U2nLsLCr52me5BzWhcX-z0",
  authDomain: "d-liver-36926.firebaseapp.com",
  projectId: "d-liver-36926",
  storageBucket: "d-liver-36926.firebasestorage.app",
  messagingSenderId: "768701512636",
  appId: "1:768701512636:web:5b35c0eb3ae46bf10b49b9",
  measurementId: "G-LM7GLYJG71"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Add additional scopes if needed
googleProvider.addScope('email');
googleProvider.addScope('profile');

export { auth, db, googleProvider };
export default app;
