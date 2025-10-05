let modal = null;
let modalMessage = null;
let modalCloseBtn = null;

function initializeModalElements() {
  modal = document.getElementById('customModal');
  modalMessage = document.getElementById('modalMessage');
  modalCloseBtn = document.getElementById('modalCloseBtn');

  if (!modal || !modalMessage || !modalCloseBtn) {
    console.error('No se pudieron inicializar los elementos del modal.');
    return false;
  }

  modalCloseBtn.addEventListener('click', hideModal);

  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      hideModal();
    }
  });
  return true;
}

// Función para mostrar el modal con un mensaje
window.showModal = function(message) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.showModal(message));
    return;
  }
  if (!modal || !modalMessage || !modalCloseBtn) {
    const initialized = initializeModalElements();
    if (!initialized) {
      console.error('No se pudo inicializar el modal para mostrar el mensaje.');
      return;
    }
  }
  if (!modal || !modalMessage) {
    console.error('Modal elements not found in DOM.');
    return;
  }
  modalMessage.textContent = message;
  modal.style.display = 'flex';
};

// Función para ocultar el modal
function hideModal() {
  if (modal) {
    modal.style.display = 'none';
  }
}

// Inicializar elementos al cargar el script para evitar llamadas tempranas
document.addEventListener('DOMContentLoaded', () => {
  initializeModalElements();
});
