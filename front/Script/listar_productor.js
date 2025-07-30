
// Función para cargar los productores preseta problemas desde el .js por eso esta acá
async function cargarProductores() {
    try {
        const response = await fetch('../back/listar_productores.php');
        const productores = await response.json();

        const selectNombre = document.getElementById('nombre');
        productores.forEach(productor => {
            const option = document.createElement('option');
            option.value = productor.cedula;
            option.textContent = productor.Nombre;
            selectNombre.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los productores:', error);
    }
}

// Función para actualizar la cédula cuando se selecciona un productor
function actualizarCedula() {
    const selectNombre = document.getElementById('nombre');
    const cedulaInput = document.getElementById('cedula');
    cedulaInput.value = selectNombre.value;
}

// Cargar productores al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    cargarProductores();
    document.getElementById('nombre').addEventListener('change', actualizarCedula);
});
