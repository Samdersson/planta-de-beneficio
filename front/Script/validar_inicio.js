function validarLogin() {
    const usuario = document.getElementById('usuario').value.trim();
    const password = document.getElementById('password').value.trim();

    if (usuario === '' || password === '') {
        alert('Por favor, complete todos los campos.');
        return false;
    }
    return true;
}
