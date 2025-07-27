import { onAuthStateChanged } from 'auth.js';
// Configuración compartida
const db = firebase.firestore();
const cardsRef = db.collection("cards");

// Detectar si estamos en la página de formulario
const isFormPage = document.getElementById('cardForm') !== null;
onAuthStateChanged((isLoggedIn) => {
  if (!isLoggedIn && window.location.pathname.includes('add-card.html')) {
    window.location.href = 'login.html';
  }
});
if (isFormPage) {
  // Lógica para página de formulario
  document.getElementById('cardForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const cardData = {
      english: document.getElementById('english').value,
      spanish: document.getElementById('spanish').value,
      image: document.getElementById('image').value,
      audio: document.getElementById('audio').value,
      example: document.getElementById('example').value,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
      await cardsRef.add(cardData);
      alert('¡Tarjeta agregada correctamente!');
      document.getElementById('cardForm').reset();
    } catch (error) {
      console.error('Error al agregar tarjeta:', error);
      alert('Ocurrió un error al guardar la tarjeta');
    }
  });
} else {
  // Lógica para página principal
  async function loadCards() {
    try {
      const snapshot = await cardsRef.orderBy("createdAt").get();
      const cardsContainer = document.querySelector('.cards-container');
      
      if (snapshot.empty) {
        cardsContainer.innerHTML = '<p>No hay tarjetas disponibles</p>';
        return;
      }
      
      let cardsHTML = '';
      snapshot.forEach(doc => {
        const card = doc.data();
        const englishClass = card.english.length > 15 ? 'long-text' : '';
        cardsHTML += `
           <div class="card">
            <div class="front">
              <div class="card-image">
                <img src="${card.image}" alt="${card.english}">
              </div>
              <h1 class="${englishClass}">${card.english}</h1>
            </div>
            <div class="back">
              <h1>${card.spanish}</h1>
              <p class="example">${card.example || 'No example provided'}</p>
            </div>
          </div>
        `;
      });
      
      cardsContainer.innerHTML = cardsHTML;
    } catch (error) {
      console.error("Error cargando tarjetas:", error);
      document.querySelector('.cards-container').innerHTML = '<p>Error cargando tarjetas</p>';
    }
  }

  // Inicializar
  document.addEventListener('DOMContentLoaded', loadCards);
}