// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLoFynO_D4fEjncb0EXrnR8NR6dooYeNY",
  authDomain: "verifymulti.firebaseapp.com",
  projectId: "verifymulti",
  storageBucket: "verifymulti.appspot.com",
  messagingSenderId: "164757421573",
  appId: "1:164757421573:web:f2361f20de61e0bdb2a66c",
  measurementId: "G-1K8G42617Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;