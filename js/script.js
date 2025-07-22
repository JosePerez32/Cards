import { db } from './firebase-config.js';
import { collection, getDocs, orderBy, limit, query } from "firebase/firestore"; 
// Datos de las tarjetas (puedes cargarlos desde un JSON)
// Referencia a la colección de tarjetas
const cardsRef = collection(db, "cards");
// Función para cargar tarjetas
async function loadCards(page = 1, cardsPerPage = 9) {
  const cardsContainer = document.querySelector('.cards-container');
  cardsContainer.innerHTML = '<p>Cargando tarjetas...</p>';
  
  try {
    const q = query(
      // cardsRef, 
      // orderBy("createdAt"), 
      // limit(cardsPerPage)
      collection(db, "Cards"), orderBy("createdAt")
    );
    
    // const querySnapshot = await cardsRef
    //   .orderBy("createdAt")
    //   .limit(cardsPerPage)
    //   .offset((page - 1) * cardsPerPage)
    //   .get();
    const querySnapshot = await getDocs(q);

    
    if (querySnapshot.empty) {
      cardsContainer.innerHTML = '<p>No hay tarjetas disponibles</p>';
      return;
    }
    
    let cardsHTML = '';
    querySnapshot.forEach(doc => {
      const card = doc.data();
      cardsHTML += `
        <div class="card">
          <div class="front">
            <div class="card-image">
              <img src="${card.image || 'default.png'}" alt="${card.english}">
            </div>
            <h1>${card.english}</h1>
            <button class="audio-btn" onclick="playAudio('${card.audio || 'default.mp3'}')">🔊</button>
          </div>
          <div class="back">
            <h1>${card.spanish}</h1>
            <p class="example">${card.example || 'No example provided'}</p>
          </div>
        </div>
      `;
    });
    
    cardsContainer.innerHTML = cardsHTML;
    //updatePagination(page, snapshot.size === cardsPerPage);
    setupAudioButtons();
  } catch (error) {
    console.error("Error cargando tarjetas: ", error);
    cardsContainer.innerHTML = '<p>Error cargando tarjetas</p>';
  }
}

// Función para agregar una nueva tarjeta
async function addCard(cardData) {
  try {
    await cardsRef.add({
      ...cardData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log("Tarjeta agregada con éxito!");
    loadCards(currentPage);
  } catch (error) {
    console.error("Error agregando tarjeta: ", error);
  }
}


// const cardsData = [
//   {
//     english: "Bargain for",
//     spanish: "Preveer/Negociar",
//     image: "imgs/bargain-for.png",
//     audio: "run.mp3",
//     example: "I run every morning."
//   },
//   // ... más datos de tarjetas
// ];

// Inicialización
let currentPage = 1;
document.addEventListener('DOMContentLoaded', () => {
  loadCards(currentPage);
  
  // Event listeners para paginación
  document.querySelector('.prev-btn').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadCards(currentPage);
    }
  });
  
  document.querySelector('.next-btn').addEventListener('click', () => {
    currentPage++;
    loadCards(currentPage);
  });
});
// const cardsPerPage = 9;

// function playAudio(audioFile) {
//   const audio = new Audio(audioFile);
//   audio.play();
// }

// function renderCards(page) {
//   const container = document.querySelector('.cards-container');
//   container.innerHTML = '';
  
//   const start = (page - 1) * cardsPerPage;
//   const end = start + cardsPerPage;
//   const cardsToShow = cardsData.slice(start, end);
  
//   cardsToShow.forEach(card => {
//     container.innerHTML += `
//       <div class="card">
//         <div class="front">
//           <div class="card-image">
//             <img src="${card.image}" alt="${card.english}">
//           </div>
//           <h1>${card.english}</h1>
//           <button class="audio-btn" onclick="playAudio('${card.audio}')">🔊</button>
//         </div>
//         <div class="back">
//           <h1>${card.spanish}</h1>
//           <p class="example">${card.example}</p>
//         </div>
//       </div>
//     `;
//   });
  
//   document.querySelector('.page-number').textContent = `Página ${page}`;
  
//   // Deshabilitar botones según la página
//   document.querySelector('.prev-btn').disabled = page === 1;
//   document.querySelector('.next-btn').disabled = end >= cardsData.length;
// }

// // Event listeners para paginación
// document.querySelector('.prev-btn').addEventListener('click', () => {
//   if (currentPage > 1) {
//     currentPage--;
//     renderCards(currentPage);
//   }
// });

// document.querySelector('.next-btn').addEventListener('click', () => {
//   if (currentPage * cardsPerPage < cardsData.length) {
//     currentPage++;
//     renderCards(currentPage);
//   }
// });

// // Inicializar
// renderCards(currentPage);