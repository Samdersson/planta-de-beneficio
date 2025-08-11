// Función para autocompletar datos del cliente al seleccionar una marca
function autocompletarCliente() {
    const marcaSelect = document.getElementById('marca-select');
    const nombreInput = document.getElementById('nombre');
    const cedulaInput = document.getElementById('cedula');

    if (!marcaSelect || !nombreInput || !cedulaInput) {
        console.error('Elementos no encontrados');
        return;
    }

    marcaSelect.addEventListener('change', function() {
        const marcaSeleccionada = this.value;
        
        if (!marcaSeleccionada) {
            // Limpiar campos si no hay marca seleccionada
            nombreInput.value = '';
            cedulaInput.value = '';
            return;
        }

        // Llamar al backend para obtener datos del cliente
        fetch(`../back/buscar_cliente_por_marca.php?marca=${encodeURIComponent(marcaSeleccionada)}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Error:', data.error);
                    nombreInput.value = '';
                    cedulaInput.value = '';
                } else {
                    nombreInput.value = data.nombre || '';
                    cedulaInput.value = data.cedula || '';
                }
            })
            .catch(error => {
                console.error('Error al obtener datos del cliente:', error);
                nombreInput.value = '';
                cedulaInput.value = '';
            });
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    autocompletarCliente();
});
