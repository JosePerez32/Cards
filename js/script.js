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

// Inicializa la aplicación
document.addEventListener('DOMContentLoaded', loadCards);