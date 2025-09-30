function validarLogin() {
    const usuario = document.getElementById('usuario').value.trim();
    const password = document.getElementById('password').value.trim();

    if (usuario === '' || password === '') {
        showModal('Por favor, complete todos los campos.');
        return false;
    }

    // Validar si el usuario es un correo electrónico
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(usuario)) {
        // Es un correo electrónico
        return true;
    } else {
        // Es un nombre
        return true; // Aquí se puede agregar lógica adicional si es necesario
    }
}
