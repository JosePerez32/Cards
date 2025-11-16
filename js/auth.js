// auth.js - Manejo de autenticación
class AuthManager {
  constructor() {
    this.auth = firebase.auth();
    this.init();
  }

  init() {
    // Escuchar cambios en el estado de autenticación
    this.auth.onAuthStateChanged((user) => {
      this.updateUI(user);
    });
  }

  async login(email, password) {
    try {
      await this.auth.signInWithEmailAndPassword(email, password);
      return true;
    } catch (error) {
      console.error('Error de login:', error);
      alert('Error: ' + error.message);
      return false;
    }
  }

  async logout() {
    try {
      await this.auth.signOut();
    } catch (error) {
      console.error('Error de logout:', error);
    }
  }

  updateUI(user) {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const addCardLink = document.getElementById('add-card-link');

    if (user) {
      // Usuario autenticado
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'inline-block';
      addCardLink.style.display = 'inline-block';
      this.hideLoginModal();
    } else {
      // Usuario no autenticado
      loginBtn.style.display = 'inline-block';
      logoutBtn.style.display = 'none';
      addCardLink.style.display = 'none';
    }
  }

  showLoginModal() {
    document.getElementById('login-modal').style.display = 'block';
  }

  hideLoginModal() {
    document.getElementById('login-modal').style.display = 'none';
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const authManager = new AuthManager();

  // Event listeners
  document.getElementById('login-btn').addEventListener('click', () => {
    authManager.showLoginModal();
  });

  document.getElementById('logout-btn').addEventListener('click', () => {
    authManager.logout();
  });

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    await authManager.login(email, password);
  });

  // Cerrar modal al hacer clic en la X
  document.querySelector('.close').addEventListener('click', () => {
    authManager.hideLoginModal();
  });

  // Cerrar modal al hacer clic fuera
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('login-modal');
    if (e.target === modal) {
      authManager.hideLoginModal();
    }
  });
});