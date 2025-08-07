
// Configuración compartida
const db = firebase.firestore();
const cardsRef = db.collection("cards");

// Detectar si estamos en la página de formulario
const isFormPage = document.getElementById('cardForm') !== null;
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
  let currentPage = 1;
  const pageSize = 9;
  let lastVisible = null;
  let firstVisible = null;
  let pageSnapshots = []; // Para retroceder páginas

  // Lógica para página principal
  async function loadCards(page = 1, direction = 'next') {
    try {
      let query = cardsRef.orderBy("createdAt").limit(pageSize);
      
 if (direction === 'next' && lastVisible) {
      query = query.startAfter(lastVisible);
    } else if (direction === 'prev' && firstVisible && pageSnapshots.length > 1) {
      // Retrocede una página: elimina la última página y usa el último doc de la anterior
      pageSnapshots.pop();
      const prevSnapshot = pageSnapshots[pageSnapshots.length - 1];
      if (prevSnapshot && !prevSnapshot.empty) {
        query = cardsRef.orderBy("createdAt").startAt(prevSnapshot.docs[0]).limit(pageSize);
      }
    }

    const snapshot = await query.get();
    if (snapshot.empty) {
      if (direction === 'next') {
        // No hay más tarjetas, no incrementes la página
        return;
      }
    } else {
      // Guarda el snapshot para retroceder
      if (direction === 'next') pageSnapshots.push(snapshot);

      const cardsContainer = document.querySelector('.cards-container');
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

      // Actualiza los punteros de paginación
      firstVisible = snapshot.docs[0];
      lastVisible = snapshot.docs[snapshot.docs.length - 1];

      // Actualiza el número de página
      document.querySelector('.page-number').textContent = `Página ${page}`;
      currentPage = page;

      // Habilita/deshabilita botones
      document.querySelector('.prev-btn').disabled = currentPage === 1;
      document.querySelector('.next-btn').disabled = snapshot.size < pageSize;
    }
    } catch (error) {
      console.error("Error cargando tarjetas:", error);
      document.querySelector('.cards-container').innerHTML = '<p>Error cargando tarjetas</p>';
    }
  }

  // Inicializar
  document.addEventListener('DOMContentLoaded', loadCards);
}