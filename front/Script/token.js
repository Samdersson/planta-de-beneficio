
// Proteger la página al cargar
document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth()) {
        // La función requireAuth ya redirige si no está autenticado
        return;
    }

    // Mostrar información del usuario si está disponible
    const userData = getCurrentUser();
    if (userData) {
        console.log('Usuario autenticado:', userData.name);
    }
});

// Función para logout
function logout() {
    sessionStorage.removeItem('auth_token');
    window.location.href = 'inicio.html';
}
