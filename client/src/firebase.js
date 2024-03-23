// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-7e50b.firebaseapp.com",
  projectId: "mern-auth-7e50b",
  storageBucket: "mern-auth-7e50b.appspot.com",
  messagingSenderId: "652933302307",
  appId: "1:652933302307:web:6267d780e5e6f221ad8996"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);