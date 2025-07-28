import { onAuthStateChanged } from './auth.js';
// Configuración compartida
const db = firebase.firestore();
const cardsRef = db.collection("cards");

// Detectar si estamos en la página de formulario
onAuthStateChanged((user) => {
  if (user) {
    // Usuario autenticado - cargar tarjetas
    loadCards();
  } else if (!window.location.pathname.includes('login.html')) {
    // Redirigir a login si no está en la página de login
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
      console.log("Cargando tarjetas..."); // Debug
      const snapshot = await cardsRef.orderBy("createdAt").get();
      const cardsContainer = document.querySelector('.cards-container');
      
      if (snapshot.empty) {
        console.log("No hay documentos"); // Debug
        cardsContainer.innerHTML = '<p>No hay tarjetas disponibles</p>';
        return;
      }
      
      let cardsHTML = '';
      snapshot.forEach(doc => {
        const card = doc.data();
        console.log("Tarjeta:", card); // Debug
        //const englishClass = card.english.length > 15 ? 'long-text' : '';
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
// Verificar autenticación y cargar tarjetas
onAuthStateChanged((user) => {
  if (user) {
    console.log("Usuario autenticado:", user.email);
    loadCards();
  } else if (!window.location.pathname.includes('login.html')) {
    console.log("Redirigiendo a login...");
    window.location.href = 'login.html';
  }
});
  // Inicializar
  //document.addEventListener('DOMContentLoaded', loadCards);
}