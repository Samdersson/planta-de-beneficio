async function manejarEnvioFormulario(event) {
    event.preventDefault();

    const cedulaInput = document.getElementById("cedula");
    const marcaInput = document.getElementById("marca");
    const nombreInput = document.getElementById("nombre");
    const destinoInput = document.getElementById("destino");

    if (!marcaInput.value || !nombreInput.value || !destinoInput.value) {
        showModal("Todos los campos son obligatorios.");
        return;
    }

    const formData = new FormData();
    formData.append('cedula', cedulaInput.value);
    formData.append('marca', marcaInput.value);
    formData.append('nombre', nombreInput.value);
    formData.append('destino', destinoInput.value);

    try {
        const response = await fetch('../back/guardar_cliente.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            showModal(result.success);
            // Redirigir a otra página si es necesario
        } else {
            showModal(result.error || 'Error desconocido al registrar el cliente');
        }
    } catch (error) {
        showModal('Error al enviar los datos: ' + error.message);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const crearClienteForm = document.getElementById('crearClienteForm');
    if (crearClienteForm) {
        crearClienteForm.addEventListener('submit', manejarEnvioFormulario);
    }
});
