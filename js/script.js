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

// Función para manejar el envío del formulario
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
    await db.collection('cards').add(cardData);
    alert('¡Tarjeta agregada correctamente!');
    
    // Limpiar el formulario
    document.getElementById('cardForm').reset();
    document.getElementById('image').value = 'imgs/';
    document.getElementById('audio').value = 'audio/';
    
    // Recargar las tarjetas
    loadCards();
  } catch (error) {
    console.error('Error al agregar tarjeta:', error);
    alert('Ocurrió un error al agregar la tarjeta');
  }
});
document.getElementById('imageUpload').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    const storageRef = firebase.storage().ref(`images/${file.name}`);
    await storageRef.put(file);
    const imageUrl = await storageRef.getDownloadURL();
    document.getElementById('image').value = imageUrl;
  }
});
if (!cardData.english || !cardData.spanish) {
  alert('Los campos en inglés y español son obligatorios');
  return;
}
// Inicializa la aplicación
document.addEventListener('DOMContentLoaded', loadCards);