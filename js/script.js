// Accede a Firestore desde el objeto global firebase
const db = firebase.firestore();
const cardsRef = db.collection("cards");

// Función para cargar tarjetas (versión simplificada)
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
      cardsHTML += `
        <div class="card">
          <div class="front">
            <img src="${card.image}" alt="${card.english}">
            <h1>${card.english}</h1>
          </div>
          <div class="back">
            <h1>${card.spanish}</h1>
            <p>${card.example}</p>
          </div>
        </div>
      `;
    });
    
    cardsContainer.innerHTML = cardsHTML;
  } catch (error) {
    console.error("Error:", error);
  }
}


// Detectar en qué página estamos
const isFormPage = window.location.pathname.includes('add-card.html');

if (isFormPage) {
  // Lógica específica para la página de formulario
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
      alert('Tarjeta agregada correctamente!');
      document.getElementById('cardForm').reset();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al agregar tarjeta');
    }
  });
} else {
  // Lógica específica para la página principal
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
        cardsHTML += `
          <div class="card">
            <!-- ... tu HTML de tarjeta ... -->
          </div>
        `;
      });
      
      cardsContainer.innerHTML = cardsHTML;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  document.addEventListener('DOMContentLoaded', loadCards);
}