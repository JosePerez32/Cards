import "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth-compat.js";
// Import the functions you need from the SDKs you need

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB99GORs63-VMAtMZMlkufk8VyyqzWcB5g",
  authDomain: "cards-39595.firebaseapp.com",
  projectId: "cards-39595",
  storageBucket: "cards-39595.appspot.com",
  messagingSenderId: "330730721070",
  appId: "1:330730721070:web:93683166c9634d762cb4bf",
  measurementId: "G-0MG1ZPSCV6"
};

// Inicializa Firebase
const app = firebase.initializeApp(firebaseConfig);
//const db = firebase.firestore(app);
const db = firebase.firestore(app);
// Habilita persistencia de datos (opcional pero útil)
db.enablePersistence()
  .catch((err) => {
    console.log("Error en persistencia:", err);
  });
const auth = firebase.auth();
export { db, auth };
// Hacer disponible para otros archivos
//Esto lo hace global
//window.db = db;