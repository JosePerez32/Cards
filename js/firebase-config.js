// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB99GORs63-VMAtMZMlkufk8VyyqzWcB5g",
  authDomain: "cards-39595.firebaseapp.com",
  projectId: "cards-39595",
  storageBucket: "cards-39595.firebasestorage.app",
  messagingSenderId: "330730721070",
  appId: "1:330730721070:web:93683166c9634d762cb4bf",
  measurementId: "G-0MG1ZPSCV6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = app.firestore();

// export { db };
// Hacer db disponible globalmente
window.db = db;
//const analytics = getAnalytics(app);