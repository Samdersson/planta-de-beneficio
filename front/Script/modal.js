
let modal = null;
let modalMessage = null;
let modalCloseBtn = null;

function initializeModalElements() {
  modal = document.getElementById('customModal');
  modalMessage = document.getElementById('modalMessage');
  modalCloseBtn = document.getElementById('modalCloseBtn');

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', hideModal);
  }

  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      hideModal();
    }
  });
}

// Función para mostrar el modal con un mensaje
function showModal(message) {
  if (!modal || !modalMessage || !modalCloseBtn) {
    initializeModalElements();
  }
  if (!modal || !modalMessage) {
    console.error('Modal elements not found in DOM.');
    return;
  }
  modalMessage.textContent = message;
  modal.style.display = 'flex';
}

// Función para ocultar el modal
function hideModal() {
  if (modal) {
    modal.style.display = 'none';
  }
}
