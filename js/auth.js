// auth.js
import { auth } from './firebase-config.js';

// Función para login
export async function login(email, password) {
  try {
    await auth.signInWithEmailAndPassword(email, password);
    return true;
  } catch (error) {
    console.error("Error de autenticación:", error);
    return false;
  }
}

// Función para logout
export async function logout() {
  await auth.signOut();
}

// Verificar estado de autenticación
export function onAuthStateChanged(callback) {
  auth.onAuthStateChanged(user => {
    callback(!!user);
  });
}